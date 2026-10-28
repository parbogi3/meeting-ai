import { NextResponse } from "next/server";

export async function POST(
  request: Request
) {
  try {
    const body = await request.json();

    const { audioUrl } = body;

    if (!audioUrl) {
      return NextResponse.json(
        {
          error: "audioUrl is required",
        },
        {
          status: 400,
        }
      );
    }

    console.log(
      "STT 요청:",
      audioUrl
    );

    return NextResponse.json({
      success: true,
      transcript:
        "테스트 회의록입니다.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: String(error),
      },
      {
        status: 500,
      }
    );
  }
}