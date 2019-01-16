import Kafka from "node-rdkafka";
import { handleMessage } from "./parser";

/**
 * Messenger
 */
export default class Messenger {
  constructor(kafkaConfig = {}, topics = []) {
    this.consumer = new Kafka.KafkaConsumer(kafkaConfig);
    this.consumer.connect();

    this.consumer
      .on("ready", () => {
        console.log("kafka client is ready");
        this.consumer.subscribe(topics);
        this.consumer.consume();
      })
      .on("data", data => {
        const log = handleMessage(data);
        if (!log) return;

        const { type } = log;

        const handler = this.events[type];

        // 有处理函数
        if (handler) {
          handler(log);
        }
      });

    this.events = {};
  }

  /**
   * 监听 rdb data 类型的log
   * @param {(object)=>{}} handler
   * @param {[string]} commands 可选，通过command 过滤,
   * command: 包括 VEHICLE_LOGIN, VEHICLE_LOGOUT, HEARTBEAT, REALTIME_REPORT, REISSUE_REPORT
   */
  onRdbData(handler, commands) {
    if (typeof handler !== "function") {
      throw new Error("Handler must be a function");
    }
    this.events["RDB_DATA"] = log => {
      const { command } = log;

      // 如果设置了 commands， 则根据commands进行筛选
      if (Array.isArray(commands) && commands.length > 0) {
        if (commands.includes(command)) {
          handler(log);
        }
      } else {
        handler(log);
      }
    };
  }

  /**
   * 处理 request error 类型的 log
   * @param {(object)=>{}} handler
   */
  onRequestError(handler) {
    if (typeof handler !== "function") {
      throw new Error("Handler must be a function");
    }
    this.events["REQUEST_ERROR"] = handler;
  }

  /**
   * 监听
   * @param {(object)=>{}} handler
   */
  onInvalidLog(handler) {
    if (typeof handler !== "function") {
      throw new Error("Handler must be a function");
    }
    this.events["INVALID_LOG"] = handler;
  }
}
