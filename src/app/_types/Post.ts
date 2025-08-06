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

export interface CreateCategoryRequestBody {
  name: string;
}

export interface UpdateCategoryRequestBody { ///api/admin/categories/[id]/route.ts ファイルから引越し
  name: string;
}

export interface CreatePostRequestBody {///api/admin/posts/route.ts ファイルから引越し
  title: string
  content: string
  categories: { id: number }[]
  thumbnailUrl: string
}

// 記事の更新時に送られてくるリクエストのbodyの型
export interface UpdatePostRequestBody {///api/admin/posts/[id]/route.ts ファイルから引越し
  title: string,
  content: string,
  categories: { id: number }[],
  thumbnailUrl: string
}
