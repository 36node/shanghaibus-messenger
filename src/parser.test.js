import { handleMessage } from "./parser";
const makeKafkaLog = msg => {
  return {
    value: Buffer.from(
      JSON.stringify({
        log: msg,
      })
    ),
  };
};
/**
 * 实时车辆信息
 */
const recordLog = makeKafkaLog(
  '{"level":30,"time":1540902953229,"msg":"handle rdb data","pid":17,"hostname":"d35202af7c8b-shanghaibus-v0-32960-1","session":"dj4Of2L6XrT","seq":22,"cost":1,"origin":"232302fe4c53464430333230314a4330303136343901025c120a1e14233501010301010e00025d3c171a264541012e1964006502010101505b7447cc6a1730238c0500073d6ebe01dc48440601560ce4018e0ca8011a4601233f07000000000000000000080101171a264501680001c80cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cbc0cd00cd00cd00cd00cbc0cd00cd00cbc0cd00cbc0cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cbc0cbc0cd00cbc0cbc0cd00cbc0cd00cd00cd00cbc0cbc0cd00cbc0cbc0cd00cbc0cd00cbc0cd00cd00cd00cd00cd00cd00cbc0cd00cbc0cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00cd00ce40cd00cd00cbc0ca80cbc0cbc0cbc0cbc0cbc0cbc0cbc0cbc0cbc0cbc0cbc0cbc0cd00cd00ce40cd00cd00cd00ce40cbc0cbc0cbc0cbc0cbc0cbc0cbc0cd00cd00cd00cd00cd00ce40ce40cd00cd00cd00cd00cd00cd00cd00ce40ce40ce40ce40ce40ce40ce40ce40ce40ce40ce40ce40ce40ce40ce40ce40ce40ce4090101003c404141414040404141414040404041414040404041403f404546454544453f4040403f40404041414040434545454445424243434243444444444343800030f7f736282227fe52520028002800280028002800281733236400000000000000000000000019641964525000ff3c3b0266","request":{"command":"REALTIME_REPORT","flag":"COMMAND","vin":"LSFD03201JC001649","encrypt":"NONE","length":604,"body":{"at":"2018-10-30T12:35:53.000Z","items":[{"type":"VEHICLE","status":"ON","chargeStatus":"UNCHARGED","mode":"ELECTRIC","speed":27,"mileage":15494,"voltage":591.4,"current":-20.3,"soc":0.65,"dcStatus":"ON","shift":"D","resistance":6500,"aptv":0,"brake":1.01},{"type":"MOTOR","count":1,"motors":[{"no":1,"status":"CONSUMPTION","controlTemp":40,"speed":3412,"torque":-162,"temp":66,"voltage":593.6,"current":-90}]},{"type":"LOCATION","state":0,"lng":121.466558,"lat":31.213636},{"type":"EXTREME","maxVoltageSubSysNo":1,"maxVoltageSingNo":86,"maxVoltage":3.3,"minVoltageSubSysNo":1,"minVoltageSingNo":142,"minVoltage":3.24,"maxNtcSubSysNo":1,"maxNtcNo":26,"maxNtc":30,"minNtcSubSysNo":1,"minNtcNo":35,"minNtc":23},{"type":"ALARM","maxLevel":0,"uas":{"ressChargeOver":0,"motorTemp":0,"highVolMuteStatus":0,"motorControlTemp":0,"dcdcStatus":0,"brake":0,"dcdcTemp":0,"insulation":0,"batteryBadConsistency":0,"ressNotMatch":0,"socJump":0,"socOver":0,"batteryLow":0,"batteryOver":0,"socLow":0,"ressVolLow":0,"ressVolOver":0,"batteryTempOver":0,"tempDiff":0},"ressLen":0,"ressList":[],"mortorLen":0,"mortorList":[],"engineLen":0,"engineList":[],"otherLen":0,"otherList":[]},{"type":"RESS_VOLTAGE","subCount":1,"subSystems":[{"no":1,"voltage":591.4,"current":-20.3,"batteryCount":360,"frameStartBatteryNo":1,"frameBatteryCount":200,"batteryVols":[3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.26,3.28,3.28,3.28,3.28,3.26,3.28,3.28,3.26,3.28,3.26,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.26,3.26,3.28,3.26,3.26,3.28,3.26,3.28,3.28,3.28,3.26,3.26,3.28,3.26,3.26,3.28,3.26,3.28,3.26,3.28,3.28,3.28,3.28,3.28,3.28,3.26,3.28,3.26,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.3,3.28,3.28,3.26,3.24,3.26,3.26,3.26,3.26,3.26,3.26,3.26,3.26,3.26,3.26,3.26,3.26,3.28,3.28,3.3,3.28,3.28,3.28,3.3,3.26,3.26,3.26,3.26,3.26,3.26,3.26,3.28,3.28,3.28,3.28,3.28,3.3,3.3,3.28,3.28,3.28,3.28,3.28,3.28,3.28,3.3,3.3,3.3,3.3,3.3,3.3,3.3,3.3,3.3,3.3,3.3,3.3,3.3,3.3,3.3,3.3,3.3,3.3]}]},{"type":"RESS_TEMPERATURE","subCount":1,"subSystems":[{"no":1,"probeCount":60,"temps":[24,25,25,25,24,24,24,25,25,25,24,24,24,24,25,25,24,24,24,24,25,24,23,24,29,30,29,29,28,29,23,24,24,24,23,24,24,24,25,25,24,24,27,29,29,29,28,29,26,26,27,27,26,27,28,28,28,28,27,27]}]},{"type":"CUSTOM_EXT","dataLen":48,"pressure1":988,"pressure2":988,"batteryVoltage":27,"dcov":27.4,"dcoc":23.8,"dcTemp":42,"acTemp":42,"lftp":0,"lftt":0,"rftp":0,"rftt":0,"lr1tp":0,"lr1tt":0,"lr2tp":0,"lr2tt":0,"rr1tp":0,"rr1tt":0,"rr2tp":0,"rr2tt":0,"cv":593.9,"rc":-94,"cp":0,"totalCharge":0,"totalDischarge":0,"instantPower":0,"bpiRes":6500,"bniRes":6500,"apTemp":42,"motorContTemp":40,"airMode":"OFF","insideTemp":20,"outsideTemp":19,"middleDoorStatus":"CLOSE","frontDoorStatus":"CLOSE","handbrakeStatus":"OFF","keyPosition":"ON"}]}},"response":"232302014c53464430333230314a43303031363439010006120a1e1423352e","v":1}'
);

