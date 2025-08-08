"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import CategoryForm from "../_components/CategoryForm"; // CategoryForm コンポーネントをインポート
import { CreateCategoryRequestBody } from "@/app/_types";

export default function CreateCategories() {//※型の有無要確認
  const [newCategoryName, setNewCategoryName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);//※error有効かされていない

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {//※React.FCとの違い
    e.preventDefault();

    setLoading(true); // フォーム送信が始まるので、loading の情報ボードを「true」（作成中）にする
    setError(null);   // 新しい送信なので、以前のエラーメッセージがあればクリアする

    const dataToSend: CreateCategoryRequestBody = { name: newCategoryName }
    try {
      const res = await fetch("/api/admin/categories", {
        // 第2引数:HTTPリクエストを送信するための関数
        method: "POST",
        headers: {
          ContentType: "application/json", //json形式で送る
        },
        body: JSON.stringify(dataToSend),
      });
      if (res.ok) {
        alert("カテゴリーが作成されました");
        setNewCategoryName(''); // 入力フィールドをクリア
        router.push("/admin/categories"); // 作成成功後、カテゴリー一覧ページにリダイレクト
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
      <h1 className="font-bold text-2xl mb-8">カテゴリー作成</h1>
      <CategoryForm
        name={newCategoryName}
        setName={setNewCategoryName}
        loading={loading}
        onSubmit={handleSubmit}
        error={error}
        mode="new"
      />
    </div>
  )
}
