
import { TelemetryPoint } from '../types/index';

type MessageHandler = (message: TelemetryPoint) => void;

class KafkaBroker {
  private topics: Map<string, MessageHandler[]> = new Map();
  private history: Map<string, TelemetryPoint[]> = new Map();

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
    const handlers = this.topics.get(topic) || [];
    const logs = this.history.get(topic) || [];
    this.history.set(topic, [...logs.slice(-100), message]);
    handlers.forEach(handler => handler(message));
  }

  getHistory(topic: string) {
    return this.history.get(topic) || [];
  }
}

export const kafka = new KafkaBroker();
