
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


export function NavigationShortcuts() {
  const navigate = useNavigate();

    
  

  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey || e.metaKey) {
        
        if ((e.metaKey || e.ctrlKey) && e.key === "F1") {
          e.preventDefault();
          navigate("/");
        }
        if ((e.metaKey || e.ctrlKey) && e.key === "F2") {
          e.preventDefault();
          navigate("/dashboard");
        }
        if ((e.metaKey || e.ctrlKey) && e.key === "F3") {
          e.preventDefault();
          navigate("/settings");
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate]);

  return null;
}