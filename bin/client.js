/**
 * client 使用 example
 */

import Messenger from "../src/index";

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
