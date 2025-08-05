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
