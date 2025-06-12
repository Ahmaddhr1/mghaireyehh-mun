import { connectToDB } from "@/lib/connectDb";
import Aid from "@/models/Aid";
import Recipient from "@/models/Recipient";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  await connectToDB();
  const { id: aidId } = await params;

  try {
    let { id } = await req.json();
    console.log("RECIPIENTT ID:" + id);
    console.log("AIDDD ID" + aidId);

    // التحقق من البيانات المدخلة
    if (!id) {
      return NextResponse.json(
        { error: "معرف المستفيد مطلوب" },
        { status: 400 }
      );
    }

    // البحث عن المعونة والمستفيد
    const [aid, recipient] = await Promise.all([
      Aid.findById(aidId),
      Recipient.findById(id),
    ]);

    if (!aid) {
      return NextResponse.json(
        { error: "المعونة غير موجودة" },
        { status: 404 }
      );
    }

    if (!recipient) {
      return NextResponse.json(
        { error: "المستفيد غير موجود" },
        { status: 404 }
      );
    }

    // منع التعيين المكرر
    if (aid.recipients.includes(id)) {
      return NextResponse.json(
        { error: "هذه المعونة مسندة بالفعل لهذا المستفيد" },
        { status: 409 }
      );
    }

    // تحديث البيانات في المعونة والمستفيد
    await Promise.all([
      Aid.findByIdAndUpdate(aidId, { $push: { recipients: id } }),
      Recipient.findByIdAndUpdate(id, {
        $push: { aids: aidId },
        $inc: {
          [`${
            aid.type === "financial" ? "financialAidCount" : "moralAidCount"
          }`]: 1,
        },
      }),
    ]);

    return NextResponse.json(
      { message: "تم إسناد المعونة بنجاح" },
      { status: 200 }
    );
  } catch (error) {
    console.error("خطأ في إسناد المعونة:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء إسناد المعونة" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    await connectToDB();

    const deletedAid = await Aid.findByIdAndDelete(id);
    if (!deletedAid) {
      return new Response(JSON.stringify({ error: "المعونة غير موجودة" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ message: "تم حذف المعونة بنجاح" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "حدث خطأ أثناء حذف المعونة" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
