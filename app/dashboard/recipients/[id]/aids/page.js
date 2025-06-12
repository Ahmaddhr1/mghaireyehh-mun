"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";

export default function AidsPage() {
  const { id } = useParams();

  const queryClient = useQueryClient();
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("assign");
  const [selectedAidId, setSelectedAidId] = useState("");
  const [newAid, setNewAid] = useState({
    type: "financial",
    description: "",
  });

  // Fetch all aids
  const { data: aids = [], isLoading } = useQuery({
    queryKey: ["aids"],
    queryFn: async () => {
      const { data } = await axios.get("/api/aids");
      return data;
    },
  });

  // Create new aid mutation
  const createAid = useMutation({
    mutationFn: (aidData) => axios.post("/api/aids", aidData),
    onSuccess: () => {
      toast.success("تم إنشاء المعونة بنجاح");
      queryClient.invalidateQueries(["aids"]);
      setActiveTab("assign");
      setNewAid({ type: "financial", description: "" });
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "فشل إنشاء المعونة");
    },
  });

  // Assign aid mutation
  const assignAid = useMutation({
    mutationFn: (aidId) =>
      axios.put(`/api/aids/${aidId}`, {
        id,
      }),
    onSuccess: () => {
      toast.success("تم تعيين المعونة بنجاح");
      queryClient.invalidateQueries(["aids"]);
      router.push("/dashboard/recipients/"+id)
      setSelectedAidId("");
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "فشل تعيين المعونة");
    },
  });

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newAid.description.trim()) {
      toast.error("الوصف مطلوب");
      return;
    }
    createAid.mutate(newAid);
  };

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    if (!selectedAidId) {
      toast.error("يجب اختيار معونة");
      return;
    }
    assignAid.mutate(selectedAidId);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6 section">
      <h1 className="text-2xl font-bold text-right">إدارة المعونات</h1>

      <div className="flex gap-2 justify-end">
        <Button
          variant={activeTab === "create" ? "default" : "outline"}
          onClick={() => setActiveTab("create")}
        >
          إنشاء معونة جديدة
        </Button>
        <Button
          variant={activeTab === "assign" ? "default" : "outline"}
          onClick={() => setActiveTab("assign")}
        >
          تعيين معونة
        </Button>
      </div>

      {/* Create Aid Form */}
      {activeTab === "create" && (
        <form
          onSubmit={handleCreateSubmit}
          className="space-y-4 p-4 border rounded-lg text-right"
        >
          <div>
            <label className="block mb-2 font-medium">نوع المعونة</label>
            <div className="flex gap-4 justify-end">
              {["financial", "moral"].map((type) => (
                <label key={type} className="flex items-center gap-2">
                  <span>{type === "financial" ? "مادية" : "معنوية"}</span>
                  <input
                    type="radio"
                    checked={newAid.type === type}
                    onChange={() => setNewAid({ ...newAid, type })}
                    className="h-4 w-4"
                  />
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium">وصف المعونة</label>
            <textarea
              className="w-full p-2 border rounded text-right"
              value={newAid.description}
              onChange={(e) =>
                setNewAid({ ...newAid, description: e.target.value })
              }
              rows={3}
              placeholder="أدخل وصف المعونة"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={createAid.isPending}
            className="w-full"
          >
            {createAid.isPending ? "جاري الإنشاء..." : "إنشاء المعونة"}
          </Button>
        </form>
      )}

      {/* Assign Aid Form */}
      {activeTab === "assign" && (
        <form
          onSubmit={handleAssignSubmit}
          className="space-y-4 p-4 border rounded-lg text-right"
        >
          <div>
            <label className="block mb-2 font-medium">اختر المعونة</label>
            <select
              className="w-full p-2 border rounded text-right"
              value={selectedAidId}
              onChange={(e) => setSelectedAidId(e.target.value)}
              required
            >
              <option value="">-- اختر معونة --</option>
              {aids.map((aid) => (
                <option key={aid._id} value={aid._id}>
                  {aid.type === "financial" ? "مادية" : "معنوية"} -{" "}
                  {aid.description}
                </option>
              ))}
            </select>
          </div>
          <Button
            type="submit"
            disabled={assignAid.isPending}
            className="w-full"
          >
            {assignAid.isPending ? "جاري التعيين..." : "تعيين المعونة"}
          </Button>
        </form>
      )}
    </div>
  );
}
