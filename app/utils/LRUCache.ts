export class LRUCacheNode {
  constructor(key: any, value: any) {
    this.key = key;
    this.value = value;
    this.next = null;
    this.prev = null;
  }
  key: any;
  value: any;
  next: LRUCacheNode | null;
  prev: LRUCacheNode | null;
}

export class LRUCache {
  capacity: number;
  cache: Map<any, LRUCacheNode>;
  head: LRUCacheNode;
  tail: LRUCacheNode;

  get(key: any): any {
    if (this.cache.has(key)) {
      console.log("HIT!", this);
      const node = this.cache.get(key);
      node && this.remove(node);
      node && this.moveToHead(node);
      return node?.value;
    }
  }
  remove(node: LRUCacheNode) {
    try {
      if (!node.prev) {
        return;
      }
      if (!node.next) {
        node.prev.next = null;
        return;
      }
      node.prev.next = node.next;
      node.next.prev = node.prev;
    } catch (error) {
      throw error;
    }
  }
  moveToHead(node: LRUCacheNode) {
    if (this.head.next) {
      this.head.next.prev = node;
      node.next = this.head.next;
    } else {
      node.next = this.tail;
      this.tail.prev = node;
    }
    node.prev = this.head;
    this.head.next = node;
  }
  set(key: any, value: any) {
    if (this.cache.has(key)) {
      const node = this.cache.get(key);
      node && this.remove(node);
      node && this.moveToHead(node);
      node && (node.value = value);
    } else {
      const node = new LRUCacheNode(key, value);
      this.cache.set(key, node);
      this.moveToHead(node);
      if (this.cache.size > this.capacity) {
        const tail = this.tail.prev;
        tail && this.remove(tail);
        tail && this.cache.delete(tail.key);
      }
    }
  }
  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map();
    this.head = new LRUCacheNode(null, null);
    this.tail = new LRUCacheNode(null, null);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }
}
