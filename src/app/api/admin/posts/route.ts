//記事作成API  src/app/api/admin/posts/route.ts

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client"
import { CreatePostRequestBody, CreatePostResponse, GetPostsResponse, Post } from "@/app/_types";

const prisma = new PrismaClient();

export const GET = async (request: NextRequest) => {
  try {
    const postsFromDb = await prisma.post.findMany({
      include: {
        postCategories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    // ▼▼▼修正箇所 ▼▼▼
    // フロントエンドのPost型に合わせて、Dateオブジェクトを文字列に変換
    const posts: Post[] = postsFromDb.map(post => ({
      ...post,
      createdAt: post.createdAt.toISOString(), // Dateを文字列に変換？？
    }));
    // ▲▲▲ 修正箇所 ▲▲▲
    return NextResponse.json<GetPostsResponse>({ status: "OK", posts: posts }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 })
  }
}


// // 記事作成のリクエストボディの型→共通のPost型へお引越し
// interface CreatePostRequestBody {
//   title: string
//   content: string
//   categories: { id: number }[]
//   thumbnailUrl: string
// }

// POSTという命名にすることで、POSTリクエストの時にこの関数が呼ばれる
// ▼ 修正箇所: 使われていない `context: any` を削除
export const POST = async (request: NextRequest) => {
  try {
    // リクエストのbodyを取得
    const body = await request.json()

    // bodyの中からtitle, content, categories, thumbnailUrlを取り出す(分割代入)
    const { title, content, categories, thumbnailUrl }: CreatePostRequestBody = body

    // 投稿をDBに生成
    const data = await prisma.post.create({
      data: {
        title,
        content,
        thumbnailUrl,
      },
    })
    // 記事とカテゴリーの中間テーブルのレコードをDBに生成
    // 本来複数同時生成には、createManyというメソッドがあるが、sqliteではcreateManyが使えないので、for文1つずつ実施
    for (const category of categories) {
      await prisma.postCategory.create({
        data: {
          categoryId: category.id,
          postId: data.id,
        },
      })
    }

    // レスポンスを返す
    // ▼ 修正箇所 ▼
    return NextResponse.json<CreatePostResponse>({
      status: "OK",
      message: "作成しました",
      id: data.id,
    })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 })
    }
  }
}
