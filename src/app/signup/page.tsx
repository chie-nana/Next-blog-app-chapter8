//src/app/signup/page.tsx

"use client";
import { supabase } from "@/utils/supabase";// 前の工程で作成したファイル
import { useState } from "react";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();//ページ全体のリロード（再読み込み）をキャンセルする

    const { error } = await supabase.auth.signUp({ //signUp命令は結果として「成功or失敗」という情報を含んだオブジェクトを返し、その中からerror情報だけ取り出す、登録が成功すれば error は空っぽ（null）、認証機能（auth）
      email: email,
      password: password,
      options: {
        emailRedirectTo: `http://localhost:3000/login`,//は追加オプション。Supabaseのサインアップ成功時に送る本人確認用メール中のリンクをユクリックした際、ログインページにリダイレクトするよう指定
      },
    })

    if (error) {
      alert("登録に失敗しました")
    } else {
      setEmail("")
      setPassword("")
      alert("確認メールを送信しました")
    }
  }
  return (
    <div className="flex justify-center pt-[240px]">
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-[400px]">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-900"
          >
            メールアドレス
          </label>
          <input
            type="email"
            name="email"
            id="email"//htmlFor属性とid属性は同じ値を指定する
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="name@company.com"
            required
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            パスワード
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="••••••••"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
            onChange={(e) => { setPassword(e.target.value) }}
            value={password} //入力フィールドの値をstateと同期させる
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus-outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            登録
          </button>
        </div>
      </form>
  </div>
)
}
