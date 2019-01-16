/**
 * 日志的解析
 */
import Ajv from "ajv";
import { logSchema, rdbDataSchema } from "./schemas";
import { pick, uniq } from "lodash";
import { ALARM_FLAGS } from "./constants";
import moment from "moment";
import { isNil, padStart } from "lodash";

const ajv = new Ajv();

/**
 * 验证message格式是否正确，如果不正确，则抛弃
 * @param message 信息
 */
function validateLog(message) {
  const valid = ajv.validate(logSchema, message);
  if (!valid) {
    const error = new Error("LogSchemaError");
    error.name = "LogSchemaError";
    error.ajv = ajv.errors;
    throw error;
  }
}

export function parseRecord(vin, body) {
  const { items = [], at } = body;
  let record = { id: vin, alarmLevel: 0, at };
  for (let item of items) {
    switch (item.type) {
      case "VEHICLE": {
        record.vehicle = {
          ...pick(item, [
            "status",
            "chargeStatus",
            "mode",
            "speed",
            "mileage",
            "voltage",
            "current",
            "soc",
            "dcStatus",
            "shift",
            "resistance",
            "aptv",
            "brake",
          ]),
        };
        break;
      }
      case "MOTOR": {
        const { motors = [] } = item;
        record.motors = motors;
        break;
      }
      case "LOCATION": {
        const { lng, lat } = item;
        record.location = { lng, lat };
        break;
      }
      case "EXTREME": {
        record.extreme = pick(item, [
          "maxVoltageSubSysNo",
          "maxVoltageSingNo",
          "maxVoltage",
          "minVoltageSubSysNo",
          "minVoltageSingNo",
          "minVoltage",
          "maxNtcSubSysNo",
          "maxNtcNo",
          "maxNtc",
          "minNtcSubSysNo",
          "minNtcNo",
          "minNtc",
        ]);
        break;
      }
      case "ALARM": {
        const { maxLevel = 0, uas = {} } = item;
        const codes = [];
        record.alarmLevel = maxLevel;
        // 处理uas的警报
        if (maxLevel > 0) {
          // 有效的标志位
          const tags = Object.keys(uas).filter(k => uas[k] && uas[k] > 0);

          // 解析为警报码
          codes.push(
            ...tags.map(t => {
              const defaultCode =
                "000000" + padStart(maxLevel.toString(16), 2, "0");
              if (!ALARM_FLAGS[t]) return defaultCode;

              const code = ALARM_FLAGS[t][maxLevel - 1];
              if (!code) return defaultCode;

              return code.toString(16);
            })
          );
        }

        // 处理 list 的警报
        const {
          ressList = [],
          mortorList = [],
          engineList = [],
          otherList = [],
        } = item;

        const toCode = (alarm = {}) => {
          const { type = 0, code = 0, level = 1 } = alarm;

          return (
            padStart(type.toString(16), 2, "0") +
            padStart(code.toString(16), 4, "0") +
            padStart(level.toString(16), 2, "0")
          );
        };

        [ressList, mortorList, engineList, otherList].forEach(l => {
          codes.push(...l.map(a => toCode(a)));
        });

        record.alarms = uniq(codes);

        break;
      }
      case "CUSTOM_EXT": {
        record.customExt = pick(item, [
          "pressure1", // 气压1
          "pressure2", // 气压2
          "batteryVoltage", // 蓄电池电压
          "dcov", // DCDC输出电压
          "dcoc", // DCDC输出电流
          "dcTemp", // DCDC散热器温度
          "acTemp", // DCAC散热器温度
          "lftp", // 左前轮胎压力
          "lftt", // 左前轮胎温度
          "rftp", // 右前轮胎压力
          "rftt", // 右前轮胎温度
          "lr1tp", // 左后 1 轮胎压力
          "lr1tt", // 左后 1 轮胎温度
          "lr2tp", // 左后 2 轮胎压力
          "lr2tt", // 左后 2 轮胎温度
          "rr1tp", // 右后 1 轮胎压力
          "rr1tt", // 右后 1 轮胎温度
          "rr2tp", // 右后 2 轮胎压力
          "rr2tt", // 右后 2 轮胎温度
          "cv", // 充电电压
          "rc", // 充电电流
          "cp", // 充电电量
          "totalCharge", // 累积充电电量
          "totalDischarge", // 累积放电电量
          "instantPower", // 瞬时电耗
          "bpiRes", // 电池正绝缘电阻
          "bniRes", // 电池负绝缘电阻
          "apTemp", // 气泵扇热器温度
          "motorContTemp", // 电机控制器温度
          "airMode", // 空调模式", 关闭, 进风, 制热, 制冷
          "airTemp", // 空调设定温度
          "insideTemp", // 车厢内实际温度
          "outsideTemp", // 车外温度
          "middleDoorStatus", // 中门状态", 关闭, 开, 异常
          "frontDoorStatus", // 前门状态", 关闭, 开, 异常
          "handbrakeStatus", // 手刹状态", 松, 刹, 异常
          "keyStatus", // 钥匙位置
        ]);
        break;
      }
      case "TEN_SECONDS": {
        const { datas = [] } = item;
        record.adas = datas;
        break;
      }

      default:
        break;
    }
  }
  return record;
}