/**
 * 错误请求
 */
const requestErrorLog = makeKafkaLog(
  '{"level":50,"time":1540902953574,"msg":"request error","pid":17,"hostname":"d35202af7c8b-shanghaibus-v0-32960-1","session":"z2-NYoZCXXc","error":{"type":"Error","message":"Report has wrong info type 61.","stack":"Error: Report has wrong info type 61.    at r.formatter (/app/dist/cli.js:2:9317)    at r.o.formatter (/app/node_modules/@36node/telegram/dist/index.js:1:3698)    at r.o.parse (/app/node_modules/@36node/telegram/dist/index.js:1:3434)    at s.parse (/app/node_modules/@36node/telegram/dist/index.js:1:3161)    at r.realParseItem (/app/node_modules/@36node/telegram/dist/index.js:1:6286)    at r.parseItem (/app/node_modules/@36node/telegram/dist/index.js:1:5828)    at r.realParse (/app/node_modules/@36node/telegram/dist/index.js:1:5777)    at r.o.parse (/app/node_modules/@36node/telegram/dist/index.js:1:3403)    at s.parse (/app/node_modules/@36node/telegram/dist/index.js:1:3161)    at e.realParse (/app/node_modules/@36node/telegram/dist/index.js:1:8422)"},"v":1}'
);

