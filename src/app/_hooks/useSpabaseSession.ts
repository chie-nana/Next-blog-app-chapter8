import { supabase } from "@/utils/supabase";
import { Session } from "@supabase/supabase-js";
import { useState, useEffect } from "react";

export const useSpabaseSession = () => {
  // undefind: ログイン状態ロード中, null: ログインしていない, Session: ログインしている
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetcher = async () => {
      const { data: { session }, } = await supabase.auth.getSession();
      setSession(session);
      setToken(session?.access_token || null);
      setIsLoading(false);
    }
    fetcher();
  }, [])

  return { session, token, isLoading }
}
