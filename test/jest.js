// const Bundle = require("../core/redis");
const Bundle = require("../build/bundle");
const logsconfig = require("./logconfig");
const http = require("http");
const server = http.createServer();
server.listen(3000)
server.on("error", () => {
    console.error("error")
});
server.on("listening", () => {
    console.log("启动成功,111")
});
let config = {
    ip: "localhost",
    port: 6379,
    auth: "sZa4QfLM7Ieu4xlq",
    channel: "_test_",
    com_config: logsconfig,
    console: true,
    path: "../logs/",
    acceptMessage: acceptMsg
};
const initBundle = new Bundle(config).connection();
const {logCategories, log4js} = initBundle.getLog();
const logger = logCategories.access;

// const logger = initBundle.logLevelConfig("info");

function acceptMsg(channel, msg) {
    logger.info("接收到数据", msg)
}

setInterval(function () {
    initBundle.sendMessage({msg: "sjflsjdf"})
}, 2000);

