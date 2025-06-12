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
      return NextResponse.json(
        { error: "المستفيد غير موجود" },
        { status: 404 }
      );
    }
    
    await Aid.updateMany({ recipients: id }, { $pull: { recipients: id } });

    // Optionally delete any Aid with no recipients left
    await Aid.deleteMany({ recipients: { $size: 0 } });

    return NextResponse.json({
      message: "تم حذف المستفيد وجميع المعونات المرتبطة به بنجاح",
    });
  } catch (error) {
    console.error("Error deleting recipient and aids:", error);
    return NextResponse.json({ error: "حدث خطأ أثناء الحذف" }, { status: 500 });
  }
}

export async function GET(req, { params }) {
  await connectToDB();
  const { id } = await params;
  try {
    const recipient = await Recipient.findById(id).populate("aids");
    if (!recipient) {
      return NextResponse.json(
        { error: "المستفيد غير موجود" },
        { status: 404 }
      );
    }
    return NextResponse.json(recipient);
  } catch (e) {
    console.log(e.message);
    return NextResponse.json(
      { error: e.message || "حدث خطأ أثناء جلب البيانات" },
      { status: 500 }
    );
  }
}
