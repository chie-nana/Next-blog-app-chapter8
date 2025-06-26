import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

// GETという命名にすることで、GETリクエストの時にこの関数が呼ばれる
export const GET = async (request: NextRequest) => {
  try {
    // Postの一覧をDBから取得
    const posts = await prisma.post.findMany({
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

    // レスポンスを返す
    return NextResponse.json({ status: "OK", posts: posts }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 })
  }
}
