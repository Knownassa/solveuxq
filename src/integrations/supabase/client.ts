// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://drgjgkroprkycxdjuknr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyZ2pna3JvcHJreWN4ZGp1a25yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyODE5NTksImV4cCI6MjA1ODg1Nzk1OX0.wCHCSFbQu4xxOUY_xQcLgMUShX4oj8jSuAt8ha9HzjI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);