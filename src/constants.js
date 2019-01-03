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
