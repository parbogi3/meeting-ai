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

    const genAI =
      new GoogleGenerativeAI(
        process.env.GEMINI_API_KEY!
      );

    const model =
      genAI.getGenerativeModel({
        model: "gemini-3.5-flash-lite",
      });

    const result =
      await model.generateContent(
        transcript
      );

    const summary =
      result.response.text();

    console.log(
      "SUMMARY:",
      summary
    );

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