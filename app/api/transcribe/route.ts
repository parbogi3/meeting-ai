import { NextResponse } from "next/server";

export async function POST(
  request: Request
) {
  try {
    const body = await request.json();

    const { audioUrl } = body;

    console.log(audioUrl);

    return NextResponse.json({
      transcript:
        "테스트 회의록입니다.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: String(error),
      },
      { status: 500 }
    );
  }
}