class MockSlack {
    constructor() {
        this.messages = [];
    }

    async sendMessage(message) {
        this.messages.push(message);
        return { ok: true };
    }

    getMessages() {
        return this.messages;
    }

    clearMessages() {
        this.messages = [];
    }
}

module.exports = new MockSlack(); 