# @36node/shanghaibus-messenger

基于 kafka 的消息接收 clinet

[![version][0]][1] [![downloads][2]][3]

## Install

```bash
yarn add @36node/shanghaibus-messenger
```

## 使用

```js
import Messenger from "shanghaibus-messenger";

const client = new Messenger(
  {
    "group.id": "shanghaibus-core",
    "metadata.broker.list": "localhost:9092",
  },
  ["TBOX"]
);

/** 订阅全部 rdb log */
client.onRdbData(log => {
  console.log(log.vin, "rdb log comming");
});

/** 按照 command 订阅 rdb log */
client.onRdbData(
  log => {
    console.log(log.command);
  },
  ["REALTIME_REPORT", "REISSUE_REPORT"]
);

/**订阅 request error 类型log */
client.onRequestError(log => {
  console.log("Request error log comming");
});

/** 订阅 invalid log */
client.onInvalidLog(log => {
  console.log("Invalid log comming");
});
```

### messenger 解析后日志的基本格式

```typescript
{

  recordId?: string, // 由原始日志的 session + seq 组成， 对于 RDB_DATA 类型的日志才有，其他类型的日志没有这条记录
  cost?: number, // 解析日志的耗时
  data?: string, // 原始二进制日志内容(二进制字符串)
  origin?: string,  // 二进制字符串
  partial?: boolean, // 是否完全
  type: string, // 日志类型
  payload: object, // 日志的内容, 对于 REALTIME_REPORT, REISSUE_REPORT, payload 为 record
  vin?: string, // 车辆vin码， 只在 RDB_DATA 类型日志中存在
  command?: string, // 日志的命令， 只在 RDB_RATA 类型日志中存在
  error?: string, // 日志解析时发生的错误，只在 INVALID_LOG 类型中存在
  reportedAt: string, // 日志发送的时间，为 ISO string
}
```

### 日志类型(type)

| 类型          | 说明                         |
| :------------ | :--------------------------- |
| RDB_DATA      | 车辆信息日志                 |
| REQUEST_ERROR | 日志产生时发生的错误         |
| INVALID_ERROR | messenger 无法正确解析的日志 |

### 命令(command)

在 RDB_DATA 类型的日志中，按 command 可分为:

| 类型            | 说明         |
| :-------------- | :----------- |
| VEHICLE_LOGIN   | 车辆登入     |
| VEHICLE_LOGOUT  | 车辆登出     |
| HEARTBEAT       | 心跳         |
| REALTIME_REPORT | 实时数据上报 |
| REISSUE_REPORT  | 数据补发     |

### record 格式

将原始的车辆数据进行解析，形成 record

```typescript
{
  id:string, // 车辆vin
  at:string, // 信息采集时间
  vehicle?: object, // 整车数据, 具体数据内容见下原始日志格式说明
  montors?: [object], // 电机数据, 具体数据内容见下原始日志格式说明
  extreme?: object, // 极值数据, 具体数据内容见下原始日志格式说明
  alarm?: [string], // 警报数据, 为警报码的数组
  customExt?: object, // 自定义数据，具体数据内容见下原始日志格式说明
  adas?: [object], // 补充协议数据，具体数据内容见下原始日志格式说明
}
```

## 原始日志格式说明

原始日志指从 kafka 接收到的未经处理的日志

### 0 日志基本格式

```js
{
  level: number, // 日志级别
  time: number, // 日志产生时间，unix时间戳
  msg: string, // 日志信息 "handle rdb data", "request error", "session closed" 等
  request?: object, // 日志的信息，可选
  error?: object, // 错误信息, 可选
  session?: string, // 终端的session
  seq?: string, // 当前session下的消息编号
}
```

### 1 车辆实时信息日志(Handle rdb data)

#### 1.1 车辆登入 (command=VEHICLE_LOGIN)

```js
{
  level: 30, // 日志级别
  time: 1540902956033, // 日志时间戳
  msg: "handle rdb data", // 日志信息
  pid: 17,
  hostname: "d35202af7c8b-shanghaibus-v0-32960-1",
  session: "phJhOh3EiUF",
  seq: 2,
  cost: 0,
  origin:
    "232301fe4c5a595442474257364a3130313431393401001e120a1e14233600fd383938363034303231303137303031373937373901005c",
  request: { // 日志具体内容
    command: "VEHICLE_LOGIN",
    flag: "COMMAND",
    vin: "LZYTBGBW6J1014194", // 车辆vin码
    encrypt: "NONE",
    length: 30,
    body: {
      at: "2018-10-30T12:35:54.000Z", // 数据上报时间
      sn: 253,
      iccid: "89860402101700179779",
      subSysNm: 1,
      subSysNmLen: 0,
      subSysSn: [],
    },
  },
  response: "232301014c5a595442474257364a31303134313934010006120a1e1423364f",
  v: 1,
}

```

request body 格式说明:

