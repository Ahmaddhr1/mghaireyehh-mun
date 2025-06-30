import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/connectDb";
import Recipient from "@/models/Recipient";

export async function GET(req) {
  try {
    await connectToDB();

    const url = new URL(req.url);
    const {
      name = "",
      financialSituation,
      filterBy = "total", // 'total', 'financial', 'moral'
      sortOrder = "asc", // 'asc' or 'desc'
    } = Object.fromEntries(url.searchParams.entries());

    // Build search query
    const query = {};

    if (name) {
      query.fullName = { $regex: name, $options: "i" };
    }
    if (financialSituation && ["poor", "very poor"].includes(financialSituation)) {
      query.financialSituation = financialSituation;
    }

    // Find matching recipients
    let recipients = await Recipient.find(query);

    // Sort by filter
    recipients.sort((a, b) => {
      let aVal = 0, bVal = 0;
      switch (filterBy) {
        case "financial":
          aVal = a.financialAidCount || 0;
          bVal = b.financialAidCount || 0;
          break;
        case "moral":
          aVal = a.moralAidCount || 0;
          bVal = b.moralAidCount || 0;
          break;
        default: // total
          aVal = (a.financialAidCount || 0) + (a.moralAidCount || 0);
          bVal = (b.financialAidCount || 0) + (b.moralAidCount || 0);
          break;
      }

      if (sortOrder === "desc") return bVal - aVal;
      return aVal - bVal;
    });

    return NextResponse.json(recipients, { status: 200 });
  } catch (error) {
    console.error("Error searching recipients:", error);
    return NextResponse.json({ error: "حدث خطأ أثناء البحث" }, { status: 500 });
  }
}
