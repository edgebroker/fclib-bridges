function handler(In) {
    var self = this;
    var RM = Java.type("org.apache.pulsar.client.api.MessageRoutingMode");
    var CT = Java.type("org.apache.pulsar.client.api.CompressionType");
    var client = this.getInputReference("Connection")().getClient();
    try {
        var builder = client.newProducer();
        builder.topic(this.props["topicname"]);
        if (this.props["producername"])
            builder.producerName(this.props["producername"]);
        builder.messageRoutingMode(routingMode(this.props["routingmode"]));
        builder.compressionType(compressionType(this.props["compressiontype"]));
        this.producer = builder.create();
    } catch (e) {
        stream.getStreamCtx().logStackTrace(e);
    }

    function routingMode(prop) {
        switch (prop) {
            case "Round Robin":
                return RM.RoundRobinPartition;
            case "Single Partition":
                return RM.SinglePartition;
            case "Custom Partition":
                return RM.CustomPartition;
        }
    }

    function compressionType(prop) {
        switch (prop) {
            case "None":
                return CT.NONE;
            case "LZ4":
                return CT.LZ4;
            case "ZLIB":
                return CT.ZLIB;
            case "ZSTD":
                return CT.ZSTD;
            case "SNAPPY":
                return CT.SNAPPY;
        }
    }
}