| 数据表示内容           | 字段        | 数据类型        | 描述及要求                                                                          |
| :--------------------- | :---------- | :-------------- | :---------------------------------------------------------------------------------- |
| 数据采集时间           | at          | date ISO string | 数据采集的原始时间                                                                  |
| 登入流水号             | sn          | integer         | 车载终端每登入一次登入流水号自动加 1，从 1 开始循环累加，最大值 65531，循环周期为天 |
| ICCID                  | iccid       | string          | SIM 卡 ICCID 号（ICCID 应为终端从 SIM 卡获取的值，不应该人为填写或修改）            |
| 可充电储能子系统数     | subSysNm    | integer         | 可充电储能子系统数 n，有效值范围：0~250                                             |
| 可充电储能系统编码长度 | subSysNmLen | integer         | 可充电储能系统编码长度 m，有效值范围：0~50，“0”表示不上传该编码                     |
| 可充电储能系统编码     | subSysSn    | [string]        | 可充电储能系统编码宜为终端从车辆获取的值                                            |

#### 1.2 车辆登出 (command=VEHICLE_LOGOUT)

```js
{
  level: 30,
  time: 1540902976674,
  msg: "handle rdb data",
  pid: 17,
  hostname: "d35202af7c8b-shanghaibus-v0-32960-1",
  session: "fcG8xIaC4C8",
  seq: 470,
  cost: 0,
  origin: "232304fe4c53464430333230344a43303031353935010008120a1e1424110014e9",
  request: {
    command: "VEHICLE_LOGOUT",
    flag: "COMMAND",
    vin: "LSFD03204JC001595",
    encrypt: "NONE",
    length: 8,
    body: { at: "2018-10-30T12:36:17.000Z", sn: 20 },
  },
  response: "232304014c53464430333230344a43303031353935010006120a1e1424110c",
  v: 1,
}
```

request body 格式说明：

| 数据表示内容 | 字段 | 数据类型        | 描述及要求                     |
| :----------- | :--- | :-------------- | :----------------------------- |
| 登出时间     | at   | date ISO string | 数据采集的原始时间             |
| 登出流水号   | sn   | integer         | 登出流水号和当前登入流水号一致 |

#### 1.3 实时信息上报 (command=REALTIME_REPORT)

```js
{
  level: 30,
  time: 1540902953574,
  msg: "handle rdb data",
  pid: 17,
  hostname: "d35202af7c8b-shanghaibus-v0-32960-1",
  session: "z2-NYoZCXXc",
  seq: 749482,
  cost: 1,
  origin:
    "232302fe4c5a59544147425732453130353434393101007f120a1e142400010103010000001b390b164925da39023e41b6000102010104284e204e2028000027100500073d270801dcda6a06013f0cbf015b0cb2010246014e400700000000000000000080003000000003e803e8ffffffffffffffffffffffffffff1649feca00000000000000000000ffff00000000ff280028282802c7",
  request: {
    command: "REALTIME_REPORT",
    flag: "COMMAND",
    vin: "LZYTAGBW2E1054491",
    encrypt: "NONE",
    length: 127,
    body: {
      at: "2018-10-30T12:36:00.000Z",
      items: [
        {
          type: "VEHICLE",
          status: "ON",
          chargeStatus: "UNCHARGED",
          mode: "ELECTRIC",
          speed: 0,
          mileage: 178407.5,
          voltage: 570.5,
          current: -31,
          soc: 0.57,
          dcStatus: "OFF",
          shift: "D",
          resistance: 16822,
          aptv: 0,
          brake: 0.01,
        },
        {
          type: "MOTOR",
          count: 1,
          motors: [
            {
              no: 1,
              status: "READY",
              controlTemp: 0,
              speed: 0,
              torque: 0,
              temp: 0,
              voltage: 0,
              current: 0,
            },
          ],
        },
        { type: "LOCATION", state: 0, lng: 121.4482, lat: 31.25105 },
        {
          type: "EXTREME",
          maxVoltageSubSysNo: 1,
          maxVoltageSingNo: 63,
          maxVoltage: 3.263,
          minVoltageSubSysNo: 1,
          minVoltageSingNo: 91,
          minVoltage: 3.25,
          maxNtcSubSysNo: 1,
          maxNtcNo: 2,
          maxNtc: 30,
          minNtcSubSysNo: 1,
          minNtcNo: 78,
          minNtc: 24,
        },
        {
          type: "ALARM",
          maxLevel: 0,
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
          pressure1: 0,
          pressure2: 0,
          batteryVoltage: 0,
          dcov: -900,
          dcoc: -900,
          cv: 570.5,
          rc: 5522.6,
          cp: 0,
          totalCharge: 0,
          totalDischarge: 0,
          bpiRes: 0,
          bniRes: 0,
          motorContTemp: 0,
          airMode: "OFF",
          airTemp: 0,
          insideTemp: 0,
          outsideTemp: 0,
          middleDoorStatus: "CLOSE",
          frontDoorStatus: "CLOSE",
          handbrakeStatus: "OFF",
          keyPosition: "ON",
        },
      ],
    },
  },
  response: "232302014c5a595441474257324531303534343931010006120a1e14240071",
  v: 1,
}
```

request body 格式说明：

| 数据表示内容 | 字段  | 数据类型        | 描述及要求                 |
| :----------- | :---- | :-------------- | :------------------------- |
| 登出时间     | at    | date ISO string | 数据采集的原始时间         |
| 实时车辆数据 | items | [object]        | 车辆实时数据, 具体定义见下 |

##### 1.3.1 整车数据 (type=VEHICLE)

