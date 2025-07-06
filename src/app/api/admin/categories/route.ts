import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export const GET = async (request: NextRequest) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })
    return NextResponse.json({ status: "OK", categories }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 })
  }
}

interface CreateCategoryRequestBody {
  name: string;
}

// POSTという命名にすることで、POSTリクエストの時にこの関数が呼ばれる
export const POST = async (request: NextRequest, context: any) => {
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
    return NextResponse.json({
      status: "OK",
      message: "カテゴリーを作成しました",
      id: data.id,
    })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({status: error.message}, { status: 400 })
  }
}
