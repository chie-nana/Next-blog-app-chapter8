"use client"; // クライアントサイドで実行

import React from "react";
import { Category, GetCategoriesResponse } from "@/app/_types";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const {token} = useSupabaseSession();

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/admin/categories', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token, // 👈 Header に token を付与
          },
        });
        const data: GetCategoriesResponse = await res.json();
        setCategories(data.categories);
      } catch (error) {
        setError("カテゴリーの取得に失敗しました");
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, [token]);
  if (loading) { return <p>読み込み中...</p> }
  if (error) { return <p>エラー: {error}</p> }
  if (categories.length === 0) { return <p>カテゴリーが見つかりませんでした</p> }

  return (
    <>
      <div className="flex justify-between items-center mb-8 p-4">
        <h1 className="text-2xl font-bold">カテゴリー一覧</h1>
        <Link href="/admin/categories/new" className="p-3 bg-[#f26c00d6] rounded-lg py-2  px-5  font-bold text-white">新規作成</Link>
      </div>

      <div>
        {categories.length === 0 ? (
          <p>カテゴリーが見つかりませんでした</p>
        ) : (
          <ul>
            {categories.map((category) => (
              <li key={category.id}>
                <Link href={`/admin/categories/${category.id}`} className="block hover:bg-[#ccdee7] p-5 border-b border-gray-200">
                  <h2 className="font-bold text-xl">{category.name}</h2>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}
