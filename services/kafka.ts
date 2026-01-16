
import { TelemetryPoint } from '../types';

type MessageHandler = (message: TelemetryPoint) => void;

class KafkaBroker {
  private topics: Map<string, MessageHandler[]> = new Map();
  private offsets: Map<string, number> = new Map();

  subscribe(topic: string, handler: MessageHandler) {
    if (!this.topics.has(topic)) {
      this.topics.set(topic, []);
    }
    this.topics.get(topic)?.push(handler);
    return () => {
      const handlers = this.topics.get(topic) || [];
      this.topics.set(topic, handlers.filter(h => h !== handler));
    };
  }

  produce(topic: string, message: TelemetryPoint) {
    const currentOffset = this.offsets.get(topic) || 0;
    this.offsets.set(topic, currentOffset + 1);
    
    const handlers = this.topics.get(topic) || [];
    handlers.forEach(handler => handler(message));
  }
}

export const kafka = new KafkaBroker();
