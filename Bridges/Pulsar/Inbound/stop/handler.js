function handler(){
    try {
        if (this.consumer)
            this.consumer.unsubscribe();
    } catch (e) {
    }
}