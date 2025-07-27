"use client";

import React, { useState, useEffect } from "react";
import { Post } from "@/app/_types/Post";
import Link from "next/link";

export default function AdminPostsPage() {

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    setLoading(true);
    setError(null);

    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/admin/posts");
        if (res.ok) {
          const data = await res.json();
          setPosts(data.posts);
        } else {
          const errorData = await res.json();
          throw new Error(errorData.message || "記事の取得に失敗しました");
        }
      } catch (error: any) {
        setError(error.message || "記事の取得に失敗しました");
        console.error("記事の取得中にエラーが発生しました:", error);
      }
      finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, [])
  if (loading) { return <p>読み込み中...</p> }
  if (error) { return <p>エラー: {error}</p> }
  if (posts.length === 0) { return <p>記事が見つかりませんでした</p> }


  return (
    <div className="p-4">
      <div className="flex justify-between items-start mb-8">
        <h1 className="text-xl font-bold mb-8">記事一覧</h1>
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
