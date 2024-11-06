import dynamic from "next/dynamic";

// Import React Quill với dynamic import để tránh lỗi SSR (Server Side Rendering)
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface TextEditorProps {
  content: string;
  setContent: (value: string) => void;
}

export default function TextEditor({ content, setContent }: TextEditorProps) {
  const handleChange = (value: string) => {
    setContent(value);
  };
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "list",
    "bullet",
    "link",
    "image",
  ];

  return (
    <div>
      <h2>Soạn Thảo Bài Viết</h2>
      <ReactQuill
        value={content}
        onChange={handleChange}
        modules={modules}
        formats={formats}
      />
    </div>
  );
}