```js
{
  type: "VEHICLE",
  status: "ON",
  chargeStatus: "UNCHARGED",
  mode: "ELECTRIC",
  speed: 0,
  mileage: 178407.5,
  voltage: 570.5,
  current: -31,
  soc: 0.57,
  dcStatus: "OFF",
  shift: "D",
  resistance: 16822,
  aptv: 0,
  brake: 0.01,
}
```

数据说明:

| 字段         | 数据内容       | 类型          | 有效值范围   | 分辨率  | 说明                                                                                               |
| :----------- | :------------- | :------------ | :----------- | :------ | :------------------------------------------------------------------------------------------------- |
| status       | 车辆状态       | string enum   |              |         | "ON": 启动, "OFF": 熄火, "OTHER": 其他                                                             |
| chargeStatus | 充电状态       | string enum   |              |         | "PARK_CHARGING": 停车充电, "MOVE_CHARGING": 行驶充电, "UNCHARGED": 未充电状态, "COMPETE": 充电完成 |
| mode         | 运行模式       | string enum   |              |         | "ELECTRIC": 电动, "MIXED": 混动, "FUEL": 燃油                                                      |
| speed        | 车速           | float         | 0 ~220       | 0.1km/h |
| mileage      | 累计里程       | float         | 0 ～ 9999999 | 0.1km   |
| voltage      | 总电压         | float         | 0 ～ 10000   | 0.1V    |
| current      | 总电流         | float 0~20000 | 0.1A         |
| soc          | SOC            | float         | 0~1          | 0.01    |
| dcStatus     | DC-OC 状态     | string        |              |         | "ON":工作, "OFF": 断开                                                                             |
| shift        | 档位           | enum          |              |         |
| resistance   | 绝缘电阻       | integer       | 0~60000      | 1kΩ     |
| aptv         | 加速踏板行程值 | float         | 0~1          | 0.01    |
| break        | 制动踏板状态   | float         | 0~1          | 0.01    |                                                                                                    |

##### 1.3.2 驱动电机数据 (type=MOTOR)

```js
{
  type: "MOTOR",
  count: 1,
  motors: [
    {
      no: 1,
      status: "READY",
      controlTemp: 0,
      speed: 0,
      torque: 0,
      temp: 0,
      voltage: 0,
      current: 0,
    },
  ],
}
```

数据说明

| 字段   | 数据内容             | 类型     | 有效值范围 |
| :----- | :------------------- | :------- | :--------- |
| count  | 驱动电机个数         | integer  | 1~253      |
| motors | 驱动电机总成信息列表 | [object] |            |

每个驱动电机数据说明:

| 字段        | 数据内容               | 类型        | 有效值范围 | 分辨率 | 说明                                                                      |
| :---------- | :--------------------- | :---------- | :--------- | :----- | :------------------------------------------------------------------------ |
| no          | 驱动电机序号           | integer     | 1~253      |        |                                                                           |
| status      | 驱动电机状态           | enum string |            |        | "CONSUMPTION": 耗电， "GENERATION": 发电， "OFF": 关闭状态, "READY": 准备 |
| controlTemp | 驱动电机控制器温度     | float       | 0~250      | 1℃     |                                                                           |
| speed       | 驱动电机转速           | integer     | 0~65531    | 1r/min |                                                                           |
| torque      | 驱动电机转矩           | integer     | 0~65531    | 0.1N·m |                                                                           |
| temp        | 驱动电机温度           | integer     | 0~250      | 1℃     |                                                                           |
| voltage     | 电机控制器输入电压     | integer     | 0~60000    | 0.1V   |                                                                           |
| current     | 电机控制器直线母线电流 | integer     | 0~20000    | 0.1A   |                                                                           |

##### 1.3.3 车辆位置数据 (type=LOCATION)

```js
{
  type: "LOCATION",
  state: 0,
  lng: 121.4482,
  lat: 31.25105
}
```

数据说明:

| 字段  | 数据内容 | 类型    | 说明                                         |
| :---- | :------- | :------ | :------------------------------------------- |
| state | 定义状态 | integer | 0：有效定位；1：无效定位                     |
| lng   | 经度     | float   | 以度为单位的纬度值乘以 10^6,精度到万分之一度 |
| lat   | 纬度     | float   | 以度为单位的纬度值乘以 10^6,精度到万分之一度 |

##### 1.3.4 极值数据 (type=EXTREME)

```js
{
  type: "EXTREME",
  maxVoltageSubSysNo: 1,
  maxVoltageSingNo: 63,
  maxVoltage: 3.263,
  minVoltageSubSysNo: 1,
  minVoltageSingNo: 91,
  minVoltage: 3.25,
  maxNtcSubSysNo: 1,
  maxNtcNo: 2,
  maxNtc: 30,
  minNtcSubSysNo: 1,
  minNtcNo: 78,
  minNtc: 24,
}
```

数据说明:

