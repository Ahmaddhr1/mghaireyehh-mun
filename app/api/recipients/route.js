import Recipient from "@/models/Recipient";
import { connectToDB } from "@/lib/connectDb";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = 20;
  const skip = (page - 1) * limit;

  await connectToDB();

  try {
    const total = await Recipient.countDocuments();
    const recipients = await Recipient.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalPages = Math.ceil(total / limit);

    return new Response(JSON.stringify({ recipients, totalPages, page }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: "خطأ في الخادم" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
