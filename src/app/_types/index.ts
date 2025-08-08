export type Post = {
  id: number;
  title: string;
  thumbnailUrl: string;
  content: string;
  createdAt: string;
  postCategories: { category: Category }[]; // カテゴリーは配列で、各カテゴリーはidとnameを持つ
};

export interface Category {
  id: number;
  name: string;
}

// Requestリクエスト(送る時)、フロント側ではdataToSendの型
//1.カテゴリー新規作成（categories/new）
export interface CreateCategoryRequestBody {
  name: string;
}

//2.カテゴリー更新（カテゴリー編集）(categories/[id])
export interface UpdateCategoryRequestBody { ///api/admin/categories/[id]/route.ts ファイルから引越し
  name: string;
}

//新規記事作成(posts/new)
export interface CreatePostRequestBody {///api/admin/posts/route.ts ファイルから引越し
  title: string
  content: string
  categories: { id: number }[]
  thumbnailUrl: string
}

// 記事更新（記事編集）時に送られてくるリクエストのbodyの型(posts/[id]/)
export interface UpdatePostRequestBody {///api/admin/posts/[id]/route.ts ファイルから引越し
  title: string,
  content: string,
  categories: { id: number }[],
  thumbnailUrl: string
}



// Responseレスポンス(取得する時)、バックエンドからのレスポンス、フロント側ではdataの型
//2.カテゴリー情報取得(categories/[id])
export interface CategoryResponseBody {
  // APIは { "status": "ok", "category": Category } の形で返している
  name: string;
}

//カテゴリー一覧(レスポンス）
// // APIは { "status": "OK", "categories": Category[] } の形で返している
export interface CategoriesResponseBody {//カテゴリー一覧配列で返るため複数
  status: string;
  categories: Category[];
}
