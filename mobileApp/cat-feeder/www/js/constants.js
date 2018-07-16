(function(){
    app.constants = {
        incomeMessageType: 'income',
        outcomeMessageType: 'outcome',
        endOfMessage: '\r\n\r\n',
        endOfMessageRegexp: new RegExp('\r\n\r\n', 'g'),
        wakeResponse: 'woke',
        wakeMessage: 'wake',
        activeAlarmMark: '*',
        apiMessages: {
            getTime: 'getTime',
            getAlarms: 'getAlarms',
            feed: 'feed',
            deleteAlarm: 'deleteAlarm-',
            addAlarm: 'addAlarm-',
            setActiveAlarm: 'setActiveAlarm-'
        }
    }
})