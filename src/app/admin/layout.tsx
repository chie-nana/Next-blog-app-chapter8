"use client";

import React from "react";
import Link from "next/link";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  // AdminLayout: React.FC = ({ children }) => {
  // ({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <main className="flex">
      <aside className="w-64 bg-gray-100 h-screen">
        <nav>
          <ul className="space-y-2">
            <li><Link href="/admin/posts" className="block hover:bg-[#c1d7da] p-4">記事一覧</Link></li>
            <li><Link href="/admin/categories" className="block hover:bg-[#c1d7da] p-4">カテゴリー一覧</Link></li>
          </ul>
        </nav>
      </aside>
      <div className="flex-1 bg-white p-4">
        {children}
      </div>
    </main>
  );
};
