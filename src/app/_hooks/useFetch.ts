import useSWR from 'swr';
import { useSupabaseSession } from './useSupabaseSession';
import { fetcherWithToken } from '@/lib/fetcher';

//認証が必要なAPIエンドポイントからデータを取得するためのカスタムフック
//Tとは、どんな型（T）のデータでも扱うことができますよ」と定義
export const useFetch = <T>(url: string | null) => {
  //  内部で自動的にtokenを取得
  const { token, isLoading: isSessionLoading } = useSupabaseSession();

  //SWRを呼び出す（`key`: tokenとurlが存在する場合のみ、[url, token]の配列をキーとして渡す）
  const { data, error, isLoading: isSWRLoading, mutate} = useSWR<T>(
    token && url ? [url, token] : null,
    fetcherWithToken
    );

  const isLoading = isSessionLoading || isSWRLoading;

    //SWRが返した結果を、そのまま外部に返す

    return {
      data, error, isLoading, mutate,// データを手動で更新したい場合（キャッシュの更新など）に使う高度な機能
};

};
