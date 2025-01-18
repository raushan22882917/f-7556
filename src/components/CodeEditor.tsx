import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const languages = [
  { id: "cpp", name: "C++" },
  { id: "java", name: "Java" },
  { id: "python", name: "Python" },
  { id: "javascript", name: "JavaScript" },
];

interface CodeEditorProps {
  onChange: (value: string | undefined) => void;
  value: string;
}

export function CodeEditor({ onChange, value }: CodeEditorProps) {
  const [language, setLanguage] = useState("javascript");

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Select value={language} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang.id} value={lang.id}>
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="h-[500px] border rounded-md overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage={language}
          theme="vs-dark"
          value={value}
          onChange={onChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            roundedSelection: false,
            scrollBeyondLastLine: false,
            readOnly: false,
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
}