
import { useState, useEffect } from 'react';
import { kafka } from '../lib/kafka';
import { TelemetryPoint } from '../types/index';

export function useKafka(topic: string, initialData: TelemetryPoint[] = []) {
  const [messages, setMessages] = useState<TelemetryPoint[]>(initialData);

  useEffect(() => {
    const unsubscribe = kafka.subscribe(topic, (newMsg) => {
      setMessages(prev => [...prev.slice(-99), newMsg]);
    });
    return unsubscribe;
  }, [topic]);

  return messages;
}
