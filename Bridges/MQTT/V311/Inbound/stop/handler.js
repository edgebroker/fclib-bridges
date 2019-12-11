function handler(){
    try {
        this.client.unsubscribe(this.props["topicfilter"]);
    } catch (e) {
    }
}