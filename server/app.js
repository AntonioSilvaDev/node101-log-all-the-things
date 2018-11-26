const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');



// create a write stream (in append mode)

app.use(function(req, res, next){
    //var accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.csv'), { flags: 'a' })
    var agent = req.headers['user-agent'].replace(",", "");
    var time = new Date().toISOString();
    var method = req.method;
    var resource = req.path;
    var version = "HTTP/" + req.httpVersion;
    var status = res.statusCode;
    var logger = (agent + ',' + time + ',' + method + ',' + resource + ',' + version + ',' + status + '\n');
    console.log(logger);
    fs.appendFile('log.csv', logger, 'utf8', (err) => {
        if (err) throw err;
        console.log('The "data to append" was appended to file! node-superagent');
      });
    next();
})

app.get('/', (req, res) => {
// write your code to respond "ok" here
    res.send('ok');
});


app.get('/logs', (req, res) => {
// write your code to return a json object containing the log data here
    var jsonResponse = [];
    fs.readFile('./log.csv', 'utf8', (err, data) => {
        if (err) throw err;
        var lines = data.split("\n");
        lines.shift();
            for(var i = 0; i < lines.length - 1; i++){
                //console.log(lines.length);
                var row = lines[i].split(",");
                var keysPairs = {'Agent' : row[0],
                                'Time' : row[1],
                                'Method' : row[2],
                                'Resource' : row[3],
                                'Version' : row[4],
                                'Status' : row[5],
                                };
                jsonResponse.push(keysPairs);
            };
            res.send(jsonResponse);
        }); 
    });
    
module.exports = app;