/**
 * issue report
 */
const issueReportLog = makeKafkaLog(
  '{"level":30,"time":1540902953648,"msg":"handle rdb data","pid":17,"hostname":"d35202af7c8b-shanghaibus-v0-32960-1","session":"XFajAofoZIP","seq":20,"cost":0,"origin":"232303fe4c5a595442474257334a3130313432313701006b120a1e0c232c81010002130301b8042c0c010002000301b80426d3010002000301a4042483010002000301900422990100020003016804203b01000200030140041f1601000200030104041e94010002000300be0420fb010002000300780423eb010002000300320426559e","request":{"command":"REISSUE_REPORT","flag":"COMMAND","vin":"LZYTBGBW3J1014217","encrypt":"NONE","length":107,"body":{"at":"2018-10-30T04:35:44.000Z","items":[{"type":"TEN_SECONDS","datas":[{"accPedal":0,"brake":0.19,"speed":44,"totalCurrent":10276},{"accPedal":0,"brake":0,"speed":44,"totalCurrent":8939},{"accPedal":0,"brake":0,"speed":42,"totalCurrent":8347},{"accPedal":0,"brake":0,"speed":40,"totalCurrent":7857},{"accPedal":0,"brake":0,"speed":36,"totalCurrent":7251},{"accPedal":0,"brake":0,"speed":32,"totalCurrent":6958},{"accPedal":0,"brake":0,"speed":26,"totalCurrent":6828},{"accPedal":0,"brake":0,"speed":19,"totalCurrent":7443},{"accPedal":0,"brake":0,"speed":12,"totalCurrent":8195},{"accPedal":0,"brake":0,"speed":5,"totalCurrent":8813}]}]}},"response":"232303014c5a595442474257334a31303134323137010006120a1e0c232c42","v":1}'
);

/**
 * nonsupport log
 */
const nonsupportLog = makeKafkaLog(
  '{"level":40,"time":1540902953648,"msg":"handle rdb data"}'
);

const invalidLog = makeKafkaLog('{"level":"abc"}');

