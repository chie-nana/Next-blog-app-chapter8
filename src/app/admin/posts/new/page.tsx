"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Post } from "@/app/_types/Post";// Post型を使うためにインポート

export default function CreatePosts() {
  const router = useRouter();
  const [newPostTitle, setNewPostTitle] = React.useState<string>('');
  const [newPostContent, setNewPostContent] = React.useState<string>("");
  const [newPostThumbnailUrl, setNewPostThumbnailUrl] = React.useState<string>("");
  const [newPostCategories, setNewPostCategories] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: {
          ContentType: "application/json",
        },
        body: JSON.stringify({ name: newPostTitle, content: newPostContent, thumbnailUrl: newPostThumbnailUrl, categories: newPostCategories }),
      });
      if (res.ok) {
        alert("記事が作成されました");
        setNewPostTitle("");
        setNewPostContent("");
        setNewPostThumbnailUrl("");
        setNewPostCategories([]);
        router.push("/admin/posts");
      } else {
        alert(`記事の作成に失敗しました`);
      }
    } catch (error: any) {
      setError("記事の作成に失敗しました");
      console.error("記事の作成中にエラーが発生しました:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-8">新規記事作成</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="postTitle" className="block">タイトル</label>
        <input
          id="postTitle"//htmlForと一致させる
          className="border p-2 w-full rounded block mb-4"
          type="text"
          name="title"
          value={newPostTitle}
          onChange={(e) => { setNewPostTitle(e.target.value) }}//入力値を更新
        />

        <label htmlFor="content" className="block">内容</label>
        <textarea
          id="content"
          name="content"
          className="border p-2 w-full rounded block mb-4"
          rows={10}
          value={newPostContent}
          onChange={(e) => { setNewPostContent(e.target.value) }}
        ></textarea>

        <label htmlFor="thumbnailUrl" className="block">サムネイルURL</label>
        <input
          id="thumbnailUrl"
          name="thumbnailUrl"
          type="text"
          className="border p-2 w-full rounded block mb-4"
          value={newPostThumbnailUrl}
          onChange={(e) => { setNewPostThumbnailUrl(e.target.value) }}
        />

        <label htmlFor="postCategories" className="block">カテゴリー</label>
        <select
          id="postCategories"
          name="categories"
          className="border p-2 w-full rounded block mb-8"
          value={newPostCategories}
        // onChange={(e) => { setNewPostCategories(e.target.value) }}
        />

        <button
          type="submit"
          className="bg-blue-700 text-white py-2 px-3 rounded font-bold"
          disabled={loading}
        >作成</button>
      </form>

    </div>
  )
}
