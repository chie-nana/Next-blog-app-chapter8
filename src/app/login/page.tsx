//src/app/login/page.tsx


"use client";
import { supabase } from "@/utils/supabase";
import { useRouter } from "next/navigation";
// import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";// react-hook-formのuseForm`SubmitHandler`ををインポート


// フォームの入力値の型を定義
type LoginFormInput = {
  email: string;
  password: string;
};

export default function Page() {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }, // isSubmittingを追加してローディング状態を管理
  } = useForm<LoginFormInput>();

  const router = useRouter();

  // const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   const { error } = await supabase.auth.signInWithPassword({
  //     email,
  //     password,
  //   });
  //   if (error) {
  //     alert("ログインに失敗しました")
  //   } else {
  //     router.replace("/admin/posts");
  //   }
  // }
  const onSubmit: SubmitHandler<LoginFormInput> = async (data) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error) {
      alert("ログインに失敗しました" + error.message);
    } else {
      // router.pushでも良いが、replaceはブラウザの履歴に残らず戻るボタンでログインページに戻るのを防げます
      router.replace("/admin/posts");
    }
  }

    return (
      <div className="flex justify-center pt-[240px]">
        {/* handleSubmitでonSubmit関数をラップ */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-[400px]">
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              メールアドレス
            </label>
            <input
              type="email"
              // id="email"
              {...register("email", {
                required: "メールアドレスは必須です",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "有効なメールアドレスを入力してください"
                }
              })}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="name@company.com"
              // onChange={(e) => setEmail(e.target.value)}
              // value={email}
              disabled={isSubmitting} // 送信中はボタンを無効化
            />
            <div className="text-sm text-red-600">{errors.email?.message}</div>

            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              パスワード
            </label>
            <input
              type="password"
              // name="password"
              id="password"
              {...register("password", {
                required: "パスワードは必須です",
              })}
              placeholder="••••••••"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              // onChange={(e) => setPassword(e.target.value)}
              // value={password}
              disabled={isSubmitting} // 送信中はボタンを無効化
            />
            <div className="text-sm text-red-600">{errors.password?.message}</div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting} // 送信中はボタンを無効化
              className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              {isSubmitting ? "ログイン中..." : "ログイン"}
            </button>
          </div>

        </form>
      </div>
    )
  }
