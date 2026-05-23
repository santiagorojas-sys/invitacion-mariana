import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = "https://wnrtwjercdwctlnnxsbh.supabase.co"
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InducnR3amVyY2R3Y3Rsbm54c2JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1MDI4NzIsImV4cCI6MjA5NTA3ODg3Mn0.DpgOgsjsAkr0O06MsFt8zVydeGZ6wKU4KXiU6a4NwFU"

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON)