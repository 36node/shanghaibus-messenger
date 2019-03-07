import { handleKafkaData, parseLog } from "./parser";
import { padStart } from "lodash";
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

const withDataLog = makeKafkaLog(
  '{"level":30,"time":1547609015380,"msg":"handle tbox data success","pid":15,"hostname":"d28b0b3c862c-shanghaibus-v0-bus32960-1","session":"_H2wm5nd2C","seq":3934572,"partial":true,"cost":2,"data":"232302fe4c4a4d36474344423847415330313136350102461301100b17210101030100000012f2fa156c277f37011e1ce2001e02010102534e204cae7e156c27100500073d35f501dee6ca0601a50ce001790cc1010b3e01423507000000000000000000080101000a271000ff0001c80cc60cc60cc70cc70cc60cc70cc80cc70cc60cc60cc70cc60cc70cc70cc80cc70cc70cc70cc80cc80cc60cc70cc70cc70cc70cc70cc80cc70cc70cc70cc80cc70cc60cc70cc80cc80cc70cc70cc80cc80cc80cc70cc80cc80cc60cc70cc80cc70cc60cc60cc70cc60cc70cc80cc80cc70cc70cc70cc70cc70cc70cc70cc80cc70cc70cc70cc80cc80cc60cc70cc70cc70cc10cc20cc20cc10cc10cc20cc30cc20cc10cc10cc20cc20cc10cc10cc20cc10cc20cc20cc30cc20cc10cc20cc20cc10cc10cc20cc30cc20cc20cc20cc30cc20cc20cc20cc20cc20cc20cc20cc20cc10cc20cc30cc40cc30cc10cc20cc20cc20cc10cc20cc20cd60cdc0cd70cd30cd50cd60cd70cd20cd40cd10cd60cd10cd30cd40cd50cd20cd50cda0cd50cd10cd30cd10cd70cd20cd40cd60cd70cd20cd60cdb0cd70cd20cd40cd10cd80cd20cd50cd50cd80cd20cd60ce00cd70cd20cd50cd20cd60cd20cd40cd90cd70cd20cd50cd60cd80cd30cd60cd30cd80cd30cd60cd80cd90cd40cd70cd90cd60cd40cd70cd00cd50cd10cd30cd90cd60cd10cd309010100423c3c3c3c3d3d3c3d3c3d3e3d3b3d3c3c3c3c363636353636363736363636353635353636353636353535353635353635353635353635353635353636353635353635d00014000000000000000000000000000000000010f2652d","origin":"232302fe4c4a4d36474344423847415330313136350102461301100b17210101030100000012f2fa156c277f37011e1ce2001e02010102534e204cae7e156c27100500073d35f501dee6ca0601a50ce001790cc1010b3e01423507000000000000000000080101000a271000ff0001c80cc60cc60cc70cc70cc60cc70cc80cc70cc60cc60cc70cc60cc70cc70cc80cc70cc70cc70cc80cc80cc60cc70cc70cc70cc70cc70cc80cc70cc70cc70cc80cc70cc60cc70cc80cc80cc70cc70cc80cc80cc80cc70cc80cc80cc60cc70cc80cc70cc60cc60cc70cc60cc70cc80cc80cc70cc70cc70cc70cc70cc70cc70cc80cc70cc70cc70cc80cc80cc60cc70cc70cc70cc10cc20cc20cc10cc10cc20cc30cc20cc10cc10cc20cc20cc10cc10cc20cc10cc20cc20cc30cc20cc10cc20cc20cc10cc10cc20cc30cc20cc20cc20cc30cc20cc20cc20cc20cc20cc20cc20cc20cc10cc20cc30cc40cc30cc10cc20cc20cc20cc10cc20cc20cd60cdc0cd70cd30cd50cd60cd70cd20cd40cd10cd60cd10cd30cd40cd50cd20cd50cda0cd50cd10cd30cd10cd70cd20cd40cd60cd70cd20cd60cdb0cd70cd20cd40cd10cd80cd20cd50cd50cd80cd20cd60ce00cd70cd20cd50cd20cd60cd20cd40cd90cd70cd20cd50cd60cd80cd30cd60cd30cd80cd30cd60cd80cd90cd40cd70cd90cd60cd40cd70cd00cd50cd10cd30cd90cd60cd10cd309010100423c3c3c3c3d3d3c3d3c3d3e3d3b3d3c3c3c3c363636353636363736363636353635353636353636353535353635353635353635353635353635353636353635353635d00014000000000000000000000000000000000010f2652d232302fe4c4a4d36474344423847415330313136350101241301100b17210101030100000012f2fa156c277f37011e1ce2001e02010102534e204cae7e156c27100500073d35f501dee6ca0601190cda01370cd0010b3e01423507000000000000000000080101000a271000ff00c9370cd60cd50cd10cd40cd10cd50cd10cd30cd80cd50cd00cd10cd70cd40cd00cd30cd10cd70cd10cd30cd70cd60cd10cd50cda0cd50cd10cd40cd00cd40cd00cd40cd70cd40cd10cd30cd50cd50cd10cd20cd00cd50cd10cd30cd80cd70cd10cd40cd60cd40cd10cd40cd00cd20cd009010100423c3c3c3c3d3d3c3d3c3d3e3d3b3d3c3c3c3c363636353636363736363636353635353636353636353535353635353635353635353635353635353636353635353635d00014000000000000000000000000000000000010f26559232302fe4c4a4d36474344423247415330313136320102461301100b17210101030101e0001174e8150f234934010e125600000201010152651a4ff677150f23c80501073ccb2601deba3c06012b0ca4015d0c7c010b4001253607000000000000000000080101000a28f000ff0001c80c9d0c970ca00c9c0c910c980ca20c9c0c980c950ca00c9a0ca00c970ca20c9a0c960c980ca40c9d0c8e0c960ca10c9a0c9f0c970ca20c9c0c900c990ca40c9e0c960c980ca30c9c0ca10c980ca20c9a0c990c9a0ca40c9d0c8b0c950ca10c9c0c9e0c950c9f0c970c8b0c970ca20c9b0c930c940ca00c9a0c9e0c940ca00c990c950c980ca10c9a0c8d0c930c9f0c960c930c8d0c970c8e0c850c8e0c990c910c8b0c8b0c960c8f0c940c8b0c950c8c0c8a0c8d0c9a0c920c7c0c8a0c950c8c0c910c8c0c940c8d0c7e0c8c0c970c910c8d0c890c950c8d0c940c8b0c950c8f0c8e0c8d0c970c8f0c800c8b0c950c8e0c920c8f0c960c8f0c810c8c0c950c910c8e0c8c0c950c8e0c910c8a0c940c8d0c8a0c8b0c950c8f0c8a0c8a0c940c8e0c8f0c870c910c8a0c880c8c0c950c8c0c860c870c930c8d0c940c8f0c960c8f0c850c8a0c970c910c820c8a0c920c890c930c900c960c920c850c8f0c980c930c910c8e0c960c900c940c8c0c950c8e0c8e0c920c970c900c860c8d0c970c930c960c910c990c930c890c900c9b0c9609010100423d3e3e3f403f3e403e3f403f3d3f3e3e3e3e38","request":{"command":"REALTIME_REPORT","flag":"COMMAND","vin":"LJM6GCDB8GAS01165","encrypt":"NONE","length":582,"body":{"at":"2019-01-16T03:23:33.000Z","items":[{"type":"VEHICLE","status":"ON","chargeStatus":"UNCHARGED","mode":"ELECTRIC","speed":0,"mileage":124185,"voltage":548.4,"current":11.1,"soc":0.55,"dcStatus":"ON","shift":"D","resistance":7394,"aptv":0,"brake":0.3},{"type":"MOTOR","count":1,"motors":[{"no":1,"status":"GENERATION","controlTemp":43,"speed":0,"torque":-37,"temp":86,"voltage":548.4,"current":0}]},{"type":"LOCATION","state":0,"lng":121.452021,"lat":31.38529},{"type":"EXTREME","maxVoltageSubSysNo":1,"maxVoltageSingNo":165,"maxVoltage":3.296,"minVoltageSubSysNo":1,"minVoltageSingNo":121,"minVoltage":3.265,"maxNtcSubSysNo":1,"maxNtcNo":11,"maxNtc":22,"minNtcSubSysNo":1,"minNtcNo":66,"minNtc":13},{"type":"ALARM","maxLevel":0,"uas":{"ressChargeOver":0,"motorTemp":0,"highVolMuteStatus":0,"motorControlTemp":0,"dcdcStatus":0,"brake":0,"dcdcTemp":0,"insulation":0,"batteryBadConsistency":0,"ressNotMatch":0,"socJump":0,"socOver":0,"batteryLow":0,"batteryOver":0,"socLow":0,"ressVolLow":0,"ressVolOver":0,"batteryTempOver":0,"tempDiff":0},"ressLen":0,"ressList":[],"mortorLen":0,"mortorList":[],"engineLen":0,"engineList":[],"otherLen":0,"otherList":[]},{"type":"RESS_VOLTAGE","subCount":1,"subSystems":[{"no":1,"voltage":1,"current":0,"batteryCount":255,"frameStartBatteryNo":1,"frameBatteryCount":200,"batteryVols":[3.27,3.27,3.271,3.271,3.27,3.271,3.272,3.271,3.27,3.27,3.271,3.27,3.271,3.271,3.272,3.271,3.271,3.271,3.272,3.272,3.27,3.271,3.271,3.271,3.271,3.271,3.272,3.271,3.271,3.271,3.272,3.271,3.27,3.271,3.272,3.272,3.271,3.271,3.272,3.272,3.272,3.271,3.272,3.272,3.27,3.271,3.272,3.271,3.27,3.27,3.271,3.27,3.271,3.272,3.272,3.271,3.271,3.271,3.271,3.271,3.271,3.271,3.272,3.271,3.271,3.271,3.272,3.272,3.27,3.271,3.271,3.271,3.265,3.266,3.266,3.265,3.265,3.266,3.267,3.266,3.265,3.265,3.266,3.266,3.265,3.265,3.266,3.265,3.266,3.266,3.267,3.266,3.265,3.266,3.266,3.265,3.265,3.266,3.267,3.266,3.266,3.266,3.267,3.266,3.266,3.266,3.266,3.266,3.266,3.266,3.266,3.265,3.266,3.267,3.268,3.267,3.265,3.266,3.266,3.266,3.265,3.266,3.266,3.286,3.292,3.287,3.283,3.285,3.286,3.287,3.282,3.284,3.281,3.286,3.281,3.283,3.284,3.285,3.282,3.285,3.29,3.285,3.281,3.283,3.281,3.287,3.282,3.284,3.286,3.287,3.282,3.286,3.291,3.287,3.282,3.284,3.281,3.288,3.282,3.285,3.285,3.288,3.282,3.286,3.296,3.287,3.282,3.285,3.282,3.286,3.282,3.284,3.289,3.287,3.282,3.285,3.286,3.288,3.283,3.286,3.283,3.288,3.283,3.286,3.288,3.289,3.284,3.287,3.289,3.286,3.284,3.287,3.28,3.285,3.281,3.283,3.289,3.286,3.281,3.283]}]},{"type":"RESS_TEMPERATURE","subCount":1,"subSystems":[{"no":1,"probeCount":66,"temps":[20,20,20,20,21,21,20,21,20,21,22,21,19,21,20,20,20,20,14,14,14,13,14,14,14,15,14,14,14,14,13,14,13,13,14,14,13,14,14,13,13,13,13,14,13,13,14,13,13,14,13,13,14,13,13,14,13,13,14,14,13,14,13,13,14,13]}]}]},"err":"report has wrong info type d0"},"response":"232302014c4a4d36474344423847415330313136350100061301100b17211a","v":1}'
);

