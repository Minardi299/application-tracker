import { useFolders } from "@/hooks/use-folder";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { prefetchApplications } from "@/hooks/use-folder";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export function FolderGrid() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: folders = [], isLoading } = useFolders();
  const [showAll, setShowAll] = useState(false);
  const [search, setSearch] = useState("");

  const filteredFolders = useMemo(() => {
    return folders.filter((folder) =>
      folder.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [folders, search]);
  const folderPerRow=6;
  const gridCols = {
    5: "lg:grid-cols-5",
    6: "lg:grid-cols-6",
    7: "lg:grid-cols-7",
  };

  const visibleFolders = showAll ? filteredFolders : filteredFolders.slice(0, folderPerRow);

  if (isLoading) return <p className="text-muted-foreground">Loading folders...</p>;
  if (!folders.length) return <p className="text-muted-foreground">No folders found.</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
          <Input
            type="search"
            placeholder="Search folders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className=" max-w-sm"
          />
        <Button
            variant="ghost"
          onClick={() => setShowAll((prev) => !prev)}
          className=" hover:underline"
        >
          {showAll ? "Show Less" : "Show More"}
        </Button>
      </div>

      <div className={cn(
        "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4",
        gridCols[folderPerRow]
      )}>
        {visibleFolders.map((folder) => (
          <Link
            to={`/folder/${folder.id}`}
            onMouseEnter={() => prefetchApplications(queryClient, folder.id)}
            key={folder.id}
            className="group flex flex-col items-center justify-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
          >
            <p className="text-sm font-medium truncate max-w-[100px] mb-1 text-center">
              {folder.name}
            </p>
            <Folder className="w-20 h-20 text-primary fill-primary transition-all duration-300 group-hover:-translate-y-1" />
          </Link>
        ))}
      </div>
    </div>
  );
}
