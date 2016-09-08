const mqconfig = require('./mqconfig');
var basename = require('path').basename;
var open = require('amqplib').connect(mqconfig.url);
const BlockChain = require('./jsondata');

var keys = process.argv.slice(2);
if (keys.length < 2){
  console.info("usage: node %s [quque] [key.pattern]", basename(process.argv[1]));
}

var channel, queue;
var blockchain = new BlockChain();

function startWorker() {
  // Consumer
  return open.then(function(conn) {
    return conn.createChannel();
  }).then(function (ch) {
    channel = ch;
    channel.on('error', handleError);
    channel.on('close', handleClose);
    return ch.assertExchange(mqconfig.exchange, 'topic', {durable:true});
  }).then(function () {
    return channel.assertQueue(keys[0] || mqconfig.defaultQueue, {durable:true});
  }).then(function (q) {
    queue = q.queue;
    channel.prefetch(1);
    return channel.bindQueue(queue, mqconfig.exchange, keys[1] || mqconfig.defaultKey);
  }).then(function () {
    return channel.consume(queue, function (msg) {
      var obj = JSON.parse(msg.content.toString());
      return blockchain.saveJson(obj.key, JSON.stringify(obj.json)).then(function () {
        console.log("[x] %s %s", msg.fields.routingKey, msg.content.toString());
        channel.ack(msg);
      }).catch(function (err) {
        channel.ack(msg);
        console.warn(err);
      });

    }, {noAck:false});
  }).catch(console.warn);
}

function handleError(err) {
  console.warn(err);
}

function handleClose() {
  console.info('connetion closed.');
}

startWorker();
