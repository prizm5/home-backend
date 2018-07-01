'use strict';
var outlets = require('./outlets.json');
var exec = require('child_process').exec;
var codeSendPulseLength = "189";
var codeSendPIN = "0";
var mqhost = process.env.MQHOST || "192.168.0.102";

var RedisSMQ = require("rsmq");
rsmq = new RedisSMQ({ host: mqhost, port: 6379, ns: "rsmq" });
rsmq.createQueue({ qname: "myqueue" }, (err, resp) => {
  if (resp === 1) { console.log("queue created") }
});
rsmq.listQueues( function (err, queues) {
  if(err) {
    console.error( err )
    return
  }
  console.log("Active queues: " + queues.join( "," ) )
});

var RSMQWorker = require( "rsmq-worker" );
var worker = new RSMQWorker( "myqueue", { interval: [ .6, .2 ] });

worker.on( "message", function( msg, next, id ){
  var command = JSON.parse(msg);
  console.log("Message received.", msg);
  // msg.id, msg.action 
  var o = outlets.filter(function (o) { return o.id == command.id; })
  if(o.length == 0) { next(); }

  sendcode(currentValue[command.action])
    .then(next())
});


// Listen to errors
	worker.on('error', function( err, msg ){
	    console.log( "ERROR", err, msg.id );
	});
	worker.on('timeout', function( msg ){
	    console.log( "TIMEOUT", msg.id, msg.rc );
	});