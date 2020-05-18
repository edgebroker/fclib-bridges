function handler() {
    var self = this;
    this.client = this.getInputReference("Connection")().getClient();
    var builder = this.client.newConsumer();
    builder.topics(topics());
    if (this.props["subscriptionname"])
        builder.subscriptionName(this.props["subscriptionname"]);
    this.consumer = builder.subscribe();

    this.consumer.receiveAsync().thenAccept(process);

    function process(message) {
        stream.executeCallback(function(msg) {
            var outMsg = stream.create().message().bytesMessage();
            outMsg.body(msg.getData());
            self.executeOutputLink("Out", outMsg);
            self.consumer.acknowledge(msg);
            self.consumer.receiveAsync().thenAccept(process);
        }, message);

    }

    function topics() {
        var LIST = Java.type("java.util.ArrayList");
        var list = new LIST();
        for (var i=0;i<self.props["topics"].length;i++) {
           list.add(self.props["topics"][i]);
        }
        return list;
    }

}