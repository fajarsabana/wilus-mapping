const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://jqueqchgsazhompvfifr.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxdWVxY2hnc2F6aG9tcHZmaWZyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDk3MzkwMiwiZXhwIjoyMDU2NTQ5OTAyfQ.7ZjSzjdlpRNObS78AU3oUZPaEzKZRUXD0hU0dUYlsx4";
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase };
