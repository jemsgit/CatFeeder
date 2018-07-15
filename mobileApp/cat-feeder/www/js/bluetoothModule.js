(function(){
  if(!app.modules){
    app.modules = {}
  }

  devices = [];
  connectedDevice = null;
  bleService = null;
  message = '';

  // ASCII only
  function stringToBytes(string) {
     var array = new Uint8Array(string.length);
     for (var i = 0, l = string.length; i < l; i++) {
         array[i] = string.charCodeAt(i);
      }
      return array.buffer;
  }

  // ASCII only
  function bytesToString(buffer) {
      return String.fromCharCode.apply(null, new Uint8Array(buffer));
  }

  app.modules.bluetooth = {
    getDeviceList: function(success, failure){
        if(!success){
          return new Error('provide callbacks');
        }
        devices = [];
        ble.scan([], 10, function(device){
          devices.push(device);
          success(devices);
        }, function(e){
          failure(e)
        });
    },
    connectDevice: function(macAddress_or_uuid, success, failure){
      if(!macAddress_or_uuid || !success){
        return new Error('provide id and callbacks');
      }
      ble.stopScan(function(){});
      ble.connect(macAddress_or_uuid, function(device){
        connectedDevice = device;
        bleService = connectedDevice.characteristics.find(function(item){
          return item.properties.indexOf('Read') > -1 && item.properties.indexOf('WriteWithoutResponse') > -1
        })
        success();
      }, failure);
    },
    disconnectDevices: function(success, failure){
      if(connectedDevice == null){
          success && success();
          return;
      }
      ble.disconnect(connectedDevice.id, function(){
        connectedDevice = null;
        bleService = null;
        success && success();
      }, function(e){
        failure(e)
      });
    },
    wakeSignal: function(data, success, failure){
      this.sendData(data, success, failure);
    },
    sendData: function(data, success, failure){
      if(!success){
        return new Error('provide callbacks');
      }
      if(!bleService){
        failure && failure('No ble with writable and readable characteristic');
        return;
      }
      ble.write(connectedDevice.id, bleService.service, bleService.characteristic, stringToBytes(data), success, failure);
    },
    subscribeOnReply: function(success, failure){
      if(!success){
        return new Error('provide callbacks');
      }
      if(!bleService){
        failure && failure('No ble with writable and readable characteristic');
        return;
      }
      ble.startNotification(connectedDevice.id, bleService.service, bleService.characteristic, function(data){ 
        message += bytesToString(data);
        if(message.indexOf('\r\n\r\n') != -1){
            success(message.replace(/\r\n\r\n/g, ''));
            message = '';
        }
      }, failure);
    }
  }
})()
