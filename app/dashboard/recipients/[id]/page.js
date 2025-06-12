"use client";

import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";
import Loading from "@/components/Loading";

const Page = () => {
  const { id } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["recipient", id],
    queryFn: async () => {
      const response = await axios.get(`/api/recipients/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 items-center">
        <Loading />
        <p>جاري تحميل</p>
      </div>
    );
  }

  if (error || data?.error) {
    return (
      <p className="text-center text-red-500 mt-8">
        حدث خطأ: {data?.error || "تعذر جلب البيانات"}
      </p>
    );
  }

  return (
    <section className="max-w-4xl mx-auto px-4 py-8" dir="rtl">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        معلومات المستفيد
      </h1>

      {/* Recipient Info Card */}
      <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-600">الاسم الكامل</h2>
          <p className="text-gray-900">{data.fullName}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-600">رقم الهاتف</h2>
          <p className="text-gray-900">{data.phoneNumber}</p>
        </div>

        <div className="flex gap-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-600">
              عدد المساعدات المالية
            </h2>
            <p className="text-gray-900">{data.financialAidCount}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-600">
              عدد المساعدات المعنوية
            </h2>
            <p className="text-gray-900">{data.moralAidCount}</p>
          </div>
        </div>
      </div>

      {/* Aids List */}
      <div className="mt-10 bg-white shadow-md rounded-xl p-6">
        <div className="flex items-center justify-between flex-wrap">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            المساعدات المقدمة
          </h2>
          <Link href={`/dashboard/recipients/${data._id}/aids`}>
            <Button>تقديم مساعدة</Button>
          </Link>
        </div>

        {data.aids?.length > 0 ? (
          <Table className="min-w-full table-auto border-collapse border border-gray-300">
            <TableCaption className="text-right p-2 font-semibold text-gray-700">
              قائمة بجميع المساعدات المقدمة لهذا المستفيد.
            </TableCaption>

            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="border border-gray-300 px-4 py-2 text-right">
                  النوع
                </TableHead>
                <TableHead className="border border-gray-300 px-4 py-2 text-right">
                  الوصف
                </TableHead>
                <TableHead className="border border-gray-300 px-4 py-2 text-right">
                  تاريخ التقديم
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data?.aids?.length > 0 ? (
                data.aids.map((aid) => (
                  <TableRow
                    key={aid._id}
                    className="hover:bg-gray-50 even:bg-gray-100"
                  >
                    <TableCell className="border border-gray-300 px-4 py-2 text-right capitalize">
                      {aid.type === "financial" ? "مالية" : "معنوية"}
                    </TableCell>
                    <TableCell className="border border-gray-300 px-4 py-2 text-right">
                      {aid.description}
                    </TableCell>
                    <TableCell className="border border-gray-300 px-4 py-2 text-right">
                      {new Date(aid.createdAt).toLocaleDateString("ar-EG")}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="border border-gray-300 px-4 py-2 text-center"
                  >
                    لا توجد مساعدات مسجلة
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        ) : (
          <p className="text-gray-500 mt-4">لا توجد مساعدات لهذا المستفيد.</p>
        )}
      </div>
    </section>
  );
};

export default Page;
