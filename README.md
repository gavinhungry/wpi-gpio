wpi-gpio
========
A no-frills wrapper around the
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
By default, `wpi-gpio` uses the WiringPi pin numbers. To use Broadcom GPIO (BCM)
pin numbers instead (the `-g` flag to `gpio`):

```javascript
gpio.BCM_GPIO = true;
```

### Methods
```javascript
gpio.input(4).then(function() {
  // GPIO pin 4 set as input pin
});
```

```javascript
gpio.output(4, 0).then(function() {
  // GPIO pin 4 set as output pin with value 0 (default value is optional)
});
```

```javascript
gpio.read(4).then(function(val) {
  // `val` is binary value of GPIO pin 4
});
```

```javascript
gpio.write(4, 1).then(function() {
  // GPIO pin 4 value to set 1
});
```

```javascript
gpio.tap(4).then(function() {
  // GPIO pin 4 is "tapped" once (same as `gpio.sequence(4, [1, 0, 1])`)
});
```

License
-------
This software is released under the terms of the **MIT license**. See `LICENSE`.
