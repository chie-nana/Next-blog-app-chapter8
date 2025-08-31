//src/app/admin/layout.tsx

"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation'
import { useRouteGuard } from './_hooks/useRouteGuard'

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children, }: AdminLayoutProps) {
  // AdminLayout: React.FC = ({ children }) => {
  // ({ children, }: Readonly<{ children: React.ReactNode; }>) {

  // このコンポーネントが表示されるたびに、ルートガードが実行される
  useRouteGuard();

  // 現在のURLパスを取得して、選択中のメニューをハイライトする
  const pathname = usePathname();
  const isSelected = (href: string) => {
    return pathname.includes(href);
  }
  return (
    <main className="flex">
      {/* サイドバー */}
      <aside className="w-64 bg-gray-100 h-screen p-4">
        <nav>
          <ul className="space-y-2">
            <li><Link href="/admin/posts" className="block hover:bg-[#ccdee7] p-3">記事一覧</Link></li>
            <li><Link href="/admin/categories" className="block hover:bg-[#ccdee7] p-3">カテゴリー一覧</Link></li>
          </ul>
        </nav>
      </aside>
      {/* メインエリア */}
      <div className="flex-1 bg-white p-4">
        {children}
      </div>
    </main>
  );
};
