import { connectToDB } from "@/lib/connectDb";
import Recipient from "@/models/Recipient";
import Aid from "@/models/Aid";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  const { id: recipientId } = params;

  try {
    await connectToDB();

    const deletedRecipient = await Recipient.findByIdAndDelete(recipientId);

    if (!deletedRecipient) {
      return NextResponse.json(
        { error: "المستفيد غير موجود" },
        { status: 404 }
      );
    }

    // إزالة المستفيد من جميع المعونات
    await Aid.updateMany({ recipients: recipientId }, { $pull: { recipients: recipientId } });

    // حذف المعونات التي ليس لها أي مستفيدين
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
  const { id: recipientId } = params;

  try {
    const recipient = await Recipient.findById(recipientId).populate("aids.aid");

    if (!recipient) {
      return NextResponse.json(
        { error: "المستفيد غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json(recipient);
  } catch (error) {
    console.log(error.message);
    return NextResponse.json(
      { error: error.message || "حدث خطأ أثناء جلب البيانات" },
      { status: 500 }
    );
  }
}
