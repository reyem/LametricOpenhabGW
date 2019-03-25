var express = require('express')
var request = require('request')
const nocache = require('nocache')


var app = express()
var openhabHost = 'localhost'
if(process.argv.length > 2) {
    openhabHost = process.argv[2];
}



var indicatorAppResponse = {
    "frames": [
        {
            "text": "10 °C",
            "icon": "i4285"
        },
        {
            "text": "20 °C",
            "icon": "i4286"
        }
    ]
}


function callOpenHabAPI(itemName) {
        var options = {
            url: 'http://' + openhabHost +':8080/rest/items/' + itemName,
            headers: {
                'User-Agent': 'request'
            }
        };

        // Return new promise 
        return new Promise(function(resolve, reject) {
            // Do async job
            request.get(options, function(err, resp, body) {
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
    
    callOpenHabAPI('ASH2200Temp1').then(function(result) {
         indicatorAppResponse.frames[0].text = result.state + "°C";
         callOpenHabAPI('LivingRoomTemp').then(function(result) {
            indicatorAppResponse.frames[1].text = result.state + "°C";
            res.send(indicatorAppResponse);
         }, function(err) {
            console.log(err);
            res.send(err);
        })
    }, function(err) {
        console.log(err);
        res.send(err);
    })
})
 
app.listen(3000)