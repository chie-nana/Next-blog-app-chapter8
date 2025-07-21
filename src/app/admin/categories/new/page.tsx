"use client";

import React, { useState, useEffect } from "react";

export default function NewCategoryPage() {
  const [newCategoryName, setNewCategoryName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async(e:React.FormEvent) => {
    e.preventDefault();

    setLoading(true); // フォーム送信が始まるので、loading の情報ボードを「true」（作成中）にする
    setError(null);   // 新しい送信なので、以前のエラーメッセージがあればクリアする

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          ContentType: "application/json", // 送るデータがJSON形式
        },
        body: JSON.stringify({ name: newCategoryName }),
      });
      if (res.ok) {
        alert("カテゴリーが作成されました");
        setNewCategoryName(''); // 入力フィールドをクリア
      } else {
        alert(`カテゴリーの作成に失敗しました`);
      }

    } catch (error: any) {
      setError("カテゴリーの作成に失敗しました");
      console.error("カテゴリーの作成中にエラーが発生しました:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="font-bold text-2xl">カテゴリー作成</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mt-4" >
        <label htmlFor="categoryName" className="block">カテゴリー名</label>
        <input
          id="categoryName"
          className="border p-2 w-full rounded block"
          type="text"
          name="categoryName"
          value={newCategoryName}
          onChange={(e)=>{setNewCategoryName(e.target.value)}}
        />
        <button
          type="submit"
          className="bg-blue-700 text-white py-2 px-3 rounded font-bold"
          disabled={loading} // 送信中はボタンを無効化
        >作成</button>
      </form>
    </div>
  )
}
