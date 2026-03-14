import { getAuthUser } from "@/lib/auth";
import { getMongoDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

type Context = {
  params: Promise<{ slideId: string }>;
};

export async function PATCH(request: Request, context: Context) {
  const user = await getAuthUser();
  if (!user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { slideId } = await context.params;
  const payload = await request.json();

  const updateDoc = {
    title_en: payload.title_en || "",
    title_de: payload.title_de || payload.title_en || "",
    title_fr: payload.title_fr || payload.title_en || "",
    title_es: payload.title_es || payload.title_en || "",
    cta_text_en: payload.cta_text_en || "",
    cta_text_de: payload.cta_text_de || payload.cta_text_en || "",
    cta_text_fr: payload.cta_text_fr || payload.cta_text_en || "",
    cta_text_es: payload.cta_text_es || payload.cta_text_en || "",
  };

  const db = await getMongoDb();
  const result = await db.collection("homepage_slides").findOneAndUpdate(
    { _id: new ObjectId(slideId) },
    {
      $set: {
        ...updateDoc,
      },
    },
    { returnDocument: "after" }
  );

  if (!result) {
    return Response.json({ message: "Homepage slide not found" }, { status: 404 });
  }

  return Response.json({
    success: true,
    data: {
      ...result,
      _id: String((result as any)._id),
    },
  });
}
