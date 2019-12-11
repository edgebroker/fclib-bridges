function handler() {
    var self = this;
    var MESSAGECLONER = Java.type("com.swiftmq.jms.MessageCloner");
    var CF = Java.type("org.apache.activemq.ActiveMQConnectionFactory");
    var SESSION = Java.type("javax.jms.Session");

    var factory = new CF(this.props["brokerurl"]);

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