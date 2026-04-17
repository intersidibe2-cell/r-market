import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kwotomcxflbykhghxvfy.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3b3RvbWN4ZmxieWtoZ2h4dmZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NzY1NTcsImV4cCI6MjA5MDA1MjU1N30.gwgAcEn3kDSmv8qN8qDTflq2TaNPF4uIiCxbuj9u1Sc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)