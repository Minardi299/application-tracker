import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InlineInput } from "@/components/ui/inline-input";
import { toast } from "sonner";
import { useState } from "react";
import { useGlobalSheet } from "@/context/sheet-provider";
import { useFolders } from "@/hooks/use-folder";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  RichTextEditor,
  RichTextEditorContent,
  RichTextEditorToolbar,
} from "@/components/ui/rich-text-editor";

export function ApplicationForm({ mode = "create", data = {} }) {
  const queryClient = useQueryClient();
  const { closeSheet } = useGlobalSheet();
  async function deleteApplication({id}) {
    const res = await fetch(`/api/jobapplications/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("Failed to delete application");
    }
    return true;
  }
  const deleteMutation = useMutation({
    mutationFn: deleteApplication,
      onSuccess: (_, variables) => {
      const appId = variables.id;

      const folderIds = variables.folders.map(f => f.id);
      toast.success("Application deleted successfully");
      queryClient.invalidateQueries(["application", appId]); 

      folderIds.forEach(folderId => {
          queryClient.invalidateQueries(["applications", folderId]);
      });
      closeSheet();
    },
    onError: () => {
    toast.error("Failed to delete application");
    },
    
    });
  async function handleDelete(e) {
    e.preventDefault();
    if (!formData.id) return;

    deleteMutation.mutate({ id: formData.id, folders: data.folders || [] });
  }
  const applicationStatuses = [
    "Wishlist",
    "Applied",
    "Interviewing",
    "OfferReceived",
    "Rejected",
    "Accepted",
    "Withdrawn",
  ];
  const [formData, setFormData] = useState({
    ...data,
    companyName: data.companyName || "",
    position: data.position || "",
    location: data.location || "",
    jobPostingUrl: data.jobPostingUrl || "",
    notes: data.notes || "",
    status: data.status || "Applied",
    folders: data.folders ? data.folders.map((f) => f.id) : [],
  });
  async function updateApplication(payload) {
    const url =
      mode === "edit"
        ? `/api/jobapplications/${payload.id}`
        : "/api/jobapplications";
    const res = await fetch(url, {
      method: mode === "edit" ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to save application");
    return res.json();
  }
  const { data: folders } = useFolders();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleStatusChange = (value) => {
    setFormData((prev) => ({ ...prev, status: value }));
  };
  const handleRichTextChange = (value) => {
    setFormData((prev) => ({ ...prev, notes: value }));
  };
  const handleFolderToggle = (folderId) => {
    setFormData((prev) => {
      const exists = prev.folders.includes(folderId);
      return {
        ...prev,
        folders: exists
          ? prev.folders.filter((id) => id !== folderId)
          : [...prev.folders, folderId],
      };
    });
  };
  
  const mutation = useMutation({
    mutationFn: updateApplication,
    onSuccess: (_, variables) => {
      const appId = variables.id;
      const folderIds = variables.folders.map((f) => f.id);
      toast.success(
        mode === "edit" ? "Application updated!" : "Application created!"
      );
      queryClient.invalidateQueries(["application", appId]);
      folderIds.forEach((folderId) => {
        queryClient.invalidateQueries(["applications", folderId]);
      });
      closeSheet();
    },
    onError: (error) => {
      toast.error("Something went wrong");
      console.error(error);
    },
  });
  async function handleSubmit(e) {
    e.preventDefault();
    const fullFolders = folders.filter((folder) =>
      formData.folders.includes(folder.id)
    );

    const payload = {
      ...formData,
      folders: fullFolders,
    };
    mutation.mutate(payload);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Company Name</Label>
        <InlineInput
          header
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label>Position</Label>
        <InlineInput
          name="position"
          value={formData.position}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label>Job Posting URL</Label>
        <InlineInput
          name="jobPostingUrl"
          value={formData.jobPostingUrl}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label>Notes</Label>
        <RichTextEditor
          name="notes"
          value={formData.notes}
          onChange={(value) => handleRichTextChange(value)}
        >
          <RichTextEditorToolbar />
          <RichTextEditorContent />
        </RichTextEditor>
      </div>
      <div>
        <Label>Status</Label>
        <Select value={formData.status} onValueChange={handleStatusChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {applicationStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Folders</Label>
        {folders.map((folder) => (
          <div
            key={folder.id}
            className="border-b py-2 flex items-center gap-2"
          >
            <Checkbox
              id={`folder-${folder.id}`}
              checked={formData.folders.includes(folder.id)}
              onCheckedChange={() => handleFolderToggle(folder.id)}
            />
            <label
              htmlFor={`folder-${folder.id}`}
              className="w-full cursor-pointer select-none"
            >
              {folder.name}
            </label>
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-2 pt-4">
        {mode === "edit" && (
        <Button
          type="button"
          variant="destructive"
          disabled={deleteMutation.isLoading}
          onClick={handleDelete}
        >
          {deleteMutation.isLoading ? "Deleting..." : "Delete"}
        </Button>
        )}
        <Button type="submit" disabled={mutation.isLoading}>
          {mutation.isLoading ? "Saving..." : "Save Application"}
        </Button>
      </div>
    </form>
  );
}
