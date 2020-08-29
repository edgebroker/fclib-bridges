function handler() {
    var self = this;
    var SESSION = Java.type("javax.jms.Session");
    this.jmsconnection = this.getInputReference("Connection")();
    this.connection = this.jmsconnection.getConnection();
    this.session = this.connection.createSession(false, SESSION.AUTO_ACKNOWLEDGE);
    if (this.props["durablename"])
        this.consumer = this.session.createDurableSubscriber(this.session.createTopic(this.props["topicname"]), this.props["durablename"]);
    else
        this.consumer = this.session.createConsumer(this.session.createTopic(this.props["topicname"]));
    var LISTENER = Java.extend(Java.type("javax.jms.MessageListener"), {
        onMessage: function (message) {
            self.executeOutputLink("Out", self.jmsconnection.toMessage(message));
        }
    });
    this.consumer.setMessageListener(stream.async("javax.jms.MessageListener", new LISTENER()));
}