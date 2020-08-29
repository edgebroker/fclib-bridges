function handler() {
    var self = this;
    this.client = this.getInputReference("Connection")().getClient();
    var builder = this.client.newConsumer();
    builder.topics(topics());
    if (this.props["subscriptionname"])
        builder.subscriptionName(this.props["subscriptionname"]);
    this.consumer = builder.subscribe();

    enqueueReceive();

    var CONSUMER = Java.extend(Java.type("java.util.function.Consumer"), {
        accept: function (message) {
            var outMsg = stream.create().message().bytesMessage();
            outMsg.body(message.getData());
            self.executeOutputLink("Out", outMsg);
            self.consumer.acknowledge(message);
            enqueueReceive();
        }
    });

    var c = stream.async("java.util.function.Consumer", new CONSUMER());

    function enqueueReceive() {
        stream.executeCallback(function () {
            self.consumer.receiveAsync().thenAccept(c);
        }, null);

    }

    function topics() {
        var LIST = Java.type("java.util.ArrayList");
        var list = new LIST();
        for (var i = 0; i < self.props["topics"].length; i++) {
            list.add(self.props["topics"][i]);
        }
        return list;
    }

}