function handleCommand(request) {
  const { command, vin, body } = request;

  switch (command) {
    case "REISSUE_REPORT":
    case "REALTIME_REPORT":
      const record = parseRecord(vin, body);
      return {
        type: "RDB_DATA",
        vin: vin,
        command: command,
        payload: record,
      };
    case "VEHICLE_LOGIN":
    case "VEHICLE_LOGOUT":
    case "HEARTBEAT":
      return {
        type: "RDB_DATA",
        vin: vin,
        command: command,
        payload: body,
      };
    default:
      throw new Error("Not support request command:", command);
  }
}

/**
 * 处理 info 日志
 * @param {*} log
 */
function handleInfo(log) {
  // 如果是 rdb data
  const valid = ajv.validate(rdbDataSchema, log);
  if (!valid) {
    return {
      type: "INVALID_LOG",
      payload: log,
      error: ajv.errors,
    };
  } else {
    return handleCommand(log.request);
  }
}

export function handleMessage(kafkaData) {
  try {
    const message = JSON.parse(kafkaData.value.toString()) || {};
    const { log } = message;
    if (!log && typeof log === "string") {
      throw new Error(
        "Message must contains log properity, which must be a string"
      );
    }
    const logObject = JSON.parse(log);
    validateLog(logObject);
    const {
      level,
      time,
      session,
      seq,
      cost,
      data,
      origin,
      partial,
    } = logObject;

    let finalLog = {};

    switch (level) {
      case 30:
        finalLog = handleInfo(logObject);
        break;
      case 50:
        finalLog = {
          type: "REQUEST_ERROR",
          payload: logObject,
        };
        break;
      default:
        finalLog = {
          type: "INVALID_LOG",
          payload: logObject,
          error: "Non support log type!",
        };
        break;
    }

    finalLog.reportedAt = moment(time).toISOString();

    if (session && seq !== undefined) {
      finalLog.recordId = session + "_" + seq;
    }

    if (!isNil(cost)) {
      finalLog.cost = cost;
    }

    if (!isNil(data)) {
      finalLog.data = data;
    }

    if (!isNil(partial)) {
      finalLog.partial = partial;
    }

    if (!isNil(origin)) {
      finalLog.origin = origin;
    }

    return finalLog;
  } catch (error) {
    // console.log(error.name);

    // json 解析错误，直接抛弃日志
    if (error.name === "SyntaxError") {
      return;
    }

    // 不符合 logSchema的 也直接抛弃日志
    if (error.name === "LogSchemaError") {
      return;
    }

    return {
      type: "INVALID_LOG",
      payload: kafkaData.value ? kafkaData.value.toString() : kafkaData,
      error: error.toString(),
    };
  }
}
