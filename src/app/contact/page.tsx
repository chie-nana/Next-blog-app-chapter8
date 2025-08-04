//app/contact/page.tsx

"use client"

import React, { useState } from 'react';

// 型定義
type ContactData = {
  name: string;
  email: string;
  message: string;
};
type ContactError = {
  name?: string;
  email?: string;
  message?: string;
};

const Contact: React.FC = () => {

  // ステート定義(初期値設定)
  const [contactData, setContactData] = useState<ContactData>({
    name: "",
    email: "",
    message: ""
  });
  const [errors, setErrors] = useState<ContactError>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // フォーム入力値の変更処理（handleChange）/ChangeEvent型<input> タグと <textarea> タグを表す型
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = event.target;
    setContactData((prevData) => ({
      ...prevData,
      [id]: value
    }));
  };
  // 入力チェック（バリデーション）
  const validate = (): boolean => {
    const errorMessages: ContactError = {};  // エラーメッセージを一時保存するための格納用オブジェクト

    if (!contactData.name) {
      errorMessages.name = "お名前は入力必須です。"; // 名前が空な場合のエラーメッセージ
    } else if (contactData.name.length > 30) {
      errorMessages.name = "お名前は30文字以内で入力してください。";// 名前が20文字以上の場合のエラーメッセージ
    }
    if (!contactData.email) {
      errorMessages.email = "メールアドレスは入力必須です。";
    } else if (!/^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(contactData.email)) {
      errorMessages.email = "正しいメールアドレスの形式で入力してください。";
    }
    if (!contactData.message) {
      errorMessages.message = "本文は入力必須です。";
    } else if (contactData.message.length > 500) {
      errorMessages.message = "本文は500文字以内で入力してください。";
    }
    setErrors(errorMessages);
    return Object.keys(errorMessages).length === 0;//バリテーションの結果返す
  }

  // フォーム送信処理（APIへ送信）
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();//① ページのリロードを防ぎ送信処理を制御（ブラウザのデフォルトの動作をキャンセルするメソッド）
    if (!validate()) return;//② バリデーション(false を返すとreturnで送信処理を中断)
    setIsSubmitting(true);// ③送信中フラグON(「送信中」状態を管理しボタン無効化へ)
    try {
      const response = await fetch("https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/contacts", {//④ APIへデータを送信
        method: "POST",//データを新規送信する（POSTは新しいデータを送信）
        headers: { 'Content-Type': 'application/json' },//JSON形式のデータ を送ることを明示
        body: JSON.stringify(contactData),//フォームのデータ）をJSON形式の文字列に変換して送信
      });
      if (!response.ok) throw new Error("Network response was not ok");//⑤ レスポンスの確認
      alert("送信しました");//⑥ 送信成功時の処理
      handleClear();//送信成功時のみフォームをクリア
      setErrors({});// エラーメッセージをリセット
    } catch (error) {//⑦ エラーが発生した場合
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);//⑧ 送信処理が終わったらフラグをOFF
    }
  };
  // フォームクリア処理
  const handleClear = () => { //送信完了後、フォームの各項目の中身をクリア
    setContactData({ name: '', email: '', message: '' });
  };
  return (
    <div className="max-w-[50.00rem] my-10 m-auto py-0 px-8">
      <h2 className="mb-12 text-2xl font-semibold">問い合わせフォーム</h2>
      <form onSubmit={handleSubmit}>

        <div className="flex mb-10">
          <label className="w-64" htmlFor="name">お名前</label>
          <div className="flex flex-col w-full">
            <input
              type="text"
              id="name"
              maxLength={30}
              value={contactData.name}
              onChange={handleChange}
              disabled={isSubmitting}
              className='p-5 rounded w-[calc(100%-40px)] border-[1.5px] border-[#bababa]'
            />
            {errors.name && <p className="mb-8 text-[0.63rem] text-red">{errors.name}</p>}
          </div>
        </div>
        <div className="flex mb-10">
          <label className="w-64" htmlFor="email">メールアドレス</label>
          <div className="flex flex-col w-full">
            <input
              type="email"
              id="email"
              value={contactData.email}
              onChange={handleChange}
              disabled={isSubmitting}
              className='p-5 rounded w-[calc(100%-40px)] border-[1.5px] border-[#bababa]'
            />
            {errors.email && <p className="mb-8 text-[0.63rem] text-red">{errors.email}</p>}
          </div>
        </div>
        <div className="flex mb-10">
          <label className="w-64" htmlFor="message">本文</label>
          <div className="flex flex-col w-full">
            <textarea
              id="message"
              maxLength={500}
              value={contactData.message}
              onChange={handleChange}
              disabled={isSubmitting}
              rows={10}
              className="rounded w-[calc(100%-20px)] p-3 border-[1.5px] border-[#bababa]"
            />
            {errors.message && <p className="mb-8 text-[0.63rem] text-red">{errors.message}</p>}
          </div>
        </div>
        <div className="flex items-center justify-center gap-5">
          <input
            type="submit"
            value="送信"
            disabled={isSubmitting}
            className='w-24 p-3 text-[#fff] font-black rounded-xl bg-black'
          />
          <button
            type="button"
            onClick={handleClear}
            disabled={isSubmitting}
            className="w-24 p-3 font-black rounded-xl bg-gray-200 text-gray-800"
          >クリア</button>
        </div>
      </form>
    </div>
  )
};
export default Contact;
