export const runtime = "edge";

export async function POST({ request }) {
  try {
    const body = await request.json();

    return new Response(
      JSON.stringify({
        success: true,
        message: "OK",
        data: body,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Invalid request",
      }),
      { status: 400 }
    );
  }
}
