
// 認証が不要な、シンプルなデータ取得関数
export const fetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {// レスポンスが成功でなければエラーを投げ,SWRの`error`状態が自動的に設定される
    const error = new Error("データの取得中にエラーが発生しました");
    throw error;
  }
  return res.json();
}

// 認証が必要な管理者ページなどで使用する、トークン付きのデータ取得関数
export const fetcherWithToken = async ([url, token]: [string, string]) => {
  const res = await fetch(url, {
    headers: {
      Authorization: token, // 受け取ったtokenをAuthorizationヘッダーにセット
    },
  });

  if (!res.ok) {
    const error = new Error("データの取得中にエラーが発生しました");
    throw error;
  }
  return res.json();
};
