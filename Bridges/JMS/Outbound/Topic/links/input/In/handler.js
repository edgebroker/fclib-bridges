function handler(In) {
    this.producer.send(this.jmsconnection.toImpl(In));
}