'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { QueueEntry } from '../types';

export const useQueue = (autoRefresh = false, initialQueue?: QueueEntry) => {
  const [queue, setQueue] = useState<QueueEntry | null>(initialQueue || null);
  const [loading, setLoading] = useState(!initialQueue);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  const fetchQueue = async () => {
    try {
      const { data, error } = await supabase
        .from('queue')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setQueue(data || { id: 'current', queue_number: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateQueue = async (newNumber: number) => {
    if (newNumber < 0) return;

    try {
      setLoading(true);
      
      // Create history entry
      await supabase
        .from('queue_history')
        .insert({
          queue_number: newNumber,
          action: queue ? (newNumber > queue.queue_number ? 'increment' : newNumber < queue.queue_number ? 'decrement' : 'reset') : 'reset'
        });

      // Update or create queue entry
      const { error } = await supabase
        .from('queue')
        .upsert({
          id: queue?.id || 'current',
          queue_number: newNumber,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        });

      if (error) throw error;

      await fetchQueue();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialQueue) {
      fetchQueue();
    }

    if (autoRefresh) {
      const interval = setInterval(fetchQueue, 30000); // 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh, initialQueue]);

  return {
    queue,
    loading,
    error,
    updateQueue,
    refetch: fetchQueue
  };
};