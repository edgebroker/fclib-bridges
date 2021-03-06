function handler() {
    var self = this;
    var CLIENT = Java.type("org.eclipse.paho.client.mqttv3.MqttClient");
    var OPTIONS = Java.type("org.eclipse.paho.client.mqttv3.MqttConnectOptions");
    var PERSISTENCE = Java.type("org.eclipse.paho.client.mqttv3.persist.MemoryPersistence");

    connect();
    this.setOutputReference("Connection", execRef);

    function connect() {
        self.client = new CLIENT(self.props["url"], self.props["clientid"], new PERSISTENCE());
        var options = new OPTIONS();
        if (self.props["autoreconnect"])
            options.setAutomaticReconnect(self.props["autoreconnect"]);
        if (self.props["cleansession"])
            options.setCleanSession(self.props["clientsession"]);
        if (self.props["keepaliveinterval"])
            options.setKeepAliveInterval(typeconvert.toInteger(self.props["keepaliveinterval"]));
        if (self.props["username"])
            options.setUserName(self.props["username"]);
        if (self.props["password"])
            options.setPassword(self.props["password"].toCharArray());
        options.setConnectionTimeout(typeconvert.toInteger(0));
        self.client.connect(options);
    }

    function execRef() {
        return self;
    }

    this.getClient = function () {
        return self.client;
    };
}