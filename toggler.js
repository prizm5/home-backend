var outlets = require('./outlets.json');
var exec = require('child_process').exec;
var codeSendPulseLength = "189";
var codeSendPIN = "0";
RedisSMQ = require("rsmq");
rsmq = new RedisSMQ({ host: "127.0.0.1", port: 6379, ns: "rsmq" });

getmsg = () => {
	rsmq.popMessage({qname:"myqueue"}, function (err, resp) {
		if (resp.id) {
      var msg = JSON.parse(resp.message)	;
      console.log("Message received.", msg);
      Toggle(msg.id, msg.action);
		}
		setTimeout(getmsg, 1000);
	});
};

var sendCode = (code) => {
  var cmd = 'sudo ./codesend ' + code + ' -p ' + codeSendPIN + ' -l ' + codeSendPulseLength;
  console.log("Executing command: ", cmd);
  return exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.log('Error calling cmd: ', cmd, error);
      return false;
    }
    else if (stderr) {
      console.log('Error calling cmd stderr: ', cmd, stderr);
      return false;
    }
    else {
      console.log("cmd success: ", stdout);
      return true;
    }
  });
}

Toggle = (id, state) => {
  if (id == 6) {
    var o = outlets;
  }
  else {
    var o = outlets.filter(function (o) { return o.id == id; });
  }
  return o.reduce(
    ( accumulator, currentValue ) => {
      console.log(currentValue);
      var res = sendCode(currentValue[state]);
      accumulator = res;
    },
    false
  );
}