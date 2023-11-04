import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import QuillToolbar, { modules, formats } from "./toolbar";

// Imported this in main.jsx
import "react-quill/dist/quill.snow.css";

import "@styles/components/quillEditor.scss"

// default value for starting state
export const Editor = ({value, onChange, defaultValue}) => {

  const [editorValue, setEditorValue] = useState(value || defaultValue);

  useEffect(() => {
    if (editorValue !== value) {
      onChange(editorValue);
    }
  }, [editorValue, onChange, value]);

  const handleEditorChange = (content) => {
    setEditorValue(content);
  };

  // const [editorValue, setEditorValue] = useState(value);
  // useEffect(() => {
  //   if (editorValue !== value) {
  //     onChange(editorValue);
  //   }
  // }, [editorValue, onChange, value]);

  // const handleEditorChange = (content) => {
  //   setEditorValue(content);
  // };

  return (
    <div className="text-editor">
      <QuillToolbar />
      <ReactQuill
        id="editor"
        theme="snow"

        value={editorValue}
        onChange={handleEditorChange}

        modules={modules}
        formats={formats}
      />
    </div>
  );
};

export default Editor;