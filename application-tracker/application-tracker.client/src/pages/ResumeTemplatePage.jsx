import { Button } from "@/components/ui/button";
export function ResumeTemplatePage() {
     const files = [
    {
      name: "I use this one",
      file: "/files/Template1.docx.pdf",
    },
    {
      name: "Data Scientist Resume",
      file: "/files/Template2.pdf",
    },
    {
      name: "Generic Resume",
      file: "/files/Template3.pdf",
    },
  ];
    return (
      <div className="flex flex-col items-center gap-12 py-8">
      {files.map((file, index) => (
        <div
          key={index}
          className="w-full max-w-3xl  rounded-xl shadow-md border overflow-hidden"
        >
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">{file.name}</h2>
          </div>
          <div className="w-full h-[80vh] flex items-center justify-center">
            <iframe
              src={`${file.file}#toolbar=0&navpanes=0&view=FitV`}
              className="w-full h-full border-none"
              title={`Preview of ${file.name}`}
            />
          </div>
          <div className="flex justify-end px-4 py-3 border-t">
          <Button asChild>
            <a href={file.file} download>
              Download
            </a>
          </Button>
          </div>
        </div>
      ))}
    </div>
    );
}