const recordWithAlarms = makeKafkaLog(
  JSON.stringify({
    level: 30,
    time: 1540902954337,
    msg: "handle rdb data",
    pid: 17,
    hostname: "d35202af7c8b-shanghaibus-v0-32960-1",
    session: "PBUh3XpG4yo",
    seq: 36,
    cost: 0,
    origin:
      "232302fe4c5a595442474357314a31303335383038010083120a1e0c23350101030100000000049c16aa271062010034f9000002010104464e204e204416a827100500073c1fa401dd26c70601310d0901f30d0401034101113f0703000000000000000110140602800030cece3727a2282528280142f63cf73cf63df73c054816aa2710186a0000000000000585000034f934f92846003e3b3d0627",
    request: {
      command: "REALTIME_REPORT",
      flag: "COMMAND",
      vin: "LZYTBGCW1J1035808",
      encrypt: "NONE",
      length: 131,
      body: {
        at: "2018-10-30T04:35:53.000Z",
        items: [
          {
            type: "VEHICLE",
            status: "ON",
            chargeStatus: "UNCHARGED",
            mode: "ELECTRIC",
            speed: 0,
            mileage: 118,
            voltage: 580.2,
            current: 0,
            soc: 0.98,
            dcStatus: "ON",
            shift: "N",
            resistance: 13561,
            aptv: 0,
            brake: 0,
          },
          {
            type: "MOTOR",
            count: 1,
            motors: [
              {
                no: 1,
                status: "READY",
                controlTemp: 30,
                speed: 0,
                torque: 0,
                temp: 28,
                voltage: 580,
                current: 0,
              },
            ],
          },
          { type: "LOCATION", state: 0, lng: 121.380772, lat: 31.270599 },
          {
            type: "EXTREME",
            maxVoltageSubSysNo: 1,
            maxVoltageSingNo: 49,
            maxVoltage: 3.337,
            minVoltageSubSysNo: 1,
            minVoltageSingNo: 243,
            minVoltage: 3.332,
            maxNtcSubSysNo: 1,
            maxNtcNo: 3,
            maxNtc: 25,
            minNtcSubSysNo: 1,
            minNtcNo: 17,
            minNtc: 23,
          },
          {
            type: "ALARM",
            maxLevel: 3,
            uas: {
              ressChargeOver: 1,
              motorTemp: 0,
              highVolMuteStatus: 0,
              motorControlTemp: 0,
              dcdcStatus: 0,
              brake: 0,
              dcdcTemp: 0,
              insulation: 0,
              batteryBadConsistency: 0,
              ressNotMatch: 0,
              socJump: 0,
              socOver: 0,
              batteryLow: 0,
              batteryOver: 0,
              socLow: 0,
              ressVolLow: 0,
              ressVolOver: 0,
              batteryTempOver: 0,
              tempDiff: 0,
            },
            ressLen: 0,
            ressList: [],
            mortorLen: 0,
            mortorList: [],
            engineLen: 0,
            engineList: [],
            otherLen: 1,
            otherList: [{ type: 16, code: 5126, level: 2 }],
          },
          {
            type: "CUSTOM_EXT",
            dataLen: 48,
            pressure1: 824,
            pressure2: 824,
            batteryVoltage: 27.5,
            dcov: 14.6,
            dcoc: 27.7,
            dcTemp: 0,
            acTemp: 0,
            lftp: 4,
            lftt: 26,
            rftp: 984,
            rftt: 20,
            lr1tp: 988,
            lr1tt: 20,
            lr2tp: 984,
            lr2tt: 21,
            rr1tp: 988,
            rr1tt: 20,
            rr2tp: 20,
            rr2tt: 32,
            cv: 580.2,
            rc: 0,
            cp: 625,
            totalCharge: 0,
            totalDischarge: 141.3,
            instantPower: 0,
            bpiRes: 13561,
            bniRes: 13561,
            apTemp: 0,
            motorContTemp: 30,
            airMode: "OFF",
            airTemp: 22,
            insideTemp: 19,
            outsideTemp: 21,
            middleDoorStatus: "CLOSE",
            frontDoorStatus: "CLOSE",
            handbrakeStatus: "ON",
            keyPosition: "ON",
          },
        ],
      },
    },
    response: "232302014c5a595442474357314a31303335383038010006120a1e0c23355e",
    v: 1,
  })
);

const loginLog = makeKafkaLog(
  '{"level":30,"time":1540902955596,"msg":"handle rdb data","pid":17,"hostname":"d35202af7c8b-shanghaibus-v0-32960-1","session":"5TpAsE4dik","seq":0,"cost":1,"origin":"232301fe4c5a595442474357344a3130333634393701001e120a1e14233600353839383630343032313031373030313733333938010090","request":{"command":"VEHICLE_LOGIN","flag":"COMMAND","vin":"LZYTBGCW4J1036497","encrypt":"NONE","length":30,"body":{"at":"2018-10-30T12:35:54.000Z","sn":53,"iccid":"89860402101700173398","subSysNm":1,"subSysNmLen":0,"subSysSn":[]}},"response":"232301014c5a595442474357344a31303336343937010006120a1e1423364a","v":1}'
);

const logoutLog = makeKafkaLog(
  '{"level":30,"time":1540902957001,"msg":"handle rdb data","pid":17,"hostname":"d35202af7c8b-shanghaibus-v0-32960-1","session":"z2-NYoZCXXc","seq":749553,"cost":0,"origin":"232304fe4c5a595441474257304731303432353336010008120a1e1423390212a3","request":{"command":"VEHICLE_LOGOUT","flag":"COMMAND","vin":"LZYTAGBW0G1042536","encrypt":"NONE","length":8,"body":{"at":"2018-10-30T12:35:57.000Z","sn":530}},"response":"232304014c5a595441474257304731303432353336010006120a1e14233942","v":1}'
);

