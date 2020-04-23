const redis = require("redis");
const default_channel = "_ex_channel_";
const ConfigLogs = require("./logconf");
export default class Exredis extends ConfigLogs {
    /**
     * @param conf
     * ip ###ip
     * port ###port
     * auth ###password
     * channel ###subscribe channel
     * acceptMessage ###accept channel massage callback
     * log4js ###config log4js
     */
    constructor(conf = {}) {
        super(conf);
        this.ip = conf.ip;
        this.port = conf.port;
        this.auth = conf.auth || "";
        this.channel = conf.channel || default_channel;
        this.acceptMessage = conf.acceptMessage || null;

        // current client redis
        this.client = {
            client_sub: null,
            client_pub: null
        }
    }

    /**
     * create connections used to subscribe and publish
     * @param clientType
     * client_sub use to subscribe
     * client_pub use to publish
     */
    connection(clientType = "client_sub") {
        this.client[clientType] = redis.createClient(this.port, this.ip);
        //select auth password
        this.client[clientType].auth(this.auth);
        //select default dbIndex "0"
        this.client[clientType].select("0");
        //onerror callabck
        this.client[clientType].on("error", (err) => {
            throw new Error(err)
        });
        if (clientType === "client_sub") {
            //subscribe channel infomation
            this.subscribe(this.channel);
            //accept message callback
            this.client.client_sub.on("message", (channel, data) => {
                this.accept(channel, data)
            });
        }
        return this;
    }

    /**
     * accept channel information
     * callback client config
     * @param channel
     * @param data
     */
    accept(channel, data) {
        if (this.acceptMessage) {
            this.acceptMessage(channel, data)
        }
    }

    /**
     * send message to channel
     * @param msg is object or string or number etc
     */
    sendMessage(msg) {
        if (!this.client.client_pub) {
            this.connection("client_pub")
        }
        let pub_msg = {
            "rtime": Date.now(),
            "msg": msg
        };
        msg = JSON.stringify(pub_msg);
        this.client.client_pub.publish(this.channel, msg, err => {
            if (err) {
                throw new Error(err)
            }
        })
    }

    /**
     * subscribe channel information
     */
    subscribe() {
        this.client.client_sub.subscribe(this.channel, err => {
            if (err) {
                throw new Error("subscribe channel is error" + err)
            }
        })
    }

    /**
     * unsubscribe channel information
     */
    unsubscribe() {
        this.client.client_sub.unsubscribe(this.channel, err => {
            if (err) {
                throw new Error("unsubscribe channel is error" + err)
            }
        })
    }
};
