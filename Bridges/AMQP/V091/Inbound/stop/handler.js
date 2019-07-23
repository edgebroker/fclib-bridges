function handler(){
    try {
        this.consumer.close();
        this.session.close();
    } catch (e) {
    }
}