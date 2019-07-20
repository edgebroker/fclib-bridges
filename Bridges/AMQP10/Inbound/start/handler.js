function handler() {
    var self = this;
    var QOS = Java.type("com.swiftmq.amqp.v100.client.QoS");
    var AMQPMSG = Java.type("com.swiftmq.amqp.v100.messaging.AMQPMessage");
    this.session = this.getInputReference("Connection")().getSession();

    this.QoS = qos(this.props["qos"]);
    this.selector = this.props["selector"] ? this.props["selector"] : null;
    this.consumer = this.session.createConsumer(this.props["sourceaddress"], this.props["linkcredit"], this.QoS, this.props["nolocal"], this.selector);

    // Initiate polling
    poll();

    function qos(prop) {
        switch (prop) {
            case "At most once":
                return QOS.AT_MOST_ONCE;
            case "At least once":
                return QOS.AT_LEAST_ONCE;
            case "Exactly once":
                return QOS.EXACTLY_ONCE;
        }
    }

    function copyMessage(source) {
        var target = new AMQPMSG();
        target.setMessageAnnotations(source.getMessageAnnotations());
        target.setApplicationProperties(source.getApplicationProperties());
        target.setDeliveryAnnotations(source.getDeliveryAnnotations());
        target.setProperties(source.getProperties());
        target.setFooter(source.getFooter());
        var i, l;
        if (source.getAmqpValue() !== null)
            target.setAmqpValue(source.getAmqpValue());
        else if (source.getAmqpSequence() !== null) {
            l = source.getAmqpSequence();
            for (i = 0; i < l.size(); i++)
                target.addAmqpSequence(l.get(i));
        } else if (source.getData() !== null) {
            l = source.getData();
            for (i = 0; i < l.size(); i++)
                target.addData(l.get(i));
        }
        return target;
    }

    function messageAvail(consumer) {
        poll();
    }

    function poll() {
        stream.executeCallback(function () {
            var amqpMsg = self.consumer.receiveNoWait(messageAvail);
            if (amqpMsg !== null) {
                self.executeOutputLink("Out", copyMessage(amqpMsg));
                if (!amqpMsg.isSettled()) {
                    amqpMsg.accept();
                }
                poll();
            }
        }, null);
    }
}