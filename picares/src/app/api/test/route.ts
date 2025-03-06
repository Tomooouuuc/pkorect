import { check } from "@/app/test";
import { User } from "@/libs/models";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    //我使用的是mysql数据库
    const newUser = await User.findAll();
    console.log(check("restesst"));
    console.log(newUser);
    return NextResponse.json({
      code: 0,
      data: newUser,
      message: "success",
    });
  } catch (error) {
    console.error("Error creating user:", error);
  }
}
