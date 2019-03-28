# Overview

The intention of this app is not to be usable directly by anybody, but to show a practical example on how one can connect a pulling indicator app on the lametric device with the openhab REST API in a simple way.

This simple app queries the openhab2 REST API and replies in the format expected by an indicator app on the lametric device. The response look like the following.

````
{
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
````
The first frame represents the outside temperatur of my home and the second frame the inside temperature. To gather the outside and inside temperature, it queries the individual items via openhab REST API one by one and concatenates the result in a response as shown above, given and required by the indicator app.

To use this app, one needs: 
1) lametric device https://lametric.com
2) An OpenHab2 Installation http://www.openhab.org
3) Create an indicator App on http://developer.lamteric.com and install it on la metric

Note: This is a pragmatic tailored script and lots of things are hard coded in the `ìndex.js` script:
1) the item names for outside and inside temperature
2) The port of the service is also hard coded to 3000 
3) The port of the openhab api is set to 8080.


# Initialize and start manually

````
cd app
npm install
node src/index.js <configfile>
````

## Systemd
for systemd there is a service configuration file under ``/etc/systemd/system/lametricopenhabgw.service``.

# Test
````
curl -D - http://localhost:3000/tempIndicator
```` 