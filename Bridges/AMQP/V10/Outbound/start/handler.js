function handler(){
    var self = this;
    var QOS = Java.type("com.swiftmq.amqp.v100.client.QoS");
    this.session = this.getInputReference("Connection")().getSession();

    this.QoS = qos(this.props["qos"]);
    this.producer = this.session.createProducer(this.props["targetaddress"], this.QoS);

    function qos(prop){
        switch (prop){
            case "At most once":
                return QOS.AT_MOST_ONCE;
            case "At least once":
                return QOS.AT_LEAST_ONCE;
            case "Exactly once":
                return QOS.EXACTLY_ONCE;
        }
    }
}