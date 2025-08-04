//app/page.tsx
"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import { Post } from "@/app/_types/Post";

const Home = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetcher = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/posts')// Nextjsの自作APIへ変更
        const { posts } = await res.json()
        setPosts(posts)
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetcher()
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
    <div className="max-w-[50.00rem] my-10  m-auto  py-0  px-8">
      <ul className="p-0 list-none">
        {posts.map((post) => (
          <li key={post.id} className="border-[1.5px] border-[#bbbbbb] mb-10 p-5">
            <Link href={`/posts/${post.id}`} className="no-underline text-[#333]">
              <div className="flex items-center justify-between mb-5 text-[0.80rem] text-[#999]">
                {/* 日付をJavascriptのnew Date()で返し、toLocaleDateString()で整えて表示する */}
                <time>
                  {new Date(post.createdAt).toLocaleDateString()}
                </time>
                {/* カテゴリーをmapメソッドで取得し表示する */}
                <div>
                  {post.postCategories.map((pc) => {
                    return (
                      <span key={pc.category.id} className="border-[1px] border-[#2e64a2] rounded-sm p-1.5 mr-3.5 text-[#2e64a2]">
                        {pc.category.name}</span>
                    );
                  })}
                </div>
              </div>
              <h2 className="text-2xl mb-3">{post.title}</h2>
              {/* ReactでHTMLをそのまま表示:dangerouslySetInnerHTML属性を使用 */}
              <p className="overflow-hidden text-ellipsis line-clamp-2" dangerouslySetInnerHTML={{ __html: post.content }}>
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default Home;
