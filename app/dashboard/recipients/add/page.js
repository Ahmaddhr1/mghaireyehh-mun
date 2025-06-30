"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const AddRecipientPage = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: "",
    phoneNumber: "",
    financialSituation: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const cleanValue = name === "phoneNumber" ? value.replace(/\D/g, "") : value;

    setForm((prev) => ({
      ...prev,
      [name]: cleanValue,
    }));
  };

  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await axios.post("/api/recipients/create", data);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "تمت إضافة المستفيد بنجاح");
      setForm({
        fullName: "",
        phoneNumber: "",
        financialSituation: "",
      });
      router.replace("/dashboard/recipients");
    },
    onError: (error) => {
      const message = error.response?.data?.error || "فشل في إضافة المستفيد.";
      toast.error(message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.fullName || !form.phoneNumber || !form.financialSituation) {
      toast.error("يرجى تعبئة جميع الحقول");
      return;
    }

    mutation.mutate(form);
  };

  return (
    <section className="section max-w-md mx-auto p-4" dir="rtl">
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800">إضافة مستفيد</h1>
      </header>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          type="text"
          placeholder="الاسم الكامل"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
        />

        <Input
          type="text"
          inputMode="numeric"
          placeholder="رقم الهاتف"
          name="phoneNumber"
          value={form.phoneNumber}
          onChange={handleChange}
        />

        <select
          name="financialSituation"
          value={form.financialSituation}
          onChange={handleChange}
          className="border rounded px-3 py-2 text-right"
          required
        >
          <option value="">اختر الوضع المالي</option>
          <option value="poor">فقير</option>
          <option value="very poor">فقير جداً</option>
        </select>

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? (
            <span className="flex items-center gap-2">
              <Loader2 className="animate-spin h-4 w-4" />
              جاري الإضافة...
            </span>
          ) : (
            "إضافة"
          )}
        </Button>
      </form>
    </section>
  );
};

export default AddRecipientPage;
