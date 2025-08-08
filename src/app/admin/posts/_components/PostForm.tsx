// src/app/admin/posts/_components/PostForm.tsx

"use client";
import React, { useState, useEffect } from "react";
import { Category, Post } from "@/app/_types";
import { Dispatch, SetStateAction } from "react";



// PostForm コンポーネントが外から受け取る情報の「型」を定義
interface Props {
  post: Post | null;//PostFormがpostデータなし（null）の状態も受け入れられるように、post: Post | nullと修正
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

// const PostForm: React.FC<Props> = (props) => {const PostForm: React.FC<Props> = ({
const PostForm: React.FC<Props> = ({
  post,
  setPost,
  categories,
  setCategories,
  onSubmit,
  loading,
  onDelete,
  mode,
  formError,
}) => {

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

  // ▼▼▼ レビュー指摘対応 ▼▼▼
  const handleSelectCategory = (clickedCategory: Category) => {
    if (loading) return; // props.loadingがtrueの場合は処理を実行しない

    // クリックされたカテゴリーが既に選択されているかチェック
    const isSelected = categories.some(
      (selectedCat) => selectedCat.id === clickedCategory.id
    );

    // クリックされたカテゴリーを選択/非選択を切り替える
    if (isSelected) {
      // もしすでに選択されていたら、リストから削除
      setCategories(
        categories.filter(
          (selectedCat) => selectedCat.id !== clickedCategory.id
        )
      );
    } else {
      // もし選択されていなかったら、リストに追加
      setCategories([
        ...categories,
        { id: parseInt(clickedCategory.id.toString()) }, // 元のコードのロジックをそのまま移動
      ]);
    }
  };
  // ▲▲▲ レビュー指摘対応 ▲▲▲

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
  // ▼ 修正点2: postがnullの場合は何も表示しない（クラッシュ回避）
  if (!post) {
    return null;
  }

  return (
    <form onSubmit={onSubmit}>

      {formError && <p className="text-red-500 mb-4">{formError}</p>}
      <label htmlFor="postTitle" className="block">タイトル</label>
      <input
        id="postTitle"//htmlForと一致させる
        className="border p-2 w-full rounded block mb-4"
        type="text"
        name="title"
        value={post.title} //value={props.post.title}
        onChange={(e) => setPost(prev => prev ? { ...prev, title: e.target.value } : null)}//入力値を更新//onChange={(e) => props.setPost(prev => prev ? { ...prev, title: e.target.value } : null)}
        //（postの最新の状態（prev）をください、もしprevがnullではないなら、それをコピーしtitleを書き換え新しい値にしてください。もしprevがnullだったら、nullのままにしてください」という意味）
        disabled={loading}//disabled={props.loading}
      />

      <label htmlFor="content" className="block">内容</label>
      <textarea
        id="content"
        name="content"
        className="border p-2 w-full rounded block mb-4"
        rows={5}
        value={post.content}
        // onChange={(e) => { props.setPost({ ...props.post, content: e.target.value }) }}
        onChange={(e) => setPost(prev => prev ? { ...prev, content: e.target.value } : null)}
        disabled={loading}
      ></textarea>

      <label htmlFor="thumbnailUrl" className="block">サムネイルURL</label>
      <input
        id="thumbnailUrl"
        name="thumbnailUrl"
        type="text"
        className="border p-2 w-full rounded block mb-4"
        value={post.thumbnailUrl}
        // onChange={(e) => { props.setPost({ ...props.post, thumbnailUrl: e.target.value }) }}
        onChange={(e) => setPost(prev => prev ? { ...prev, thumbnailUrl: e.target.value } : null)}
        disabled={loading}
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
            const isSelected = categories.some(//const isSelected = props.categories.some(
              (selectedCat) => selectedCat.id === category.id
            );

            return (
              <div
                key={category.id}
                // ▼▼▼ レビュー指摘対応 ▼▼▼
                // onClickの中では、分離した関数を呼び出すだけにする
                onClick={() => handleSelectCategory(category)}
                className={`
                      border border-gray-300 rounded-md py-1 px-3 text-sm cursor-pointer
                      ${isSelected ? "bg-blue-600 text-white border-blue-600" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}
                      transition-colors duration-200 ${loading ? "pointer-events-none opacity-50" : ""}
                    `}
              >
                {category.name}
              </div>
            );
          })
        )}
      </div>
      <div className="flex justify-start space-x-3 mt-4">
        <button
          type="submit"
          className="bg-blue-700 text-white py-2 px-3 rounded font-bold"
          disabled={loading}
        >
          {mode === "new" ? "作成" : "更新"} {/* mode に応じてボタンのテキストを変更  {props.mode === "new" ? "作成" : "更新"}  */}
        </button>
        {/* mode が 'edit' のときだけ、以下のコードを実行する */}
        {mode === "edit" && (//{props.mode === "edit" && (
          <button
            type="button"
            onClick={onDelete}//onClick={props.onDelete}
            className="bg-red-500 text-white py-2 px-3 rounded font-bold"
            disabled={loading} // 送信中はボタンを無効化
          >
            削除
          </button>
        )}
      </div>
    </form>
  );


}
export default PostForm; // PostForm コンポーネントをエクスポート
