export async function GET() {
  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=health&apiKey=d0e54a7feb68490783afc6b55fdf44be`
    );

    if (!response.ok) throw new Error("Failed to fetch news");

    const data = await response.json();

    return Response.json({ results: data.articles || [] });
  } catch {
  // No use of `error` here
  return Response.json({ message: "Something went wrong" }, { status: 500 });
}

  }