const heatbeatLog = makeKafkaLog(
  '{"level":30,"time":1540902956963,"msg":"handle rdb data","pid":17,"hostname":"d35202af7c8b-shanghaibus-v0-32960-1","session":"wQXtl0Ja-Y","seq":73,"cost":0,"origin":"232307fe4c5a595442474257584a31303134323135010000d3","request":{"command":"HEARTBEAT","flag":"COMMAND","vin":"LZYTBGBWXJ1014215","encrypt":"NONE","length":0,"body":{}},"response":"232307014c5a595442474257584a313031343231350100002c","v":1}'
);

const discardLog = makeKafkaLog(
  '{"log":"  Error: read ECONNRESET\n","stream":"stderr","@timestamp":"2018-11-11T08:54:57.509","host":"304e08829f92-wali-logpilot-1","index":"TBOX","topic":"TBOX","@target":"TBOX","docker_app":"Shanghaibus-v0","docker_container":"Shanghaibus-v0_bus32960_3","docker_service":"bus32960"}'
);

function printLog(log) {
  console.log(JSON.stringify(log, null, 2));
}

describe("Test parser", function() {
  test("login log", () => {
    const parsedLog = handleMessage(loginLog);
    printLog(parsedLog);
    expect(parsedLog.type).toBe("RDB_DATA");
    expect(parsedLog.command).toBe("VEHICLE_LOGIN");
    expect(parsedLog.vin).toBe("LZYTBGCW4J1036497");
  });

  test("logout log", () => {
    const parsedLog = handleMessage(logoutLog);
    printLog(parsedLog);
    expect(parsedLog.type).toBe("RDB_DATA");
    expect(parsedLog.command).toBe("VEHICLE_LOGOUT");
    expect(parsedLog.vin).toBe("LZYTAGBW0G1042536");
  });

  test("heartbeat log", () => {
    const parsedLog = handleMessage(heatbeatLog);
    printLog(parsedLog);
    expect(parsedLog.type).toBe("RDB_DATA");
    expect(parsedLog.command).toBe("HEARTBEAT");
    expect(parsedLog.vin).toBe("LZYTBGBWXJ1014215");
  });

  test("alarm parse", () => {
    const parsedLog = handleMessage(recordWithAlarms);
    printLog(parsedLog);
    expect(parsedLog.payload.alarms.length).toBe(2);
  });

  test("record log", () => {
    const parsedLog = handleMessage(recordLog);
    printLog(parsedLog);
    expect(parsedLog.type).toBe("RDB_DATA");
    expect(parsedLog.command).toBe("REALTIME_REPORT");
    expect(parsedLog.vin).toBe("LSFD03201JC001649");
    expect(parsedLog.payload.id).toBe("LSFD03201JC001649");
  });

  test("reissue report", () => {
    const parsedLog = handleMessage(issueReportLog);
    printLog(parsedLog);
    expect(parsedLog.type).toBe("RDB_DATA");
    expect(parsedLog.payload.adas.length).toBe(10);
    expect(parsedLog.command).toBe("REISSUE_REPORT");
    expect(parsedLog.vin).toBe("LZYTBGBW3J1014217");
  });

  test("request error", () => {
    const parsedLog = handleMessage(requestErrorLog);
    printLog(parsedLog);
    expect(parsedLog.type).toBe("REQUEST_ERROR");
  });

  test("nonsupport log", () => {
    const parsedLog = handleMessage(nonsupportLog);
    printLog(parsedLog);
    expect(parsedLog.type).toBe("INVALID_LOG");
  });

  test("invalid log", () => {
    const parsedLog = handleMessage(invalidLog);
    printLog(parsedLog);
    expect(parsedLog).toBe(undefined);
  });
  test("discard log", () => {
    const log = handleMessage(discardLog);
    printLog(log);
    expect(log).toBe(undefined);
  });
});
