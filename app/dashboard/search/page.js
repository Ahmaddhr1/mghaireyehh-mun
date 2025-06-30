"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loading from "@/components/Loading";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Filter as FilterIcon } from "lucide-react";

const fetchRecipients = async (filters) => {
  const params = new URLSearchParams();

  if (filters.name) params.append("name", filters.name);
  if (filters.financialSituation) params.append("financialSituation", filters.financialSituation);
  if (filters.filterBy) params.append("filterBy", filters.filterBy);
  if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);

  const res = await axios.get(`/api/recipients/search?${params.toString()}`);
  return res.data;
};

const RecipientsSearchPage = () => {
  const [filters, setFilters] = useState({
    name: "",
    financialSituation: "",
    filterBy: "total",
    sortOrder: "asc",
  });
  const [openFilters, setOpenFilters] = useState(false);

  const { data = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["recipients", filters],
    queryFn: () => fetchRecipients(filters),
    keepPreviousData: true,
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      refetch();
    }, 800);
    return () => clearTimeout(timeout);
  }, [filters, refetch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section className="section mx-auto px-2 py-4 tracking-wider max-w-7xl" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        {/* Always visible search input */}
        <Input
          type="text"
          name="name"
          placeholder="بحث بالاسم"
          value={filters.name}
          onChange={handleInputChange}
          className="max-w-xs text-right"
        />

        {/* Filter button and popover */}
        <Popover open={openFilters} onOpenChange={setOpenFilters}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 max-w-xs">
              <FilterIcon className="w-4 h-4" />
              فلترة
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-[260px] p-4 space-y-4">
            <div>
              <label htmlFor="financialSituation" className="block mb-1 font-semibold text-sm">
                الوضع المالي
              </label>
              <select
                id="financialSituation"
                name="financialSituation"
                value={filters.financialSituation}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">كل الأوضاع المالية</option>
                <option value="poor">فقير</option>
                <option value="very poor">فقير جداً</option>
              </select>
            </div>

            <div>
              <label htmlFor="filterBy" className="block mb-1 font-semibold text-sm">
                ترتيب حسب
              </label>
              <select
                id="filterBy"
                name="filterBy"
                value={filters.filterBy}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="total">مجموع المعونات</option>
                <option value="financial">المساعدات المالية</option>
                <option value="moral">المساعدات المعنوية</option>
              </select>
            </div>

            <div>
              <label htmlFor="sortOrder" className="block mb-1 font-semibold text-sm">
                ترتيب
              </label>
              <select
                id="sortOrder"
                name="sortOrder"
                value={filters.sortOrder}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="asc">الأقل أولاً</option>
                <option value="desc">الأكثر أولاً</option>
              </select>
            </div>

            <Button onClick={() => setOpenFilters(false)} className="w-full">
              تطبيق
            </Button>
          </PopoverContent>
        </Popover>
      </div>

      {isLoading ? (
        <Loading />
      ) : isError ? (
        <div className="text-center py-8 text-red-600">حدث خطأ في تحميل البيانات</div>
      ) : (
        <div className="overflow-x-auto border rounded-md">
          <Table className="min-w-[700px]">
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="text-right w-[5%]">#</TableHead>
                <TableHead className="text-right w-[25%]">الاسم الكامل</TableHead>
                <TableHead className="text-right w-[20%]">رقم الهاتف</TableHead>
                <TableHead className="text-right w-[15%]">الوضع المالي</TableHead>
                <TableHead className="text-right w-[10%]">المساعدات المالية</TableHead>
                <TableHead className="text-right w-[10%]">المساعدات المعنوية</TableHead>
                <TableHead className="text-right w-[10%]">مجموع المعونات</TableHead>
                <TableHead className="text-center w-[15%]">العمليات</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4 text-gray-500">
                    لا يوجد مستفيدون
                  </TableCell>
                </TableRow>
              ) : (
                data.map(
                  (
                    {
                      _id,
                      fullName,
                      phoneNumber,
                      financialSituation,
                      financialAidCount,
                      moralAidCount,
                    },
                    index
                  ) => (
                    <TableRow key={_id} className="hover:bg-gray-50/50">
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{fullName}</TableCell>
                      <TableCell>{phoneNumber || "-"}</TableCell>
                      <TableCell className="capitalize">{financialSituation || "-"}</TableCell>
                      <TableCell>{financialAidCount || 0}</TableCell>
                      <TableCell>{moralAidCount || 0}</TableCell>
                      <TableCell>{(financialAidCount || 0) + (moralAidCount || 0)}</TableCell>
                      <TableCell className="flex justify-center gap-2">
                        <Link href={`/dashboard/recipients/${_id}`}>
                          <Button size="sm" variant="outline" className="h-7 px-2">
                            اطلاع
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  )
                )
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
};

export default RecipientsSearchPage;
