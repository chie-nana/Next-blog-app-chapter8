//admin/posts/[id]/page.tsx

"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Post, UpdatePostRequestBody } from "@/app/_types"; // Post型を使うために
import { Category } from "@/app/_types"; // Category型もインポート！
import PostForm from "../_components/PostForm"; // PostForm コンポーネントをインポート

export default function EditPosts({ params }: { params: { id: string } }) { //  URLパラメータを受け取る
  const { id } = params; // URLから記事のIDを取得 (ここで定義されている)

  const router = useRouter();

  // --- フォームの入力値を管理するStateたち ---
  const [post, setPost] = useState<Post | null>(null);//修正点:記事データ全体を Post 型の単一Stateで管理する
  // const [editPostTitle, setEditPostTitle] = useState<string>('');
  // const [editPostContent, setEditPostContent] = useState<string>('');
  // const [editPostThumbnailUrl, setEditPostThumbnailUrl] = useState<string>('');

  // 選択されたカテゴリーのIDの配列（バックエンドのPost型に合わせる）
  const [editPostCategories, setEditPostCategories] = useState<{ id: number }[]>([]);

  // --- ページ全体のローディングとエラーState ---
  const [loading, setLoading] = useState<boolean>(false);
  const [pageError, setPageError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);


  useEffect(() => {
    setLoading(true);
    setPageError(null);

    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/admin/posts/${id}`);

        if (res.ok) {
          // レスポンス型チェック「dataは post というキーを持ち、その中身は Post 型である」と定義する
          const data: { post: Post } = await res.json(); // 成功時のみJSONを読み込む
          if (data.post) { // data.post が存在するか安全にチェック
            // setEditPostTitle(data.post.title);
            // setEditPostContent(data.post.content);
            // setEditPostThumbnailUrl(data.post.thumbnailUrl);
            setPost(data.post);//記事データ全体をセット


            // data.post.postCategories は { category: Category }[] 型なので、any を使う必要がなくなる（map((pc：any) =>から修正）
            const initialCategories = data.post.postCategories.map((pc) => ({ id: pc.category.id }));
            setEditPostCategories(initialCategories);

          } else {
            throw new Error("記事の取得に成功しましたが、レスポンスの形式が正しくありません。");
          }
        } else {  // レスポンスが失敗した場合
          const errorData = await res.json();
          throw new Error(errorData.status || "記事の取得に失敗しました（(200番台以外) だった場合。サーバーとの通信が失敗したか、サーバー側が**「エラー」だと明確に返事した**場合）");
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          setPageError(error.message);
        } else {
          // 予期せぬ型のエラー（文字列がthrowされた場合など）に対応
          setPageError("予期せぬエラーが発生しました。");
        }
        console.error("記事の取得中にエラーが発生しました:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();// 記事データを取得する関数を実行
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault(); // ページの再読み込みを防ぐ
    setLoading(true); // ローディング状態を開始
    setFormError(null); // エラーをリセット

    if (!post) return; // post がなければ何もしない

    try {
      const dataToSend: UpdatePostRequestBody = { // サーバーに送るデータ（更新後の投稿内容）
        //バックエンドの形と合わせる
        title: post.title,
        content: post.content,
        thumbnailUrl: post.thumbnailUrl,
        categories: editPostCategories,
        // title: editPostTitle,
        // content: editPostContent,
        // thumbnailUrl: editPostThumbnailUrl,
        // categories: editPostCategories, // 選択されたカテゴリー
      };
      const res = await fetch(`/api/admin/posts/${id}`, { // PUTリクエストを送る
        method: "PUT",
        headers: {
          "Content-Type": "application/json", // JSON形式で送る
        },
        body: JSON.stringify(dataToSend), // JavaScriptのオブジェクトをJSON文字列に変換して送る
      });

      if (res.ok) { // サーバーからの応答が成功 (200番台) かどうかをチェック
        alert("記事が更新されました");
        router.push("/admin/posts"); // 更新成功後、記事一覧ページにリダイレクト
      } else {
        const errorData = await res.json();
        throw new Error(errorData.status || "記事の更新に失敗しました。");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setFormError(error.message);
      } else {
        setFormError("予期せぬエラーが発生しました。");
      }
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
    if (!post) return; //  post がなければ何もしない

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
        throw new Error(errorData.status || "記事の削除に失敗しました");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setFormError(error.message);
      } else {
        setFormError("予期せぬエラーが発生しました。");
      }
      console.error("記事の削除中にエラーが発生しました:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading && !post) { return <p>読み込み中...</p> }
  if (pageError) { return <p>エラー: {pageError}</p> }
  if (!post) { return <p>記事が見つかりませんでした。</p> }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-8">記事編集ページ</h1>

      <PostForm
        post={post}
        setPost={setPost}
        // title={post.title}
        // setTitle={(newTitle) => setPost(prevPost => prevPost ? { ...prevPost, title: newTitle } : null)}
        // content={post.content}
        // setContent={(newContent) => setPost(prevPost => prevPost ? { ...prevPost, content: newContent } : null)}
        // thumbnailUrl={post.thumbnailUrl}
        // setThumbnailUrl={(newUrl) => setPost(prevPost => prevPost ? { ...prevPost, thumbnailUrl: newUrl } : null)}
        // setContent={setEditPostContent}
        // thumbnailUrl={editPostContent || ""}
        // setThumbnailUrl={setEditPostThumbnailUrl || ""}
        categories={editPostCategories}
        setCategories={setEditPostCategories}
        onSubmit={handleUpdate}
        loading={loading}
        formError={formError} // 修正:formErrorを渡す
        mode="edit" // 編集モード
        onDelete={handleDelete} // 削除関数を渡す
      />
    </div>
  )
}
