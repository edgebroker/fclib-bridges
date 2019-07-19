function handler(){
    try {
        this.consumer.setMessageListener(null);
        this.consumer.close();
        this.session.close();
    } catch (e) {
    }
}