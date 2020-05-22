function handler(In) {
    var payload;
    switch (In.type()) {
        case "bytes":
            payload = In.body();
            break;
        case "text":
            payload = In.body().getBytes();
            break;
        case "map":
            payload = In.body().toJson().getBytes();
            break;
        default:
            throw "Invalid message type: "+In.type();
    }
    this.producer.send(payload);
}