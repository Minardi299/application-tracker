import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import {toast} from "sonner"
import { useState } from "react";
import { useGlobalSheet } from "@/context/sheet-provider";
import { useQuery } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
export function ApplicationForm({ mode = "create", data = {} }) {
  const { closeSheet } = useGlobalSheet();
  const applicationStatuses = ["Wishlist","Applied","Interviewing","OfferReceived","Rejected","Accepted","Withdrawn",];
  const [formData, setFormData] = useState({
    ...data,
    company: data.company || "",
    position: data.position || "",
    location: data.location || "",
    title: data.title || "",
    
  });
  const { data: folders = [] } = useQuery({
    queryKey: ["userFolders"],
    queryFn: async () => {
      const res = await fetch("/api/folders");
      if (!res.ok) throw new Error("Failed to fetch folders");
      return res.json();
    }
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleStatusChange = (value) => {
    setFormData((prev) => ({ ...prev, status: value }));
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if(mode === "edit"){
        toast("editing application");
      }
      else{
        toast("creating application");
      }
      // const response = await fetch(
      //   mode === "edit"
      //     ? `/api/applications/${initialData.id}`
      //     : "/api/applications",
      //   {
      //     method: mode === "edit" ? "PUT" : "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify(formData),
      //   }
      // );

      // if (!response.ok) throw new Error("Failed to save application");

    } catch (err) {
      console.error(err);
      // handle error (toast, error UI, etc)
    } finally {
      setIsSubmitting(false);
    }
  };
   return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Company Name</Label>
        <Input
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label>Position</Label>
        <Input
          name="position"
          value={formData.position}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label>Job Posting URL</Label>
        <Input
          name="jobPostingUrl"
          value={formData.jobPostingUrl}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label>Notes</Label>
        <Textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
        />
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
        <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-2">
          {folders.map((folder) => (
            <div key={folder.id} className="flex items-center gap-2">
              <Checkbox
                id={`folder-${folder.id}`}
                checked={formData.folders.includes(folder.id)}
                onCheckedChange={() => handleFolderToggle(folder.id)}
              />
              <label htmlFor={`folder-${folder.id}`} className="text-sm">
                {folder.name}
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={closeSheet}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Application"}
        </Button>
      </div>
    </form>
  );
}
