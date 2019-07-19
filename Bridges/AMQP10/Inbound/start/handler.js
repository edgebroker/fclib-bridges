function handler(){
    var self = this;
    var SESSION = Java.type("com.swiftmq.amqp.v100.client.Session");
    var CONSUMER = Java.type("com.swiftmq.amqp.v100.client.Consumer");
    this.connection = this.getInputReference("Connection")();

}