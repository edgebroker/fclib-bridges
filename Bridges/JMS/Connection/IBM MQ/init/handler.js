function handler() {
    var self = this;
    var MESSAGECLONER = Java.type("com.swiftmq.jms.MessageCloner");
    var SESSION = Java.type("javax.jms.Session");
    var FF = Java.type("com.ibm.msg.client.jms.JmsFactoryFactory");
    var JMSCONST = Java.type("com.ibm.msg.client.jms.JmsConstants");
    var COMCONST = Java.type("com.ibm.msg.client.wmq.common.CommonConstants");

    try {
        var ff = FF.getInstance(JMSCONST.WMQ_PROVIDER);
        var cf = ff.createConnectionFactory();

        cf.setStringProperty(COMCONST.WMQ_HOST_NAME, this.props["hostname"]);
        cf.setIntProperty(COMCONST.WMQ_PORT, this.props["port"]);
        cf.setStringProperty(COMCONST.WMQ_CHANNEL, this.props["channel"]);
        cf.setIntProperty(COMCONST.WMQ_CONNECTION_MODE, COMCONST.WMQ_CM_CLIENT);
        cf.setStringProperty(COMCONST.WMQ_QUEUE_MANAGER, this.props["queuemanager"]);
        cf.setStringProperty(COMCONST.WMQ_APPLICATIONNAME, this.props["appname"]);
        cf.setBooleanProperty(JMSCONST.USER_AUTHENTICATION_MQCSP, true);
        cf.setStringProperty(JMSCONST.USERID, this.props["username"]);
        cf.setStringProperty(JMSCONST.PASSWORD, this.props["password"]);

        stream.log().info("WMQ_HOST_NAME: "+COMCONST.WMQ_HOST_NAME);
        stream.log().info("WMQ_PORT: "+COMCONST.WMQ_PORT);
        stream.log().info("WMQ_CHANNEL: "+COMCONST.WMQ_CHANNEL);
        stream.log().info("WMQ_CONNECTION_MODE: "+COMCONST.WMQ_CONNECTION_MODE);
        stream.log().info("WMQ_QUEUE_MANAGER: "+COMCONST.WMQ_QUEUE_MANAGER);
        stream.log().info("WMQ_APPLICATIONNAME: "+COMCONST.WMQ_APPLICATIONNAME);
        stream.log().info("USERID: "+JMSCONST.USERID);
        stream.log().info("PASSWORD: "+JMSCONST.PASSWORD);
        stream.log().info(cf);

        this.connection = this.props["username"] ? cf.createConnection(this.props["username"], this.props["password"]) : cf.createConnection();
        if (this.props["clientid"])
            this.connection.setClientID(this.props["clientid"]);
        this.factorysession = this.connection.createSession(false, SESSION.AUTO_ACKNOWLEDGE);
        this.setOutputReference("Connection", execRef);
    } catch (e) {
        e.printStackTrace();
        throw e;
    }

    function execRef() {
        return self;
    }

    this.getConnection = function() {
        return self.connection;
    };

    this.toMessage = function(impl) {
        return stream.create().message().wrap(MESSAGECLONER.cloneMessage(impl));
    };

    this.toImpl = function(message) {
        return MESSAGECLONER.cloneMessage(message.getImpl(), self.factorysession);
    };
}