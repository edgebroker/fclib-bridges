function handler(In) {
    var client = this.getInputReference("Connection")().getClient();

    client.publish(this.props["topicname"], In.getPayload(), qos(this.props["qos"]), this.props["retain"]);
    
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