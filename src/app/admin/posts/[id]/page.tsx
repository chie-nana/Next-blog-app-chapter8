"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Post } from "@/app/_types/Post"; // Post型を使うために

export default function EditPosts() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-8">記事編集ページ</h1>
      <p>このページでは、記事の編集ができます。</p>
      <Link href="/admin/posts" className="mt-4 inline-block p-3 bg-[#f26c00d6] rounded-lg py-2 px-5 font-bold text-white">記事一覧に戻る</Link>
    </div>
  )
}
