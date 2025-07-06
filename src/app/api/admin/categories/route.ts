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
      return NextResponse.json({ status: error.message }, { status: 400 })
  }
}


interface UpdateCategoryRequestBody {
  name: string;
}

export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
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
    return NextResponse.json({ status: "OK", category }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 })
  }
}

export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
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
