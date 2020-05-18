function handler() {
    var self = this;
    var CLIENT = Java.type("org.apache.pulsar.client.api.PulsarClient");

    connect();
    this.setOutputReference("Connection", execRef);

    function connect() {
        self.client = CLIENT.builder().serviceUrl(self.props["serviceURL"]).build();
    }

    function execRef() {
        return self;
    }

    this.getClient = function () {
        return self.client;
    };
}