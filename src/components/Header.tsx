"use client"; //クライアントサイドで実行

import Link from "next/link";

export const Header:React.FC = () => {
  return (
    <header className="bg-gray-800 px-6 py-5">
      <ul className="flex items-center justify-between list-none p-0">
        <li><Link href="/" className="text-white no-underline font-extrabold">Blog</Link></li>
        <li><Link href="/contact" className="text-white no-underline font-extrabold">お問い合わせ</Link></li>
      </ul>
    </header>
  );
}
