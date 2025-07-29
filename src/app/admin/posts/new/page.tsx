"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Post } from "@/app/_types/Post";// Post型を使うためにインポート
import { Category } from "@/app/_types/Post"; // Category型もインポート！

export default function CreatePosts() {
  const router = useRouter();

  // --- フォームの入力値を管理
  const [newPostTitle, setNewPostTitle] = React.useState<string>('');
  const [newPostContent, setNewPostContent] = React.useState<string>("");
  const [newPostThumbnailUrl, setNewPostThumbnailUrl] = React.useState<string>("");
  // newPostCategories の型を { id: number }[] に。（バックエンドが { id: number }[] の形式の配列）
  const [newPostCategories, setNewPostCategories] = React.useState<{id:number}[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  // 利用可能なカテゴリーを保存するStateを追加
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  //availableCategories のローディングとエラーState (既存のloading/errorを使い回すことも可能だけど、ここでは明示的に)
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
  const [errorCategories, setErrorCategories] = useState<string | null>(null);

  //availableCategories を取得するための useEffect
  useEffect(() => {
    setLoadingCategories(true);
    setErrorCategories(null);

    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/admin/categories");// カテゴリー一覧APIから取得
        if (res.ok) {//  成功した場合 (200 OK)
        // サーバーが { status: "OK", categories: [...] } の形で返すので data.categories を使う
          const data = await res.json();
          setAvailableCategories(data.categories);// 取得したカテゴリーをStateにセット
        } else {
          const errorData = await res.json();
          throw new Error(errorData.message || "カテゴリーの取得に失敗しました");
        }
      } catch (error: any) {
        setErrorCategories(error.message || "カテゴリーの取得に失敗しました");
        console.error("カテゴリーの取得中にエラーが発生しました:", error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);// 初回ロード時のみ実行


  // --- フォーム送信処理 ---
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
        body: JSON.stringify({ title: newPostTitle, content: newPostContent, thumbnailUrl: newPostThumbnailUrl, categories: newPostCategories }),
      });
      // サーバーからの応答をまずJSONとして読み込む（成功でも失敗でも）
      const responseData = await res.json();
      // サーバーの応答の 'status' プロパティが "OK" かどうかで判断する
      if (responseData.status === "OK") {


        alert("記事が作成されました");
        // フォームをリセットする
        setNewPostTitle("");
        setNewPostContent("");
        setNewPostThumbnailUrl("");
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


  // --- 画面表示 ---
  if (loadingCategories) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold mb-8">新規記事作成</h1>
        <p>カテゴリーを読み込み中...</p>
      </div>
    );
  }
  if (errorCategories) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold mb-8">新規記事作成</h1>
        <p className="text-red-500">エラー: {errorCategories}</p>
      </div>
    );
  }

  // --- コンテンツ表示 ---
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
          name="categories"// バックエンドの期待する 'categories'
          className="border p-2 w-full rounded block mb-8"
          multiple
          // value には選択された option の value (ID) の配列を渡す
          value={newPostCategories.map(cat => cat.id.toString())} // 選択されたカテゴリーのIDを配列で保持
          onChange={(e) => {
            // 選択されたすべての <option> 要素を取得
            const selectedOptions = Array.from(e.target.selectedOptions);
            // 選択されたオプションの value (ID) を数値に変換し、{ id: 数値ID } のオブジェクトの配列を作成
            const newSelection = selectedOptions.map(option => ({ id: parseInt(option.value) }));
            setNewPostCategories(newSelection); // Stateを更新
          }}
        >
          <option value="">カテゴリーを選択してください</option>
          {availableCategories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-blue-700 text-white py-2 px-3 rounded font-bold"
          disabled={loading}
        >作成</button>
      </form>
      {loading && <p className="text-blue-600 mb-2">記事を作成中...</p>}
      {error && <p className="text-red-500 mb-2">エラー: {error}</p>}

    </div>
  );
}
