import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import {toast} from "sonner"
import { useState } from "react";
import { useGlobalSheet } from "@/context/sheet-provider";

export function FolderForm({ mode = "create", data = {} }) {
  const { closeSheet } = useGlobalSheet();
  const [formData, setFormData] = useState({
   ...data,
    name: data?.name || "",
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
        toast("editing folder");
      }
      else{
        toast("creating folder");
      }
      

    } catch (err) {
      console.error(err);
      // handle error (toast, error UI, etc)
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <label>Folder Name</label>
      <Input className="input" value={formData.name} onChange={handleChange} />
        <Button className="btn btn-primary mt-4" onClick={closeSheet}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting} className="btn btn-primary mt-4">Save Changes</Button>
    </form>

  );
}