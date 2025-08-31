// src/app/admin/posts/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import { GetPostsResponse, Post } from "@/app/_types";
import Link from "next/link";
import {useSupabaseSession} from "@/app/_hooks/useSupabaseSession";

export default function AdminPostsPage() {

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useSupabaseSession(); // カスタムフックからtokenを取得


  useEffect(() => {
    // tokenがまだ取得できていない場合は、APIリクエストを実行しない
    if (!token) {
      // ローディング状態だけを更新し、処理を中断
      setLoading(false);
      return;
    }

    const fetchPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/admin/posts", {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token, // 👈 Header に token を付与
          },
        });

        if (res.ok) {
          // { posts: Post[] }からより具体的に修正
          const data: GetPostsResponse  = await res.json();
          setPosts(data.posts);
        } else {
          const errorData = await res.json();
          throw new Error(errorData.status || "記事の取得に失敗しました");
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("予期せぬエラーが発生しました");
        }
        console.error("記事の取得中にエラーが発生しました:", error);
      }
      finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, [token])
  if (loading) { return <p>読み込み中...</p> }
  if (error) { return <p>エラー: {error}</p> }
  if (posts.length === 0) { return <p>記事が見つかりませんでした</p> }


  return (
    <div className="p-4">
      <div className="flex justify-between items-start mb-8">
        <h1 className="text-2xl font-bold mb-8">記事一覧</h1>
        <Link href="/admin/posts/new" className="p-3 bg-[#f26c00d6] rounded-lg py-2 px-5 font-bold text-white">新規作成</Link>
      </div>
      <div>
        {posts.length === 0 ? (
          <p>記事が見つかりませんでした</p>
        ) : (
          <ul>
            {posts.map((post) => (
              <li key={post.id}>
                <Link href={`/admin/posts/${post.id}`} className="block hover:bg-[#ccdee7] p-5 border-b border-gray-200">
                  <h2 className="font-bold text-xl">{post.title}</h2>
                  <p className="text-gray-600">{post.content.substring(0, 100)}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
