// src/app/admin/posts/new/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Post } from "@/app/_types";// Post型を使うためにインポート
import { Category } from "@/app/_types"; // Category型もインポート
import PostForm from "../_components/PostForm"; // PostForm コンポーネントをインポート
import { CreatePostRequestBody } from "@/app/_types";

export default function CreatePosts() {
  const router = useRouter();

  // --- フォームの入力値を管理
  const [post, setPost] = useState<Post | null>(null);
  // const [newPostTitle, setNewPostTitle] = React.useState<string>('');
  // const [newPostContent, setNewPostContent] = React.useState<string>("");
  // const [newPostThumbnailUrl, setNewPostThumbnailUrl] = React.useState<string>("");
  // newPostCategories の型を { id: number }[] に。（バックエンドが { id: number }[] の形式の配列）
  const [newPostCategories, setNewPostCategories] = React.useState<{ id: number }[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);


  // --- フォーム送信処理 ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!post) return;

    try {

      const dataToSend: CreatePostRequestBody = {
        title: post.title,
        content: post.content,
        thumbnailUrl: post.thumbnailUrl,
        categories: newPostCategories,
      };

      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: {
          'Content-Type': "application/json",
        },
        body: JSON.stringify(dataToSend),
      });
      // サーバーからの応答をまずJSONとして読み込む（成功でも失敗でも）
      const responseData = await res.json();
      // サーバーの応答の 'status' プロパティが "OK" かどうかで判断する
      if (responseData.status === "OK") {


        alert("記事が作成されました");
        // フォームをリセットする
        setPost(null);
        setNewPostCategories([]);
        router.push("/admin/posts");// 記事一覧ページへリダイレクト
      } else {// サーバーからの応答が "OK" でない場合、エラーとして扱う
        throw new Error(responseData.message || '記事の作成に失敗しました。');
      }
    } catch (error: any) {
      setError(`記事の作成中にエラーが発生しました: ${error.message || '不明なエラー'}`);
      console.error("記事の作成中にエラーが発生しました:", error);
    } finally {
      setLoading(false);// ローディング状態を解除
    }
  };
  if (!post) return;

  // --- コンテンツ表示 ---
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-8">新規記事作成</h1>
      {/* PostForm コンポーネントを利用してフォームを表示 */}
      <PostForm
        post={post}
        setPost={setPost}
        // title={newPostTitle}
        // setTitle={setNewPostTitle}
        // content={newPostContent}
        // setContent={setNewPostContent}
        // thumbnailUrl={newPostThumbnailUrl}
        // setThumbnailUrl={setNewPostThumbnailUrl}
        categories={newPostCategories}
        setCategories={setNewPostCategories}
        onSubmit={handleSubmit}
        loading={loading}
        mode="new" // 新規作成モード
      />
      {loading && <p className="text-blue-600 mb-2">記事を作成中...</p>}
      {error && <p className="text-red-500 mb-2">エラー: {error}</p>}

    </div>
  );
}
