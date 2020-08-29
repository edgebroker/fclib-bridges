function handler() {
    if (this.subscription)
        this.subscription.cancel();
}