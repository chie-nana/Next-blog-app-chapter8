//api/posts/route.ts

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { GetPostsResponse, Post } from "@/app/_types";


const prisma = new PrismaClient();

// GETという命名にすることで、GETリクエストの時にこの関数が呼ばれる
export const GET = async (request: NextRequest) => {
  try {
    // Postの一覧をDBから取得
    // データベースから取得したデータを一時的な変数に格納します
    const postsFromDb = await prisma.post.findMany({
      include: {
        // カテゴリーも含めて取得
        postCategories: {
          include: {
            category: {
              // カテゴリーのidとnameだけ取得
              select: {
                id: true,
                name: true, // ← カンマあり（まだ終わってない）
              },// ← selectのオブジェクト終了
            },// ← categoryオブジェクト終了
          }, // ← includeオブジェクト終了
        },// ← postCategoriesオブジェクト終了
      },// ← includeオブジェクト終了
      // 作成日時の降順で取得
      orderBy: {
        createdAt: "desc",
      }, // ← orderByオブジェクト終了
    })// ← findManyの()終了


    // ▼ 修正点2: フロントエンドのPost型に合わせて、Dateオブジェクトを文字列に変換
    const posts: Post[] = postsFromDb.map(post => ({
      ...post,
      createdAt: post.createdAt.toISOString(), // Dateを文字列に変換
    }));

    // レスポンスを返す
    return NextResponse.json<GetPostsResponse>({ status: "OK", posts: posts }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 })
  }
}
