function handler() {
    var self = this;
    var SESSION = Java.type("javax.jms.Session");
    this.jmsconnection = this.getInputReference("Connection")();
    this.connection = this.jmsconnection.getConnection();
    this.session = this.connection.createSession(false, SESSION.AUTO_ACKNOWLEDGE);
    this.producer = this.session.createProducer(this.session.createTopic(this.props["topicname"]));
    var DMODE = Java.type("javax.jms.DeliveryMode");
    if (this.props["persistence"]) {
        switch (this.props["persistence"]){
            case "Persistent":
                this.producer.setDeliveryMode(DMODE.PERSISTENT);
               break;
            case "Non Persistent":
                this.producer.setDeliveryMode(DMODE.NON_PERSISTENT);
                break;
        }
    }
}