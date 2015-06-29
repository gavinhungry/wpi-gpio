wpi-gpio
========
Node module wrapping the
[WiringPi gpio command-line utility](https://projects.drogon.net/raspberry-pi/wiringpi/the-gpio-utility/).

Installation
------------

    $ npm install wpi-gpio

Usage
-----

```javascript
var gpio = require('wpi-gpio');
```

### Pin numbering
By default, `wpi-gpio` uses the WiringPi pin numbers. To use BCM_GPIO pin
numbers instead (the `-g` flag to `gpio`):

```javascript
gpio.BCM_GPIO = true;
```

### Methods


```javascript
gpio.mode(2, 'out', function(err) {
  // GPIO pin 2 set as output pin
});
```
```javascript
gpio.read(2, function(err, val) {
  // value of GPIO pin 2 is 1 (high) or 0 (low)
});
```

```javascript
gpio.write(2, 1, function(err) {
  // GPIO pin 2 set to high
});
```

```javascript
gpio.pwm(2, 100, function(err) {
  // GPIO pin 2 PWM value set to 100
});
```
```javascript
gpio.readAll(function(err, table) {
  // GPIO table
});
```

License
-------
Released under the terms of the
[MIT license](http://tldrlegal.com/license/mit-license). See **LICENSE**.
