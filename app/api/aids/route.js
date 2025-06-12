import { connectToDB } from "@/lib/connectDb";
import Aid from "@/models/Aid";
import Recipient from "@/models/Recipient";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDB();
  try {
    const aids = await Aid.find().populate(
      "recipients",
      "fullName phoneNumber"
    );
    return NextResponse.json(aids);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}



export async function POST(req) {
  await connectToDB();
  try {
    const { type, description } = await req.json();
    
    // التحقق من المدخلات
    if (!type || !description) {
      return NextResponse.json(
        { error: "نوع المعونة ووصفها مطلوبان" },
        { status: 400 }
      );
    }

    if (!["financial", "moral"].includes(type)) {
      return NextResponse.json(
        { error: "نوع المعونة غير صحيح" },
        { status: 400 }
      );
    }

    const newAid = await Aid.create({ type, description });
    return NextResponse.json(newAid, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { error: error.message || "فشل إنشاء المعونة" },
      { status: 500 }
    );
  }
}
