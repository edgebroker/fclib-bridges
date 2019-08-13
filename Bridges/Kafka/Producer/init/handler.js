function handler() {
    var self = this;
    var PROPERTIES = Java.type("java.util.Properties");
    var PRODUCER = Java.type("org.apache.kafka.clients.producer.KafkaProducer");

    this.producer = new PRODUCER(createProps());

    function createProps() {
        var props = new PROPERTIES();
        props.put("acks", self.props["ackmode"]);
        props.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer");
        props.put("value.serializer", "org.apache.kafka.common.serialization.ByteArraySerializer");
        props.put("bootstrap.servers", self.props["bootstrapservers"]);
        props.put("compression.type", self.props["compressiontype"]);
        props.put("client.dns.lookup", self.props["clientdnslookup"]);
        if (self.props["clientid"])
            props.put("client.id", self.props["clientid"]);
        return props;
    }
}