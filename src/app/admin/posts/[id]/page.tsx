"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Post } from "@/app/_types/Post"; // Post型を使うために
import { Category } from "@/app/_types/Post"; // Category型もインポート！
import PostForm from "../_components/PostForm"; // PostForm コンポーネントをインポート

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
  const [pageError, setPageError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // 利用可能なカテゴリーを保存するStateを追加
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  //availableCategories のローディングとエラーState (既存のloading/errorを使い回すことも可能だけど、ここでは明示的に)
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
  const [errorCategories, setErrorCategories] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setPageError(null);

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
        setPageError(error.message || "記事の取得に失敗しました");
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
    setFormError(null); // エラーをリセット

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
      setFormError(`記事の更新に失敗しました:${error.message || '不明なエラー'}`);
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
    setFormError(null);

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
      setFormError(error.message || "記事の削除に失敗しました");
      console.error("記事の削除中にエラーが発生しました:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) { return <p>読み込み中...</p> }
  if (pageError) { return <p>エラー: {pageError}</p> }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-8">記事編集ページ</h1>

      <PostForm
        title={editPostTitle}
        setTitle={setEditPostTitle}
        content={editPostContent}
        setContent={setEditPostContent}
        thumbnailUrl={editPostContent}
        setThumbnailUrl={setEditPostThumbnailUrl}
        categories={editPostCategories}
        setCategories={setEditPostCategories}

        onSubmit={handleUpdate}
        loading={loading}
        availableCategories={availableCategories}
        setAvailableCategories={setAvailableCategories}
        loadingCategories={loadingCategories}
        setLoadingCategories={setLoadingCategories}
        errorCategories={errorCategories}
        setErrorCategories={setErrorCategories}

        mode="edit" // 編集モード
        onDelete={handleDelete} // 削除関数を渡す
      />
    </div>
  )
}
