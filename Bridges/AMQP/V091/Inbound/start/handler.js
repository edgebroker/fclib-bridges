function handler() {
    var self = this;
    try {
        var DEFAULTCONSUMER = Java.type("com.rabbitmq.client.DefaultConsumer");

        this.channel = this.getInputReference("Connection")().getChannel();
        this.exchangeName = this.props["exchangename"];
        if (!this.exchangeName)
            this.exchangeName = "";
        this.exchangeType = this.props["exchangetype"];
        this.consumerTag = this.props["consumertag"];
        if (!this.consumerTag)
            this.consumerTag = "";
        this.routingKey = this.props["routingkey"];
        if (!this.routingKey)
            this.routingKey = "";

        if (this.exchangeName.length() > 0)
            this.channel.exchangeDeclare(this.exchangeName, this.exchangeType);
        if (this.props["queuename"])
            this.declareOk = this.channel.queueDeclare(this.props["queuename"], this.props["durable"], this.props["exclusive"], this.props["autodelete"], null);
        else
            this.declareOk = this.channel.queueDeclare();
        if (this.exchangeName.length() > 0)
            this.channel.queueBind(this.declareOk.getQueue(), this.exchangeName, this.routingKey);

        var MYCONSUMER = Java.extend(DEFAULTCONSUMER, {
            handleDelivery: function (consumerTag, envelope, properties, body) {
                self.executeOutputLink("Out", {properties: properties, body: body});
                self.channel.basicAck(envelope.getDeliveryTag(), true);
            }
        });

        this.channel.basicConsume(this.declareOk.getQueue(), false, this.consumerTag, stream.async("com.rabbitmq.client.Consumer", new MYCONSUMER(this.channel)));
    } catch (e) {
        e.printStackTrace();
        throw e;
    }

}