| 字段               | 数据内容             | 类型    | 有效值范围 | 分辨率 | 说明 |
| :----------------- | :------------------- | :------ | :--------- | :----- | :--- |
| maxVoltageSubSysNo | 最高电压电池子系统号 | integer | 1~250      |        |      |
| maxVoltageSingNo   | 最高电压电池单体代号 | integer | 1~250      |        |      |
| maxVoltage         | 电池单体电压最高值   | float   | 1~15000    | 0.001V |      |
| minVoltageSubSysNo | 最低电压电池子系代号 | integer | 1~250      |        |      |
| minVoltageSingNo   | 最低电压电池单体代号 | integer | 1~250      |        |      |
| minVoltage         | 电池单体最低电压值   | float   | 1~15000    | 0.001V |      |
| maxNtcSubSysNo     | 最高温度子系统号     | integer | 1~250      |        |      |
| maxNtcNo           | 最高温度探针序号     | integer | 1~250      |        |      |
| maxNtc             | 最高温度值           | integer | 1~250      | 1℃     |      |
| minNtcSubSysNo     | 最低温度子系统号     | integer | 1~250      |        |      |
| minNtcNo           | 最低温度探针序号     | integer | 1~250      |        |      |
| minNtc             | 最低温度值           | integer | 1~250      | 1℃     |      |

##### 1.3.5 报警数据 (type=ALARM)

```js
{
  type: "ALARM",
  maxLevel: 0,
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
  otherList: [{"type":16,"code":5126,"level":2}],
}
```

数据说明:

| 字段          | 数据内容                   | 类型     | 有效值范围 | 说明                 |
| :------------ | :------------------------- | :------- | :--------- | :------------------- |
| maxAlarmLevel | 最高报警等级               | integer  | 0~3        |                      |
| uas           | 通用报警标志               | object   |            | 见通用报警标志位定义 |
| ressLen       | 可充电储能装置故障总数 N1  | integer  | 0~255      |                      |
| lessList      | 可充电储能装置故障代码列表 | [object] |            | 见故障定义           |
| mortorLen     | 驱动电机故障总数 N2        | integer  | 0~255      |                      |
| mortorList    | 驱动电机故障代码列表       | [object] |            | 见故障定义           |
| engineLen     | 发动机故障总数 N3          | integer  | 0~255      |                      |
| engineList    | 发动机故障列表             | [object] |            | 见故障定义           |
| otherLen      | 其他故障总数 N4            | integer  | 0~255      |                      |
| otherLis      | 其他故障代码列表           | [object] |            | 见故障定义           |

通用警报位定义及解析:

```js
export const ALARM_FLAGS = {
  tempDiff: [0x10131101, 0x10131202, 0x10131202], // 温度差异报警
  batteryTempOver: [0x10131501, 0x10131603, 0x10131603], // 电池高温报警
  ressVolOver: [0x10131901, 0x10131901, 0x10131901], // 车载储能装置类型过压报警
  ressVolLow: [0x10131801, 0x10131801, 0x10131801], // 车载储能装置类型欠压报警
  socLow: [0x10131701, 0x10131701, 0x10131701], // SOC 低报警
  batteryOver: [0x10130b01, 0x10130c03, 0x10130c03], // 单体电池过压报警
  batteryLow: [0x10130d01, 0x10130e02, 0x10130e02], // 单体电池欠压报警
  batteryBadConsistency: [0x10131c02, 0x10131c02, 0x10131c02], // 电池单体一致性差报警
  insulation: [0x100aa602, 0x100aa602, 0x100aa703], // 绝缘报警
  dcdcTemp: [0x10120e01, 0x10120d02, 0x10120d02], //  DC-DC 温度报警
  brake: [0x10100302, 0x10100302, 0x10100302], // 制动系统报警
  dcdcStatus: [0x10110f01, 0x10111002, 0x10111002], // DC-DC 状态报警
  motorControlTemp: [0x10140901, 0x10140901, 0x10140802], // 驱动电机控制器温度报警
  highVolMuteStatus: [0x100a0a03, 0x100a0a03, 0x100a0a03], // 高压互锁状态报警
  motorTemp: [0x10140701, 0x10140602, 0x10140602], // 驱动电机温度报警
  ressChargeOver: [0x10130002, 0x10130002, 0x10130002], // 车载储能装置类型过充
};

// 解析成警报码

// maxAlarmLevel 为报警信息中的 maxAlarmLevel 字段
const tags = Object.keys(uas).filter(k => uas[k] && uas[k] > 0);

// 解析为警报码
codes.push(
  ...tags.map(t =>
    (ALARM_FLAGS[t] ? ALARM_FLAGS[t][maxAlarmLevel - 1] : -1).toString(16)
  )
);
```

故障定义及解析：

```js
// 将故障列表中故障解析为报警码

// 故障列表中的项定义

{
  type: number, // 故障类型
  code: number, // 故障编码
  level: number // 故障级别
}

// 处理 list 的警报
const {
  ressList = [],
  mortorList = [],
  engineList = [],
  otherList = [],
} = item;

[ressList, mortorList, engineList, otherList].forEach(l => {
  codes.push(
    ...l.map(a => ((a.type << 24) + (a.code << 8) + a.level).toString(16))
  );
});
```

警报码定义：

通过上面解析出来的故障码，找到对应的故障

