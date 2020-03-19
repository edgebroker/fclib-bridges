function handler() {
    var self = this;
    var PROPERTIES = Java.type("java.util.Properties");
    var CONSUMER = Java.type("org.apache.kafka.clients.consumer.KafkaConsumer");
    var STRING = Java.type("java.lang.String");
    var LIST = Java.type("java.util.ArrayList");

    this.consumer = new CONSUMER(createProps());
    this.consumer.subscribe(topicList());

    function createProps() {
        var props = new PROPERTIES();
        props.put("enable.auto.commit", "false");
        props.put("fetch.size", "1000000");
        props.put("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
        props.put("value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
        props.put("bootstrap.servers", self.props["bootstrapservers"]);
        props.put("client.dns.lookup", self.props["clientdnslookup"]);
        if (self.props["allowautocreatetopic"])
            props.put("allow.auto.create.topic", STRING.valueOf(self.props["allowautocreatetopic"]));
        if (self.props["groupid"])
            props.put("group.id", self.props["groupid"]);
        if (self.props["groupinstanceid"])
            props.put("group.instance.id", self.props["groupinstanceid"]);
        if (self.props["clientid"])
            props.put("client.id", self.props["clientid"]);
        if (self.props["clientrackid"])
            props.put("client.rack.id", self.props["clientrackid"]);
        props.put("max.poll.records", STRING.valueOf(self.props["maxpollrecords"]));
        props.put("auto.offset.reset", self.props["autooffsetreset"]);
        props.put("isolation.level", self.props["isolationlevel"]);
        if (self.props["additional"] && self.props["additional"].length > 0) {
            for (var i=0;i<self.props["additional"].length;i++)
                props.put(self.props["additional"][i].name, self.props["additional"][i].value);
        }
        return props;
    }

    function topicList() {
        var list = new LIST();
        for (var i=0;i<self.props["topicnames"].length;i++)
            list.add(self.props["topicnames"][i]);
        return list;
    }
}