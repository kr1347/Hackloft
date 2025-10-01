import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';

function App() {
  const editorRef = useRef(null);

  function handleEditorDidMount(editor) {
    editorRef.current = editor;
  }

  async function executeCode() {
    const code = editorRef.current.getValue();

    const payload = {
      code,
      language_id: 92, // Python 3.11.2, adjust based on required language
    };

    try {
      const response = await fetch('http://127.0.0.1:5000/execute_code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Response from server:', data);

      // Display result or error in your frontend
      const output = data.stdout || data.stderr || data.message || 'No output returned.';
      alert(output);

    } catch (error) {
      console.error('Error:', error);
      alert('Error executing code.');
    }
  }

  return (
    <div className="App">
      <h1>Hackloft Code Editor</h1>
      <Editor
        height="90vh"
        defaultLanguage="javascript"
        defaultValue="// Write your code here..."
        onMount={handleEditorDidMount}
      />
      <button onClick={executeCode}>Run Code</button>
    </div>
  );
}

export default App;
