class MockRedis {
    constructor() {
        this.store = new Map();
        this.lists = new Map();
        this.sets = new Map();
    }

    async setex(key, seconds, value) {
        this.store.set(key, value);
        return 'OK';
    }

    async get(key) {
        return this.store.get(key);
    }

    async del(...keys) {
        keys.forEach(key => this.store.delete(key));
        return keys.length;
    }

    async keys(pattern) {
        const regex = new RegExp(pattern.replace('*', '.*'));
        return Array.from(this.store.keys()).filter(key => regex.test(key));
    }

    async lpush(key, ...values) {
        if (!this.lists.has(key)) {
            this.lists.set(key, []);
        }
        this.lists.get(key).unshift(...values);
        return this.lists.get(key).length;
    }

    async lrange(key, start, stop) {
        if (!this.lists.has(key)) return [];
        const list = this.lists.get(key);
        return list.slice(start, stop === -1 ? undefined : stop + 1);
    }

    async smembers(key) {
        if (!this.sets.has(key)) return [];
        return Array.from(this.sets.get(key));
    }

    async sadd(key, ...members) {
        if (!this.sets.has(key)) {
            this.sets.set(key, new Set());
        }
        members.forEach(member => this.sets.get(key).add(member));
        return members.length;
    }

    async flushall() {
        this.store.clear();
        this.lists.clear();
        this.sets.clear();
        return 'OK';
    }

    async info(section) {
        return `# ${section}\nconnected_clients:1\nused_memory:1000000\n`;
    }
}

module.exports = new MockRedis(); 