function handler() {
    var self = this;
    var URI = Java.type("java.net.URI");
    var HTTP_CLIENT = Java.type("java.net.http.HttpClient");
    var HTTP_REQUEST = Java.type("java.net.http.HttpRequest");
    var HTTP_RESPONSE = Java.type("java.net.http.HttpResponse");
    var FLOW = Java.type("java.util.concurrent.Flow");

    var body = {
        ksql: this.props["query"],
        streamsProperties: {}
    };
    var sp = this.props["streamsprops"];
    var numProps = sp && sp.length || 0;
    if (numProps > 0) {
        sp.forEach(function (prop) {
            body.streamsProperties[prop["key"]] = prop["value"];
        });
    }
    this.client = HTTP_CLIENT.newBuilder().build();
    var request = HTTP_REQUEST.newBuilder()
                    .uri(URI.create(this.props["url"]+"/query"))
                    .version(HTTP_CLIENT.Version.HTTP_1_1)
                    .header("Content-Type", "application/vnd.ksql.v1+json; charset=utf-8")
                    .POST(HTTP_REQUEST.BodyPublishers.ofString(JSON.stringify(body)))
                    .build();
    var CALLBACK = Java.extend(Java.type("java.util.concurrent.Flow$Subscriber"), {
        onSubscribe: function(subscription) {
            self.subscription = subscription;
            self.subscription.request(1);
        },
        onNext: function(item) {
            if (item.length() > 0 && !item.startsWith("[")){
                if (item.endsWith(","))
                    item = item.substring(0, item.length()-1);
                var json = JSON.parse(item);
                if (json.row) {
                    var resultMsg = stream.create().message().message();
                    mapProps(resultMsg, json.row.columns);
                    self.executeOutputLink("Result", resultMsg);
                } else {
                    var msg = stream.create().message().textMessage();
                    msg.body(json.message);
                    self.executeOutputLink("Error", msg);
                }
            }
            self.subscription.request(1);
        },
        onError: function(throwable) {
            var msg = stream.create().message().textMessage();
            msg.body(throwable.cause().getMessage());
            self.executeOutputLink("Error", msg);
        },
        onComplete: function() {
            var msg = stream.create().message().textMessage();
            msg.body("Query stopped: Invalid query or a LIMIT in the query has been reached. Please check the query string on errors.");
            self.executeOutputLink("Error", msg);
        }
    });

    this.client.sendAsync(request, HTTP_RESPONSE.BodyHandlers.fromLineSubscriber(stream.async("java.util.concurrent.Flow$Subscriber", new CALLBACK())));

    function mapProps(msg, array) {
        var propMap = self.props["propmap"];
        var max = Math.min(propMap.length, array.length);
        for (var i=0;i<max;i++){
            msg.property(propMap[i]).set(array[i]);
        }
    }
}