```js
[
  { name: "整车高压互锁故障", level: 3, code: 0x100a0a03 },
  { name: "电机通讯故障", level: 2, code: 0x10c29202 },
  { name: "BMS通讯故障（ACAname:)", level: 2, code: 0x10c28902 },
  { name: "ACU通讯故障", level: 2, code: 0x10d10002 },
  { name: "ATS通讯故障", level: 2, code: 0x10c11602 },
  { name: "刹车踏板信号无效故障", level: 2, code: 0x10100302 },
  { name: "加速踏板信号无效故障", level: 2, code: 0x10100f02 },
  { name: "档位信号无效故障", level: 2, code: 0x10100e02 },
  { name: "高压绝缘一般故障", level: 2, code: 0x100aa602 },
  { name: "高压绝缘严重故障", level: 3, code: 0x100aa703 },
  { name: "整车控制器系统故障", level: 3, code: 0x10100003 },
  { name: "低压电池电压低故障", level: 2, code: 0x10102602 },
  { name: "气压低故障", level: 3, code: 0x10101003 },
  { name: "气压低报警", level: 2, code: 0x10103402 },
  { name: "气压传感器报警", level: 2, code: 0x10103502 },
  { name: "整车接触器驱动故障", level: 2, code: 0x10103702 },
  { name: "预充接触器驱动故障", level: 2, code: 0x10103802 },
  { name: "整车接触器断路故障", level: 2, code: 0x10100c02 },
  { name: "预充接触器断路故障", level: 2, code: 0x10103602 },
  { name: "整车接触器或预充接触器粘连故障", level: 3, code: 0x10100b03 },
  { name: "预充超时故障", level: 2, code: 0x10100d02 },
  { name: "仪表内部通讯故障", level: 1, code: 0x10d10801 },
  { name: "车身模块一般故障", level: 1, code: 0x10103a01 },
  { name: "胎压监测系统一般故障", level: 1, code: 0x10103b01 },
  { name: "集中润滑系统一般故障", level: 1, code: 0x10103c01 },
  { name: "ABS系统一般故障", level: 2, code: 0x10103d02 },
  { name: "ABS系统严重故障", level: 3, code: 0x10103e03 },
  { name: "ECAS系统一般故障", level: 2, code: 0x10103f02 },
  { name: "电机控制器系统故障", level: 3, code: 0x10140003 },
  { name: "编码器故障", level: 3, code: 0x10140103 },
  { name: "电机控制器过压故障", level: 2, code: 0x10140202 },
  { name: "欠压故障", level: 2, code: 0x10140302 },
  { name: "电机超速故障", level: 2, code: 0x10140402 },
  { name: "电机超速报警", level: 1, code: 0x10140501 },
  { name: "电机过温故障", level: 2, code: 0x10140602 },
  { name: "电机过温报警", level: 1, code: 0x10140701 },
  { name: "控制器过温故障", level: 2, code: 0x10140802 },
  { name: "控制器过温报警", level: 1, code: 0x10140901 },
  { name: "电机速度传感器故障", level: 2, code: 0x10140a02 },
  { name: "电机控制器过流故障", level: 2, code: 0x10140b02 },
  { name: "电机控制器通讯故障", level: 2, code: 0x10d10902 },
  { name: "充电故障", level: 2, code: 0x10130002 },
  { name: "充电插座高温报警", level: 1, code: 0x10130101 },
  { name: "充电插座高温故障", level: 2, code: 0x10130202 },
  { name: "充电继电器粘连故障", level: 3, code: 0x10130303 },
  { name: "充电继电器开路故障", level: 2, code: 0x10130402 },
  { name: "充电预充继电器粘连故障", level: 3, code: 0x10130503 },
  { name: "充电预充继电器开路故障", level: 2, code: 0x10130602 },
  { name: "电池内部高压互锁故障", level: 3, code: 0x10130703 },
  { name: "主继电器粘连故障", level: 3, code: 0x10130803 },
  { name: "主继电器开路故障", level: 2, code: 0x10130902 },
  { name: "BMS通讯故障(C CAname:)", level: 2, code: 0x10130a02 },
  { name: "单体过压报警", level: 1, code: 0x10130b01 },
  { name: "单体过压故障", level: 3, code: 0x10130c03 },
  { name: "单体欠压报警", level: 1, code: 0x10130d01 },
  { name: "单体欠压故障", level: 2, code: 0x10130e02 },
  { name: "单体压差报警", level: 1, code: 0x10130f01 },
  { name: "单体压差故障", level: 2, code: 0x10131002 },
  { name: "电池温差报警", Level: 1, code: 0x10131101 },
  { name: "电池温差故障", level: 2, code: 0x10131202 },
  { name: "电池低温报警", level: 1, code: 0x10131301 },
  { name: "电池低温故障", level: 2, code: 0x10131402 },
  { name: "电池高温报警", level: 1, code: 0x10131501 },
  { name: "电池高温故障", level: 3, code: 0x10131603 },
  { name: "电池SOC低报警", level: 1, code: 0x10131701 },
  { name: "电池总电压低报警", level: 1, code: 0x10131801 },
  { name: "电池总电压高报警", level: 1, code: 0x10131901 },
  { name: "电池放电电流超限制报警", level: 1, code: 0x10131a01 },
  { name: "电池回充电流超限制报警", level: 1, code: 0x10131b01 },
  { name: "均衡电路故障", level: 2, code: 0x10131c02 },
  { name: "电池热管理系统报警", level: 2, code: 0x10131d02 },
  { name: "电池支路断路报警", level: 2, code: 0x10131e02 },
  { name: "DCDC故障", level: 1, code: 0x10110f01 },
  { name: "严重故障", level: 2, code: 0x10111002 },
  { name: "输出欠压故障", level: 2, code: 0x10122502 },
  { name: "输出过压故障", level: 2, code: 0x10122602 },
  { name: "输入欠压警告", level: 1, code: 0x10123801 },
  { name: "输入欠压故障", level: 2, code: 0x10121d02 },
  { name: "输入过压故障", level: 2, code: 0x10121c02 },
  { name: "通讯故障", level: 2, code: 0x10d10502 },
  { name: "过温报警", level: 1, code: 0x10120e01 },
  { name: "过温故障", level: 2, code: 0x10120d02 },
  { name: "输出电流过流", level: 2, code: 0x10120202 },
  { name: "油泵故障", level: 1, code: 0x10111101 },
  { name: "严重故障", level: 2, code: 0x10111202 },
  { name: "通讯故障", level: 2, code: 0x10d10602 },
  { name: "高压输入欠压故障", level: 2, code: 0x10122402 },
  { name: "相电流过流报警", level: 1, code: 0x10123001 },
  { name: "控制器过温报警", level: 1, code: 0x10121101 },
  { name: "控制器过温故障", level: 2, code: 0x10121702 },
  { name: "电机过温报警", level: 1, code: 0x10121201 },
  { name: "电机过温故障", level: 2, code: 0x10121802 },
  { name: "控制低压欠压故", level: 2, code: 0x10123102 },
  { name: "高压输入过压故障", level: 2, code: 0x10122302 },
  { name: "相电流过流故障", level: 2, code: 0x10120602 },
  { name: "缺相故障", level: 2, code: 0x10122e02 },
  { name: "失速", level: 2, code: 0x10123202 },
  { name: "低压绕阻输入欠压", level: 2, code: 0x10123302 },
  { name: "低压绕阻输出过流", level: 2, code: 0x10123402 },
  { name: "气泵一般故障", level: 1, code: 0x10111301 },
  { name: "严重故障", level: 2, code: 0x10111402 },
  { name: "通讯故障", level: 2, code: 0x10d10702 },
  { name: "高压输入欠压故障", level: 2, code: 0x10122202 },
  { name: "相电流过流报警", level: 1, code: 0x10123501 },
  { name: "控制器过温报警", level: 1, code: 0x10120f01 },
  { name: "控制器过温故障", level: 2, code: 0x10121502 },
  { name: "电机过温报警", level: 1, code: 0x10121001 },
  { name: "电机过温故障", level: 2, code: 0x10121602 },
  { name: "控制低压欠压故障", level: 2, code: 0x10123602 },
  { name: "高压输入过压故障", level: 2, code: 0x10122102 },
  { name: "相电流过流故障", level: 2, code: 0x10120402 },
  { name: "缺相故障", level: 2, code: 0x10122f02 },
  { name: "失速", level: 2, code: 0x10123702 },
  { name: "热管理系统一般故障", level: 1, code: 0x10111501 },
  { name: "热管理系统严重故障", level: 2, code: 0x10111602 },
  { name: "空调系统一般故障", level: 1, code: 0x101f0001 },
  { name: "空调系统严重故障", level: 1, code: 0x101f0101 },
  { name: "车外温度传感器故障", level: 1, code: 0x101f0201 },
  { name: "车内温度传感器故障", level: 1, code: 0x101f0301 },
  { name: "蒸发器传感器故障", level: 1, code: 0x101f0401 },
  { name: "空调压力过压", level: 1, code: 0x101f0501 },
  { name: "空调压力欠压", level: 1, code: 0x101f0601 },
];
```

