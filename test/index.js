/**
 * wpi-gpio - Wrapper around the WiringPi gpio command-line utility
 * https://github.com/gavinhungry/wpi-gpio
 */

(function() {
  'use strict';

  var tap = require('tap');
  var proxyquire = require('proxyquire');

  var cmds = [];
  var stdout = '';

  var gpio = proxyquire('../wpi-gpio', {
    child_process: {
      exec: function(cmd, callback) {
        cmds.push(cmd);
        callback(null, stdout, '');
      }
    }
  });

  tap.test('should set pin as input', function(t) {
    cmds = [];
    gpio.BCM_GPIO = false;
    return gpio.input(3).then(function() {
      t.same(cmds, ['gpio mode 3 in'], 'input method executes correct command');
    }).then(function() {
      cmds = [];
      gpio.BCM_GPIO = true;
      return gpio.input(3).then(function() {
        t.same(cmds, ['gpio -g mode 3 in'], 'input method with BCM_GPIO executes correct command');
      });
    });
  });

  tap.test('should set pin as output', function(t) {
    cmds = [];
    gpio.BCM_GPIO = false;
    return gpio.output(4).then(function() {
      t.same(cmds, ['gpio mode 4 out'], 'output method executes correct command');
    }).then(function() {
      cmds = [];
      gpio.BCM_GPIO = true;
      return gpio.output(4).then(function() {
        t.same(cmds, ['gpio -g mode 4 out'], 'output method with BCM_GPIO executes correct command');
      });
    });
  });

  tap.test('should set pin as output with initial value', function(t) {
    cmds = [];
    gpio.BCM_GPIO = false;
    return gpio.output(5, 1).then(function() {
      t.same(cmds, ['gpio write 5 1', 'gpio mode 5 out'], 'output method with initial value executes correct commands');
    }).then(function() {
      cmds = [];
      gpio.BCM_GPIO = true;
      return gpio.output(5, 1).then(function() {
        t.same(cmds, ['gpio -g write 5 1', 'gpio -g mode 5 out'], 'output method with initial value and BCM_GPIO executes correct commands');
      });
    });
  });

  tap.test('should read pin value', function(t) {
    cmds = [];
    stdout = '1';
    gpio.BCM_GPIO = false;
    return gpio.read(6).then(function(val) {
      t.same(cmds, ['gpio read 6'], 'read method executes correct command');
      t.equal(val, 1, 'read method returns numeric value');
    }).then(function() {
      cmds = [];
      gpio.BCM_GPIO = true;
      return gpio.read(6).then(function(val) {
        t.same(cmds, ['gpio -g read 6'], 'read method with BCM_GPIO executes correct command');
      });
    });
  });

  // this test is duplicated by testing gpio.output with an initial value
  tap.test('should write pin value', function(t) {
    cmds = [];
    gpio.BCM_GPIO = false;
    return gpio.write(7, 0).then(function() {
      t.same(cmds, ['gpio write 7 0'], 'write method executes correct command');
    }).then(function() {
      cmds = [];
      gpio.BCM_GPIO = true;
      return gpio.write(7, 0).then(function() {
        t.same(cmds, ['gpio -g write 7 0'], 'write method with BCM_GPIO executes correct command');
      });
    });
  });

  tap.test('should write pin sequence', function(t) {
    cmds = [];
    gpio.BCM_GPIO = false;
    return gpio.sequence(8, [0, 1, 0]).then(function() {
      t.same(cmds, [
        'gpio mode 8 out', 'gpio write 8 0', 'gpio write 8 1', 'gpio write 8 0'
      ], 'sequence method executes correct commands');
    }).then(function() {
      cmds = [];
      gpio.BCM_GPIO = true;
      return gpio.sequence(8, [0, 1, 0]).then(function() {
        t.same(cmds, [
          'gpio -g mode 8 out', 'gpio -g write 8 0', 'gpio -g write 8 1', 'gpio -g write 8 0'
        ], 'sequence method with BCM_GPIO executes correct commands');
      });
    });
  });

  tap.test('should write pin tap sequence', function(t) {
    cmds = [];
    gpio.BCM_GPIO = false;
    return gpio.tap(9).then(function() {
      t.same(cmds, [
        'gpio mode 9 out', 'gpio write 9 1', 'gpio write 9 0', 'gpio write 9 1'
      ], 'tap method executes correct commands');
    }).then(function() {
      cmds = [];
      gpio.BCM_GPIO = true;
      return gpio.tap(9).then(function() {
        t.same(cmds, [
          'gpio -g mode 9 out', 'gpio -g write 9 1', 'gpio -g write 9 0', 'gpio -g write 9 1'
        ], 'tap method with BCM_GPIO executes correct commands');
      });
    });
  });

})();
