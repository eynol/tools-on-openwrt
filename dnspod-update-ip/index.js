var json = require('./profile.json');

var Dnspod = require('dnspod-client');
var client = new Dnspod({'login_token': json.token});

var hostip = "";
console.log("loaded");
client
    .on('getHostIp', function (err, message) {

        console.log("loaded ip");
        if (err) {

          console.log(err);
          process.exit(0);
        } else {
            console.log('get IP address: ' + message);
            hostip = message;
            client.recordList({length: 5, domain_id: json.domain_id, "sub_domain": json.sub_domain})

        }
    });
    client.on('recordList', function (err, recordResult) {
        if (err) {
            console.log(err);

          process.exit(0);
        } else {
            var the_record = recordResult.records[0];
            console.log(the_record);
            if (hostip === "") {
                client.getHostIp();
                return;
            }
            if (hostip === the_record.value) {

                var lastUpdateTime = new Date(the_record.updated_on);
                var currentTime = new Date();
                var timeGap = currentTime - lastUpdateTime;

          process.exit(0);
            } else {

                var lastUpdateTime = new Date(the_record.updated_on);
                var currentTime = new Date();
                var timeGap = currentTime - lastUpdateTime;
                if (timeGap < 1000 * 60 * 60) {
                    console.log("更改时间小于一个小时，不能更改")
                } else {
                    client.recordModify({
                        domain_id: json.domain_id,
                        record_id: json.record_id,
                        sub_domain: json.sub_domain,
                        record_type: "A",
                        record_line: "默认",
                        value: hostip
                    })
                }

            }

        }
    });
    client.on('recordModify', function (err, result) {
        if (err) {
            console.log(err);
          process.exit(0);
        } else {
            console.log(result);
          process.exit(0);
            if (result.status.code == 1) {
                console.log(result.status.message)
            } else {
                console.log(result.status.message)
            }
        }

    });
client
  .getHostIp();
console.log("after runt");
