export async function generateSummary(
  transcript: string
) {
  const response = await fetch(
    "/api/summary",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        transcript,
      }),
    }
  );

  return response.json();
}