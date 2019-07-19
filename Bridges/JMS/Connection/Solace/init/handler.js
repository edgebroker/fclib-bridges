function handler() {
    var self = this;
    var MESSAGECLONER = Java.type("com.swiftmq.jms.MessageCloner");
    var SOLACEUTIL = Java.type("com.solacesystems.jms.SolJmsUtility");
    var SESSION = Java.type("javax.jms.Session");

    var factory = SOLACEUTIL.createConnectionFactory();
    factory.setHost(this.props["hostname"]);
    factory.setVPN(this.props["vpn"]);
    factory.setUsername(this.props["username"]);
    factory.setPassword(this.props["password"]);

    this.connection = factory.createConnection();
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