const withAdas = makeKafkaLog(
  '{"level":30,"time":1551686251582,"msg":"handle tbox data success","pid":28,"hostname":"4284e3e0848f-shanghaibus-v0-bus32960-3","session":"7-lTpSNhCtrt0VhTZbs8I","seq":51,"cost":0,"data":"232303fe4c53464431333230304a433030313939340101291303040f39118201000200030000042710050006ff07ff08ff09000a010b040c000d000001000200030000042710050006ff07ff08ff09000a010b040c000d000001000200030000042710050006ff07ff08ff09000a010b040c000d000001000200030000042710050006ff07ff08ff09000a010b040c000d000001000200030000042710050006ff07ff08ff09000a010b040c000d000001000200030000042710050006ff07ff08ff09000a010b040c000d000001000200030000042710050006ff07ff08ff09000a010b040c000d000001000200030000042710050006ff07ff08ff09000a010b040c000d000001000200030000042710050006ff07ff08ff09000a010b040c000d000001000200030000042710050006ff07ff08ff09000a010b040c000d000044","request":{"command":"REISSUE_REPORT","flag":"COMMAND","vin":"LSFD13200JC001994","encrypt":"NONE","length":297,"body":{"at":"2019-03-04T07:57:17.000Z","items":[{"type":"ADAS","datas":[{"accPedal":0,"brake":0,"speed":0,"totalCurrent":9000,"overSpeed":0,"wheelWarning":false,"buzzerWarning":false,"pWarning":false,"rWarning":false,"lWarning":false,"cWarning":true,"cmcsLevel":0,"crbs":true,"reserved":0,"fault":0},{"accPedal":0,"brake":0,"speed":0,"totalCurrent":9000,"overSpeed":0,"wheelWarning":false,"buzzerWarning":false,"pWarning":false,"rWarning":false,"lWarning":false,"cWarning":true,"cmcsLevel":0,"crbs":true,"reserved":0,"fault":0},{"accPedal":0,"brake":0,"speed":0,"totalCurrent":9000,"overSpeed":0,"wheelWarning":false,"buzzerWarning":false,"pWarning":false,"rWarning":false,"lWarning":false,"cWarning":true,"cmcsLevel":0,"crbs":true,"reserved":0,"fault":0},{"accPedal":0,"brake":0,"speed":0,"totalCurrent":9000,"overSpeed":0,"wheelWarning":false,"buzzerWarning":false,"pWarning":false,"rWarning":false,"lWarning":false,"cWarning":true,"cmcsLevel":0,"crbs":true,"reserved":0,"fault":0},{"accPedal":0,"brake":0,"speed":0,"totalCurrent":9000,"overSpeed":0,"wheelWarning":false,"buzzerWarning":false,"pWarning":false,"rWarning":false,"lWarning":false,"cWarning":true,"cmcsLevel":0,"crbs":true,"reserved":0,"fault":0},{"accPedal":0,"brake":0,"speed":0,"totalCurrent":9000,"overSpeed":0,"wheelWarning":false,"buzzerWarning":false,"pWarning":false,"rWarning":false,"lWarning":false,"cWarning":true,"cmcsLevel":0,"crbs":true,"reserved":0,"fault":0},{"accPedal":0,"brake":0,"speed":0,"totalCurrent":9000,"overSpeed":0,"wheelWarning":false,"buzzerWarning":false,"pWarning":false,"rWarning":false,"lWarning":false,"cWarning":true,"cmcsLevel":0,"crbs":true,"reserved":0,"fault":0},{"accPedal":0,"brake":0,"speed":0,"totalCurrent":9000,"overSpeed":0,"wheelWarning":false,"buzzerWarning":false,"pWarning":false,"rWarning":false,"lWarning":false,"cWarning":true,"cmcsLevel":0,"crbs":true,"reserved":0,"fault":0},{"accPedal":0,"brake":0,"speed":0,"totalCurrent":9000,"overSpeed":0,"wheelWarning":false,"buzzerWarning":false,"pWarning":false,"rWarning":false,"lWarning":false,"cWarning":true,"cmcsLevel":0,"crbs":true,"reserved":0,"fault":0},{"accPedal":0,"brake":0,"speed":0,"totalCurrent":9000,"overSpeed":0,"wheelWarning":false,"buzzerWarning":false,"pWarning":false,"rWarning":false,"lWarning":false,"cWarning":true,"cmcsLevel":0,"crbs":true,"reserved":0,"fault":0}]}]}},"response":"232303014c53464431333230304a433030313939340100061303040f391117","v":1}'
);

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

