import { User } from "@/libs/models";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    //我使用的是mysql数据库
    const newUser = await User.findAll();
    return NextResponse.json({
      code: 0,
      data: newUser,
      message: "success",
    });
  } catch (error) {}
}
