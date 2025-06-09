import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import {toast} from "sonner"
import { useState } from "react";
import { useGlobalSheet } from "@/context/sheet-provider";
export function ApplicationForm({ mode = "create", data = {} }) {
  const { closeSheet } = useGlobalSheet();
  
  const [formData, setFormData] = useState({
    ...data,
    company: data.company || "",
    position: data.position || "",
    location: data.location || "",
    title: data.title || "",
    
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    <form onSubmit={handleSubmit}>
        <label>Job Title</label>
        <Input className="input" value={formData.title} onChange={handleChange} />
        <Button  className="btn btn-primary mt-4" onClick={closeSheet}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting} className="btn btn-primary mt-4">Save Changes</Button>

    </form>
    
  );
}
