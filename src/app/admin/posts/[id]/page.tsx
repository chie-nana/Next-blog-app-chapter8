"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Post } from "@/app/_types/Post"; // Post型を使うために
import { Category } from "@/app/_types/Post"; // Category型もインポート！

export default function EditPosts({ params }: { params: { id: string } }) { //  URLパラメータを受け取る
  const { id } = params; // URLから記事のIDを取得 (ここで定義されている)

  const router = useRouter();

  // --- フォームの入力値を管理するStateたち ---
  const [editPostTitle, setEditPostTitle] = useState<string>('');
  const [editPostContent, setEditPostContent] = useState<string>('');
  const [editPostThumbnailUrl, setEditPostThumbnailUrl] = useState<string>('');

  // 選択されたカテゴリーのIDの配列（バックエンドのPost型に合わせる）
  const [editPostCategories, setEditPostCategories] = useState<{ id: number }[]>([]);

  // --- ページ全体のローディングとエラーState ---
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 利用可能なカテゴリーを保存するStateを追加
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  //availableCategories のローディングとエラーState (既存のloading/errorを使い回すことも可能だけど、ここでは明示的に)
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
  const [errorCategories, setErrorCategories] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/admin/posts/${id}`);

        if (res.ok) {
          const data = await res.json(); // 成功時のみJSONを読み込む
          if (data.post) { // data.post が存在するか安全にチェック
            setEditPostTitle(data.post.title);
            setEditPostContent(data.post.content);
            setEditPostThumbnailUrl(data.post.thumbnailUrl);
            // カテゴリーデータもセット (バックエンドのPost型に合わせて変換)
            const initialCategories = data.post.postCategories.map((pc: any) => ({ id: pc.category.id }));
            setEditPostCategories(initialCategories);

          } else {
            throw new Error(data.message || "記事の取得に失敗しました");
          }
        } else {  // レスポンスが失敗した場合
          const errorData = await res.json();
          throw new Error(errorData.message || "記事の取得に失敗しました");
        }
      } catch (error: any) {
        setError(error.message || "記事の取得に失敗しました");
        console.error("記事の取得中にエラーが発生しました:", error);
      } finally {
        setLoading(false);
      }
    };


    // 利用可能なカテゴリーの取得処理もここで行う (これはそのまま)
    setLoadingCategories(true);
    setErrorCategories(null);

    const fetchAvailableCategories = async () => {
      try {
        const res = await fetch("/api/admin/categories");
        const data = await res.json();

        if (res.ok) {
          setAvailableCategories(data.categories);
        } else {
          throw new Error(data.message || '利用可能なカテゴリーの取得に失敗しました');
        }
      } catch (error: any) {
        setErrorCategories(error.message || '利用可能なカテゴリーの取得中にエラーが発生しました');
        console.error("カテゴリー一覧取得エラー:", error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchPost();// 記事データを取得する関数を実行
    fetchAvailableCategories(); // 利用可能なカテゴリーをロードする関数も実行
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault(); // ページの再読み込みを防ぐ
    setLoading(true); // ローディング状態を開始
    setError(null); // エラーをリセット

    try {
      const dataTOSend = { // サーバーに送るデータ（更新後の投稿内容）
        title: editPostTitle,
        content: editPostContent,
        thumbnailUrl: editPostThumbnailUrl,
        categories: editPostCategories, // 選択されたカテゴリー
      };
      const res = await fetch(`/api/admin/posts/${id}`, { // PUTリクエストを送る
        method: "PUT",
        headers: {
          "Content-Type": "application/json", // JSON形式で送る
        },
        body: JSON.stringify(dataTOSend), // JavaScriptのオブジェクトをJSON文字列に変換して送る
      });

      if (res.ok) { // サーバーからの応答が成功 (200番台) かどうかをチェック
        alert("記事が更新されました");
        router.push("/admin/posts"); // 更新成功後、記事一覧ページにリダイレクト
      } else {
        alert("記事の更新に失敗しました");
      }
    } catch (error: any) { // サーバーとの通信自体が失敗した場合（例: ネットが繋がらない）にここに来る
      setError(`記事の更新に失敗しました:${error.message || '不明なエラー'}`);
      console.error("記事の更新中にエラーが発生しました:", error);
    } finally {
      setLoading(false);
    }
  }


  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault(); // ページの再読み込みを防ぐ

    // ユーザーに確認ダイアログを表示,確認ダイアログでユーザーが「OK 」を選択した場合のみ削除を実行
    if (!window.confirm("本当にこの記事を削除しますか？")) {
      return; // ユーザーがキャンセルした場合、何もしない
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("記事が削除されました");
        router.push("/admin/posts");
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || "記事の削除に失敗しました");
      }
    } catch (error: any) {
      setError(error.message || "記事の削除に失敗しました");
      console.error("記事の削除中にエラーが発生しました:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) { return <p>読み込み中...</p> }
  if (error) { return <p>エラー: {error}</p> }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-8">記事編集ページ</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <label htmlFor="postTitle" className="block mb-1">タイトル</label>
        <input
          id="postTitle"
          className="border rounded w-full p-2 mb-4"
          type="text"
          name="title"
          value={editPostTitle}
          onChange={(e) => { setEditPostTitle(e.target.value) }}
        />

        <label htmlFor="postContent" className="block mb-1">内容</label>
        <textarea
          id="postContent"
          className="border rounded w-full p-2 mb-4"
          name="content"
          rows={5}
          value={editPostContent}
          onChange={(e) => { setEditPostContent(e.target.value) }}
        />

        <label htmlFor="postThumbnailUrl" className="block mb-1">サムネイルURL</label>
        <input
          id="postThumbnailUrl"
          className="border rounded w-full p-2 mb-4"
          type="text"
          name="thumbnailUrl"
          value={editPostThumbnailUrl}
          onChange={(e) => (setEditPostThumbnailUrl(e.target.value))}
        />

        <label htmlFor="postCategories" className="block mb-1">カテゴリー</label>
        <select
          id="postCategories"
          className="border rounded w-full p-2"
          name="categories" // バックエンドの期待する 'categories'
          multiple // 複数選択を可能にする！
          // value には、現在 editPostCategories に記憶されているIDの配列を渡す
          // select タグは value に文字列の配列を期待するので、IDを文字列に変換する
          value={editPostCategories.map(cat => cat.id.toString())}
          onChange={(e) => {// ユーザーが選択したすべての <option> 要素を取得、Array.from() で配列に変換
            const selectedOptions = Array.from(e.target.selectedOptions);

            // 選択されたオプションの value (ID) を数値に変換し、
            // バックエンドが期待する { id: 数値ID } のオブジェクトの配列を作成
            const newSelection = selectedOptions.map(option => ({ id: parseInt(option.value) }));

            setEditPostCategories(newSelection); // editPostCategories Stateを更新
          }}
        >
          <option value="">カテゴリーを選択してください</option>
          {/* availableCategories から option タグを動的に生成 */}
          {availableCategories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        <div className="flex justify-start space-x-3 mt-4">
        <button
          type="submit"
          className="bg-blue-700 text-white py-2 px-3 rounded font-bold"
          disabled={loading} // 送信中はボタンを無効化
        >更新</button>
        <button
          type="button"
          onClick={handleDelete}
          className="bg-red-500 text-white py-2 px-3 rounded font-bold"
          disabled={loading} // 送信中はボタンを無効化
          >削除</button>
          </div>
      </form>
      <Link href="/admin/posts" className="mt-4 inline-block p-3 bg-[#f26c00d6] rounded-lg py-2 px-5 font-bold text-white">記事一覧に戻る</Link>
    </div>
  )
}
