function handler(){
    try {
        if (this.producer)
            this.producer.close();
    } catch (e) {
    }
}