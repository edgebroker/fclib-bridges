function handler(){
    try {
        this.producer.close();
        this.session.close();
    } catch (e) {
    }
}