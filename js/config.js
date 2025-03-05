// config.js
const supabaseUrl = "https://jqueqchgsazhompvfifr.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxdWVxY2hnc2F6aG9tcHZmaWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5NzM5MDIsImV4cCI6MjA1NjU0OTkwMn0.8q1m-jIL4kRgck4pwDfOYFHgFMSg2BIfBSTgIWBc_PE";
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

export { supabase };
