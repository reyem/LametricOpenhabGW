const express = require('express')
const request = require('request')
const nocache = require('nocache')

const app = express()
var configFile = '../../etc/lametricopenhabgw/config.json'

if (process.argv.length > 2) {
    configFile = process.argv[2];
}

const config = require(configFile);
var openhabHost = config.openhabHost;
var openhabPort = config.openhabPort;

const itemFinderRegexp = /\$\{([A-Za-z0-9_-]+)\}/g;


async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}


function callOpenHabAPI(itemName) {
    var options = {
        url: 'http://' + openhabHost + ':' + openhabPort + '/rest/items/' + itemName,
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

app.use(nocache())

app.get('/tempIndicator', function (req, res) {
    const execute = async () => {
        var response = config.pollingApps.tempIndicator.responseTemplate;
        var responseStr = JSON.stringify(response)
        
        var items = responseStr.match(itemFinderRegexp)
        await asyncForEach(items, async (item) => {
            item = item.substring(2, item.length -1)
            await callOpenHabAPI(item).then(function (result) {                         
                responseStr = responseStr.replace(new RegExp('\\$\\{' + item + '\\}'), result.state)
            }, function (err) {
                console.log(err);
            })
        })

        res.send(JSON.parse(responseStr));
    }
    execute()
})

app.listen(3000)