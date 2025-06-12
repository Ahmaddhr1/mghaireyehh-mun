"use client";

import React from "react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";

const AidsPage = () => {
  const queryClient = useQueryClient();

  const { data: aids = [], isLoading } = useQuery({
    queryKey: ["aids"],
    queryFn: async () => {
      const { data } = await axios.get("/api/aids");
      return data;
    },
  });

  const deleteAidMutation = useMutation({
    mutationKey: ["deleteAid"],
    mutationFn: async (id) => {
      await axios.delete(`/api/aids/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["aids"]);
    },
  });

  const handleDelete = (id) => {
    if (confirm("هل أنت متأكد من حذف هذه المعونة؟")) {
      deleteAidMutation.mutate(id);
    }
  };

  return (
    <section className="section" dir="rtl">
      <div>
        <h1 className="font-bold text-xl mb-4">المساعدات</h1>
      </div>
      <div className="space-y-4 text-right">
        {isLoading ? (
          <div className="flex flex-col gap-2 items-center">
            <Loading />
            <p>جاري تحميل</p>
          </div>
        ) : aids.length === 0 ? (
          <p>لا توجد معونات متاحة</p>
        ) : (
          <div className="grid gap-4">
            {aids.map((aid) => (
              <div key={aid._id} className="p-4 border rounded-lg relative">
                <div className="flex justify-between items-center">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      aid.type === "financial"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {aid.type === "financial" ? "مادية" : "معنوية"}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(aid.createdAt).toLocaleDateString("ar-EG")}
                  </span>
                </div>
                <p className="mt-2">{aid.description}</p>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600 mt-1">
                    عدد المستفيدين: {aid.recipients?.length || 0}
                  </p>
                  <Button
                    onClick={() => handleDelete(aid._id)}
                    disabled={deleteAidMutation.isPending}
                    title="حذف المعونة"
                    variant="destructive"
                  >
                    حذف
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AidsPage;
