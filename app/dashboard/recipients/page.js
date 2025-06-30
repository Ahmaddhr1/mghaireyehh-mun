"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import Loading from "@/components/Loading";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

const fetchRecipients = async (page) => {
  const res = await axios.get(`/api/recipients?page=${page}`);
  return res.data;
};

const deleteRecipient = async (id) => {
  await axios.delete(`/api/recipients/${id}`);
};

const RecipientsPage = () => {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["recipients", page],
    queryFn: () => fetchRecipients(page),
    keepPreviousData: true,
  });

  const mutation = useMutation({
    mutationFn: deleteRecipient,
    onSuccess: () => {
      toast.success("تم حذف المستفيد بنجاح");
      queryClient.invalidateQueries({ queryKey: ["recipients"] });
    },
    onError: () => {
      toast.error("فشل في حذف المستفيد");
    },
  });

  const handleDelete = (id) => {
    if (!confirm("هل أنت متأكد من حذف هذا المستفيد؟")) return;
    mutation.mutate(id);
  };

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <div className="text-center py-8 text-red-600">حدث خطأ في تحميل البيانات</div>
    );

  const recipients = data?.recipients || [];
  const totalPages = data?.totalPages || 1;

  return (
    <section className="section mx-auto px-2 py-4 tracking-wider" dir="rtl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">المستفيدون</h1>
        <Link href="/dashboard/recipients/add">
          <Button size="sm" className="px-4 py-1.5 font-semibold">
            إضافة مستفيد +
          </Button>
        </Link>
      </div>

      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="text-right w-[40%]">#</TableHead>
              <TableHead className="text-right w-[40%]">الاسم الكامل</TableHead>
              <TableHead className="text-right w-[30%]">رقم الهاتف</TableHead>
              <TableHead className="text-center w-[30%]">العمليات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recipients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4 text-gray-500">
                  لا يوجد مستفيدون
                </TableCell>
              </TableRow>
            ) : (
              recipients.map(({_id, fullName, phoneNumber }, index) => (
                <TableRow key={_id} className="hover:bg-gray-50/50">
                  <TableCell>{index+1}</TableCell>
                  <TableCell>{fullName}</TableCell>
                  <TableCell>{phoneNumber || "-"}</TableCell>
                  <TableCell className="flex justify-center gap-2">
                    <Link href={`/dashboard/recipients/${_id}`}>
                      <Button size="sm" variant="outline" className="h-7 px-2">
                        اطلاع
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-7 px-3 min-w-[80px]"
                      onClick={() => handleDelete(_id)}
                      disabled={mutation.isPending && mutation.variables === _id}
                    >
                      {mutation.isPending && mutation.variables === _id ? (
                        <div className="flex items-center justify-center gap-1">
                          <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          جاري الحذف
                        </div>
                      ) : (
                        "حذف"
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="px-3 font-semibold"
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
        >
          السابق
        </Button>
        <span className="text-sm text-gray-600 font-semibold">
          الصفحة {page} من {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          className="px-3 font-semibold"
          disabled={page >= totalPages}
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
        >
          التالي
        </Button>
      </div>
    </section>
  );
};

export default RecipientsPage;
