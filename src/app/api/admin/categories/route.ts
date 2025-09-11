import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { CreateCategoryRequestBody, CreateCategoryResponse, GetCategoriesResponse } from "@/app/_types";
import { supabase } from "@/utils/supabase";

const prisma = new PrismaClient()

export const GET = async (request: NextRequest) => {
  const token = request.headers.get('Authorization') ?? '';
  //supabaseに対してtokenを送る
  const { error } = await supabase.auth.getUser(token);
  // 送ったtokenが正しくない場合、errorが返却されるので、クライアントにもエラーを返す
  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 })
  // tokenが正しい場合、以降が実行される
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })
    // ▼ 修正箇所: NextResponse.jsonに、レスポンスの型 <GetCategoriesResponse> を指定する ▼
    return NextResponse.json<GetCategoriesResponse>({ status: "OK", categories }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 })
  }
}

// interface CreateCategoryRequestBody {→型宣言Post.tsへお引越し
//   name: string;
// }

// POSTという命名にすることで、POSTリクエストの時にこの関数が呼ばれる
export const POST = async (request: NextRequest, context: any) => {
  const token = request.headers.get('Authorization') ?? '';
  //supabaseに対してtokenを送る
  const { error } = await supabase.auth.getUser(token);
  // 送ったtokenが正しくない場合、errorが返却されるので、クライアントにもエラーを返す
  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 })
  // tokenが正しい場合、以降が実行される
  try {
    // リクエストのbodyを取得
    const body = await request.json()
    // bodyの中からnameを取り出す
    const { name }: CreateCategoryRequestBody = body;
    // カテゴリーをDBに生成
    const data = await prisma.category.create({
      data: {
        name,
      },
    })
    return NextResponse.json<CreateCategoryResponse>({
      status: "OK",
      message: "カテゴリーを作成しました",
      id: data.id,
    })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 })
  }
}
