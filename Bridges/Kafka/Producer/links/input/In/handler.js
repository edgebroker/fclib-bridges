function handler(In) {
    var RECORD = Java.type("org.apache.kafka.clients.producer.ProducerRecord");

    if (!this.assertProperty(In,this.props["keyproperty"]))
        return;

    var value;
    switch (In.type()) {
        case "bytes":
            value = In.body();
            break;
        case "text":
            value = In.body().getBytes();
            break;
        default:
            throw "Incoming message is neither of type BytesMessage nor of type TextMessage!";
    }
    this.producer.send(new RECORD(this.props["topicname"], In.property(this.props["keyproperty"]).value().toString(), value));
}