function handler(In) {
    var self = this;
    var urlProp = this.props["url"];
    if (!urlProp.endsWith("/ksql"))
        urlProp += "/ksql";
    var statementProp = this.props["statement"];
    var timeoutSeconds = this.props["request_timeout"];

    var body = {
        "ksql": statementProp,
        "streamsProperties": {}
    };
    var endpoint = urlProp;
    stream.log().info(endpoint);
    var URL = Java.type("java.net.URL");
    var getUrl = new URL(endpoint);

    var con = getUrl.openConnection();
    con.setRequestMethod("POST");

    if (this.props["username"] && this.props["password"]) {
        var authorization = basicAuthHeaderValue();
        for (var key in authorization) {
            var value = authorization[key];
            con.setRequestProperty(key, value);
        }
    }
    var streamsprops = this.props["streamsprops"];
    var numProps = streamsprops && streamsprops.length || 0;
    if (numProps > 0) {
        streamsprops.forEach(function (prop) {
            body.streamsProperties[prop["key"]] = prop["value"];
        });
    }

    con.setRequestProperty("Content-Type", this.props["contenttype"]);

    con.setConnectTimeout(timeoutSeconds * 1000 / 2);
    con.setReadTimeout(timeoutSeconds * 1000 / 2);

    con.setDoOutput(true);

    var outputStream = con.getOutputStream();
    var inputBytes = JSON.stringify(body).getBytes("utf-8");
    outputStream.write(inputBytes, 0, inputBytes.length);

    var status = con.getResponseCode();

    var InputStreamReader = Java.type("java.io.InputStreamReader");
    var streamReader;

    if (status > 299) {
        streamReader = new InputStreamReader(con.getErrorStream());
    } else {
        streamReader = new InputStreamReader(con.getInputStream());
    }

    var BufferedReader = Java.type("java.io.BufferedReader");
    var inReader = new BufferedReader(streamReader);
    var inputLine;
    var StringBuffer = Java.type("java.lang.StringBuffer");
    var content = new StringBuffer();
    while ((inputLine = inReader.readLine()) != null) {
        content.append(inputLine);
    }
    inReader.close();
    con.disconnect();

    var response = content.toString();

    if (status > 299) {
        throw status+"/"+response;
    } else {
        var json = JSON.parse(response);
        if (json.error_code)
            throw "Errorcode: " + json.error_code + ", Message: " + json.message;
    }

    function basicAuthHeaderValue() {
            var credentials = self.props["username"] + ":" + self.props["password"];
            var Base64 = Java.type("java.util.Base64");

            return {
                "Authorization": "Basic " + Base64.getEncoder().encodeToString(credentials.getBytes())
            };
        }
}
