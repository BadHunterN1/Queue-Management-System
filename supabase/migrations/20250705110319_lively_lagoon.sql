/*
  # Queue Management System Database Schema

  1. New Tables
    - `queue`
      - `id` (text, primary key) - Unique identifier for queue entry
      - `queue_number` (integer) - Current number of people in queue
      - `created_at` (timestamptz) - When the queue was first created
      - `updated_at` (timestamptz) - When the queue was last updated
    
    - `queue_history`
      - `id` (uuid, primary key) - Unique identifier for history entry
      - `queue_number` (integer) - Queue number at time of action
      - `action` (text) - Type of action performed (increment, decrement, reset)
      - `created_at` (timestamptz) - When the action was performed

  2. Security
    - Enable RLS on both tables
    - Allow public read access to queue table for live display
    - Restrict write access to queue table for authenticated users only
    - Allow authenticated users to read and write queue_history

  3. Indexes
    - Index on queue_history created_at for efficient time-based queries
    - Index on queue_history action for filtering by action type
*/

-- Create queue table
CREATE TABLE IF NOT EXISTS queue (
  id text PRIMARY KEY DEFAULT 'current',
  queue_number integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create queue_history table
CREATE TABLE IF NOT EXISTS queue_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  queue_number integer NOT NULL,
  action text NOT NULL CHECK (action IN ('increment', 'decrement', 'reset')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE queue_history ENABLE ROW LEVEL SECURITY;

-- Queue policies - allow public read, authenticated write
CREATE POLICY "Allow public read access to queue"
  ON queue
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to update queue"
  ON queue
  FOR ALL
  TO authenticated
  USING (true);

-- Queue history policies - authenticated only
CREATE POLICY "Allow authenticated users to read queue history"
  ON queue_history
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert queue history"
  ON queue_history
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_queue_history_created_at ON queue_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_queue_history_action ON queue_history(action);

-- Insert initial queue entry
INSERT INTO queue (id, queue_number, created_at, updated_at)
VALUES ('current', 0, now(), now())
ON CONFLICT (id) DO NOTHING;