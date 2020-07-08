function handler() {
    var self = this;
    var LISTENER = Java.extend(Java.type("org.eclipse.paho.client.mqttv3.IMqttMessageListener"), {
        messageArrived: function(topic, message) {
            self.executeOutputLink("Out", message);
        }
    });
    this.client = this.getInputReference("Connection")().getClient();
    this.client.subscribe(this.props["topicfilter"], qos(this.props["qos"]), stream.async("org.eclipse.paho.client.mqttv3.IMqttMessageListener", new LISTENER()));

    function qos(prop) {
        switch (prop) {
            case "At most once":
                return 0;
            case "At least once":
                return 1;
            case "Exactly once":
                return 2;
        }
    }

}