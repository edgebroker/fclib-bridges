function handler(In) {
    stream.log().info("Receiving: "+In);
    this.producer.send(In);
    stream.log().info("Message sent");

}