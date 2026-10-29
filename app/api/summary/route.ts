import { GoogleGenerativeAI } from "@google/generative-ai";

export async function GET() {
  return Response.json({
    status: "ok",
  });
}

export async function POST(
  request: Request
) {
  try {
    const { transcript } =
      await request.json();

    if (!transcript?.trim()) {
      return Response.json(
        {
          success: false,
          error: "회의 원문이 없습니다.",
        },
        {
          status: 400,
        }
      );
    }

    const genAI =
      new GoogleGenerativeAI(
        process.env.GEMINI_API_KEY!
      );

    const model =
      genAI.getGenerativeModel({
        model: "gemini-3.5-flash-lite",
      });

    const prompt = `
당신은 전문 회의록 작성 비서입니다.

아래 회의 내용을 분석하여 정리해주세요.

# 회의 요약
회의 핵심 내용을 요약

# 주요 논의사항
- 항목별 정리

# 결정사항
- 실제로 결정된 내용만 작성

# 액션 아이템
- 해야 할 일 목록

회의 내용:

${transcript}
`;

    const result =
      await model.generateContent(
        prompt
      );

    const summary =
      result.response.text();

    return Response.json({
      success: true,
      summary,
    });
  } catch (error) {
    console.error(
      "GEMINI ERROR:",
      error
    );

    return Response.json(
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