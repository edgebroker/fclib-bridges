function handler() {
    var self = this;
    var VERTX = Java.type("io.vertx.core.Vertx");
    var WEB_CLIENT = Java.type("io.vertx.ext.web.client.WebClient");
    var JSON_OBJECT = Java.type("io.vertx.core.json.JsonObject");
    var JSON_PARSER = Java.type("io.vertx.core.parsetools.JsonParser");
    var BODY_CODEC = Java.type("io.vertx.ext.web.codec.BodyCodec");

    var body = new JSON_OBJECT();
    body.put("ksql", this.props["query"]);
    var streamsProps = new JSON_OBJECT();
    body.put("streamsProperties", streamsProps);
    var sp = this.props["streamsprops"];
    var numProps = sp && sp.length || 0;
    if (numProps > 0) {
        sp.forEach(function (prop) {
            streamsProps.put(prop["key"], prop["value"]);
        });
    }
    this.webClient = WEB_CLIENT.create(VERTX.vertx());
    var parser = JSON_PARSER.newParser().objectValueMode();
    parser.handler(function(evt){
        var object = evt.objectValue();
        if (object.getJsonObject("row") !== null){
            var resultMsg = stream.create().message().message();
            mapProps(resultMsg, object.getJsonObject("row").getJsonArray("columns"));
            stream.executeCallback(function(outMsg){
               self.executeOutputLink("Result", outMsg);
            }, resultMsg);
        } else {
            var msg = stream.create().message().textMessage();
            msg.body(object.getString("message"));
            stream.executeCallback(function(outMsg){
               self.executeOutputLink("Error", outMsg);
            }, msg);
        }
    });

    if (this.props["username"] && this.props["password"]) {
        this.webClient
            .post(this.props["port"], this.props["host"], "/query")
            .basicAuthentication(this.props["username"], this.props["password"])
            .as(BODY_CODEC.jsonStream(parser))
            .sendJsonObject(body, asyncResult);
    } else {
        this.webClient
            .post(this.props["port"], this.props["host"], "/query")
            .as(BODY_CODEC.jsonStream(parser))
            .sendJsonObject(body, asyncResult);
    }

    function asyncResult(ar) {
        if (!ar.succeeded()){
            var msg = stream.create().message().textMessage();
            msg.body(ar.cause().getMessage());
            stream.executeCallback(function(outMsg){
               self.executeOutputLink("Error", outMsg);
            }, msg);
        }
    }

    function mapProps(msg, array) {
        var propMap = self.props["propmap"];
        var max = Math.min(propMap.length, array.size());
        for (var i=0;i<max;i++){
            msg.property(propMap[i]).set(array.getValue(i));
        }
    }
}