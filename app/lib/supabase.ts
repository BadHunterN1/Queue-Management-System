import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Server component client
export const createServerClient = () => {
  return createServerComponentClient({ cookies });
};

// Client component client
export const createClient = () => {
  return createClientComponentClient();
};

// Legacy export for backward compatibility
export const supabase = createClientComponentClient();