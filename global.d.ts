declare module "@supabase/ssr" {
  import { SupabaseClient } from "@supabase/supabase-js";

  export function createBrowserClient(
    supabaseUrl: string,
    supabaseKey: string
  ): SupabaseClient<any, "public", any>;

  export function createServerClient(
    supabaseUrl: string,
    supabaseKey: string,
    opts?: any
  ): SupabaseClient<any, "public", any>;
}
