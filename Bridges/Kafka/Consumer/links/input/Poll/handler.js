function handler(timer) {
    var DURATION = Java.type("java.time.Duration");

    var records = this.consumer.poll(DURATION.ofMillis(this.props["polltimeout"]));
    for (var iter = records.iterator();iter.hasNext();) {
        var record = iter.next();
        var msg = stream.create().message().bytesMessage();
        if (record.key() !== null)
            msg.property("key").set(record.key());
        msg.body(record.value());
        this.executeOutputLink("Out", msg);
        this.consumer.commitSync();
    }
}