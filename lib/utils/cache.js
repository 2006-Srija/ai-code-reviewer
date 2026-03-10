class Cache {
  constructor() {
    this.store = new Map();
  }

  set(key, value, ttl = 3600) {
    this.store.set(key, {
      value,
      expiry: Date.now() + (ttl * 1000)
    });
  }

  get(key) {
    const item = this.store.get(key);
    if (!item) return null;
    
    if (item.expiry < Date.now()) {
      this.store.delete(key);
      return null;
    }
    
    return item.value;
  }

  delete(key) {
    this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }

  stats() {
    return {
      size: this.store.size,
      keys: Array.from(this.store.keys())
    };
  }
}

export default new Cache();