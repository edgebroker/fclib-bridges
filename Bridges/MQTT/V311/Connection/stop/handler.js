function handler() {
    try {
        this.client.disconnect();
    } catch (e) {
    }
    try {
        this.client.close();
    } catch (e) {
    }
}