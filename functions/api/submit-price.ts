export async function POST({ request }) {
  try {
    const body = await request.json();

    return new Response(
      JSON.stringify({
        success: true,
        message: "submit-price OK",
        data: body,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Invalid request",
      }),
      {
        status: 400,
      }
    );
  }
}
