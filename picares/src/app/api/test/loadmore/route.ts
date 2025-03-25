import { success } from "@/utils/resultUtils";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return success(true);
}
