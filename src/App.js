import { useState } from 'react';
import './App.css';
import MonacoEditor from '@monaco-editor/react';

// Main application component
function App() {
  // State variables
  const [code, setCode] = useState('# Welcome to Vocal Studio Code\n# Try saying: "print hello" or "x equals 5"\n\n');
  const [isListening, setIsListening] = useState(false);
  const [output, setOutput] = useState('');

  // Voice recognition handler
  const startVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition not supported in your browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.start();
    setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log('Heard:', transcript);
      
      // Convert speech to Python code
      let pythonCode = '';
      
      if (transcript.toLowerCase().includes('print')) {
        const content = transcript.replace(/print\s*/i, '').trim();
        pythonCode = content ? `print("${content}")` : `print("Hello!")`;
      } else if (transcript.toLowerCase().includes('equals')) {
        const parts = transcript.split(/\s+equals\s+/i);
        if (parts.length === 2) {
          pythonCode = `${parts[0].trim()} = ${parts[1].trim()}`;
        }
      } else {
        pythonCode = `print("${transcript}")`;
      }
      
      console.log('Generated code:', pythonCode);
      setCode(prev => prev + pythonCode + '\n');
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  // Code execution handler
  const runCode = () => {
    console.log('Running code:', code);
    
    // Simple execution simulation
    let result = '';
    const lines = code.split('\n').filter(line => line.trim() && !line.startsWith('#'));
    
    lines.forEach(line => {
      if (line.includes('print(')) {
        const match = line.match(/print\("([^"]*)"\)/);
        if (match) {
          result += match[1] + '\n';
        }
      } else if (line.includes('=')) {
        result += `Executed: ${line}\n`;
      }
    });
    
    if (!result) result = 'No output generated';
    
    setOutput(result);
  };

  return (
    <div className="App">
      {/* Header section */}
      <header className="app-header">
        <h1>🎤 Vocal Studio Code</h1>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button 
            onClick={startVoice}
            style={{
              backgroundColor: isListening ? '#e51400' : '#007acc',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              fontSize: '16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            {isListening ? '⏹ Stop Listening' : '🎙️ Start Voice'}
          </button>
          <button 
            onClick={runCode}
            style={{
              backgroundColor: '#4ec9b0',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              fontSize: '16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            ▶️ Run Code
          </button>
        </div>
      </header>
      
      {/* Main content area */}
      <div style={{ display: 'flex', height: 'calc(100vh - 120px)' }}>
        {/* Code editor */}
        <div style={{ flex: 1, padding: '10px' }}>
          <MonacoEditor
            key={code}
            height="100%"
            language="python"
            value={code}
            onChange={setCode}
            theme="vs-dark"
            options={{
              automaticLayout: true,
              fontSize: 14,
              minimap: { enabled: true },
              scrollBeyondLastLine: false,
              wordWrap: 'on'
            }}
          />
        </div>
        
        {/* Output panel */}
        <div style={{ width: '300px', padding: '10px', borderLeft: '1px solid #3c3c3c', backgroundColor: '#1e1e1e' }}>
          <h3 style={{ color: 'white', margin: '0 0 10px 0' }}>Output</h3>
          <div style={{ 
            backgroundColor: '#2d2d2d', 
            color: '#d4d4d4', 
            padding: '10px', 
            height: 'calc(100% - 40px)',
            overflowY: 'auto',
            fontFamily: 'monospace',
            fontSize: '14px'
          }}>
            {output || 'Run code to see output here...'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;