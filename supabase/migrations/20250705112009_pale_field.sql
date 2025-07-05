/*
  # Create queue management system tables

  1. New Tables
    - `queue`
      - `id` (text, primary key, default 'current')
      - `queue_number` (integer, default 0)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
    - `queue_history`
      - `id` (uuid, primary key)
      - `queue_number` (integer, not null)
      - `action` (text, not null, check constraint for valid actions)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on both tables
    - Allow public read access to queue table
    - Allow authenticated users full access to queue table
    - Allow authenticated users to read and insert queue history

  3. Indexes
    - Index on queue_history.action for filtering
    - Index on queue_history.created_at for ordering
*/

-- Create queue table
CREATE TABLE IF NOT EXISTS queue (
  id text PRIMARY KEY DEFAULT 'current'::text,
  queue_number integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create queue_history table
CREATE TABLE IF NOT EXISTS queue_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  queue_number integer NOT NULL,
  action text NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT queue_history_action_check CHECK (action = ANY (ARRAY['increment'::text, 'decrement'::text, 'reset'::text]))
);

-- Enable Row Level Security
ALTER TABLE queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE queue_history ENABLE ROW LEVEL SECURITY;

-- Create policies for queue table
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

-- Create policies for queue_history table
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_queue_history_action ON queue_history USING btree (action);
CREATE INDEX IF NOT EXISTS idx_queue_history_created_at ON queue_history USING btree (created_at DESC);

-- Insert initial queue entry if it doesn't exist
INSERT INTO queue (id, queue_number, created_at, updated_at)
VALUES ('current', 0, now(), now())
ON CONFLICT (id) DO NOTHING;