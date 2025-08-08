// src/app/admin/posts/_components/PostForm.tsx

"use client";
import React, { useState, useEffect } from "react";
import { Category, Post } from "@/app/_types/Post";
import { Dispatch, SetStateAction } from "react";



// PostForm コンポーネントが外から受け取る情報の「型」を定義
interface Props {
  post: Post;
  setPost: Dispatch<SetStateAction<Post | null>>;
  // title: string;
  // setTitle: Dispatch<SetStateAction<string>>;  //setTitle:(title:string)=>void; と同一
  // content: string;
  // setContent: Dispatch<SetStateAction<string>>;//  setContent: (content: string) => void;
  // thumbnailUrl: string;
  // setThumbnailUrl: Dispatch<SetStateAction<string>>; // setThumbnailUrl: (url: string) => void;
  categories: { id: number }[]; // 選択されたカテゴリーのIDの配列
  setCategories: Dispatch<SetStateAction<{ id: number }[]>>; // setCategories: (categories: { id: number }[]) => void;
  onSubmit: (e: React.FormEvent) => void; // フォームが送信されたときに実行される関数
  loading: boolean; // ボタンの無効化状態
  // 編集ページ用 (新規作成ページでは使わないので ? をつける)
  onDelete?: (e: React.FormEvent) => void; // 削除関数（オプション）
  mode?: 'new' | 'edit'; // モード（オプション）
  formError?: string | null;// フォーム操作時のエラー (オプション)


}

