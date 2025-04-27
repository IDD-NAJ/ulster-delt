class MockEmail {
    constructor() {
        this.sentEmails = [];
    }

    async sendEmail({ email, subject, message }) {
        this.sentEmails.push({
            email,
            subject,
            message,
            timestamp: new Date()
        });
        return { success: true };
    }

    getSentEmails() {
        return this.sentEmails;
    }

    clearSentEmails() {
        this.sentEmails = [];
    }
}

module.exports = new MockEmail(); 