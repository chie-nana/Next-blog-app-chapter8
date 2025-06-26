import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export const GET = async (request: NextRequest, { params }: { params: { id: string } },// ここでリクエストパラメータを受け取る)
) => {
  // paramsの中にidが入っているので、それを取り出す
  const { id } = params//分割代入

  try {
    // idを元にPostをDBから取得
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(id)
      },
      include: {
        postCategories: {
          include: {
            // カテゴリーも含めて取得
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
    // レスポンスを返す
    return NextResponse.json({ status: "OK", post: post }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 })
  }
}