const withAlarmLog = makeKafkaLog(
  JSON.stringify({
    level: 30,
    time: 1540902954337,
    msg: "handle rdb data",
    pid: 17,
    hostname: "d35202af7c8b-shanghaibus-v0-32960-1",
    session: "PBUh3XpG4yo",
    seq: 36,
    cost: 0,
    request: {
      command: "REALTIME_REPORT",
      flag: "COMMAND",
      vin: "LZYTBGCW3J1044624",
      encrypt: "NONE",
      length: 131,
      body: {
        at: "2019-01-16T08:58:59.000Z",
        items: [
          {
            type: "VEHICLE",
            status: "ON",
            chargeStatus: "UNCHARGED",
            mode: "ELECTRIC",
            speed: 29,
            mileage: 4689,
            voltage: 562,
            current: 172.4,
            soc: 0.55,
            dcStatus: "ON",
            shift: "D",
            resistance: 13815,
            aptv: 0.3,
            brake: 0,
          },
          {
            type: "MOTOR",
            count: 1,
            motors: [
              {
                no: 1,
                status: "CONSUMPTION",
                controlTemp: 56,
                speed: 933,
                torque: 986,
                temp: 68,
                voltage: 559,
                current: 178,
              },
            ],
          },
          {
            type: "LOCATION",
            state: 0,
            lng: 121.517465,
            lat: 31.318744,
          },
          {
            type: "EXTREME",
            maxVoltageSubSysNo: 1,
            maxVoltageSingNo: 187,
            maxVoltage: 3.265,
            minVoltageSubSysNo: 1,
            minVoltageSingNo: 221,
            minVoltage: 3.248,
            maxNtcSubSysNo: 1,
            maxNtcNo: 32,
            maxNtc: 20,
            minNtcSubSysNo: 1,
            minNtcNo: 19,
            minNtc: 12,
          },
          {
            type: "ALARM",
            maxLevel: 3,
            uas: {
              ressChargeOver: 0,
              motorTemp: 0,
              highVolMuteStatus: 0,
              motorControlTemp: 0,
              dcdcStatus: 0,
              brake: 0,
              dcdcTemp: 0,
              insulation: 0,
              batteryBadConsistency: 0,
              ressNotMatch: 0,
              socJump: 1,
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
            otherList: [
              {
                type: 173,
                code: 41892,
                level: 3,
              },
            ],
          },
          {
            type: "CUSTOM_EXT",
            dataLen: 48,
            pressure1: 992,
            pressure2: 992,
            batteryVoltage: 27.5,
            dcov: 27.8,
            dcoc: 28.1,
            dcTemp: 56,
            acTemp: 56,
            lftp: 1012,
            lftt: 22,
            rftp: 4,
            rftt: 21,
            lr1tp: 4,
            lr1tt: 22,
            lr2tp: 8,
            lr2tt: 26,
            rr1tp: 4,
            rr1tt: 24,
            rr2tp: null,
            rr2tt: 21,
            cp: 0,
            totalCharge: 0,
            totalDischarge: 5951.1,
            instantPower: 3.5,
            bpiRes: 2500,
            bniRes: 2500,
            apTemp: 0,
            motorContTemp: 56,
            airTemp: 18,
            insideTemp: 8,
            outsideTemp: 19,
            middleDoorStatus: "CLOSE",
            frontDoorStatus: "CLOSE",
            handbrakeStatus: "OFF",
            keyPosition: "ON",
          },
        ],
      },
    },
  })
);

const largeMaxLevelLog = makeKafkaLog(
  JSON.stringify({
    level: 30,
    time: 1540902954337,
    msg: "handle rdb data",
    pid: 17,
    hostname: "d35202af7c8b-shanghaibus-v0-32960-1",
    session: "PBUh3XpG4yo",
    seq: 36,
    cost: 0,
    request: {
      command: "REALTIME_REPORT",
      flag: "COMMAND",
      vin: "LZYTBGCW6J1036646",
      encrypt: "NONE",
      length: 127,
      body: {
        at: "2019-01-17T08:27:44.000Z",
        items: [
          {
            type: "VEHICLE",
            status: "ON",
            chargeStatus: "UNCHARGED",
            mode: "ELECTRIC",
            speed: 9,
            mileage: 10343,
            voltage: 579,
            current: 3,
            soc: 1,
            dcStatus: "ON",
            shift: "D",
            resistance: 38829,
            aptv: 0,
            brake: 0,
          },
          {
            type: "MOTOR",
            count: 1,
            motors: [
              {
                no: 1,
                status: "GENERATION",
                controlTemp: 20,
                speed: 294,
                torque: 0,
                temp: 11,
                voltage: 579,
                current: 0,
              },
            ],
          },
          {
            type: "LOCATION",
            state: 1,
            lng: 121.442673,
            lat: 31.226615,
          },
          {
            type: "EXTREME",
            maxVoltageSubSysNo: 1,
            maxVoltageSingNo: 26,
            maxVoltage: 3.371,
            minVoltageSubSysNo: 1,
            minVoltageSingNo: 228,
            minVoltage: 3.31,
            maxNtcSubSysNo: 1,
            maxNtcNo: 32,
            maxNtc: 16,
            minNtcSubSysNo: 1,
            minNtcNo: 13,
            minNtc: 10,
          },
          {
            type: "ALARM",
            maxLevel: 51,
            uas: {
              ressChargeOver: 0,
              motorTemp: 1,
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
            otherLen: 0,
            otherList: [],
          },
          {
            type: "CUSTOM_EXT",
            dataLen: 48,
            pressure1: 1000,
            pressure2: 1000,
            batteryVoltage: 27.5,
            dcov: 14.9,
            dcoc: 27.7,
            dcTemp: 0,
            acTemp: 0,
            lftp: 976,
            lftt: 21,
            rftp: 956,
            rftt: 16,
            lr1tp: 968,
            lr1tt: 18,
            lr2tp: 976,
            lr2tt: 21,
            rr1tp: 984,
            rr1tt: 22,
            rr2tp: 968,
            rr2tt: 18,
            cp: 6131.1,
            totalCharge: 0,
            totalDischarge: 12432.4,
            instantPower: 0.1,
            bpiRes: 38829,
            bniRes: 38829,
            apTemp: 0,
            motorContTemp: 20,
            airMode: "OFF",
            airTemp: 16,
            insideTemp: 7,
            outsideTemp: 7,
            middleDoorStatus: "CLOSE",
            frontDoorStatus: "CLOSE",
            handbrakeStatus: "OFF",
            keyPosition: "ON",
          },
        ],
      },
    },
  })
);

function printLog(log) {
  console.log(JSON.stringify(log, null, 2));
}

describe("Test parser", function() {
  test("login log", () => {
    const parsedLog = handleKafkaData(loginLog);
    printLog(parsedLog);
    expect(parsedLog.type).toBe("RDB_DATA");
    expect(parsedLog.command).toBe("VEHICLE_LOGIN");
    expect(parsedLog.vin).toBe("LZYTBGCW4J1036497");
    expect(parsedLog.recordId).toBe("5TpAsE4dik_0");
  });

  test("logout log", () => {
    const parsedLog = handleKafkaData(logoutLog);
    printLog(parsedLog);
    expect(parsedLog.type).toBe("RDB_DATA");
    expect(parsedLog.command).toBe("VEHICLE_LOGOUT");
    expect(parsedLog.vin).toBe("LZYTAGBW0G1042536");
    expect(parsedLog.recordId).toBe("z2-NYoZCXXc_749553");
  });

  test("heartbeat log", () => {
    const parsedLog = handleKafkaData(heatbeatLog);
    printLog(parsedLog);
    expect(parsedLog.type).toBe("RDB_DATA");
    expect(parsedLog.command).toBe("HEARTBEAT");
    expect(parsedLog.vin).toBe("LZYTBGBWXJ1014215");
    expect(parsedLog.recordId).toBe("wQXtl0Ja-Y_73");
  });

  test("alarm parse", () => {
    const parsedLog = handleKafkaData(recordWithAlarms);
    printLog(parsedLog);
    expect(parsedLog.payload.alarms.length).toBe(2);
    expect(parsedLog.recordId).toBe("PBUh3XpG4yo_36");
  });

  test("record log", () => {
    const parsedLog = handleKafkaData(recordLog);
    printLog(parsedLog);
    expect(parsedLog.type).toBe("RDB_DATA");
    expect(parsedLog.command).toBe("REALTIME_REPORT");
    expect(parsedLog.vin).toBe("LSFD03201JC001649");
    expect(parsedLog.payload.id).toBe("LSFD03201JC001649");
    expect(parsedLog.recordId).toBe("dj4Of2L6XrT_22");
  });

  test("reissue report", () => {
    const parsedLog = handleKafkaData(issueReportLog);
    printLog(parsedLog);
    expect(parsedLog.type).toBe("RDB_DATA");
    expect(parsedLog.payload.tens.length).toBe(10);
    expect(parsedLog.command).toBe("REISSUE_REPORT");
    expect(parsedLog.vin).toBe("LZYTBGBW3J1014217");
    expect(parsedLog.recordId).toBe("XFajAofoZIP_20");
  });

  test("request error", () => {
    const parsedLog = handleKafkaData(requestErrorLog);
    printLog(parsedLog);
    expect(parsedLog.type).toBe("REQUEST_ERROR");
  });

  test("nonsupport log", () => {
    const parsedLog = handleKafkaData(nonsupportLog);
    printLog(parsedLog);
    expect(parsedLog.type).toBe("INVALID_LOG");
  });

  test("invalid log", () => {
    const parsedLog = handleKafkaData(invalidLog);
    printLog(parsedLog);
    expect(parsedLog).toBe(undefined);
  });
  test("discard log", () => {
    const log = handleKafkaData(discardLog);
    printLog(log);
    expect(log).toBe(undefined);
  });

  test("log with data", () => {
    const parsedLog = handleKafkaData(withDataLog);
    printLog(parsedLog);
    expect(parsedLog.cost).toBe(2);
    expect(parsedLog.partial).toBe(true);
    expect(parsedLog.data).toBe(
      "232302fe4c4a4d36474344423847415330313136350102461301100b17210101030100000012f2fa156c277f37011e1ce2001e02010102534e204cae7e156c27100500073d35f501dee6ca0601a50ce001790cc1010b3e01423507000000000000000000080101000a271000ff0001c80cc60cc60cc70cc70cc60cc70cc80cc70cc60cc60cc70cc60cc70cc70cc80cc70cc70cc70cc80cc80cc60cc70cc70cc70cc70cc70cc80cc70cc70cc70cc80cc70cc60cc70cc80cc80cc70cc70cc80cc80cc80cc70cc80cc80cc60cc70cc80cc70cc60cc60cc70cc60cc70cc80cc80cc70cc70cc70cc70cc70cc70cc70cc80cc70cc70cc70cc80cc80cc60cc70cc70cc70cc10cc20cc20cc10cc10cc20cc30cc20cc10cc10cc20cc20cc10cc10cc20cc10cc20cc20cc30cc20cc10cc20cc20cc10cc10cc20cc30cc20cc20cc20cc30cc20cc20cc20cc20cc20cc20cc20cc20cc10cc20cc30cc40cc30cc10cc20cc20cc20cc10cc20cc20cd60cdc0cd70cd30cd50cd60cd70cd20cd40cd10cd60cd10cd30cd40cd50cd20cd50cda0cd50cd10cd30cd10cd70cd20cd40cd60cd70cd20cd60cdb0cd70cd20cd40cd10cd80cd20cd50cd50cd80cd20cd60ce00cd70cd20cd50cd20cd60cd20cd40cd90cd70cd20cd50cd60cd80cd30cd60cd30cd80cd30cd60cd80cd90cd40cd70cd90cd60cd40cd70cd00cd50cd10cd30cd90cd60cd10cd309010100423c3c3c3c3d3d3c3d3c3d3e3d3b3d3c3c3c3c363636353636363736363636353635353636353636353535353635353635353635353635353635353636353635353635d00014000000000000000000000000000000000010f2652d"
    );
    expect(parsedLog.origin).toBe(
      "232302fe4c4a4d36474344423847415330313136350102461301100b17210101030100000012f2fa156c277f37011e1ce2001e02010102534e204cae7e156c27100500073d35f501dee6ca0601a50ce001790cc1010b3e01423507000000000000000000080101000a271000ff0001c80cc60cc60cc70cc70cc60cc70cc80cc70cc60cc60cc70cc60cc70cc70cc80cc70cc70cc70cc80cc80cc60cc70cc70cc70cc70cc70cc80cc70cc70cc70cc80cc70cc60cc70cc80cc80cc70cc70cc80cc80cc80cc70cc80cc80cc60cc70cc80cc70cc60cc60cc70cc60cc70cc80cc80cc70cc70cc70cc70cc70cc70cc70cc80cc70cc70cc70cc80cc80cc60cc70cc70cc70cc10cc20cc20cc10cc10cc20cc30cc20cc10cc10cc20cc20cc10cc10cc20cc10cc20cc20cc30cc20cc10cc20cc20cc10cc10cc20cc30cc20cc20cc20cc30cc20cc20cc20cc20cc20cc20cc20cc20cc10cc20cc30cc40cc30cc10cc20cc20cc20cc10cc20cc20cd60cdc0cd70cd30cd50cd60cd70cd20cd40cd10cd60cd10cd30cd40cd50cd20cd50cda0cd50cd10cd30cd10cd70cd20cd40cd60cd70cd20cd60cdb0cd70cd20cd40cd10cd80cd20cd50cd50cd80cd20cd60ce00cd70cd20cd50cd20cd60cd20cd40cd90cd70cd20cd50cd60cd80cd30cd60cd30cd80cd30cd60cd80cd90cd40cd70cd90cd60cd40cd70cd00cd50cd10cd30cd90cd60cd10cd309010100423c3c3c3c3d3d3c3d3c3d3e3d3b3d3c3c3c3c363636353636363736363636353635353636353636353535353635353635353635353635353635353636353635353635d00014000000000000000000000000000000000010f2652d232302fe4c4a4d36474344423847415330313136350101241301100b17210101030100000012f2fa156c277f37011e1ce2001e02010102534e204cae7e156c27100500073d35f501dee6ca0601190cda01370cd0010b3e01423507000000000000000000080101000a271000ff00c9370cd60cd50cd10cd40cd10cd50cd10cd30cd80cd50cd00cd10cd70cd40cd00cd30cd10cd70cd10cd30cd70cd60cd10cd50cda0cd50cd10cd40cd00cd40cd00cd40cd70cd40cd10cd30cd50cd50cd10cd20cd00cd50cd10cd30cd80cd70cd10cd40cd60cd40cd10cd40cd00cd20cd009010100423c3c3c3c3d3d3c3d3c3d3e3d3b3d3c3c3c3c363636353636363736363636353635353636353636353535353635353635353635353635353635353636353635353635d00014000000000000000000000000000000000010f26559232302fe4c4a4d36474344423247415330313136320102461301100b17210101030101e0001174e8150f234934010e125600000201010152651a4ff677150f23c80501073ccb2601deba3c06012b0ca4015d0c7c010b4001253607000000000000000000080101000a28f000ff0001c80c9d0c970ca00c9c0c910c980ca20c9c0c980c950ca00c9a0ca00c970ca20c9a0c960c980ca40c9d0c8e0c960ca10c9a0c9f0c970ca20c9c0c900c990ca40c9e0c960c980ca30c9c0ca10c980ca20c9a0c990c9a0ca40c9d0c8b0c950ca10c9c0c9e0c950c9f0c970c8b0c970ca20c9b0c930c940ca00c9a0c9e0c940ca00c990c950c980ca10c9a0c8d0c930c9f0c960c930c8d0c970c8e0c850c8e0c990c910c8b0c8b0c960c8f0c940c8b0c950c8c0c8a0c8d0c9a0c920c7c0c8a0c950c8c0c910c8c0c940c8d0c7e0c8c0c970c910c8d0c890c950c8d0c940c8b0c950c8f0c8e0c8d0c970c8f0c800c8b0c950c8e0c920c8f0c960c8f0c810c8c0c950c910c8e0c8c0c950c8e0c910c8a0c940c8d0c8a0c8b0c950c8f0c8a0c8a0c940c8e0c8f0c870c910c8a0c880c8c0c950c8c0c860c870c930c8d0c940c8f0c960c8f0c850c8a0c970c910c820c8a0c920c890c930c900c960c920c850c8f0c980c930c910c8e0c960c900c940c8c0c950c8e0c8e0c920c970c900c860c8d0c970c930c960c910c990c930c890c900c9b0c9609010100423d3e3e3f403f3e403e3f403f3d3f3e3e3e3e38"
    );
  });

  test("error alarms", () => {
    const parsedLog = handleKafkaData(withAlarmLog);
    printLog(parsedLog);
    expect(parsedLog.payload.alarms.length).toBe(2);
    expect(parsedLog.payload.alarms[0]).toBe("00000003");
    expect(parsedLog.payload.alarms[1]).toBe("ada3a403");
    expect(parsedLog.recordId).toBe("PBUh3XpG4yo_36");
  });

  test("large alarmLevel log", () => {
    const parsedLog = handleKafkaData(largeMaxLevelLog);
    printLog(parsedLog);
    expect(parsedLog.payload.alarms.length).toBe(1);
    expect(parsedLog.payload.alarms[0]).toBe("10140602");
  });

  test("adas log", () => {
    const parsedLog = handleKafkaData(withAdas);
    printLog(parsedLog);
    expect(parsedLog.payload.adas.length).toBe(10);
    expect(parsedLog.command).toBe("REISSUE_REPORT");
  });
});
