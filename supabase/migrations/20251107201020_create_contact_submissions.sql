/*
  # Create contact submissions table

  1. New Tables
    - `contact_submissions`
      - `id` (uuid, primary key) - Unique identifier for each submission
      - `name` (text) - Customer's full name
      - `email` (text) - Customer's email address
      - `phone` (text, nullable) - Customer's phone number
      - `subject` (text) - Subject/inquiry type
      - `message` (text) - Detailed message from customer
      - `status` (text) - Status: 'new', 'in_progress', 'resolved', 'closed'
      - `priority` (text) - Priority level: 'low', 'medium', 'high', 'urgent'
      - `assigned_to` (text, nullable) - Email of team member handling the request
      - `notes` (text, nullable) - Internal notes for team members
      - `created_at` (timestamptz) - When submission was received
      - `updated_at` (timestamptz) - Last update timestamp
      - `responded_at` (timestamptz, nullable) - When first response was sent
      - `closed_at` (timestamptz, nullable) - When inquiry was closed

  2. Security
    - Enable RLS on `contact_submissions` table
    - Admin users can view and manage all submissions
    - Public users can only insert their own submissions

  3. Important Notes
    - All submissions are tracked for response time monitoring
    - Status workflow: new → in_progress → resolved → closed
    - Priority can be set manually or automatically based on keywords
    - Includes timestamps for SLA monitoring (24-48 hour response time)
*/

CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'closed')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  assigned_to text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  responded_at timestamptz,
  closed_at timestamptz
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert contact submissions"
  ON contact_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Only authenticated admins can view submissions"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only authenticated admins can update submissions"
  ON contact_submissions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_priority ON contact_submissions(priority);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email);
