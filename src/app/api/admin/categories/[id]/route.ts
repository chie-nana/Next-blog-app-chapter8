import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { GetCategoryResponse, UpdateCategoryRequestBody, UpdateCategoryResponse } from "@/app/_types";
import { supabase } from "@/utils/supabase";

const prisma = new PrismaClient();

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {

  const token = request.headers.get('Authorization') ?? '';
  //supabaseに対してtokenを送る
  const { error: authError } = await supabase.auth.getUser(token);// エラー変数の名前を重複しないように変更
  // 送ったtokenが正しくない場合、errorが返却されるので、クライアントにもエラーを返す
  if (authError)
    return NextResponse.json({ status: authError.message }, { status: 400 })
  // tokenが正しい場合、以降が実行される

  const { id } = params;
  try {
    const category = await prisma.category.findUnique({
      where: {
        id: parseInt(id),
      },
    })
    if (!category) {
      return NextResponse.json(
        { status: "error", message: "カテゴリーが見つかりませんでした。" }, { status: 404 } //  Status Code を 404 にする！
      );
    }
    return NextResponse.json<GetCategoryResponse>({ status: "ok", category }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 })
  }
}

export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  const token = request.headers.get('Authorization') ?? '';
  //supabaseに対してtokenを送る
  const { error: authError } = await supabase.auth.getUser(token);// エラー変数の名前を重複しないように変更
  // 送ったtokenが正しくない場合、errorが返却されるので、クライアントにもエラーを返す
  if (authError)
    return NextResponse.json({ status: authError.message }, { status: 400 })
  // tokenが正しい場合、以降が実行される

  const { id } = params;
  const { name }: UpdateCategoryRequestBody = await request.json()

  try {
    const category = await prisma.category.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name,
      },
    })
    // ▼ 修正UpdateCategoryResponse
    return NextResponse.json<UpdateCategoryResponse>({ status: "OK", category }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 })
  }
}

export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
 const token = request.headers.get('Authorization') ?? '';
  //supabaseに対してtokenを送る
  const { error: authError } = await supabase.auth.getUser(token);// エラー変数の名前を重複しないように変更
  // 送ったtokenが正しくない場合、errorが返却されるので、クライアントにもエラーを返す
  if (authError)
    return NextResponse.json({ status: authError.message }, { status: 400 });
  // tokenが正しい場合、以降が実行される

  const { id } = params;
  try {
    await prisma.category.delete({
      where: {
        id: parseInt(id),
      },
    })
    return NextResponse.json({ status: "OK" }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 })
  }
}
