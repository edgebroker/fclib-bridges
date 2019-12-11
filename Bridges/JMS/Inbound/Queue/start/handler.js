function handler() {
    var self = this;
    var SESSION = Java.type("javax.jms.Session");
    this.jmsconnection = this.getInputReference("Connection")();
    this.connection = this.jmsconnection.getConnection();
    this.session = this.connection.createSession(false, SESSION.AUTO_ACKNOWLEDGE);
    this.consumer = this.session.createConsumer(this.session.createQueue(this.props["queuename"]));
    this.consumer.setMessageListener(function(message){
       stream.executeCallback(function(msg) {
           self.executeOutputLink("Out", self.jmsconnection.toMessage(msg));
       }, message);
    });
}