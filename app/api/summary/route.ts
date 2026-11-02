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
당신은 공공기관 회의록 작성 전문가입니다.

회의 내용을 분석하여 아래 형식으로만 작성하세요.

■ 회의 개요

■ 주요 논의사항

■ 결정사항

■ 후속조치

■ 향후 일정

각 항목은 Bullet(-) 형식으로 작성하고, 그 아래는 (·)형식으로 작성하세요.

3줄 이상 장황하게 작성하지 말고 핵심만 정리하세요.

추측 금지.
회의에서 언급되지 않은 내용 작성 금지.

작성할 수 없는 항목은 작성하지 마세요.

주요논의사항은 안건별로 자세하게 작성하되 문장은 간결하고, 보고용으로 작성하세요.

또한 최대한 1장 이내로 정리할 수 있는 회의록으로 작성하세요.

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