##### 1.3.6 用户自定义数据 (type=CUSTOM_EXT)

```js
{
  type: "CUSTOM_EXT",
  dataLen: 48,
  pressure1: 0,
  pressure2: 0,
  batteryVoltage: 0,
  dcov: -900,
  dcoc: -900,
  cv: 570.5,
  rc: 5522.6,
  cp: 0,
  totalCharge: 0,
  totalDischarge: 0,
  bpiRes: 0,
  bniRes: 0,
  motorContTemp: 0,
  airMode: "OFF",
  airTemp: 0,
  insideTemp: 0,
  outsideTemp: 0,
  middleDoorStatus: "CLOSE",
  frontDoorStatus: "CLOSE",
  handbrakeStatus: "OFF",
  keyPosition: "ON",
}
```

| 字段             | 数据内容        | 类型    | 分辨率 | 说明                                                                              |
| :--------------- | :-------------- | :------ | :----- | :-------------------------------------------------------------------------------- |
| dataLen          | 自定义数据长度  | integer |        | 字节长度                                                                          |
| pressure1        | 气压 1          | float   | 1hPa   |                                                                                   |
| pressure2        | 气压 2          | float   | 1hPa   |                                                                                   |
| batteryVoltage   | 蓄电池电压      | float   | 0.01V  |                                                                                   |
| dcov             | DCDC 输出电压   | float   | 0.01V  |                                                                                   |
| dcoc             | DCDC 输出电流   | float   | 0.01A  |                                                                                   |
| dcTemp           | DCDC 散热器温度 | integer | 1℃     |                                                                                   |
| acTemp           | DCAC 散热器温度 | integer | 1℃     |                                                                                   |
| lftp             | 左前轮胎压力    | float   | 1hPa   |                                                                                   |
| lftt             | 左前轮胎温度    | integer | 1℃     |                                                                                   |
| rftp             | 右前轮胎压力    | float   | 1hPa   |                                                                                   |
| rftt             | 右前轮胎温度    | integer | 1℃     |                                                                                   |
| lr1tp            | 左后 1 轮胎压力 | float   | 1hPa   |                                                                                   |
| lr1tt            | 左后 1 轮胎温度 | integer | 1℃     |                                                                                   |
| lr2tp            | 左后 2 轮胎压力 | float   | 1hPa   |                                                                                   |
| lr2tt            | 左后 2 轮胎温度 | integer | 1℃     |                                                                                   |
| rr1tp            | 右后 1 轮胎压力 | float   | 1hPa   |                                                                                   |
| rr1tt            | 右后 1 轮胎温度 | integer | 1℃     |                                                                                   |
| rr2tp            | 右后 2 轮胎压力 | float   | 1hPa   |                                                                                   |
| rr2tt            | 右后 2 轮胎温度 | integer | 1℃     |                                                                                   |
| cv               | 充电电压        | float   | 0.01V  |                                                                                   |
| rc               | 充电电流        | float   | 0.01A  |                                                                                   |
| cp               | 充电电量        | integer |        |                                                                                   |
| totalCharge      | 累积充电电量    | integer |        |                                                                                   |
| totalDischarge   | 累积放电电量    | integer |        |                                                                                   |
| instantPower     | 瞬时电耗        | integer |        |                                                                                   |
| bpiRes           | 电池正绝缘电阻  | integer | 1KΩ    |                                                                                   |
| apTemp           | 气泵扇热器温度  | integer | 1℃     |                                                                                   |
| motorContTemp    | 电机控制器温度  | integer | 1℃     |                                                                                   |
| airMode          | 空调模式        | string  |        | WIND: "进风", OFF: "关", REFRIGERATION: "制冷", HEATING: "制热", ABNORMAL: "异常" |
| airTemp          | 空调设定温度    | integer | 1℃     |                                                                                   |
| insideTemp       | 车厢内实际温度  | integer | 1℃     |                                                                                   |
| outsideTemp      | 车外温度        | integer | 1℃     |                                                                                   |
| middleDoorStatus | 中门状态        | string  |        | CLOSE: "关闭", OPEN: "开启", ABNORMAL: "异常"                                     |
| frontDoorStatus  | 前门状态        | string  |        | CLOSE: "关闭", OPEN: "开启", ABNORMAL: "异常"                                     |
| handbrakeStatus  | 手刹状态        | string  |        | ON: "开", OFF: "关", ABNORMAL: "异常"                                             |
| keyStatus        | 钥匙位置        | string  |        | OFF: 关, ACC: 通电, ON: 开, START: 启动                                           |

