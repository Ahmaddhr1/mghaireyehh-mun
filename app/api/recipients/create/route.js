import Recipient from "@/models/Recipient";
import { connectToDB } from "@/lib/connectDb";
import { NextResponse } from "next/server";

const allowedFinancialSituations = ["poor", "very poor"];

export async function POST(req) {
  try {
    await connectToDB();
    const body = await req.json();
    const { fullName, phoneNumber, financialSituation } = body;

    if (!fullName) {
      return NextResponse.json(
        { error: "الاسم الكامل مطلوب." },
        { status: 400 }
      );
    }
    if (!phoneNumber) {
      return NextResponse.json(
        { error: "رقم الهاتف مطلوب." },
        { status: 400 }
      );
    }
    if (!financialSituation) {
      return NextResponse.json(
        { error: "الوضع المالي مطلوب." },
        { status: 400 }
      );
    }
    if (!allowedFinancialSituations.includes(financialSituation)) {
      return NextResponse.json(
        { error: "الوضع المالي غير صالح." },
        { status: 400 }
      );
    }

    const existing = await Recipient.findOne({ phoneNumber });
    if (existing) {
      return NextResponse.json(
        { error: "رقم المستفيد موجود مسبقًا." },
        { status: 400 }
      );
    }

    const newRecipient = await Recipient.create({
      fullName,
      phoneNumber,
      financialSituation,
    });

    return NextResponse.json(
      { message: "تم إنشاء المستفيد بنجاح!", recipient: newRecipient },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating recipient:", error);
    return NextResponse.json(
      { error: "حدث خطأ ما، يرجى المحاولة لاحقًا." },
      { status: 500 }
    );
  }
}
