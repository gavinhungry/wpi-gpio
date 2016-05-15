/**
 * wpi-gpio - Wrapper around the WiringPi gpio command-line utility
 * https://github.com/gavinhungry/wpi-gpio
 */

(function() {
  'use strict';

  var exec = require('child_process').exec;

  var gpio = module.exports;
  gpio.BCM_GPIO = true;

  /**
   * Exec a call to gpio
   *
   * @param {String} method
   * @param {Number|String} pin
   * @param {Array} args
   * @return {Promise}
   */
  var gpioExec = function(method, pin, args) {
    pin = parseInt(pin, 10) || 0;

    var flag = gpio.BCM_GPIO ? '-g' : '';
    var cmd = ['gpio', flag, method, pin, args.join(' ')].join(' ');

    return new Promise(function(res, rej) {
      exec(cmd, function(err, stdout, stderr) {
        return err ? rej(stderr) : res();
      });
    });
  };

  /**
   * Set an input pin
   *
   * @param {Number|String} pin
   * @return {Promise}
   */
  gpio.input = function(pin) {
    return gpioExec('mode', pin, ['in']);
  };

  /**
   * Set an output pin
   *
   * @param {Number|String} pin
   * @param {Boolean|Number} [val]
   * @return {Promise}
   */
  gpio.output = function(pin, val) {
    return gpio.write(pin, val).then(function() {
      return gpioExec('mode', pin, ['out']);
    });
  };

  /**
   * Read the value of a pin
   *
   * @param {Number|String} pin
   * @return {Promise} -> {Number}
   */
  gpio.read = function(pin) {
    return gpioExec('read', pin).then(function(val) {
      return parseInt(val, 10);
    });
  };

  /**
   * Set the value of an output pin
   *
   * @param {Number|String} pin
   * @param {Boolean|Number} val
   * @return {Promise}
   */
  gpio.write = function(pin, val) {
    if (val === undefined) {
      return Promise.resolve();
    }

    return gpioExec('write', pin, [val ? 1 : 0]);
  };

  /**
   * Set a sequence of values to an output pin
   *
   * @param {Number|String} pin
   * @param {Array} vals - values to write
   * @return {Promise}
   */
  gpio.sequence = function(pin, vals) {
    return vals.reduce(function(p, val) {
      return p.then(function() {
        return new Promise(function(res, rej) {
          gpio.write(pin, val).then(function() {
            setTimeout(res, 100);
          });
        });
      });
    }, gpio.output(pin));
  };

  /**
   * Simulate "tapping" an output pin by toggling it once
   *
   * @param {Number|String} pin
   * @return {Promise}
   */
  gpio.tap = function(pin) {
    return gpio.sequence(pin, [1, 0, 1]);
  };

})();