#### 1.4 信息补发日志(command=REISSUE_REPORT)

补发车辆数据，request 的格式 REALTIME_REPORT 相同

在补发数据中可能会出现 type=TEN_SECONDS 的数据类型,为车辆 10 秒内的瞬时数据，数据内容为扩展协议 ADAS,下面做说明

```js
{
  level: 30,
  time: 1540902953157,
  msg: "handle rdb data",
  pid: 17,
  hostname: "d35202af7c8b-shanghaibus-v0-32960-1",
  session: "vetcULndfPe",
  seq: 7,
  cost: 0,
  origin:
    "232303fe4c5a595442474257354a3130313432323101006b120a1e0c232b810100020003000004272801000200030000042728010002000300000427280100020003000004272801000200030000042728010002000300000427290100020003000004272a0100020f03000004274b0100020003000a04276c0100020003001e042788ca",
  request: {
    command: "REISSUE_REPORT",
    flag: "COMMAND",
    vin: "LZYTBGBW5J1014221",
    encrypt: "NONE",
    length: 107,
    body: {
      at: "2018-10-30T04:35:43.000Z",
      items: [
        {
          type: "TEN_SECONDS",
          datas: [
            { accPedal: 0, brake: 0, speed: 0, totalCurrent: 9024 },
            { accPedal: 0, brake: 0, speed: 0, totalCurrent: 9024 },
            { accPedal: 0, brake: 0, speed: 0, totalCurrent: 9024 },
            { accPedal: 0, brake: 0, speed: 0, totalCurrent: 9024 },
            { accPedal: 0, brake: 0, speed: 0, totalCurrent: 9024 },
            { accPedal: 0, brake: 0, speed: 0, totalCurrent: 9025 },
            { accPedal: 0, brake: 0, speed: 0, totalCurrent: 9026 },
            { accPedal: 0, brake: 0.15, speed: 0, totalCurrent: 9059 },
            { accPedal: 0, brake: 0, speed: 1, totalCurrent: 9092 },
            { accPedal: 0, brake: 0, speed: 3, totalCurrent: 9120 },
          ],
        },
      ],
    },
  },
  response: "232303014c5a595442474257354a31303134323231010006120a1e0c232b46",
  v: 1,
}
```

##### 1.4.1 拓展协议 ADAS 说明

