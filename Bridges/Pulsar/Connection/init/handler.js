function handler() {
    var self = this;
    var AUTHFACTORY = Java.type("org.apache.pulsar.client.api.AuthenticationFactory");
    var CLIENT = Java.type("org.apache.pulsar.client.api.PulsarClient");

    this.setOutputReference("Connection", execRef);

    function connect() {
        try {
            var builder = CLIENT.builder().serviceUrl(self.props["serviceURL"]);
            if (self.props["authToken"]) {
                builder.authentication(AUTHFACTORY.token(self.props["authToken"]));
            }
            self.client = builder.build();
            stream.log().info("client="+self.client);
        } catch (e) {
            stream.getStreamCtx().logStackTrace(e);
        }
    }

    function execRef() {
        return self;
    }

    this.getClient = function () {
        if (!self.client)
            connect();
        return self.client;
    };
}