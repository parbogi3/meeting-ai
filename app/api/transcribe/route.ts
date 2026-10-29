import { NextResponse } from "next/server";

export async function POST(
  request: Request
) {
  try {
    const { audioUrl } =
      await request.json();

    if (!audioUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "audioUrl is required",
        },
        {
          status: 400,
        }
      );
    }

    const response =
      await fetch(audioUrl);

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error:
            "오디오 파일 다운로드 실패",
        },
        {
          status: 500,
        }
      );
    }

    const arrayBuffer =
      await response.arrayBuffer();

    const buffer =
      Buffer.from(arrayBuffer);

    console.log(
      "AUDIO SIZE:",
      buffer.length
    );

    return NextResponse.json({
      success: true,
      transcript:
        "파일 다운로드 성공",
      fileSize: buffer.length,
    });
  } catch (error) {
    console.error(error);

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