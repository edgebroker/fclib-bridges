function handler() {
    var self = this;
    var MAP = Java.type("java.util.Map");
    var HASHMAP = Java.type("java.util.HashMap");
    var SWIFTMQCF = Java.type("com.swiftmq.jms.SwiftMQConnectionFactory");

    var props = new HASHMAP();
    props.put(SWIFTMQCF.SOCKETFACTORY, this.props["istls"] ? "com.swiftmq.net.JSSESocketFactory" : "com.swiftmq.net.PlainSocketFactory");
    props.put(SWIFTMQCF.HOSTNAME, this.props["hostname"]);
    props.put(SWIFTMQCF.PORT, String(this.props["port"]));
    if (this.props["hostname2"])
        props.put(SWIFTMQCF.RECONNECT_HOSTNAME2, this.props["hostname2"]);
    if (this.props["port2"])
        props.put(SWIFTMQCF.RECONNECT_PORT2, String(this.props["port2"]));
    props.put(SWIFTMQCF.KEEPALIVEINTERVAL, String(this.props["keepaliveinterval"]));
    props.put(SWIFTMQCF.RECONNECT_MAX_RETRIES, String(this.props["maxretries"]));
    props.put(SWIFTMQCF.RECONNECT_ENABLED, String(this.props["reconnect"]));
    props.put(SWIFTMQCF.RECONNECT_RETRY_DELAY, String(this.props["retrydelay"]));
    var factory = SWIFTMQCF.create(props);

    this.connection = this.props["username"] ? factory.createConnection(this.props["username"], this.props["password"]) : factory.createConnection();
    if (this.props["clientid"])
        this.connection.setClientID(this.props["clientid"]);
    this.setOutputReference("Connection", execRef);

    function execRef() {
        return self;
    }

    this.getConnection = function() {
        return self.connection;
    };

    this.toMessage = function(impl) {
        return stream.create().message().wrap(impl);
    };

    this.toImpl = function(message) {
        return message.getImpl();
    };
}