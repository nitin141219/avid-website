import { getAuthUser } from "@/lib/auth";
import { getMongoDb } from "@/lib/mongodb";

export async function GET(request: Request) {
  const user = await getAuthUser();
  if (!user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page") || "1"));
  const limit = Math.max(1, Number(searchParams.get("limit") || "10"));
  const skip = (page - 1) * limit;

  const db = await getMongoDb();
  const collection = db.collection("homepage_slides");

  const [slides, total] = await Promise.all([
    collection.find({}).sort({ position: 1, created_at: -1 }).skip(skip).limit(limit).toArray(),
    collection.countDocuments({}),
  ]);

  return Response.json({
    success: true,
    data: {
      slides: slides.map((slide: any) => ({
        ...slide,
        _id: String(slide._id),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    },
  });
}
