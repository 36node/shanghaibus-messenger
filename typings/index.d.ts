/**
 * 整车数据
 */
declare interface Vehicle {
  status?: "ELECTRIC" | "MIXED" | "FUEL"; // 车辆状态
  chargeStatus?: "PARK_CHARGING" | "MOVE_CHARGING" | "UNCHARGED" | "COMPETE"; // 充电状态
  mode?: "ON" | "OFF" | "OTHER"; // 车辆模式
  speed?: number; // 车速 km/h
  mileage?: number; // 总里程 km
  voltage?: number; // 电压 V
  current?: number; // 电流 A
  soc?: number; // soc
  dcStatus?: "ON" | "OFF"; // dc 状态
  shift?: string; // 车辆档位
  resistance?: number; // 绝缘阻抗 欧姆
  aptv?: number; // 加速踏板开度
  brake?: number; // 刹车踏板开度
}

/**
 * 电机数据
 */
declare interface Motor {
  no: number; // 电机编号
  status?: "CONSUMPTION" | "GENERATION" | "OFF" | "READY"; // 电机状态
  controlTemp?: number; // 电机控制器温度
  speed?: number; // 电机转速
  torque?: number; //驱动电机转矩 牛米
  temp?: number; // 电机温度
  voltage?: number; //电机控制器输入电流
  current?: number; //电机控制器输入电压
}

declare interface Location {
  lng: number; // 经度
  lat: number; // 纬度
}

/**
 * 极值数据
 */
declare interface Extreme {
  maxVoltageSubSysNo?: number; // 最高电压电池子系统号
  maxVoltageSingNo?: number; // 最高电压电芯编号
  maxVoltage?: number; // 最高电压
  minVoltageSubSysNo?: number; // 最低电压电池子系统号
  minVoltageSingNo?: number; // 最低电压电芯编号
  minVoltage?: number; // 最低电压
  maxNtcSubSysNo?: number; // 最高温度子系统号
  maxNtcNo?: number; // 最高温度电芯编号
  maxNtc?: number; // 单体电芯最高温度
  minNtcSubSysNo?: number; // 最低温度子系统号
  minNtcNo?: number; // 最低温度电芯编号
  minNtc?: number; // 单体电芯最低温度
}

/**
 * 自定义数据
 */
declare interface CustomExt {
  pressure1?: number; // 气压 1 hPa
  pressure2?: number; // 气压 2 hPa
  batteryVoltage?: number; // 蓄电池电压 V
  dcov?: number; // DCDC 输出电压 V
  dcoc?: number; // DCDC 输出电流 A
  dcTemp?: number; // DCDC散热器温度 ℃
  acTemp?: number; // DCAC散热器温度 ℃
  lftp?: number; // 左前轮胎压力 hPa
  lftt?: number; // 左前轮胎温度 ℃
  rftp?: number; // 右前轮胎压力 hPa
  rftt?: number; // 右前轮胎温度 ℃
  lr1tp?: number; // 左后1轮胎压力 hPa
  lr1tt?: number; // 左后1轮胎温度 ℃
  lr2tp?: number; // 左后2轮胎压力 hPa
  lr2tt?: number; // 左后2轮胎温度 ℃
  rr1tp?: number; // 右后1轮胎压力 hPa
  rr1tt?: number; // 右后1轮胎温度 ℃
  rr2tp?: number; // 右后2轮胎压力 hPa
  rr2tt?: number; // 右后2轮胎温度 ℃
  cv?: number; // 充电电压
  rc?: number; // 充电电流源
  cp?: number; // 充电电量
  totalCharge?: number; //累积充电电量
  totalDischarge?: number; // 累积放电电量
  instantPower?: number; // 瞬时电耗
  bpiRes?: number; //电池正绝缘电阻
  bniRes?: number;
  apTemp?: number; //气泵扇热器温度
  motorContTemp?: number; // 电机控制器温度
  airMode?: "WIND" | "OFF" | "REFRIGERATION" | "HEATING" | "ABNORMAL"; //空调模式
  airTemp?: number; //空调设定温度
  insideTemp?: number; //车厢内实际温度
  outsideTemp?: number; //车外温度
  middleDoorStatus?: "CLOSE" | "OPEN" | "ABNORMAL"; //中门状态
  frontDoorStatus?: "CLOSE" | "OPEN" | "ABNORMAL"; //前门状态
  handbrakeStatus?: "ON" | "OFF" | "ABNORMAL"; //手刹状态
  keyPosition?: "OFF" | "ACC" | "ON" | "START"; //钥匙位置
}

