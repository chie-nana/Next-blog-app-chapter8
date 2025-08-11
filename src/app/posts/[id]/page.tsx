"use client"; //クライアントサイドで実行

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Post } from "@/app/_types";
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
        const res = await fetch(`/api/posts/${id}`); // Next.jsの自作APIへ変更
        if (!res.ok) throw new Error("記事の取得に失敗しました！！！");
        const { post } = await res.json();
        setPost(post); //setPost(data);になっていたせいでデータが表示されなかった
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
    <div className="max-w-[50.00rem] my-12  m-auto  py-0  px-8">
      <div>
        {/* Imageの最適化。Next.jsではimgではなくImage推奨 */}
        <div className="w-3/4 my-8 m-auto">
          <Image
            src={post.thumbnailUrl}
            alt={post.title}
            width={800}
            height={400}
            className="w-full"
          />
        </div>

        <div className="flex items-center justify-between mt-5 mb-5 text-[0.80rem] text-[#333]">
          <time>
            {new Date(post.createdAt).toLocaleDateString()}
          </time>
          <div>
            {post.postCategories.map((pc) => {
              return (
                <span key={pc.category.id} className="rounded-sm p-1.5 mr-3.5 text-[#2e64a2] border-[1px] border-[#2e64a2]">{pc.category.name}</span>
              );
            })}
          </div>
        </div>
        <h2 className="font-semibold text-2xl mb-5">APIで取得した{post.title}</h2>
        <p dangerouslySetInnerHTML={{ __html: post.content }}></p>
      </div>
    </div>
  );
};

export default PostDetail; // ← App Routerで使用するためdefault exportに変更
