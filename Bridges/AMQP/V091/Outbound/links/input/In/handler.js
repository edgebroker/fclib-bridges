function handler(In) {
    var channel = this.getInputReference("Connection")().getChannel();
    channel.basicPublish(this.exchangeName, this.routingKey, In.properties, In.body)
}