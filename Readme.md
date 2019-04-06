# Overview

This simple app allows to tranlate polling calls from lametric indicator apps into the openhab2 REST API.
The templates provided by the developer.lametric.com portal, where one can create the apps, can be directly pasted into the configuration file and filled with item names.

![Diagram](https://www.draw.io/?lightbox=1&highlight=0000ff&edit=_blank&layers=1&nav=1&title=Untitled%20Diagram.drawio#R7VjRbtowFP0aHlfFDkngcYOu29SKSpXW9mkysUushjhyTIF%2B%2FRxiJ7EDpdA0MGlP%2BB7sG%2Fuccy8mPXc0X11xlEY3DJO4Bx286rnjHoQAQCA%2FcmRdIIHvF8CMU6wmVcAdfSUKdBS6oJhkxkTBWCxoaoIhSxISCgNDnLOlOe2JxeZTUzQjDeAuRHETvadYRAU6gEGF%2FyB0FuknA39YfDNHerI6SRYhzJY1yL3suSPOmChG89WIxDl5mpdi3fcd35Yb4yQR71kwmY5%2BRUtIh38e4M9x9vr7agC%2BqCwvKF6oA18jGd8QwWmo9i3Wmgx5hDQfhoup%2FPi2jKggdykKc2wp9ZdYJOaxjIAcTtkiwQRfT0sAhc8znqOThYhpQhSOEX%2BeyDRU5CZxLhzPBOEGzWeq3RIuyGonDaAkV7qSsLk8y1pOUQt8JYfyI%2FBUvKzUhQOFRTVlNYaUoWZl5opzOVC0HyAB3CLBfMP%2FJCVJhKZX9w0h9jCPsrSohSe6Irgd3vrANYmDTeJAfwtxJdg6c26DOcXYOfDlQ%2Bfc%2BOo3%2BGoQRRL8Ne%2BaeZHHKMtkEzCYKhYQ3GiaFi0yKVvwkLyxG93NEZ8Rsa8%2BmjTXaPS2sKgxTmIk6Iu53W3MqifcMioPsqtbuK6lTXFKtajefK08AJiJGu2koKGRaKNzeerjpfe6lH6vpO4pJfU8q5ENj9TU9%2FwLz0wVdKuq%2F3FVyYqKh9r4cfNb6wY6HueHdXSwrgW3hFN5AMIV1mJrOGnJe77pD%2Bgc6w8tR%2BkO2Kk7gu5q%2FlxqufzbcLhWztuJPlmrQQuVnMgtPNSDopaDwUADVTFvonU9sssZoyzK70Jt9%2F6T%2BsW%2BxEIdH%2BoXtw%2BsREGnfhl%2B3C%2BGwLvM04fgGPO06JfTXv%2FsS7x9bXuvXzz7b2fH9z%2Fdzv51w5yLEaADjjSC%2FYtl3y4%2B2wjNNz7%2FjfARI9gpjjYCbMsIMqzeKhbTq3ez7uVf)

# Basic Setup

You need
1) A lametric device https://lametric.com
2) An OpenHab2 Installation http://www.openhab.org with some items
3) Create an indicator App on http://developer.lamteric.com and install it on la metric
4) copy the the JSON provided by the app into the config.json file and put the item name enclosed in `${}` into the textual part. These will be replaced by the items state. The app name will also be the url. Following config will deploy 2 apps urls. one under http://localhost:3000/temperatureApp another under http://localhost:3000/mowerApp.

```
{
    "openhabHost": "openhabhost",
    "openhabPort": "8080",
    "lametricHost": "lametric"
    "lametricAPIKey" : "the key you get from developer.lametric.dom"
    "pollingApps": {
        "temperatureApp": {
            "frames": [
                {
                    "text": "${item1} °C",
                    "icon": "i4285"
                },
                {
                    "text": "${item2} °C",
                    "icon": "i4286"
                }
            ]
        },
        "mowerApp": {
            "frames": [
                {
                    "text": "${item3} mower status",
                    "icon": "i4285"
                }
            ]
        }
    }
}
```

You can define as many apps as desired.


# Initialize and start manually

````
cd app
npm install
node src/index.js <configfilepath>/config.json
````

## Systemd

for systemd there is a service configuration file under ``/etc/systemd/system/lametricopenhabgw.service``.

# Test
````
curl -D - http://localhost:3000/temperatureApp
```` 
