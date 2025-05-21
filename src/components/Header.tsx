"use client"; //クライアントサイドで実行

import Link from "next/link";
import classes from "../style/Header.module.css"

export const Header:React.FC = () => {
  return (
    <header className={classes.header}>
      <ul className={classes.ul}>
        <li className={classes.li}><Link href="/">Blog</Link></li>
        <li className={classes.li}><Link href="/contact">お問い合わせ</Link></li>
      </ul>
    </header>
  );
}
