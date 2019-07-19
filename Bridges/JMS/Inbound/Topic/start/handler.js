function handler() {
    var self = this;
    var SESSION = Java.type("javax.jms.Session");
    this.jmsconnection = this.getInputReference("Connection")();
    this.connection = this.jmsconnection.getConnection();
    this.session = this.connection.createSession(false, SESSION.AUTO_ACKNOWLEDGE);
    if (this.props["durablename"])
        this.consumer = this.session.createDurableConsumer(this.session.createTopic(this.props["topicname"]), this.props["durablename"]);
    else
        this.consumer = this.session.createConsumer(this.session.createTopic(this.props["topicname"]));
    this.consumer.setMessageListener(function(message){
       stream.executeCallback(function(msg) {
           self.executeOutputLink("Out", self.jmsconnection.toMessage(msg));
       }, message);
    });
}