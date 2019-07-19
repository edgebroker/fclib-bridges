function handler() {
    var self = this;
    var JSSE = Java.type("com.swiftmq.net.JSSESocketFactory");
    var CTX = Java.type("com.swiftmq.amqp.AMQPContext");
    var CONNECTION = Java.type("com.swiftmq.amqp.v100.client.Connection");

    connect();
    this.setOutputReference("Connection", execRef);

    function connect(){
        var doAuth = this.props["saslenabled"];
       var anon = this.props["saslanonymous"];

       if (!doAuth || anon)
           self.connection = new CONNECTION(new CTX(CTX.CLIENT), self.props["hostname"], self.props["port"], doAuth);
       else {
           var username = self.props["saslusername"];
           var password = self.props["saslpassword"];
           if (!username)
               throw "sasl username must be set when using SASL";
           if (!password)
               throw "sasl password must be set when using SASL";
           self.connection = new CONNECTION(new CTX(CTX.CLIENT), self.props["hostname"], self.props["port"], username, password);
       }

       self.connection.setMechanism(self.props["saslmechanism"]);
       self.connection.setIdleTimeout(self.props["idletimeout"]);
       self.connection.setMaxFrameSize(self.props["maxframesize"]);
       var containerId = self.props["containerid"];
       if (containerId)
           self.connection.setContainerId(containerId);
       var openHostname = self.props["openhostname"];
       if (openHostname)
           self.connection.setOpenHostname(openHostname);
       var isTLS = self.props["istls"];
       if (isTLS)
           connection.setSocketFactory(new JSSE());
       self.connection.connect();
    }

    function execRef() {
        return self.connection;
    }
}