/**
 * 拓展数据 1s 数据
 */
declare interface ADAS {
  accPedal?: number; // 加速踏板行程 百分比
  brake?: number; // 制动踏板行程 百分比
  speed?: number; // 车速 km/h
  totalCurrent?: number; // 总电流 A
  overspeed?: number; // 超速值  km/h
  lateralDistance?: number; // 前方障碍物横向相对距离 m
  verticalDistance?: number; // 前方障碍物相对纵向距离 m
  buzzerWarning?: number; // 蜂鸣器预警
  wheelWarning?: number; // 方向盘震动器预警
  cWarning?: number; // 前方碰撞预警
  lWarning?: number; // 左车道偏离预警
  rWarning?: number; // 右车道偏离预警
  pWarning?: number; // 行人碰撞预警
  cmcslevel?: number; // 碰撞缓解制动系统预警等级
  cmcs?: number; // 碰撞缓解制动系统状态
  reserve?: number; // 保留
  obstacleTyp?: number; //障碍物类型
}

declare interface VehicleRecord {
  id: string; // 车辆vin
  at: string; // 信息采集时间 iso date string
  vehicle?: Vehicle; // 整车数据
  location?: Location; // 车辆位置
  montors?: [Motor]; // 电机数据
  extreme?: Extreme; // 极值数据
  alarm?: [string]; // 警报数据
  customExt?: CustomExt; // 自定义数据
  adas?: [ADAS]; // 补充协议数据
  tens?: [ADAS]; // 十秒数据
}

declare interface ParsedLog<PayloadType> {
  recordId?: string; // 由原始日志的 session + seq 组成， 对于 RDB_DATA 类型的日志才有，其他类型的日志没有这条记录
  cost?: number; // 解析日志的耗时
  data?: string; // 原始二进制日志内容(二进制字符串)
  origin?: string; // 二进制字符串
  partial?: boolean; // 是否完全
  type: "RDB_DATA" | "REQUEST_ERROR" | "INVALID_LOG"; // 日志类型
  payload: PayloadType; // 日志的内容, 对于 REALTIME_REPORT, REISSUE_REPORT, payload 为 record
  vin?: string; // 车辆vin码， 只在 RDB_DATA 类型日志中存在
  command?:
    | "VEHICLE_LOGIN"
    | "VEHICLE_LOGOUT"
    | "HEARTBEAT"
    | "REALTIME_REPORT"
    | "REISSUE_REPORT"; // 日志的命令， 只在 RDB_RATA 类型日志中存在
  error?: string; // 日志解析时发生的错误，只在 INVALID_LOG 类型中存在
  reportedAt: string; // 日志发送的时间，为 ISO string
  kafka_message: string; // kafka 传递过来的原始日志
}

type Handler<PayloadType> = (log: ParsedLog<PayloadType>) => void;

declare module "@36node/shanghaibus-messenger" {
  /**
   * 解析log字符串
   * @param logStr kafka原始日志字符串
   */
  export function parseLog(logStr: string): ParsedLog<VehicleRecord>;

  export class Messenger {
    constructor(kafkaConfig: any, topics: [string]);

    /**
     * 监听 rdb data 类型的log
     * @param handler
     * @param commands 订阅的命令，默认为订阅全部命令
     */
    onRdbData(handler: Handler<VehicleRecord>, commands: [string]): void;

    /**
     * 监听 request error 类型的 log
     * @param handler
     */
    onRequestError(handler: Handler<string>): void;

    /**
     * 监听非法日志
     * @param handler
     */
    onInvalidLog(handler: Handler<string>): void;
  }
}
