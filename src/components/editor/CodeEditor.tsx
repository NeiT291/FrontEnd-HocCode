import Editor from "@monaco-editor/react";

interface CodeEditorProps {
    language: string;
    value: string;
    onChange: (value: string) => void;
}

export default function CodeEditor({
    language,
    value,
    onChange,
}: CodeEditorProps) {
    return (
        <Editor
            height="100%"
            language={language}
            value={value}
            theme="vs-dark"
            onChange={(v) => onChange(v || "")}
            options={{
                fontSize: 14,
                minimap: { enabled: false },
                tabSize: 2,
                insertSpaces: true,
                automaticLayout: true,
                scrollBeyondLastLine: false,
                wordWrap: "on",
                renderLineHighlight: "all",
            }}
        />
    );
}