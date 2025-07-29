"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Post } from "@/app/_types/Post"; // Post型を使うために
import { Category } from "@/app/_types/Post"; // Category型もインポート！

export default function EditPosts({ params }: { params: { id: string } }) { //  URLパラメータを受け取る
  const { id } = params; // URLから記事のIDを取得 (ここで定義されている)

  const router = useRouter();

  const [editPostTitle, setEditPostTitle] = useState<string>('');
  const [editPostContent, setEditPostContent] = useState<string>('');
  const [editPostThumbnailUrl, setEditPostThumbnailUrl] = useState<string>('');
  const [editPostCategories, setEditPostCategories] = useState<{ id: number }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 利用可能なカテゴリーを保存するStateを追加
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  //availableCategories のローディングとエラーState (既存のloading/errorを使い回すことも可能だけど、ここでは明示的に)
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
  const [errorCategories, setErrorCategories] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/admin/posts/${id}`);

        if (res.ok) {
          const data = await res.json(); // 成功時のみJSONを読み込む
          if (data.post) { // data.post が存在するか安全にチェック
            setEditPostTitle(data.post.title);
            setEditPostContent(data.post.content);
            setEditPostThumbnailUrl(data.post.thumbnailUrl);
            // カテゴリーデータもセット (バックエンドのPost型に合わせて変換)
            const initialCategories = data.post.postCategories.map((pc: any) => ({ id: pc.category.id }));
            setEditPostCategories(data.post.categories);
          } else {
            const errorData = await res.json();
            throw new Error(errorData.message || "記事の取得に失敗しました");
          }
        } else {  // レスポンスが失敗した場合
          const errorData = await res.json();
          throw new Error(errorData.message || "記事の取得に失敗しました");
        }
      } catch (error: any) {
        setError(error.message || "記事の取得に失敗しました");
        console.error("記事の取得中にエラーが発生しました:", error);
      } finally {
        setLoading(false);
      }
    };
    // 利用可能なカテゴリーの取得処理もここで行う (これはそのまま)
    setLoadingCategories(true);
    setErrorCategories(null);

    const fetchAvailableCategories = async () => {
      try {
        const res = await fetch("/api/admin/categories");
        const data = await res.json();

        if (res.ok) {
          setAvailableCategories(data.categories);
        } else {
          throw new Error(data.message || '利用可能なカテゴリーの取得に失敗しました');
        }
      } catch (error: any) {
        setErrorCategories(error.message || '利用可能なカテゴリーの取得中にエラーが発生しました');
        console.error("カテゴリー一覧取得エラー:", error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchPost();// 記事データを取得する関数を実行
    fetchAvailableCategories(); // 利用可能なカテゴリーをロードする関数も実行
  }, [id]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-8">記事編集ページ</h1>
      <form>
        <label htmlFor="postTitle" className="block">タイトル</label>
        <input
          id="postTitle"
          className="border rounded w-full p-2"
          type="text"
          name="title"
          value={editPostTitle}
          onChange={(e) => { setEditPostTitle(e.target.value) }}
        />

        <label htmlFor="postContent" className="block">内容</label>
        <input
          id="postContent"
          className="border rounded w-full p-2"
          type="text"
          name="content"
          value={editPostContent}
          onChange={(e) => { setEditPostContent(e.target.value) }}
        />

        <label htmlFor="postThumbnailUrl" className="block">サムネイルURL</label>
        <input
          id="postThumbnailUrl"
          className="border rounded w-full p-2"
          type="text"
          name="thumbnailUrl"
          value={editPostThumbnailUrl}
          onChange={(e) => (setEditPostThumbnailUrl(e.target.value))}
        />

        <label htmlFor="postCategories" className="block">カテゴリー</label>
        <select
          id="postCategories"
          className="border rounded w-full p-2"
          name="categories"
          multiple
          // value={newPostCategories.map(cat => cat.id.toString())} // 選択されたカテゴリーのIDを配列で保持
          onChange={(e) => {
            // 選択されたすべての <option> 要素を取得
            const selectedOptions = Array.from(e.target.selectedOptions);
            // 選択されたオプションの value (ID) を数値に変換し、{ id: 数値ID } のオブジェクトの配列を作成
            const newSelection = selectedOptions.map(option => ({ id: parseInt(option.value) }));
            setEditPostCategories(newSelection); // Stateを更新
          }}
        >
          <option value="">カテゴリーを選択してください</option>
          {availableCategories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-blue-700 text-white py-2 px-3 rounded font-bold mt-4"
          disabled={loading} // 送信中はボタンを無効化
        >更新</button>
      </form>
      <Link href="/admin/posts" className="mt-4 inline-block p-3 bg-[#f26c00d6] rounded-lg py-2 px-5 font-bold text-white">記事一覧に戻る</Link>
    </div>
  )
}
