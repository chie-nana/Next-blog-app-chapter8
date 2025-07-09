"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import { Post } from "@/app/_types/Post";
import classes from "@/app/_styles/Home.module.css"

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
    <div className={classes.container}>
      <ul className={classes.ul}>
        {posts.map((post) => (
          <li key={post.id} className={classes.postList}>
            <Link href={`/posts/${post.id}`} className={classes.postLink}>
              <div className={classes.postWrapper}>
                {/* 日付をJavascriptのnew Date()で返し、toLocaleDateString()で整えて表示する */}
                <time className={classes.postDate}>
                  {new Date(post.createdAt).toLocaleDateString()}
                </time>
                {/* カテゴリーをmapメソッドで取得し表示する */}
                <div>
                  {post.postCategories.map((pc) => {
                    return (
                      <span key={pc.category.id} className={classes.postCategory}>
                        {pc.category.name}
                      </span>
                    );
                  })}
                </div>
              </div>
              <h2 className={classes.title}>{post.title}</h2>
              {/* ReactでHTMLをそのまま表示:dangerouslySetInnerHTML属性を使用 */}
              <p className={classes.postContent} dangerouslySetInnerHTML={{ __html: post.content }}>
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default Home;
