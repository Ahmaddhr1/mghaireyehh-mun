import { connectToDB } from "@/lib/connectDb";
import Recipient from "@/models/Recipient";
import Aid from "@/models/Aid";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  const { id } = await params;

  try {
    await connectToDB();

    const deletedRecipient = await Recipient.findByIdAndDelete(id);

    if (!deletedRecipient) {
      return NextResponse.json({ error: "المستفيد غير موجود" }, { status: 404 });
    }

    await Aid.deleteMany({ recipient: id });

    return NextResponse.json({ message: "تم حذف المستفيد وجميع المعونات المرتبطة به بنجاح" });
  } catch (error) {
    console.error("Error deleting recipient and aids:", error);
    return NextResponse.json({ error: "حدث خطأ أثناء الحذف" }, { status: 500 });
  }
}
