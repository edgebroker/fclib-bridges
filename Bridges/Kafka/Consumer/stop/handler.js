function handler() {
    this.consumer.unsubscribe();
    this.consumer.close();
}