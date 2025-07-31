"use client"; //クライアントサイドで実行

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Post } from "@/app/_types/Post";
import Image from "next/image";
import classes from "@/app/_styles/PostDetail.module.css";

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
    <div className={classes.detailContainer}>
      <div className={classes.detailMain}>
        {/* Imageの最適化。Next.jsではimgではなくImage推奨 */}
        <div className={classes.detailImgBox}>
          <Image
            src={post.thumbnailUrl}
            alt={post.title}
            width={800}
            height={400}
            className={classes.detailImg}
          />
        </div>

        <div className={classes.postWrapper}>
          <time className={classes.detailDate}>
            {new Date(post.createdAt).toLocaleDateString()}
          </time>
          <div>
            {post.postCategories.map((pc) => {
              return (
                <span key={pc.category.id} className={classes.postCategory}>{pc.category.name}</span>
              );
            })}
          </div>
        </div>
        <h2 className="title">APIで取得した{post.title}</h2>
        <p className={classes.detailContent} dangerouslySetInnerHTML={{ __html: post.content }}></p>
      </div>
    </div>
  );
};

export default PostDetail; // ← App Routerで使用するためdefault exportに変更
