import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { GetPostResponse, Post } from "@/app/_types";

const prisma = new PrismaClient();

export const GET = async (request: NextRequest, { params }: { params: { id: string } },// ここでリクエストパラメータを受け取る)
) => {
  // paramsの中にidが入っているので、それを取り出す
  const { id } = params//分割代入

  try {
    // idを元にPostをDBから取得
    const postFromDb = await prisma.post.findUnique({
      where: {
        id: parseInt(id)
      },
      include: {
        postCategories: {
          include: { // カテゴリーも含めて取得
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    })
    // ▼ 修正 postが見つからなかった場合の処理を追加(nullの可能性があるとエラーが出てしまう)
    if (!postFromDb) {
      return NextResponse.json(
        { status: "error", message: `ID:${id}の記事が見つかりませんでした。` },
        { status: 404 }
      );
    }

    // ▼ 修正createdAt を文字列に変換（エラー原因解消）
    const post: Post = {
      ...postFromDb,
      createdAt: postFromDb.createdAt.toISOString(),
    };
    // レスポンスを返す
    return NextResponse.json<GetPostResponse>({ status: "OK", post: post }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 })
  }
}
