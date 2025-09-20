import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { GetPostResponse, Post, UpdatePostRequestBody, UpdatePostResponse } from "@/app/_types"
import { supabase } from "@/utils/supabase"


const prisma = new PrismaClient()

export const GET = async (
  request: NextRequest, { params }: { params: { id: string } },
) => {
  const token = request.headers.get('Authorization') ?? '';
  //supabaseに対してtokenを送る
  const { error: authError } = await supabase.auth.getUser(token);
  // 送ったtokenが正しくない場合、errorが返却されるので、クライアントにもエラーを返す
  if (authError)
    return NextResponse.json({ status: authError.message }, { status: 400 })
  // tokenが正しい場合、以降が実行される

  const { id } = params
  try {
    //（データベースから来た投稿データとしてpostFromDbと命名）
    const postFromDb = await prisma.post.findUnique({
      where: {
        id: parseInt(id),
      },
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
    })

    // ▼▼▼ 修正箇所 ▼▼▼
    // postが見つからなかった場合の処理
    if (!postFromDb) {
      return NextResponse.json(
        { status: "error", message: `ID:${id}の記事が見つかりませんでした。` },
        { status: 404 }
      );
    }

    // createdAt を文字列に変換
    const post: Post = {
      ...postFromDb,
      createdAt: postFromDb.createdAt.toISOString(),
    };
    // ▲▲▲修正箇所 ▲▲▲

    return NextResponse.json<GetPostResponse>({ status: "OK", post: post }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 })
  }
}


// 記事の更新時に送られてくるリクエストのbodyの型 →Post.tsへお引越し
// interface UpdatePostRequestBody {
//   title: string,
//   content: string,
//   categories: { id: number }[],
//   thumbnailUrl: string
// }

// PUTという命名にすることで、PUTリクエストの時にこの関数が呼ばれる
export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } },// ここでリクエストパラメータを受け取る、APIが最初に受け取ったID
) => {
  const token = request.headers.get('Authorization') ?? '';
  const { error: authError } = await supabase.auth.getUser(token);

  if (authError) {
    return NextResponse.json({ status: authError.message }, { status: 401 });
  }
  // paramsの中にidが入っているので、それを取り出す
  const { id } = params//処理している記事のID

  // リクエストのbodyを取得
  const { title, content, categories, thumbnailImageKey }: UpdatePostRequestBody = await request.json()
  try {
    // ▼▼▼ 修正箇所 ▼▼▼
    // 記事本体を更新
    await prisma.post.update({
      where: {
        id: parseInt(id),
      },
      data: {
        title,
        content,
        thumbnailImageKey
      },
    })

    // カテゴリーの中間テーブルを更新
    // 一旦、記事とカテゴリーの中間テーブルのレコードを全て削除
    await prisma.postCategory.deleteMany({
      where: {
        postId: parseInt(id)
      },
    })
    // 記事とカテゴリーの中間テーブルのレコードをDBに生成
    // 本来複数同時生成には、createManyというメソッドがあるが、sqliteではcreateManyが使えないので、for文1つずつ実施
    for (const category of categories) {
      await prisma.postCategory.create({
        data: {
          postId: parseInt(id), // post.id の代わりに params の id を使います
          categoryId: category.id,
        },
      })
    }

    // フロントに返すため、最新で完全なデータをデータベースから再取得
    const updatedPostFromDb = await prisma.post.findUnique({
      where: { id: parseInt(id) },
      include: {
        postCategories: {
          include: {
            category: { select: { id: true, name: true } },
          },
        },
      },
    });

    // 再取得したデータが見つからない場合の対応
    if (!updatedPostFromDb) {
      throw new Error("更新後の記事の再取得に失敗しました。");
    }
    // createdAt を文字列に変換し、フロントエンド用のPost型に整える
    const post: Post = {
      ...updatedPostFromDb,
      createdAt: updatedPostFromDb.createdAt.toISOString(),
    };
    // 型を整えた完全なデータをレスポンスとして返す
    return NextResponse.json<UpdatePostResponse>({ status: "OK", post: post }, { status: 200 })

    // ▲▲▲ 修正箇所ここまで ▲▲▲

  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 })
  }
}

// DELETEという命名にすることで、DELETEリクエストの時にこの関数が呼ばれる
export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } },// ここでリクエストパラメータを受け取る
) => {
  const token = request.headers.get('Authorization') ?? '';
  const { error: authError } = await supabase.auth.getUser(token);

  if (authError) {
    return NextResponse.json({ status: authError.message }, { status: 401 });
  }

  // paramsの中にidが入っているので、それを取り出す
  const { id } = params;

  try {
    await prisma.post.delete({
      where: {
        id: parseInt(id),
      },
    })
    // レスポンスを返す
    return NextResponse.json({ status: "OK" }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 })
  }
}