| 字段             | 数据内容                 | 类型    | 有效值范围                 | 分辨率     | 其他                                                                     |
| :--------------- | :----------------------- | :------ | :------------------------- | :--------- | :----------------------------------------------------------------------- |
| accPedal         | 加速踏板行程             | integer | 0~100(表示 0%~100%)        | 1%         |
| brake            | 制动踏板                 | integer | 0~100(表示 0%~100%)        | 1%         | “0”表示制动关状态；在无具体值的情况下，用“0x65”即“101”表示制动有效状态。 |
| speed            | 车速                     | float   | 0~2200(表示 0km/h~220km/h) | 0.1km/h    |
| totalCurrent     | 总电流                   | float   | 0~20000(表示-1000A~1000A)  | 0.1A       |
| overspeed        | 超速值                   | integer | 0~7                        | 5km/h      |
| lateralDistance  | 前方障碍物横向相对距离   | float   | -12M~12M                   | 0.1M/bit   | 车辆左侧为负，车辆右侧为正                                               |
| verticalDistance | 前方障碍物相对纵向距离   | float   | 0M~250M                    | 0.1M/bit   |
| relativeVelocity | 车辆前方障碍物相对速度   | float   | -50~50（m/s）              | 0.1m/s/bit |
| buzzerWarning    | 蜂鸣器预警               | integer |                            |            | 0001 有效，其他无效                                                      |
| wheelWarning     | 方向盘震动器预警         | integer |                            |            | 0001 有效，其他无效                                                      |
| cWarning         | 前方碰撞预警             | integer |                            |            | 01:有，00:无                                                             |
| lWarning         | 左车道偏离预警           | integer |                            |            | 01:有，00:无                                                             |
| rWarning         | 右车道偏离预警           | integer |                            |            | 01:有，00:无                                                             |
| pWarning         | 行人碰撞预警             | integer |                            |            | 01:有，00:无                                                             |
| cmcslevel        | 碰撞缓解制动系统预警等级 | integer |                            |            | 00:无效，01：一级预警；10：二级预警                                      |
| cmcs             | 碰撞缓解制动系统状态     | integer |                            |            | 00:不显示；01:CMCS 关闭；10：CMSC 故障，其他无效                         |
| crbs             | 碰撞缓解制动系统开关状态 | integer |                            |            | 00:无，01：有                                                            |
| reserve          | 保留                     | integer |                            |            | 保留                                                                     |
| obstacleType     | 障碍物类型               | integer |                            |            | 0:无，1：人，2：车；15：其他                                             |

#### 1.5 心跳(command=HEARTBEAT)

```js
{
  level: 30,
  time: 1540902954127,
  msg: "handle rdb data",
  pid: 17,
  hostname: "d35202af7c8b-shanghaibus-v0-32960-1",
  session: "19aCtMTzJDG",
  seq: 128,
  cost: 0,
  origin: "232307fe4c5a595442474357354a31303335373135010000b9",
  request: {
    command: "HEARTBEAT",
    flag: "COMMAND",
    vin: "LZYTBGCW5J1035715", // 车辆vin 码
    encrypt: "NONE",
    length: 0,
    body: {},
  },
  response: "232307014c5a595442474357354a3130333537313501000046",
  v: 1,
}
```

### 2 请求错误(Request Error)

level 为 50 的日志，表示日志产生时发生的错误

```json
{
  "level": 50,
  "time": 1540902953488,
  "msg": "request error",
  "pid": 17,
  "hostname": "d35202af7c8b-shanghaibus-v0-32960-1",
  "session": "kAKkuMOQtf8",
  "error": {
    "type": "NodeError",
    "message": "Attempt to write outside buffer bounds",
    "stack": "RangeError [ERR_BUFFER_OUT_OF_BOUNDS]: Attempt to write outside buffer bounds\n    at boundsError (internal/buffer.js:51:11)\n    at Buffer.readUInt16BE (internal/buffer.js:219:5)\n    at D.len (/app/dist/cli.js:2:10203)\n    at D.deSticky (/app/dist/cli.js:2:10539)\n    at /app/dist/cli.js:2:12283\n    at dispatch (/app/node_modules/koa-compose/index.js:42:32)\n    at /app/dist/cli.js:2:12174\n    at new Promise (<anonymous>)\n    at /app/dist/cli.js:2:11918\n    at dispatch (/app/node_modules/koa-compose/index.js:42:32)"
  },
  "v": 1
}
```

### 3 会话关闭(Session closed)

```js
{
  level: 30,
  time: 1540902954520,
  msg: "session closed",
  pid: 17,
  hostname: "d35202af7c8b-shanghaibus-v0-32960-1",
  session: "gkMhp5R21",
  v: 1,
}
```

## Contributing

1.  Fork it!
2.  Create your feature branch: `git checkout -b my-new-feature`
3.  Commit your changes: `git commit -am 'Add some feature'`
4.  Push to the branch: `git push origin my-new-feature`
5.  Submit a pull request :D

## Author

**module** © [36node](https://github.com/36node), Released under the [MIT](./LICENSE) License.

Authored and maintained by 36node with help from contributors ([list](https://github.com/36node/module/contributors)).

> [github.com/zzswang](https://github.com/zzswang) · GitHub [@36node](https://github.com/36node)

[0]: https://img.shields.io/npm/v/@36node/template-module.svg?style=flat
[1]: https://npmjs.com/package/@36node/template-module
[2]: https://img.shields.io/npm/dm/@36node/template-module.svg?style=flat
[3]: https://npmjs.com/package/@36node/template-module
