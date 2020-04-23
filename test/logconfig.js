module.exports = {
    appenders: {
        error: {
            type: 'dateFile',
            filename: "../stat/error.log",
            pattern: 'yyyy-MM-dd',
            alwaysIncludePattern: true,
            keepFileExt: true
        },
        "just-error": {
            type: 'logLevelFilter',
            appender: 'error',
            level: 'error'
        },
        access: {
            type: 'dateFile',
            filename: "../stat/access.log",
            pattern: 'yyyy-MM-dd',
            alwaysIncludePattern: true,
            keepFileExt: true
        },
        console: {type: 'console'}
    },
    categories: {
        access: {appenders: ['access', "console", "just-error"], level: 'all'},
        default: {appenders: ["access", "console", "just-error"], level: "all"}
    }
};
