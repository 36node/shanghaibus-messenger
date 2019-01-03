import { merge } from "lodash";

/**
 * log 的json schema
 */
export const logSchema = {
  title: "Kafka log",
  description: "Kafka 传输过来的日志信息",
  type: "object",
  properties: {
    level: { type: "integer", description: "日志级别" },
    time: { type: "number", description: "日志产生时间" },
    msg: { type: "string", description: "日志信息" },
  },
  required: ["level", "msg", "time"],
};

/**
 * rdb data schema
 */
export const rdbDataSchema = merge({}, logSchema, {
  properties: {
    request: {
      type: "object",
      description: "请求",
      properties: {
        command: { type: "string", description: "命令" },
        vin: { type: "string", description: "车架号" },
        body: {
          type: "object",
          description: "请求的内容",
          properties: {
            at: { type: "string" },
          },
        },
      },
      required: ["command", "vin"],
    },
  },
  required: ["request"],
});
