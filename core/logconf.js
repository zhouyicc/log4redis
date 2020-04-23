const log4js = require('log4js');
const defaultType = "access";
module.exports = class ConfigLogs {
    /**
     * @param config
     * com_config ###自定义配置
     * console ###是否开启打印日志
     * format ###格式化文件名 默认
     * path ###路径
     */
    constructor(config = {}) {
        this.com_config = config.com_config || false;
        this.pm2 = config.pm2 || false;
        this.console = config.console || false;
        this.format = config.format || "yyyy-MM-dd";
        this.path = config.path || "./";
        this.configure = null;
    }

    /**
     * 注册配置
     * @private
     */
    _log4config() {
        log4js.configure(this.configure);
        let logConf = {};
        logConf.logCategories = this._getLogger();
        logConf.log4js = log4js;
        return logConf;
    }

    /**
     * 获取日志级别
     * @private
     */
    _getLogger() {
        let logger = {};
        for (let i in this.configure.categories) {
            logger[i] = log4js.getLogger(i)
        }
        return logger
    }

    /**
     * 初始化默认配置
     * @returns {{categories, appenders}}
     * @private
     */
    _initLogConfig() {
        let appenders = {};
        let categories = {};
        //设置appenders
        appenders[defaultType] = {
            type: 'dateFile',
            filename: `${this.path}${defaultType}.log`,
            pattern: this.format,
            alwaysIncludePattern: true,
            keepFileExt: true
        };
        appenders["error"] = {
            type: 'dateFile',
            filename: `${this.path}error.log`,
            pattern: this.format,
            alwaysIncludePattern: true,
            keepFileExt: true
        };
        //过滤器
        appenders["just-error"] = {
            type: 'logLevelFilter',
            appender: 'error',
            level: 'error'
        };
        categories[defaultType] = {appenders: ["access", "just-error"], level: "all"};
        categories["default"] = {appenders: ["access", "just-error"], level: "all"};
        if (this.console) {
            appenders["console"] = {type: "console"};
            categories[defaultType].appenders.push("console");
            categories["default"].appenders.push("console");
        }
        return {appenders, categories, pm2: this.pm2}
    }

    /**
     * 创建初始日志
     */
    getLog() {
        let conf = {appenders: {}, categories: {}};
        if (this.com_config) {
            conf = this.com_config;
        } else {
            conf = this._initLogConfig();
        }
        this.configure = conf;
        return this._log4config();
    }
};
