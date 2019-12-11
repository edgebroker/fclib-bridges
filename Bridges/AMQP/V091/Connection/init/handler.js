function handler() {
    var self = this;
    var CF = Java.type("com.rabbitmq.client.ConnectionFactory");

    connect();
    this.setOutputReference("Connection", execRef);

    function connect() {
        var cfconn = new CF();
        cfconn.setUri(self.props["uri"]);
        self.connection = cfconn.newConnection();

        // Create Channel
        self.channel = self.connection.createChannel();
    }

    function execRef() {
        return self;
    };

    this.getConnection = function() {
        return self.connection;
    };

    this.getChannel = function() {
        return self.channel;
    };
}