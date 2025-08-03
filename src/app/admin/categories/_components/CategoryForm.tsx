"use client"; // クライアントサイドで実行

import React from "react";
import { Category } from "@/app/_types/Post";
import { Dispatch, SetStateAction } from "react";

interface Props {
  name: string;
  setName: Dispatch<SetStateAction<string>>; // setName: (name: string) => void;
  loading: boolean; // ボタンの無効化状態
  onSubmit: (e: React.FormEvent) => void; // フォームが送信されたときに実行される関数
  error: string | null;
  mode?: "new" | "edit";
  onDelete?: (e: React.FormEvent) => void;
}

const CategoryForm: React.FC<Props> = (props) => {
  //分割代入でかくと、const CategoryForm: React.FC<Props> = ({name,setName,loading,...}) =>{return}
  return (
    <div>
      <form onSubmit={props.onSubmit} className="space-y-4 mt-4" >
        <label htmlFor="categoryName" className="block">カテゴリー名</label>
        <input
          id="categoryName"
          className="border p-2 w-full rounded block"
          type="text"
          name="categoryName"
          value={props.name}
          onChange={(e) => { props.setName(e.target.value) }}
        />
        <div>
          <button
            type="submit"
            className="bg-blue-700 text-white py-2 px-3 rounded font-bold"
            disabled={props.loading} // 送信中はボタンを無効化
          >
            {props.mode === "new" ? "作成" : "更新"}
          </button>
          {/* mode が 'edit' のときだけ、以下のコードを実行する */}
          {props.mode === "edit" && (
            <button
              type="button"
              onClick={props.onDelete}
              className="bg-red-600 text-white py-2 px-3 rounded font-bold ml-3 mt-3"
              disabled={props.loading}
            >
              削除
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
export default CategoryForm;
