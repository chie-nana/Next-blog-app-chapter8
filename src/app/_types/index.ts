// ========================================================================
// 1. データモデルの型 (アプリケーションの核となるデータの形)
// ========================================================================
export type Post = {
  id: number;
  title: string;
  thumbnailImageKey: string
  content: string;
  createdAt: string;
  postCategories: { category: Category }[]; // カテゴリーは配列で、各カテゴリーはidとnameを持つ
};

export interface Category {
  id: number;
  name: string;
}

// ========================================================================
// 2. APIリクエストの型 (フロントエンドからサーバーへ送るデータ)
// ========================================================================
// Requestリクエスト(送る時)、フロント側ではdataToSendの型


// --- カテゴリー関連 ---
//カテゴリー新規作成（categories/new）時のリクエストボディ */
export interface CreateCategoryRequestBody {
  name: string;
}

//カテゴリー更新（カテゴリー編集）(categories/[id])時のリクエストボディ */
export interface UpdateCategoryRequestBody { ///api/admin/categories/[id]/route.ts ファイルから引越し
  name: string;
}

// --- 記事関連 ---

//新規記事作成(posts/new)時のリクエストボディ */
export interface CreatePostRequestBody {///api/admin/posts/route.ts ファイルから引越し
  title: string
  content: string
  categories: { id: number }[]
  thumbnailImageKey: string
}

// 記事更新（記事編集）時に送られてくるリクエストのbodyの型(posts/[id]/)
export interface UpdatePostRequestBody {///api/admin/posts/[id]/route.ts ファイルから引越し
  title: string,
  content: string,
  categories: { id: number }[],
  thumbnailImageKey: string
}


// ========================================================================
// 3. APIレスポンスの型 (サーバーからフロントエンドへ返ってくるデータ)
// ========================================================================

// 【GET】カテゴリー一覧取得APIのレスポンスの型
export interface GetCategoriesResponse {//カテゴリー一覧配列で返るため複数
  status: string;
  categories: Category[];
}

// 【GET】単一カテゴリー取得APIのレスポンスの型
export interface GetCategoryResponse {
  status: string;
  category: Category;
}

// 【POST】カテゴリー作成APIのレスポンスの型
export interface CreateCategoryResponse {
  status: string;
  message: string;
  id: number;
}

// 【PUT】単一カテゴリー更新APIのレスポンス
export interface UpdateCategoryResponse {
  status: string;
  category: Category;
}


// --- 記事関連 ---
/** 【GET】記事一覧取得APIのレスポンス */
export interface GetPostsResponse {
  status: string;
  posts: Post[];
}

/** 【GET】単一記事取得APIのレスポンス */
export interface GetPostResponse {
  status: string;
  post: Post;
}

/** 【POST】記事作成APIのレスポンス */
export interface CreatePostResponse {
  status: string;
  message: string;
  id: number;
}

/** 【PUT】単一記事（記事編集）更新APIのレスポンス */
export interface UpdatePostResponse {
  status: string;
  post: Post;
}



// ここから不要になるはず
// Responseレスポンス(取得する時)、バックエンドからのレスポンス、フロント側ではdataの型
//カテゴリー情報取得(categories/[id])
// export interface CategoryResponseBody {
//   // APIは { "status": "ok", "category": Category } の形で返している
//   name: string;
// }


// //カテゴリー一覧取得(レスポンス）
// // // APIは { "status": "OK", "categories": Category[] } の形で返している
// export interface CategoriesResponseBody {//カテゴリー一覧配列で返るため複数
//   status: string;
//   categories: Category[];
// }
