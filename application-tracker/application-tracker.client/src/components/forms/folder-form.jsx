import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useState } from "react";
import { useGlobalSheet } from "@/context/sheet-provider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";
import { Label } from "@/components/ui/label";
import { InlineInput } from "@/components/ui/inline-input";


export function FolderForm({ mode = "create", data = {} }) {
  const queryClient = useQueryClient();
  const { closeSheet } = useGlobalSheet();

  const [formData, setFormData] = useState({
    ...data,
    name: data.name?.trim() || "",
  });

  const [errors, setErrors] = useState({});

  function validateForm(data) {
    const newErrors = {};
    if (!data.name.trim()) {
      newErrors.name = "Folder name is required.";
    } else if (data.name.length > 50) {
      newErrors.name = "Folder name cannot exceed 50 characters.";
    }
    return newErrors;
  }

  async function deleteFolder({ id }) {
    const res = await fetch(`/api/folder/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("Failed to delete folder");
    }
    return true;
  }

  const deleteMutation = useMutation({
    mutationFn: deleteFolder,
    onSuccess: (_, variables) => {
      toast.success("Folder deleted successfully");
      queryClient.invalidateQueries(["userFolders"]);
      queryClient.removeQueries(["userFolders", variables.id]);
      closeSheet();
    },
    onError: () => {
      toast.error("Failed to delete folder");
    },
  });

  async function handleDelete(e) {
    e.preventDefault();
    if (!formData.id) return;
    deleteMutation.mutate({ id: formData.id });
  }

  async function saveFolder(payload) {
    const url = mode === "edit" ? `/api/folder/${payload.id}` : "/api/folder";
    const res = await fetch(url, {
      method: mode === "edit" ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to save folder");
    return res.json();
  }

  const submitMutation = useMutation({
    mutationFn: saveFolder,
    onSuccess: () => {
      toast.success(mode === "edit" ? "Folder updated!" : "Folder created!");
      queryClient.invalidateQueries(["userFolders"]);
      closeSheet();
    },
    onError: () => {
      toast.error("Failed to save folder");
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error(Object.values(validationErrors)[0]);
      return;
    }

    setErrors({});
    await submitMutation.mutateAsync(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* <div>
        <Label htmlFor="folder-name">Folder Name</Label>
        <Input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Applications, Favorites"
        />
      </div> */}
      <div className="flex  items-center justify-between">
        <Label>Name:</Label>
        <InlineInput
        
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Empty"
          className="w-3/4"
        />
        
      </div>

      <div className="flex justify-end gap-2 pt-4">
        {mode === "edit" && (
          <Button
            type="button"
            variant="destructive"
            disabled={deleteMutation.isPending}
            onClick={handleDelete}
          >
            {deleteMutation.isPending ? <Spinner /> : "Delete"}
          </Button>
        )}
        <Button type="submit" disabled={submitMutation.isPending}>
          {submitMutation.isPending ? <Spinner /> : "Save Folder"}
        </Button>
      </div>
    </form>
  );
}