// src/app/admin/posts/_components/PostForm.tsx

"use client";
import React from "react";
import { Category } from "@/app/_types/Post";
import { Dispatch, SetStateAction } from "react";


// PostForm コンポーネントが外から受け取る情報の「型」を定義
interface PostFormProps {
  title: string;
  setTitle:Dispatch<SetStateAction<string>>;  //setTitle:(title:string)=>void; と同一
  content: string;
  setContent: Dispatch<SetStateAction<string>>;//  setContent: (content: string) => void;
  thumbnailUrl: string;
  setThumbnailUrl: Dispatch<SetStateAction<string>>; // setThumbnailUrl: (url: string) => void;
  categories: { id: number }[]; // 選択されたカテゴリーのIDの配列

  // 各入力欄の値を更新するための関数 (親から渡される)
  setCategories: (categories: { id: number }[]) => void;

  // フォームが送信されたときに実行される関数 (親から渡される)
  onSubmit: (e: React.FormEvent) => void;

  // ボタンの無効化状態 (親から渡される)
  loading: boolean;

  // 利用可能なカテゴリーのリスト (親から渡される)
  availableCategories: Category[];
  loadingCategories: boolean; // カテゴリーリストのローディング状態
  errorCategories: string | null; // カテゴリーリストのエラー状態

  // 編集ページ用 (新規作成ページでは使わないので ? をつける)
  onDelete?: (e: React.FormEvent) => void; // 削除関数（オプション）
  mode?: 'new' | 'edit'; // モード（オプション）
}

// PostForm コンポーネントの定義
export default function PostForm({
  title,
  setTitle,
  content,
  setContent,
  thumbnailUrl,
  setThumbnailUrl,
  categories, // 親から渡される選択済みカテゴリー
  setCategories, // 親から渡されるカテゴリー更新関数
  onSubmit, // 親から渡されるフォーム送信関数
  loading, // 親から渡されるローディング状態
  availableCategories, // 親から渡される利用可能カテゴリー
  loadingCategories,
  errorCategories,
  onDelete, // 削除関数
  mode = 'new', // デフォルト値を new に設定
}: PostFormProps) {
  // カテゴリー読み込み中やエラーの場合の表示 (PostForm内で表示)
  // 親の CreatePosts から受け取った loadingCategories/errorCategories を使う
  if (loadingCategories) {
    return <p className="text-gray-500">カテゴリーを読み込み中...</p>;
  }
  if (errorCategories) {
    return <p className="text-red-500">カテゴリー取得エラー: {errorCategories}</p>;
  }
  // availableCategories.length === 0 は form の中に含めても良い

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* タイトル入力欄 */}
      <div className="mb-4">
        <label htmlFor="postTitle" className="block text-sm font-medium text-gray-700 mb-1">タイトル</label>
        <input
          id="postTitle"
          className="border rounded w-full p-2"
          type="text"
          name="title"
          value={title} // Props から受け取った title を使う
          onChange={(e) => { setTitle(e.target.value) }} // Props から受け取った setTitle を使う
        />
      </div>

      {/* 内容入力欄 */}
      <div className="mb-4">
        <label htmlFor="postContent" className="block text-sm font-medium text-gray-700 mb-1">内容</label>
        <textarea
          id="postContent"
          className="border rounded w-full p-2"
          rows={10}
          name="content"
          value={content}
          onChange={(e) => { setContent(e.target.value) }}
        ></textarea>
      </div>

      {/* サムネイルURL入力欄 */}
      <div className="mb-4">
        <label htmlFor="postThumbnailUrl" className="block text-sm font-medium text-gray-700 mb-1">サムネイルURL</label>
        <input
          id="postThumbnailUrl"
          className="border rounded w-full p-2"
          type="text"
          name="thumbnailUrl"
          value={thumbnailUrl}
          onChange={(e) => (setThumbnailUrl(e.target.value))}
        />
      </div>

      {/* カテゴリー選択欄 (HTML標準の select を使う) */}
      <div className="mb-8">
        <label htmlFor="postCategories" className="block text-sm font-medium text-gray-700 mb-1">カテゴリー</label>
        <select
          id="postCategories"
          className="border rounded w-full p-2"
          name="categories"
          multiple // 複数選択可能
          value={categories.map(cat => cat.id.toString())} // 親から渡される categories を使う
          onChange={(e) => {
            const selectedOptions = Array.from(e.target.selectedOptions);
            const newSelection = selectedOptions.map(option => ({ id: parseInt(option.value) }));
            setCategories(newSelection); // 親から渡される setCategories を使う
          }}
        >
          <option value="">カテゴリーを選択してください</option>
          {/* availableCategories が空の場合はメッセージを表示 */}
          {availableCategories.length === 0 ? (
            <option disabled>カテゴリーがありません</option> // 選択できないオプション
          ) : (
            availableCategories.map((category) => ( // 親から渡される availableCategories を使う
              <option key={category.id} value={category.id}>{category.name}</option>
            ))
          )}
        </select>
      </div>

      {/* 作成/更新ボタン */}
      <button
        type="submit"
        className="bg-blue-700 text-white py-2 px-3 rounded font-bold hover:bg-blue-800 transition"
        disabled={loading} // 親から渡される loading を使う
      >
        {mode === 'new' ? '作成' : '更新'} {/* mode に応じてボタンのテキストを変更 */}
      </button>

      {/* 削除ボタン (編集モードの場合のみ表示) */}
      {mode === 'edit' && onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="bg-red-600 text-white py-2 px-3 rounded font-bold hover:bg-red-700 transition ml-2"
          disabled={loading}
        >
          削除
        </button>
      )}
    </form>
  );
}
