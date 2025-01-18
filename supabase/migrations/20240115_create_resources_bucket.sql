INSERT INTO storage.buckets (id, name, public)
VALUES ('resources', 'resources', true);

-- Set up storage policy to allow authenticated uploads
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'resources');

-- Allow public downloads
CREATE POLICY "Allow public downloads"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'resources');