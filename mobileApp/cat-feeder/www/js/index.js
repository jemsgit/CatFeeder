var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    processReply: function (data) {
        if (data.indexOf(app.constants.wakeResponse) === 0) {
            console.log(app.constants.wakeResponse);
        } else if (app.bleReplyHandler) {
            app.bleReplyHandler(data);
        }
    },
    updateSettings: function () {
        app.sendBLEData(app.constants.apiMessages.getTime, function () {
            app.bleReplyHandler = app.messageHandlers.getTime;
            app.modules.markup.showSpinner('#timeSpinner', true);
            app.modules.markup.showSpinner('#alarmListSpinner', true);
            app.modules.markup.addMessage(app.constants.outcomeMessageType, 'getTime');
        });
    },

    messageHandlers: {
        getAlarms: function (data) {
            var alarms = data.split('\r\n');
            var result = [];
            alarms.forEach(function (el) {
                el = el.replace(/[\r\n]/g, '');
                if (!el) {
                    return;
                }
                var isActive = false;
                if (el.indexOf(app.constants.activeAlarmMark) != -1) {
                    isActive = true;
                    el = el.slice(el.lastIndexOf(app.constants.activeAlarmMark) + 2);
                }
                var parts = el.split(' - ');
                result.push({ active: isActive, id: parts[0], time: parts[1] })
            }, this);
            app.modules.markup.showAlarms(result);
            app.modules.markup.showSpinner('#alarmListSpinner', false);
            app.bleReplyHandler = null;
        },
        setActiveAlarm: function (data) {
            app.bleReplyHandler = null;
            app.sendBLEData(app.constants.apiMessages.getAlarms, function () {
                app.bleReplyHandler = app.messageHandlers.getAlarms;
                app.modules.markup.addMessage(app.constants.outcomeMessageType, 'get Alarm');
            });
        },
        addAlarm: function (data) {
            app.bleReplyHandler = null;
            app.sendBLEData(app.constants.apiMessages.getAlarms, function () {
                app.bleReplyHandler = app.messageHandlers.getAlarms;
                app.modules.markup.addMessage(app.constants.outcomeMessageType, 'get Alarm');
            });
        },
        deleteAlarm: function (data) {
            app.bleReplyHandler = null;
            app.sendBLEData(app.constants.apiMessages.getAlarms, function () {
                app.bleReplyHandler = app.messageHandlers.getAlarms;
                app.modules.markup.addMessage(app.constants.outcomeMessageType, 'get Alarm');
            });
        },
        getTime: function (data) {
            app.modules.markup.showTime(data);
            app.bleReplyHandler = null;
            app.modules.markup.showSpinner('timeSpinner', false);
            app.sendBLEData(app.constants.apiMessages.getAlarms, function () {
                app.bleReplyHandler = app.messageHandlers.getAlarms;
                app.modules.markup.addMessage(app.constants.outcomeMessageType, 'get Alarm');
            });
        }
    },
    sendBLEData: function (data, callback) {
        app.modules.bluetooth.wakeSignal(app.constants.wakeMessage, function () {
            setTimeout(function () { app.modules.bluetooth.sendData(data, callback); }, 1000);
        })
    },

    modules: {},

    eventCallbacks: {
        selectDevice: function (id, name) {
            if (id) {
                app.modules.bluetooth.connectDevice(id, this.connectSuccess, function (e) {
                    console.log(e)
                });
                app.activeDevice = {
                    id: id,
                    name: name
                }
            }
        },
        connectSuccess: function () {
            app.modules.bluetooth.subscribeOnReply(function (data) {
                app.modules.markup.addMessage(app.constants.incomeMessageType, data);
                app.processReply(data);
            });
            app.updateSettings();
            app.modules.markup.showCurrentDevice(app.activeDevice);
        },
        disconnectCallback: function () {
            app.modules.markup.clearChat();
            app.modules.markup.showDeviceInfo(false);
            app.modules.markup.enableTabs(false);
            app.activeDevice = null;
            app.modules.bluetooth.getDeviceList(app.modules.markup.showDevices.bind(app.modules.markup));
        },
        clearChart: function (e) {
            app.modules.markup.clearChat();
        },
        feed: function (e) {
            app.sendBLEData(app.constants.apiMessages.feed, function () {
                app.modules.markup.addMessage(app.constants.outcomeMessageType, 'feed');
            });
        },
        deleteAlarm: function (data) {
            app.sendBLEData(app.constants.apiMessages.deleteAlarm + data, function () {
                app.bleReplyHandler = app.messageHandlers.deleteAlarm;
                app.modules.markup.showSpinner('#alarmListSpinner', true);
                app.modules.markup.addMessage(app.constants.outcomeMessageType, 'delete Alarm');
            });
        },
        addAlarm: function (data) {
            app.sendBLEData(app.constants.apiMessages.addAlarm + data, function () {
                app.bleReplyHandler = app.messageHandlers.addAlarm;
                app.modules.markup.showSpinner('#addSpinner', true);
                app.modules.markup.addMessage(app.constants.outcomeMessageType, 'add Alarm');
            });
        },
        activateAlarm: function (data) {
            app.sendBLEData(app.constants.apiMessages.setActiveAlarm + data, function () {
                app.bleReplyHandler = app.messageHandlers.setActiveAlarm;
                app.modules.markup.showSpinner('#alarmListSpinner', true);
                app.modules.markup.addMessage(app.constants.outcomeMessageType, 'activate Alarm');
            });
        },
        consoleSend: function (data) {
            app.sendBLEData(data, function () {
                app.modules.markup.addMessage(app.constants.outcomeMessageType, data);
            });
        },
        refreshParams: function () {
            app.updateSettings();
        },
        refresh: function () {
            app.modules.bluetooth.disconnectDevices(function () {
                app.modules.markup.clearChat();
                app.modules.bluetooth.getDeviceList(app.modules.markup.showDevices.bind(app.modules.markup));
            })
        },
        disconnect: function () {
            app.modules.bluetooth.disconnectDevices(function () {
                app.eventCallbacks.disconnectCallback();
            });
        }
    },
    // deviceready Event Handler
    onDeviceReady: function () {
        this.receivedEvent('deviceready');
        this.modules.markup.createUI();
        this.modules.bluetooth.getDeviceList(this.modules.markup.showDevices.bind(app.modules.markup));
        this.modules.markup.attachEvents(this.eventCallbacks);
    },

    // Update DOM on a Received Event
    receivedEvent: function (id) {
    }
};

app.initialize();
