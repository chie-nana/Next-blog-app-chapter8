"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CategoryForm from "../_components/CategoryForm"
import { GetCategoryResponse, UpdateCategoryRequestBody } from "@/app/_types";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
// import useSWR from 'swr';
// import { fetcherWithToken } from "@/lib/fetcher";
import { useFetch } from "@/app/_hooks/useFetch";



export default function EditCategories({ params }: { params: { id: string } }) {
  const { id } = params;//IDを取得
  // ここでIDを使ってカテゴリーの情報を取得し、編集フォームに表示する
  const router = useRouter();
  // handleUpdateとhandleDeleteでtokenが必要なため、この行は残す
  const { token } = useSupabaseSession(); // カスタムフックからtokenを取得

  const { data, error: pageError, isLoading: pageLoading } = useFetch<GetCategoryResponse>(
    id ? `/api/admin/categories/${id}` : null
  );
  //▼▼▼ 修正: データ取得をSWRに置き換え
  // const {data, error: pageError, isLoading: pageLoading} = useSWR<GetCategoryResponse>(//ページ全体のデータ取得の状態（SWRが管理）:errorとloading別名称にしてコンフリクト対策
  //   token && id ? [`/api/admin/categories/${id}`, token] : null,
  //   fetcherWithToken
  // );

  // ▼▼▼ 修正点2: フォームの「入力値」を管理するStateは維持
  const [editCategoryName, setEditCategoryName] = useState<string>('');
  //このloading`は、フォームの更新・削除ボタンが押された時用でページ読み込みはSWRにてpageLoading
  const [loading, setLoading] = useState<boolean>(false);
  // const [pageError, setPageError] = useState<string | null>(null); // ページ読み込み時のエラー
  const [formError, setFormError] = useState<string | null>(null); // フォーム操作時(更新・削除時)のエラー



  useEffect(() => {
    // SWRがデータを取得し、その中にcategoryがあれば
    if (data?.category) {
      // フォーム用の`editCategoryName` Stateに、SWRが取得したデータを一度だけコピー
      setEditCategoryName(data.category.name);
    }
  }, [data]);//dataが変化した時（＝SWRがデータを取得した時）実行

  //   if (!token) {
  //     setLoading(false);
  //     return;
  //   }
  //   setLoading(true);//`読み込み中
  //   setPageError(null);   // エラーをリセット（ページ読み込みエラー)

  //   const fetchCategory = async () => {
  //     try {
  //       const res = await fetch(`/api/admin/categories/${id}`, {
  //         headers: {
  //           Authorization: token, // 👈 Header に token を付与
  //         },
  //       });
  //       if (res.ok) {// もし成功したら
  //         const data:GetCategoryResponse  = await res.json();// 成功したデータ（JSON）を読み取る
  //         setEditCategoryName(data.category.name);//取得したデータを State にセットする処理
  //       } else {// もし失敗したら（res.ok が false なら）
  //         const errorData = await res.json();
  //         throw new Error(errorData.message || 'カテゴリーの取得に失敗しました');
  //       }
  //     } catch (error: any) {// try ブロック内でエラーが発生した場合（ネットワークエラーや、上記で throw されたエラー）
  //       setPageError(error.message || "カテゴリーの取得に失敗しました");
  //       console.error("カテゴリーの取得中にエラーが発生しました:", error);
  //     } finally {
  //       setLoading(false);//読み込み完了
  //     }
  //   }// fetchCategory 関数の定義はここまで
  //   fetchCategory();//定義した関数を実行
  // }, [id,token]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();// ページの再読み込みを防ぐ

    if (!token) {
      setFormError("認証情報がありません。再度ログインしてください。");
      return;
    }
    setLoading(true);// ローディング状態を開始
    setFormError(null);// エラーをリセット（更新エラー)

    try {
      const dataTOSend: UpdateCategoryRequestBody = { // サーバーに送るデータ（更新後のカテゴリー名）
        name: editCategoryName,// 現在入力されているカテゴリー名
      };
      const res = await fetch(`/api/admin/categories/${id}`, {// サーバーにPUTリクエストを送る
        method: "PUT",
        headers: {
          "Content-Type": "application/json", // JSON形式で送る
          Authorization: token, // 👈 Header に token を付与
        },
        body: JSON.stringify(dataTOSend), //JavaScriptのオブジェクトをJSON文字列に変換して送る
      });

      if (res.ok) {// サーバーからの応答が成功 (200番台) かどうかをチェック
        alert("カテゴリーが更新されました");
        router.push("/admin/categories");//更新成功後、カテゴリー一覧ページにリダイレクト
      } else {
        alert("カテゴリーの更新に失敗しました");
      }
    } catch (error: any) {// サーバーとの通信自体が失敗した場合（例: ネットが繋がらない）にここに来る
      setFormError(`カテゴリーの更新に失敗しました:${error.message || '不明なエラー'}`);
      console.error("カテゴリーの更新中にエラーが発生しました:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();// ページの再読み込みを防ぐ
    if (!token) {
      setFormError("認証情報がありません。再度ログインしてください。");
      return;
    }

    if (!window.confirm("本当にこのカテゴリーを削除しますか")) {
      return; // ユーザーがキャンセルした場合、何もしない
    }

    setLoading(true);// ローディング状態を開始
    setFormError(null);// エラーをリセット(削除エラー)

    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE", // DELETEリクエストを送る
        headers: {
          Authorization: token,
        },
      });

      if (res.ok) {// サーバーからの応答が成功 (200番台) かどうかをチェック
        alert("カテゴリーが削除されました");
        router.push("/admin/categories"); //削除成功後、カテゴリー一覧ページにリダイレクト
      } else {// もし失敗したら（res.ok が false なら）
        const errorData = await res.json();
        throw new Error(errorData.message || 'カテゴリーの削除に失敗しました');
      }
    } catch (error: any) {// サーバーとの通信自体が失敗した場合（例: ネットが繋がらない）にここに来る
      setFormError(`カテゴリーの削除に失敗しました:${error.message || '不明なエラー'}`);
      console.error("カテゴリーの削除中にエラーが発生しました:", error);
    } finally {
      setLoading(false);// ローディング状態を終了
    }
  };


  if (pageLoading || !token) { return <p>読み込み中...</p> }
  if (pageError) { return <p>エラー: {pageError.message}</p> }
  if (!data?.category) { return <p>カテゴリーが見つかりませんでした。</p>; }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-8">カテゴリー編集</h1>
      <CategoryForm
        name={editCategoryName}
        setName={setEditCategoryName}
        loading={loading}
        onSubmit={handleUpdate}
        error={formError}
        mode="edit"
        onDelete={handleDelete}
      />
    </div>
  )
}
