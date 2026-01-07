import { NextResponse } from "next/server";
import { searchMovies } from "@/services/movies";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json([]);
  }

  try {
    const movies = await searchMovies(query);
    return NextResponse.json(movies);
  } catch {
    return NextResponse.json(
      { error: "Failed to search movies" },
      { status: 500 }
    );
  }
}
