const mqconfig = require('./mqconfig');
var basename = require('path').basename;
var open = require('amqplib').connect(mqconfig.url);
const BlockChain = require('./jsondata');
const yargs = require('yargs');

var argv = require('yargs')
    .usage('Usage: node $0  [queue] [routekey]')
    .example('node $0  json  json.huodui', 'the json queue will receive message that router key is json.huodui')
    .alias('q', 'queue')
    .nargs('q', 1)
    .describe('q', 'message quque name')
    .alias('k', 'key')
    .nargs('k', 1)
    .describe('k', 'message router key')
    .help('h')
    .alias('h', 'help')
    .argv;

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
    return channel.assertQueue(argv.queue || mqconfig.defaultQueue, {durable:true});
  }).then(function (q) {
    queue = q.queue;
    channel.prefetch(1);
    return channel.bindQueue(queue, mqconfig.exchange, argv.key || mqconfig.defaultKey);
  }).then(function () {
    return channel.consume(queue, function (msg) {
      try {
        var obj = JSON.parse(msg.content.toString());
        return blockchain.saveJson(obj.key, JSON.stringify(obj.json)).then(function () {
          console.log("[x] %s %s", msg.fields.routingKey, msg.content.toString());
          channel.ack(msg);
        }).catch(function (err) {
          channel.ack(msg);
          console.warn(err);
        });
      } catch (e) {
        console.log("msg %s: ", msg.content.toString());
        channel.ack(msg);
      }
    }, {noAck:false});
  }).catch(console.warn);
}

function handleError(err) {
  console.warn(err);
}

function handleClose() {
  console.info('connetion closed.');
  startWorker();
}

startWorker();
