import { getAuthUser } from "@/lib/auth";
import { getMongoDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

type Context = {
  params: Promise<{ slideId: string }>;
};

export async function GET(_: Request, context: Context) {
  const user = await getAuthUser();
  if (!user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { slideId } = await context.params;

  const db = await getMongoDb();
  const slide = await db.collection("homepage_slides").findOne({ _id: new ObjectId(slideId) });

  if (!slide) {
    return Response.json({ message: "Homepage slide not found" }, { status: 404 });
  }

  return Response.json({
    success: true,
    data: {
      ...slide,
      _id: String(slide._id),
    },
  });
}
