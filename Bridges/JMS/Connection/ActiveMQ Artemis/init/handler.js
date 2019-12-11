function handler() {
    var self = this;
    var HASHMAP = Java.type("java.util.HashMap");
    var TRANSPORTCONSTANTS = Java.type("org.apache.activemq.artemis.core.remoting.impl.netty.TransportConstants");
    var TRANSPORTCONFIG = Java.type("org.apache.activemq.artemis.api.core.TransportConfiguration");
    var CLIENT = Java.type("org.apache.activemq.artemis.api.jms.ActiveMQJMSClient");
    var FT = Java.type("org.apache.activemq.artemis.api.jms.JMSFactoryType");
    var MESSAGECLONER = Java.type("com.swiftmq.jms.MessageCloner");
    var SESSION = Java.type("javax.jms.Session");

    var connectionParams = new HASHMAP();
    connectionParams.put(TRANSPORTCONSTANTS.HOST_PROP_NAME, this.props["hostname"]);
    connectionParams.put(TRANSPORTCONSTANTS.PORT_PROP_NAME, this.props["port"]);
    connectionParams.put(TRANSPORTCONSTANTS.USE_NIO_PROP_NAME, true);
    connectionParams.put(TRANSPORTCONSTANTS.USE_EPOLL_PROP_NAME, false);
    connectionParams.put(TRANSPORTCONSTANTS.USE_KQUEUE_PROP_NAME, false);

    var transportConfiguration = new TRANSPORTCONFIG("org.apache.activemq.artemis.core.remoting.impl.netty.NettyConnectorFactory", connectionParams);

    var factory = CLIENT.createConnectionFactoryWithoutHA(FT.CF, transportConfiguration);

    this.connection = this.props["username"] ? factory.createConnection(this.props["username"], this.props["password"]) : factory.createConnection();
    if (this.props["clientid"])
        this.connection.setClientID(this.props["clientid"]);
    this.factorysession = this.connection.createSession(false, SESSION.AUTO_ACKNOWLEDGE);
    this.setOutputReference("Connection", execRef);

    function execRef() {
        return self;
    }

    this.getConnection = function () {
        return self.connection;
    };

    this.toMessage = function (impl) {
        return stream.create().message().wrap(MESSAGECLONER.cloneMessage(impl));
    };

    this.toImpl = function (message) {
        return MESSAGECLONER.cloneMessage(message.getImpl(), self.factorysession);
    };

}