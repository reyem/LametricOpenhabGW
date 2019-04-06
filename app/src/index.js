const express = require('express')
const request = require('request')
const nocache = require('nocache')

const app = express()
var configFile = '../../etc/lametricopenhabgw/config.json'
var notificationMessage = {
    "priority": "warning",
    "model": {
        "cycles": 1,
        "frames": [
           {
              "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAUklEQVQYlWNUVFBgYGBgYBC98uE/AxJ4rSPAyMDAwMCETRJZjAnGgOlAZote+fCfCV0nOmA0+yKAYTwygJuAzQoGBgYGRkUFBQZ0dyDzGQl5EwCTESNpFb6zEwAAAABJRU5ErkJggg==",
              "text": "HELLO!"
           }
        ],
        "sound": {
            "category": "notifications",
            "id": "cat"
        }
    }
}

if (process.argv.length > 2) {
    configFile = process.argv[2];
}
const config = require(configFile);

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

function callOpenHabAPI(itemName) {
    var options = {
        url: 'http://' + config.openhabHost + ':' + config.openhabPort + '/rest/items/' + itemName,
        headers: {
            'User-Agent': 'request'
        }
    };

    // Return new promise 
    return new Promise(function (resolve, reject) {
        // Do async job
        request.get(options, function (err, resp, body) {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(body));
            }
        })
    })
}

function callLametricNotificationAPI(message, reply) {    
   var options = {
        uri: 'https://' + config.lametricHost + ':4343/api/v2/device/notifications',
        headers: {
            'User-Agent': 'request',
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + Buffer.from('dev:' + config.lametricAPIKey).toString('base64')
        },       
        method: 'POST',
        body: message,
         "rejectUnauthorized": false, 
    };

    request(options, function (error, response, body) {
        if (!error) {            
            reply(response) // Print the shortened url.
        }else {
            console.log("error")
            console.log(error)
        }
      });    
}

app.use(nocache())

for(var pollingApp in config.pollingApps ) {
    console.log('deploy polling app /' + pollingApp)
    app.get('/' + pollingApp, getPollingAppHandlerFunction(pollingApp))
}

function getPollingAppHandlerFunction(pollingApp) {
    return async function (req, res) {        
            const itemFinderRegexp = /\$\{([A-Za-z0-9_-]+)\}/g;
            const response = config.pollingApps[pollingApp];            
            var responseStr = JSON.stringify(response)            
            responseStr = await resolveItems(responseStr, itemFinderRegexp);
            res.send(JSON.parse(responseStr));        
    };
}

for(var notifcationApp in config.notificationApps ) {
    console.log('deploy notification app /' + notifcationApp)
    app.get('/' + notifcationApp, getNotificationAppHandlerFunction(notifcationApp))
}

function getNotificationAppHandlerFunction(notifcationApp) {
    return async function (req, res) {        
            const itemFinderRegexp = /\$\{([A-Za-z0-9_-]+)\}/g;
            const message = config.notificationApps[notifcationApp];  
            var responseStr = JSON.stringify(message)   
            responseStr = await resolveItems(responseStr, itemFinderRegexp);
            callLametricNotificationAPI(responseStr, function(response) {
                res.send(response);
            });               
    };
}

app.listen(3000)

async function resolveItems(responseStr, itemFinderRegexp) {
    var items = responseStr.match(itemFinderRegexp);
    if(items != null) {
    await asyncForEach(items, async (item) => {
        item = item.substring(2, item.length - 1);
        await callOpenHabAPI(item).then(function (result) {
            responseStr = responseStr.replace(new RegExp('\\$\\{' + item + '\\}'), result.state);
        }, function (err) {
            console.log(err);
        });
    });
    }
    return responseStr;
}
