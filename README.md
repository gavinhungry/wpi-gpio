wpi-gpio
========
A no-frills wrapper around the
[WiringPi gpio command-line utility](https://projects.drogon.net/raspberry-pi/wiringpi/the-gpio-utility).

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
gpio.input(1).then(function() {
  // GPIO pin 1 set as input pin
});
```

```javascript
gpio.output(2, 0).then(function() {
  // GPIO pin 2 set as output pin with value 0 (default value is optional)
});
```

```javascript
gpio.read(3).then(function(val) {
  // `val` is numeric value of GPIO pin 3
});
```

```javascript
gpio.write(4, 1).then(function() {
  // GPIO pin 4 value set to 1
});
```

```javascript
gpio.sequence(5, [0, 1, 0 1]).then(function() {
  // GPIO pin 5 has values written in series, with a 100ms delay between values
});
```

```javascript
gpio.tap(6).then(function() {
  // GPIO pin 6 is "tapped" once. Same as `gpio.sequence(6, [1, 0, 1])`
});
```

License
-------
This software is released under the terms of the **MIT license**. See `LICENSE`.
