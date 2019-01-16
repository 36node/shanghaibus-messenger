import Kafka from "node-rdkafka";
import LineByLineReader from "line-by-line";
import path from "path";

const dataFile = path.join(__dirname, "..", "data", "realdata.txt");

const producer = new Kafka.Producer({
  "client.id": "kafka",
  "metadata.broker.list": "localhost:9092",
});

producer.connect();

producer.on("ready", function() {
  try {
    const lr = new LineByLineReader(dataFile);

    lr.on("line", line => {
      lr.pause();
      console.log(line);

      setTimeout(() => {
        producer.produce(
          // Topic to send the message to
          "TBOX",
          // optionally we can manually specify a partition for the message
          // this defaults to -1 - which will use librdkafka's default partitioner (consistent random for keyed messages, random for unkeyed messages)
          null,
          // Message to send. Must be a buffer
          Buffer.from(line),
          // for keyed messages, we also specify the key - note that this field is optional
          null,
          // you can send a timestamp here. If your broker version supports it,
          // it will get added. Otherwise, we default to 0
          Date.now()
          // you can send an opaque token here, which gets passed along
          // to your delivery reports
        );

        lr.resume();
      }, 500);
    });
  } catch (error) {
    console.error("A problem occurred when sending our message");
    console.error(error);
  }
});

producer.on("event.error", function(err) {
  console.log(err);
});
