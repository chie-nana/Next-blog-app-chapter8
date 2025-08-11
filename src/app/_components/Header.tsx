"use client"; //クライアントサイドで実行

import Link from "next/link";

export const Header:React.FC = () => {
  return (
    <header className="bg-[#333] py-8 px-6">
      <ul className="flex items-center justify-between p-0 list-none">
        <li className="text-[#fff] no-underline font-extrabold"><Link href="/">Blog</Link></li>
        <li className="text-[#fff] no-underline font-extrabold"><Link href="/contact">お問い合わせ</Link></li>
      </ul>
    </header>
  );
}
