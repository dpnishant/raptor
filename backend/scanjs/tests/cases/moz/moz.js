(function () {
  describe('Mozilla specific tests', function () {
    context('MozActivity', function () {
      context('safe', function () {
        context(null, function () {
          var good = 'var a = "static MozActivity";';
          it(good, function () {
            chai.expect(ScanJS.scan(acorn.parse(good, {locations : true}), "/tests/")).to.be.empty;
          });
        });
        context(null, function () {
          var good = 'var MozActivity = "static MozActivity";';
          it(good, function () {
            chai.expect(ScanJS.scan(acorn.parse(good, {locations : true}), "/tests/")).to.be.empty;
          });
        });
      });
      context('dangerous', function () {
        context(null, function () {
          var bad = 'var activity = new MozActivity({ name: "pick",data: {type: "image/jpeg"}});';
          it(bad, function () {
            chai.expect(ScanJS.scan(acorn.parse(bad, {locations : true}), "/tests/")).not.to.be.empty;
          });
        });
      });
    });

    context('.mozAlarms', function () {
      context('safe', function () {
        context(null, function () {
          var good = 'var mozAlarms = "just a string, not .mozAlarms";';
          it(good, function () {
            chai.expect(ScanJS.scan(acorn.parse(good, {locations : true}), "/tests/")).to.be.empty;
          });
        });
      });
      context('dangerous', function () {
        context(null, function () {
          var bad = 'var bad = window.navigator.mozAlarms;';
          it(bad, function () {
            chai.expect(ScanJS.scan(acorn.parse(bad, {locations : true}), "/tests/")).not.to.be.empty;
          });
        });
      });
    });

    context('mozApps.mgmt', function () {
      context('safe', function () {
        context(null, function () {
          var good = 'var getAll = "mozApps.mgmt.getAll()";';
          it(good, function () {
            chai.expect(ScanJS.scan(acorn.parse(good, {locations : true}), "/tests/")).to.be.empty;
          });
        });
      });
      context('dangerous', function () {
        context(null, function () {
          var bad = 'var stuffs = navigator.mozApps.mgmt;';
          it(bad, function () {
            chai.expect(ScanJS.scan(acorn.parse(bad, {locations : true}), "/tests/")).not.to.be.empty;
          });
        });
        context(null, function () {
          var bad = 'var stuffs = navigator.mozApps.mgmt.getAll()';
          it(bad, function () {
            chai.expect(ScanJS.scan(acorn.parse(bad, {locations : true}), "/tests/")).not.to.be.empty;
          });
        });
      });
    });

    context('.mozBluetooth', function () {
      context('safe', function () {
        context(null, function () {
          var good = 'var mozBluetooth = "just a string, not .mozBluetooth";';
          it(good, function () {
            chai.expect(ScanJS.scan(acorn.parse(good, {locations : true}), "/tests/")).to.be.empty;
          });
        });
      });
      context('dangerous', function () {
        context(null, function () {
          var bad = 'var bad = window.navigator.mozBluetooth;';
          it(bad, function () {
            chai.expect(ScanJS.scan(acorn.parse(bad, {locations : true}), "/tests/")).not.to.be.empty;
          });
        });
      });
    });

    context('mozCameras', function () {
      context('safe', function () {
        context(null, function () {
          var good = 'var mozCameras = "just a string, not mozCameras";';
          it(good, function () {
            chai.expect(ScanJS.scan(acorn.parse(good, {locations : true}), "/tests/")).to.be.empty;
          });
        });
      });
      context('dangerous', function () {
        context(null, function () {
          var bad = 'var bad = window.navigator.mozCameras;';
          it(bad, function () {
            chai.expect(ScanJS.scan(acorn.parse(bad, {locations : true}), "/tests/")).not.to.be.empty;
          });
        });
      });
    });


      context('dangerous', function () {
        context(null, function () {
          var bad = 'var bad = window.navigator.mozCellBroadcast;';
          it(bad, function () {
            chai.expect(ScanJS.scan(acorn.parse(bad, {locations : true}), "/tests/")).not.to.be.empty;
          });
        });
      });
    });

    context('mozChromeEvent', function () {
      context('safe', function () {
        context(null, function () {
          var good = 'var a = "string mozChromeEvent";';
          it(good, function () {
            chai.expect(ScanJS.scan(acorn.parse(good, {locations : true}), "/tests/")).to.be.empty;
          });
        });
        context(null, function () {
          var good = 'var mozChromeEvent = "string mozChromeEvent";';
          it(good, function () {
            chai.expect(ScanJS.scan(acorn.parse(good, {locations : true}), "/tests/")).to.be.empty;
          });
        });
      });
      context('dangerous', function () {
        context(null, function () {
          var bad = 'window.addEventListener("mozChromeEvent", function (e) {console.log("mozilla rocks!") });';
          it(bad, function () {
            chai.expect(ScanJS.scan(acorn.parse(bad, {locations : true}), "/tests/")).not.to.be.empty;
          });
        });
      });
    });

    context('.mozContacts', function () {
      context('safe', function () {
        context(null, function () {
          var good = 'var mozContacts = "just a string, not .mozContacts";';
          it(good, function () {
            chai.expect(ScanJS.scan(acorn.parse(good, {locations : true}), "/tests/")).to.be.empty;
          });
        });
      });
      context('dangerous', function () {
        context(null, function () {
          var bad = 'var bad = window.navigator.mozContacts;';
          it(bad, function () {
            chai.expect(ScanJS.scan(acorn.parse(bad, {locations : true}), "/tests/")).not.to.be.empty;
          });
        });
      });
    });

    context('mozFMRadio', function () {
      context('safe', function () {
        context(null, function () {
          var good = 'var a = "string mozFMRadio;";';
          it(good, function () {
            chai.expect(ScanJS.scan(acorn.parse(good, {locations : true}), "/tests/")).to.be.empty;
          });
        });
      });
      context('dangerous', function () {
        context(null, function () {
          var bad = 'var WebFM = navigator.mozFMRadio;';
          it(bad, function () {
            chai.expect(ScanJS.scan(acorn.parse(bad, {locations : true}), "/tests/")).not.to.be.empty;
          });
        });
      });
    });

    context('mozKeyboard', function () {
      context('safe', function () {
        context(null, function () {
          var good = 'var a = "mozKeyboard";';
          it(good, function () {
            chai.expect(ScanJS.scan(acorn.parse(good, {locations : true}), "/tests/")).to.be.empty;
          });
        });
      });
      context('dangerous', function () {
        /* deactivated, failing test.
        context(null, function () {
          var bad = 'mozKeyboard.onfocuschange = alert(0);';
          it(bad, function () {
            chai.expect(ScanJS.scan(acorn.parse(bad, {locations : true}), "/tests/")).not.to.be.empty;
          });
        });
        */
      });
    });

    context('mozMobileConnection', function () {
      context('safe', function () {
        context(null, function () {
          var good = 'var a = "mozMobileConnection";';
          it(good, function () {
            chai.expect(ScanJS.scan(acorn.parse(good, {locations : true}), "/tests/")).to.be.empty;
          });
        });
      });
      context('dangerous', function () {
        /* deactivated, failing test.
         context(null, function () {
          var bad = 'MozMobileConnection.sendMMI()';
          it(bad, function () {
            chai.expect(ScanJS.scan(acorn.parse(bad, {locations : true}), "/tests/")).not.to.be.empty;
          });
        });
        */
      });
    });

    context('.mozNotification', function () {
      context('safe', function () {
        context(null, function () {
          var good = 'var mozNotification = ".mozNotification, this is just a string";';
          it(good, function () {
            chai.expect(ScanJS.scan(acorn.parse(good, {locations : true}), "/tests/")).to.be.empty;
          });
        });
      });
      context('dangerous', function () {
        context(null, function () {
          var bad = "if (window.webkitNotifications) { _popup = window; } else if (navigator.mozNotification) { console.log (1); }";
          it(bad, function () {
            chai.expect(ScanJS.scan(acorn.parse(bad, {locations : true}), "/tests/")).not.to.be.empty;
          });
        });
      });
    });

    context('mozPermissionSettings', function () {
      context('safe', function () {
        context(null, function () {
          var good = 'var a = "just a string, not mozPermissionSettings";';
          it(good, function () {
            chai.expect(ScanJS.scan(acorn.parse(good, {locations : true}), "/tests/")).to.be.empty;
          });
        });
        context(null, function () {
          var good = 'var mozPermissionSettings = "just a string, not mozPermissionSettings";';
          it(good, function () {
            chai.expect(ScanJS.scan(acorn.parse(good, {locations : true}), "/tests/")).to.be.empty;
          });
        });
      });
      context('dangerous', function () {
        context(null, function () {
          var bad = 'var permissions = window.navigator.mozPermissionSettings;';
          it(bad, function () {
            chai.expect(ScanJS.scan(acorn.parse(bad, {locations : true}), "/tests/")).not.to.be.empty;
          });
        });
      });
    });

    context('mozPower', function () {
      context('safe', function () {
        context(null, function () {
          var good = 'var a = "just a string, window.navigator.mozPower;";';
          it(good, function () {
            chai.expect(ScanJS.scan(acorn.parse(good, {locations : true}), "/tests/")).to.be.empty;
          });
        });
        context(null, function () {
          var good = 'var mozPower = "just a string, window.navigator.mozPower;";';
          it(good, function () {
            chai.expect(ScanJS.scan(acorn.parse(good, {locations : true}), "/tests/")).to.be.empty;
          });
        });
      });
      context('dangerous', function () {
        context(null, function () {
          var bad = 'var power = window.navigator.mozPower;';
          it(bad, function () {
            chai.expect(ScanJS.scan(acorn.parse(bad, {locations : true}), "/tests/")).not.to.be.empty;
          });
        });
      });
    });

    context('mozSetMessageHandler', function () {
      context('safe', function () {
        context(null, function () {
          var good = 'var a = "static mozSetMessageHandler";';
          it(good, function () {
            chai.expect(ScanJS.scan(acorn.parse(good, {locations : true}), "/tests/")).to.be.empty;
          });
        });
      });
      context('dangerous', function () {
        context(null, function () {
          var bad = 'navigator.mozSetMessageHandler(type, handler);';
          it(bad, function () {
            chai.expect(ScanJS.scan(acorn.parse(bad, {locations : true}), "/tests/")).not.to.be.empty;
          });
        });
      });
    });

    context('mozSettings', function () {
      context('safe', function () {
        context(null, function () {
          var good = 'var a = "window.navigator.mozSettings;";';
          it(good, function () {
            chai.expect(ScanJS.scan(acorn.parse(good, {locations : true}), "/tests/")).to.be.empty;
          });
        });
        context(null, function () {
          var good = 'var mozSettings = "window.navigator.mozSettings;";';
          it(good, function () {
            chai.expect(ScanJS.scan(acorn.parse(good, {locations : true}), "/tests/")).to.be.empty;
          });
        });
      });
      context('dangerous', function () {
        context(null, function () {
          var bad = 'var settings = window.navigator.mozSettings;';
          it(bad, function () {
            chai.expect(ScanJS.scan(acorn.parse(bad, {locations : true}), "/tests/")).not.to.be.empty;
          });
        });
      });
    });

    context('mozSms', function () {
      context('safe', function () {
        context(null, function () {
          var good = 'var a = "window.navigator.mozSms;";';
          it(good, function () {
            chai.expect(ScanJS.scan(acorn.parse(good, {locations : true}), "/tests/")).to.be.empty;
          });
        });
        context(null, function () {
          var good = 'var mozSms = "window.navigator.mozSms;";';
          it(good, function () {
            chai.expect(ScanJS.scan(acorn.parse(good, {locations : true}), "/tests/")).to.be.empty;
          });
        });
      });
      context('dangerous', function () {
         /* deactivated, failing test.
         context(null, function () {
          var bad = 'var sms = window.navigator.mozSms;';
          it(bad, function () {
            chai.expect(ScanJS.scan(acorn.parse(bad, {locations : true}), "/tests/")).not.to.be.empty;
          });
        });
        */
        /* deactivated, failing test.
        context(null, function () {
          var bad = 'var msg = window.navigator.mozSms.getMessage(1);';
          it(bad, function () {
            chai.expect(ScanJS.scan(acorn.parse(bad, {locations : true}), "/tests/")).not.to.be.empty;
          });
        });
        */
      });
    });

    context('mozSystem', function () {
      context('safe', function () {
        context(null, function () {
          var good = 'var a = "mozSystem: true";';
          it(good, function () {
            chai.expect(ScanJS.scan(acorn.parse(good, {locations : true}), "/tests/")).to.be.empty;
          });
        });
      });
      context('dangerous', function () {
        context(null, function () {
          var bad = 'var xhr = new XMLHttpRequest({ mozSystem: true});';
          it(bad, function () {
            chai.expect(ScanJS.scan(acorn.parse(bad, {locations : true}), "/tests/")).not.to.be.empty;
          });
        });
      });
    });

    context('.mozTCPSocket', function () {
      context('safe', function () {
        context(null, function () {
          var good = 'var a = "navigator.mozTCPSocket;"';
          it(good, function () {
            chai.expect(ScanJS.scan(acorn.parse(good, {locations : true}), "/tests/")).to.be.empty;
          });
        });
      });
      context('dangerous', function () {
        context(null, function () {
          var bad = 'var socket = navigator.mozTCPSocket;';
          it(bad, function () {
            chai.expect(ScanJS.scan(acorn.parse(bad, {locations : true}), "/tests/")).not.to.be.empty;
          });
        });
      });
    });

    context('mozTelephony', function () {
      context('safe', function () {
        context(null, function () {
          var good = 'var a = "window.navigator.mozTelephony;";';
          it(good, function () {
            chai.expect(ScanJS.scan(acorn.parse(good, {locations : true}), "/tests/")).to.be.empty;
          });
        });
      });
      context('dangerous', function () {
        context(null, function () {
          var bad = 'var phone = window.navigator.mozTelephony;';
          it(bad, function () {
            chai.expect(ScanJS.scan(acorn.parse(bad, {locations : true}), "/tests/")).not.to.be.empty;
          });
        });
      });
    });

    context('mozTime', function () {
      context('safe', function () {
        context(null, function () {
          var good = 'var a = "mozTime;";';
          it(good, function () {
            chai.expect(ScanJS.scan(acorn.parse(good, {locations : true}), "/tests/")).to.be.empty;
          });
        });
      });
      context('dangerous', function () {
        context(null, function () {
          var bad = 'var time = window.navigator.mozTime;';
          it(bad, function () {
            chai.expect(ScanJS.scan(acorn.parse(bad, {locations : true}), "/tests/")).not.to.be.empty;
          });
        });
      });
    });

    context('mozVoicemail', function () {
      context('safe', function () {
        context(null, function () {
          var good = 'var a = "mozVoicemail";';
          it(good, function () {
            chai.expect(ScanJS.scan(acorn.parse(good, {locations : true}), "/tests/")).to.be.empty;
          });
        });
      });
      context('dangerous', function () {
        context(null, function () {
          var bad = 'var voicemail = window.navigator.mozVoicemail;';
          it(bad, function () {
            chai.expect(ScanJS.scan(acorn.parse(bad, {locations : true}), "/tests/")).not.to.be.empty;
          });
        });
        context(null, function () {
          var bad = 'var status = window.navigator.mozVoicemail.getStatus();';
          it(bad, function () {
            chai.expect(ScanJS.scan(acorn.parse(bad, {locations : true}), "/tests/")).not.to.be.empty;
          });
        });
      });
    });

    context('mozapp', function () {
      context('safe', function () {
        context(null, function () {
          var good = 'var a = "mozapp";';
          it(good, function () {
            chai.expect(ScanJS.scan(acorn.parse(good, {locations : true}), "/tests/")).to.be.empty;
          });
        });
      });
      context('dangerous', function () {
        /* deactivated, failing test.
        context(null, function () {
          var bad = 'var a = document.createElement("iframe"); a.mozapp = data.app; document.appendChild(a);';
          it(bad, function () {
            chai.expect(ScanJS.scan(acorn.parse(bad, {locations : true}), "/tests/")).not.to.be.empty;
          });
        });
        */
        context(null, function () {
          // issue 73 - https://github.com/mozilla/scanjs/issues/73
          var bad = 'iframe.setAttribute("mozapp", data.app);';
          it.skip(bad, function () {
            chai.expect(ScanJS.scan(acorn.parse(bad, {locations : true}), "/tests/")).not.to.be.empty;
          });
        });
      });
    });

    context('mozaudiochannel', function () {
      context('safe', function () {
        context(null, function () {
          var good = 'var a = "mozaudiochannel=content.toString()";';
          it(good, function () {
            chai.expect(ScanJS.scan(acorn.parse(good, {locations : true}), "/tests/")).to.be.empty;
          });
        });
      });
      context('dangerous', function () {
        /* deactivated, failing test.
        context(null, function () {
          var bad = 'var a = document.createElement("audio"); a.mozaudiochannel = "content"; document.appendChild(a);';
          it(bad, function () {
            chai.expect(ScanJS.scan(acorn.parse(bad, {locations : true}), "/tests/")).not.to.be.empty;
          });
        });
        */
        context(null, function () {
          // issue 73 - https://github.com/mozilla/scanjs/issues/73
          var bad = 'var a = document.createElement("audio"); a.setAttribute("mozaudiochannel", data.app);';
          it.skip(bad, function () {
            chai.expect(ScanJS.scan(acorn.parse(bad, {locations : true}), "/tests/")).not.to.be.empty;
          });
        });
      });
    });

    context('moznetworkdownload', function () {
      context('safe', function () {
        context(null, function () {
          var good = 'var a = "moznetworkdownload";';
          it(good, function () {
            chai.expect(ScanJS.scan(acorn.parse(good, {locations : true}), "/tests/")).to.be.empty;
          });
        });
      });
      context('dangerous', function () {
        /* deactivated, failing test.
        context(null, function () {
          var bad = 'addEventListener("moznetworkdownload", downloadHandler);';
          it(bad, function () {
            chai.expect(ScanJS.scan(acorn.parse(bad, {locations : true}), "/tests/")).not.to.be.empty;
          });
        });
        */
      });
    });

    context('moznetworkupload', function () {
      context('safe', function () {
        context(null, function () {
          var good = 'var a = "moznetworkupload";';
          it(good, function () {
            chai.expect(ScanJS.scan(acorn.parse(good, {locations : true}), "/tests/")).to.be.empty;
          });
        });
      });
      context('dangerous', function () {
        /* deactivated, failing test.
        context(null, function () {
          var bad = 'addEventListener("moznetworkupload", downloadHandler);';
          it(bad, function () {
            chai.expect(ScanJS.scan(acorn.parse(bad, {locations : true}), "/tests/")).not.to.be.empty;
          });
        });
        */
      });
    });

    context('mozWifiManager', function () {
      context('safe', function () {
        context(null, function () {
          var good = 'var a = "mozWifiManager";';
          it(good, function () {
            chai.expect(ScanJS.scan(acorn.parse(good, {locations : true}), "/tests/")).to.be.empty;
          });
        });
        context(null, function () {
          var good = 'somethingNotNavigator.mozWifiManager;';
          it(good, function () {
            chai.expect(ScanJS.scan(acorn.parse(good, {locations : true}), "/tests/")).to.be.empty;
          });
        });
      });
      context('dangerous', function () {
        context(null, function () {
          var bad = 'var wifi = navigator.mozWifiManager;';
          it(bad, function () {
            chai.expect(ScanJS.scan(acorn.parse(bad, {locations : true}), "/tests/")).not.to.be.empty;
          });
        });
        context(null, function () {
          var bad = 'var networks = navigator.mozWifiManager.getNetworks();';
          it(bad, function () {
            chai.expect(ScanJS.scan(acorn.parse(bad, {locations : true}), "/tests/")).not.to.be.empty;
          });
        });
        context(null, function () {
          var bad = 'var wifi = navigator.mozWifiManager;';
          it(bad, function () {
            chai.expect(ScanJS.scan(acorn.parse(bad, {locations : true}), "/tests/")).not.to.be.empty;
          });
        });
      });
    });

  })(); //describe('Mozilla specific tests'...