const PostForm: React.FC<Props> = (props) => {
  //分割代入でかくと、const PostForm: React.FC<Props> = ({title,setTitle,content,setContent,onSubmit..}) =>{return}

  // ※ 修正点1: カテゴリー取得に必要なStateを PostForm の中で定義する
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
  const [errorCategories, setErrorCategories] = useState<string | null>(null);

  //availableCategories を取得するための useEffect
  useEffect(() => {
    setLoadingCategories(true);
    setErrorCategories(null);

    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/admin/categories");// カテゴリー一覧APIから取得
        if (res.ok) {//成功した場合
          const data = await res.json();
          setAvailableCategories(data.categories); // { status: "OK", categories: [...] } の形で返すので data.categories を使う
        } else {
          const errorData = await res.json();
          throw new Error(errorData.message || "カテゴリーの取得に失敗しました");
        }
      } catch (error: any) {
        setErrorCategories(error.message || "カテゴリーの取得に失敗しました")
        console.error("カテゴリーの取得中にエラーが発生しました", error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);// 初回ロード時のみ実行

  // --- 画面表示 ---
  if (loadingCategories) {
    return <p className="text-xl font-bold text-gray-500">カテゴリーを読み込み中...</p>;
  }
  if (errorCategories) {
    return <p className="text-xl font-bold text-red-500">カテゴリー取得エラー: {errorCategories}</p>;
  }
  if (availableCategories.length === 0) {
    return <p className="text-xl font-bold text-gray-500">利用可能なカテゴリーがありません。</p>;
  }

  return (
    <form onSubmit={props.onSubmit}>

      {props.formError && <p className="text-red-500 mb-4">{props.formError}</p>}
      <label htmlFor="postTitle" className="block">タイトル</label>
      <input
        id="postTitle"//htmlForと一致させる
        className="border p-2 w-full rounded block mb-4"
        type="text"
        name="title"
        value={props.post.title}
        onChange={(e) => { props.setPost({...props.post,title:e.target.value}) }}//入力値を更新

        disabled={props.loading}
      />

      <label htmlFor="content" className="block">内容</label>
      <textarea
        id="content"
        name="content"
        className="border p-2 w-full rounded block mb-4"
        rows={5}
        value={props.post.content}
        onChange={(e) => { props.setPost({ ...props.post,content:e.target.value }) }}
        disabled={props.loading}
      ></textarea>

      <label htmlFor="thumbnailUrl" className="block">サムネイルURL</label>
      <input
        id="thumbnailUrl"
        name="thumbnailUrl"
        type="text"
        className="border p-2 w-full rounded block mb-4"
        value={props.post.thumbnailUrl}
        onChange={(e) => { props.setPost({ ...props.post, thumbnailUrl: e.target.value }) }}
        disabled={props.loading}
      />
      {/* カテゴリー選択欄 - ここから新しい方式に置き換える */}
      <label htmlFor="postCategories" className="block text-sm font-medium text-gray-700 mb-1">カテゴリー</label>
      {/*  ここから select タグの代わりに div ベースの選択肢を配置  */}
      <div className="flex flex-wrap justify-start gap-2 border rounded p-2 mb-8">
        {/* availableCategories がまだ読み込み中の場合 */}
        {loadingCategories ? (
          <p className="text-gray-500">カテゴリー読み込み中...</p>
        ) : errorCategories ? (
          <p className="text-red-500">カテゴリー取得エラー: {errorCategories}</p>
        ) : availableCategories.length === 0 ? (
          <p className="text-gray-500">利用可能なカテゴリーがありません。</p>
        ) : (
          // 利用可能なカテゴリーがあれば map で表示
          availableCategories.map((category) => {
            // そのカテゴリーが現在選択されているかチェック
            // editPostCategories は { id: number }[] の形式なので、id を抽出して includes でチェック
            const isSelected = props.categories.some(
              (selectedCat) => selectedCat.id === category.id
            );

            return (
              <div
                key={category.id}
                onClick={() => {
                  if (props.loading) return;//props.loadingがtrueの場合は処理を実行しない
                  // クリックされたカテゴリーを選択/非選択を切り替える
                  if (isSelected) {
                    // もしすでに選択されていたら、リストから削除
                    props.setCategories(
                      props.categories.filter(
                        (selectedCat) => selectedCat.id !== category.id
                      )
                    );
                  } else {
                    // もし選択されていなかったら、リストに追加
                    // category は { id: string, name: string } 型なので、{ id: number } 型に変換して追加
                    props.setCategories([
                      ...props.categories,
                      { id: parseInt(category.id.toString()) }, // 必要に応じて id を数値に変換
                    ]);
                  }
                }}
                className={`
                      border border-gray-300 rounded-md py-1 px-3 text-sm cursor-pointer
                      ${isSelected ? "bg-blue-600 text-white border-blue-600" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}
                      transition-colors duration-200 ${props.loading ? "pointer-events-none opacity-50" : ""}
                    `}
              >
                {category.name}
              </div>
            );
          })
        )}
      </div>
      {/* <label htmlFor="postCategories" className="block">カテゴリー</label>
        <select
          id="postCategories"
          name="categories"// バックエンドの期待する 'categories'
          className="border p-2 w-full rounded block mb-8"
          multiple
          // value には選択された option の value (ID) の配列を渡す
          value={newPostCategories.map(cat => cat.id.toString())} // 選択されたカテゴリーのIDを配列で保持
          onChange={(e) => {
            // 選択されたすべての <option> 要素を取得
            const selectedOptions = Array.from(e.target.selectedOptions);
            // 選択されたオプションの value (ID) を数値に変換し、{ id: 数値ID } のオブジェクトの配列を作成
            const newSelection = selectedOptions.map(option => ({ id: parseInt(option.value) }));
            setNewPostCategories(newSelection); // Stateを更新
          }}
        >
          <option value="">カテゴリーを選択してください</option>
          {availableCategories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select> */}

      <div className="flex justify-start space-x-3 mt-4">
        <button
          type="submit"
          className="bg-blue-700 text-white py-2 px-3 rounded font-bold"
          disabled={props.loading}
        >
          {props.mode === "new" ? "作成" : "更新"} {/* mode に応じてボタンのテキストを変更 */}
        </button>
        {/* mode が 'edit' のときだけ、以下のコードを実行する */}
        {props.mode === "edit" && (
          <button
            type="button"
            onClick={props.onDelete}
            className="bg-red-500 text-white py-2 px-3 rounded font-bold"
            disabled={props.loading} // 送信中はボタンを無効化
          >
            削除
          </button>
        )}
      </div>
    </form>
  );
}
export default PostForm; // PostForm コンポーネントをエクスポート
