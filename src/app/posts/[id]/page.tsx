"use client"; //クライアントサイドで実行

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Post } from "@/types/Post";
import Image from "next/image";

export const PostDetail: React.FC = () => {
  const params = useParams(); // ← useParamsフックはNext.jsではオブジェクト型で返される
  const id = params?.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  // useEffect を使って、記事詳細APIからデータを取得する
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/posts/${id}`);
        if (!res.ok) throw new Error("記事の取得に失敗しました！！！");
        const data = await res.json();
        setPost(data.post); //setPost(data);になっていたせいでデータが表示されなかった
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return <p>読み込み中</p>;
  if (error) return <p>エラー:{error}</p>;
  if (!post) return <p>記事が見つかりませんでした</p>;
  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="mb-4">
        {/* Imageの最適化。Next.jsではimgではなくImage推奨 */}
        <div>
          <Image
            src={post.thumbnailUrl}
            alt={post.title}
            width={800}
            height={400}
            className="rounded"
          />
        </div>

        <div className="flex items-center justify-between mb-2">
          <time className="text-sm text-gray-500">
            {new Date(post.createdAt).toLocaleDateString()}
          </time>
          <div className="space-x-2">
            {post.categories.map((category) => {
              return (
                <span key={category} className="text-xs text-white bg-blue-600 px-2 py-1 rounded">{category}</span>
              );
            })}
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-4">APIで取得した{post.title}</h2>
        <p className="prose" dangerouslySetInnerHTML={{ __html: post.content }}></p>
      </div>
    </div>
  );
};

export default PostDetail; // ← App Routerで使用するためdefault exportに変更
