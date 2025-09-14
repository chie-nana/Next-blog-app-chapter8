//src/app/signup/page.tsx

"use client";
import { supabase } from "@/utils/supabase";// 前の工程で作成したファイル
// import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";// react-hook-formのuseForm`SubmitHandler`ををインポート
import { useRouter } from "next/navigation";


// フォームの入力値の「型」を定義
type SignUpFormInput = {
  email: string;
  password: string;
}

export default function Page() {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");

  const router = useRouter();
  // `useState`の代わりに`useForm(フォームを管理するための便利な道具（registerやhandleSubmitなど）が詰まったオブジェクトを返)`を呼び出す
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }, // エラーと送信状態を管理
    } = useForm<SignUpFormInput>();

  // const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();//ページ全体のリロード（再読み込み）をキャンセルする
  //   const { error } = await supabase.auth.signUp({ //signUp命令は結果として「成功or失敗」という情報を含んだオブジェクトを返し、その中からerror情報だけ取り出す、登録が成功すれば error は空っぽ（null）、認証機能（auth）
  //     email: email,
  //     password: password,
  //     options: {
  //       emailRedirectTo: `http://localhost:3000/login`,//は追加オプション。Supabaseのサインアップ成功時に送る本人確認用メール中のリンクをユクリックした際、ログインページにリダイレクトするよう指定
  //     },
  //   })
  //   if (error) {
  //     alert("登録に失敗しました")
  //   } else {
  //     setEmail("")
  //     setPassword("")
  //     alert("確認メールを送信しました")
  //   }
  // }

  // フォーム送信時の処理
  // `data`にフォームの入力値がまとめて入ってくる
  const onSubmit: SubmitHandler<SignUpFormInput> = async (data) => {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `http://localhost:3000/login`,
      },
    })
    if (error) {
      alert("登録に失敗しました" + error.message)
    } else {
      alert("確認メールを送信しました")
      router.push("/login"); // ログインページに遷移
    }
  }
  return (
    <div className="flex justify-center pt-[240px]">
      {/* `handleSubmit`で`onSubmit`をラップする */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-[400px]">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-900"
          >
            メールアドレス
          </label>
          {/* `register`を使って`react-hook-form`に登録し、バリデーションルールを追加 */}
          <input
            type="email"
            id="email"//htmlFor属性とid属性は同じ値を指定する
            // onChange={(e) => setEmail(e.target.value)}
            // value={email}
            {...register("email",{
              required: "メールアドレスは必須です",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "有効なメールアドレスを入力してください",
              },
            })} //register関数を呼び出し、引数にフォームの入力値の名前（キー）を指定。これでinput要素とemailという名前が紐づく
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="name@company.com"
            disabled={isSubmitting}
          />
          {/* エラーメッセージの表示 */}
          <div className="text-sm text-red-600">{errors.email?.message}</div>
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
            id="password"
            {...register("password", {
              required: "パスワードは必須です",
              minLength: { value: 6, message: "6文字以上で入力してください" }
            })}
            // onChange={(e) => { setPassword(e.target.value) }}
            // value={password} //入力フィールドの値をstateと同期させる
            placeholder="••••••••"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            disabled={isSubmitting}
          />
          <div className="text-sm text-red-600">{errors.password?.message}</div>

        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting} // 送信中はボタンを無効化
            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus-outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            {isSubmitting ? "登録中..." : "登録"}
          </button>
        </div>
      </form>
  </div>
)
}
