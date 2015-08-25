/**
 * wpi-gpio - Wrapper around the WiringPi gpio command-line utility
 * https://github.com/gavinhungry/wpi-gpio
 */

(function() {
  'use strict';

  var exec = require('child_process').exec;

  var gpio = module.exports;
  gpio.BCM_GPIO = false;

  var MODES = ['in', 'out', 'pwm', 'up', 'down', 'tri'];

  /**
   * Exec a call to gpio
   *
   * @param {String} method
   * @param {Array} [args]
   * @param {Function} [callback] (err, stdout)
   */
  var gpioExec = function(method, args, callback) {
    var flag = gpio.BCM_GPIO ? '-g' : '';
    var cmd = ['gpio', flag, method, (args || []).join(' ')].join(' ');

    exec(cmd, function(err, stdout, stderr) {
      if (typeof callback !== 'function') {
        return;
      }

      if (err) {
        callback(stderr);
        return;
      }

      callback(null, stdout);
    });
  };

  var ensure = {
    num: function(num) {
      return parseInt(num, 10) || 0;
    },

    mode: function(mode) {
      return MODES.indexOf(mode) >= 0 ? mode : MODES[0];
    },

    bin: function(val) {
      return val ? 1 : 0;
    },

    pwm: function(pwm) {
      pwm = ensure.num(pwm);
      return pwm < 0 ? 0 : (pwm > 1023 ? 1023 : pwm);
    }
  };

  /**
   * Set a pin mode
   *
   * @param {Number} pin
   * @param {String} mode
   * @param {Boolean} val
   * @param {Function} [callback]
   */
  gpio.mode = function(pin, mode, val, callback) {
    pin = ensure.num(pin);
    mode = ensure.mode(mode);
    gpio.write(pin, val, function(err) {
      if (err) {
        return callback(err);
      }

      gpioExec('mode', [pin, mode], callback);
    });
  };

  /**
   * Read the value of a pin
   *
   * @param {Number} pin
   * @param {Function} [callback]
   */
  gpio.read = function(pin, callback) {
    pin = ensure.num(pin);
    gpioExec('read', [pin], function(err, val) {
      if (typeof callback !== 'function') {
        return;
      }

      if (err) {
        callback(err);
        return;
      }

      val = ensure.num(val);
      val = ensure.bin(val);

      callback(null, val);
    });
  };

  /**
   * Set the value of a pin
   *
   * @param {Number} pin
   * @param {Boolean} val
   * @param {Function} [callback]
   */
  gpio.write = function(pin, val, callback) {
    pin = ensure.num(pin);
    val = ensure.bin(val);
    gpioExec('write', [pin, val], callback);
  };

  /**
   * Set the PWM value of a pin
   *
   * @param {Number} pin
   * @param {Number} pwm
   * @param {Function} [callback]
   */
  gpio.pwm = function(pin, pwm, callback) {
    pin = ensure.num(pin);
    pwm = ensure.pwm(pwm);
    gpioExec('pwm', [pin, pwm], callback);
  };

  /**
   * Get pin table
   *
   * @param {Function} [callback]
   */
  gpio.readAll = function(callback) {
    gpioExec('readall', null, callback);
  };

  /**
   * Set a sequence of pin values
   *
   * @param {Number} pin
   * @param {Array} vals
   * @param {Number} delay
   * @param {Function} [callback]
   */
  gpio.sequence = function(pin, vals, delay, callback) {
    var val = vals.shift();
    if (val === undefined) {
      return callback(null);
    }

    gpio.write(pin, val, function(err) {
      if (err) {
        return callback(err);
      }

      if (!vals.length) {
        return callback(null);
      }

      setTimeout(function() {
        gpio.sequence(pin, vals, delay, callback);
      }, delay);
    });
  };

})();
