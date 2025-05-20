"use client"

import { useEffect, useState } from "react";
import Link from "next/link";

type Post = {
  id: string;
  title: string;
  thumbnailUrl: string;
  createdAt: string;
  categories: string[];
  content: string;
}

const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetcher = async () => {
      try {
        const res = await fetch("https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/posts");
        if (!res.ok) throw new Error("記事の取得に失敗しました")
        const data = await res.json();
        setPosts(data.posts)
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetcher();
  }, []);
  if (loading) {
    return <p>読み込み中</p>;
  }
  if (error) {
    return <p>エラー:{error}</p>;
  }
  if (posts.length === 0) {
    return <p>記事が見つかりませんでした</p>;
  }

  return (
    <div className="px-6 py-8">
      <ul className="space-y-6"> {/* mapメソッドで記事データを取得し繰り返し表示 */}
        {posts.map((post) => (
          <li key={post.id} className="border-b pb-4">
            <Link href={`/posts/${post.id}`}>
              <div className="mb-2">
                {/* 日付をJavascriptのnew Date()で返し、toLocaleDateString()で整えて表示する */}
                <time className="text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </time>
                {/* カテゴリーをmapメソッドで取得し表示する */}
                <div className="space-x-2 mt-1">
                  {post.categories.map((category) => {
                    return (
                      <span key={category} className="text-xs text-white bg-blue-600 px-2 py-1 rounded">
                        {category}
                      </span>
                    );
                  })}
                </div>
              </div>
              <h2 className="text-xl font-bold mt-2">{post.title}</h2>
              {/* ReactでHTMLをそのまま表示:dangerouslySetInnerHTML属性を使用 */}
              <p className="text-gray-700 mt-1" dangerouslySetInnerHTML={{ __html: post.content }}>
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default Home;
