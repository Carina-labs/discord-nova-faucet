import Queue from "@supercharge/queue-datastructure";
import { Mutex } from "async-mutex";
import { logger } from "./logger.js";

export class SyncedQueue<T> {
  queue = new Queue<T>()
  mutex = new Mutex()

  enqueue(item: T) {
    this.mutex.runExclusive(() => {
      this.queue.enqueue(item)
    }).catch((err) => {
      logger.log({
        level: 'error',
        message: err,
      })
    })
  }

  async peek() {
    await this.mutex.acquire()
    const item = this.queue.peek()
    this.mutex.release()
    return item
  }

  async dequeue() {
    await this.mutex.acquire()
    this.queue.dequeue()
    this.mutex.release()
  }

  async getAll() {
    await this.mutex.acquire()
    const ret = this.queue.items()
    this.mutex.release()
    return ret
  }
}
