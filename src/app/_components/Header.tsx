"use client"; //クライアントサイドで実行

import Link from "next/link";
import React from "react";
import { useSupabaseSession } from "../_hooks/useSupabaseSession"; //カスタムフックをインポート
import { supabase } from "@/utils/supabase";

export const Header: React.FC = () => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/"
  }
  const { session, isLoading } = useSupabaseSession();

  return (
    <header className="bg-gray-800 text-white p-6 font-bold flex justify-between items-center">
      <Link href="/" className="header-link">
        Blog
      </Link>
      {!isLoading && (
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <Link href="/admin/posts" className="header-link">
                管理画面
              </Link>
              <button onClick={handleLogout}>ログアウト</button>
            </>
          ) : (
            <>
              <Link href="/contact" className="header-link">
                お問い合わせ
              </Link>
              <Link href="/login" className="header-link">
                ログイン
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
