
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


export function NavigationShortcuts() {
  const navigate = useNavigate();

    
  

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
        
        if ( e.key === "F1") {
          e.preventDefault();
          navigate("/");
        }
        if ( e.key === "F2") {
          e.preventDefault();
          navigate("/dashboard");
        }
        if ( e.key === "F3") {
          e.preventDefault();
          navigate("/settings");
        }
        if ( e.key === "F4") {
          e.preventDefault();
        }
        if ( e.key === "F4") {
          e.preventDefault();
          navigate("/resume-templates");
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate]);

  return null;
}