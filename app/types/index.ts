export interface QueueEntry {
  id: string;
  queue_number: number;
  created_at: string;
  updated_at: string;
}

export interface QueueHistory {
  id: string;
  queue_number: number;
  action: 'increment' | 'decrement' | 'reset';
  created_at: string;
}

export interface User {
  id: string;
  email: string;
}