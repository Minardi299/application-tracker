import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InlineInput } from "@/components/ui/inline-input";
import { toast } from "sonner";
import { useState } from "react";
import { useGlobalSheet } from "@/context/sheet-provider";
import { useFolders } from "@/hooks/use-folder";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { fetchWithAuth } from "@/lib/interceptor";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Link as Link2 ,BriefcaseBusiness ,Building} from 'lucide-react';
import {
  RichTextEditor,
  RichTextEditorContent,
  RichTextEditorToolbar,
} from "@/components/ui/rich-text-editor";

const applicationStatuses = [
  "Wishlist",
  "Applied",
  "Interviewing",
  "Offered",
  "Rejected",
  "Accepted",
  "Withdrawn",
];
export function ApplicationForm({ mode = "create", data = {} }) {
  const queryClient = useQueryClient();
  const { closeSheet } = useGlobalSheet();
  const [_, setErrors] = useState({});
  const formatUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    return `https://${url}`;
  };
  async function deleteApplication({id}) {
    const res = await fetchWithAuth(`/api/jobapplications/${id}`, {
      method: "DELETE",
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
  const [formData, setFormData] = useState({
    ...data,
    companyName: data.companyName?.trim() || "",
    position: data.position?.trim() || "",
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
    const res = await fetchWithAuth(url, {
      method: mode === "edit" ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
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
      toast.error("Failed to save application");
      console.error(error);
    },
  });
  function validateForm(data) {
  const newErrors = {};

  if (!data.companyName.trim()) {
    newErrors.companyName = "Company name is required.";
  } else if (data.companyName.length > 100) {
    newErrors.companyName = "Company name cannot exceed 100 characters.";
  }

  if (!data.position.trim()) {
    newErrors.position = "Position is required.";
  } else if (data.position.length > 100) {
    newErrors.position = "Position cannot exceed 100 characters.";
  }
  return newErrors;
}
  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validateForm(formData);
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    toast.error(Object.values(validationErrors)[0]);
    return;
  }

  setErrors({});
    const fullFolders = folders.filter((folder) =>
      formData.folders.includes(folder.id)
    );

    const payload = {
      ...formData,
      folders: fullFolders,
    };
    await mutation.mutateAsync(payload);  
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-[80vh] space-y-4">
      <div className="flex  items-center justify-between">
        <Label>
          <Building className="w-4 h-4 "/>

          Company:
        </Label>
        <InlineInput
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          placeholder="Empty"
          className="w-3/4"
        />
        
      </div>
      <div className="flex  items-center justify-between">
        <Label>
          <BriefcaseBusiness className="w-4 h-4 "/>
          Position:
        </Label>
        <InlineInput
          name="position"
          value={formData.position}
          onChange={handleChange}
          placeholder="Empty"
          className="w-3/4"
        />
      </div>
      <div className="flex items-center justify-between">
        <Label>          
        <Link2 className="w-4 h-4 "/>
        Posting URL:</Label>
      <div className="flex w-3/4 items-center gap-2">
        <InlineInput
          name="jobPostingUrl"
          value={formData.jobPostingUrl}
          onChange={handleChange}
          placeholder="Empty"

          className="flex-grow"
        />
        
          {formData.jobPostingUrl && (
            <a
              href={formatUrl(formData.jobPostingUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground underline hover:text-foreground"
              title="Open link in new tab"
            >
              <Link2 className="h-5 w-5" />
            </a>
          )}
        </div>
      </div>
      <div>
        <Label>Notes</Label>
        <RichTextEditor
          name="notes"
          value={formData.notes}
          onChange={(value) => handleRichTextChange(value)}
          placeholder="Start typing..."
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
      <div className="flex flex-col flex-1 min-h-100">
        <Label>Folders</Label>
        <ScrollArea className="flex-1 min-h-0  overflow-hidden">


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
        </ScrollArea>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        {mode === "edit" && (
        <Button
          type="button"
          variant="destructive"
          disabled={deleteMutation.isPending}
          onClick={handleDelete}
        >
          {deleteMutation.isPending  ? <Spinner/> : "Delete"}
        </Button>
        )}
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending  ? <Spinner/>: "Save Application"}
        </Button>
      </div>
    </form>
  );
}
