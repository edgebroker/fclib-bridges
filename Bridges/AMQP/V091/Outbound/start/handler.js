function handler(){
    var self = this;
    this.channel = this.getInputReference("Connection")().getChannel();
    this.exchangeName = this.props["exchangename"];
    if (!this.exchangeName)
        this.exchangeName = "";
    this.exchangeType = this.props["exchangetype"];
    this.routingKey = this.props["routingkey"];
    if (!this.routingKey)
        this.routingKey = "";
    if (this.exchangeName.length() > 0)
        this.channel.exchangeDeclare(this.exchangeName, this.exchangeType);
}