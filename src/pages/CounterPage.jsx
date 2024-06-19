import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const CounterPage = () => {
  const [counts, setCounts] = useState([0, 0, 0, 0, 0]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [history, setHistory] = useState([]);
  const { transcript, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    if (isCapturing) {
      SpeechRecognition.startListening({ continuous: true });
    } else {
      SpeechRecognition.stopListening();
    }
  }, [isCapturing]);

  useEffect(() => {
    const keywords = ['one', 'two', 'three', 'four', 'five'];
    const numbers = ['1', '2', '3', '4', '5'];

    const words = transcript.split(' ');
    words.forEach(word => {
      const keywordIndex = keywords.indexOf(word.toLowerCase());
      const numberIndex = numbers.indexOf(word);

      if (keywordIndex !== -1) {
        handleIncrement(keywordIndex);
        addToHistory(`Incremented container ${keywordIndex + 1}`);
      } else if (numberIndex !== -1) {
        handleIncrement(numberIndex);
        addToHistory(`Incremented container ${numberIndex + 1}`);
      }
    });

    resetTranscript();
  }, [transcript]);

  const handleIncrement = (index) => {
    const newCounts = [...counts];
    newCounts[index] += 1;
    setCounts(newCounts);
  };

  const handleDecrement = (index) => {
    const newCounts = [...counts];
    newCounts[index] -= 1;
    setCounts(newCounts);
  };

  const handleStartStopCapture = () => {
    setIsCapturing(!isCapturing);
  };

  const addToHistory = (action) => {
    const timestamp = new Date().toISOString();
    setHistory([...history, { action, timestamp }]);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const totalCount = counts.reduce((acc, count) => acc + count, 0);

  const exportToCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + history.map(e => `${e.timestamp},${e.action}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "count_history.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Counter Page</h1>
      <div className="mb-4">
        <button onClick={handleStartStopCapture} className="px-4 py-2 bg-blue-500 text-white rounded">
          {isCapturing ? 'Stop Capture' : 'Start Capture'}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {counts.map((count, index) => (
          <div key={index} className="p-4 bg-white rounded shadow">
            <h2 className="text-xl font-bold">Container {index + 1}</h2>
            <p className="text-lg">Count: {count}</p>
            <div className="flex space-x-2 mt-2">
              <button onClick={() => handleIncrement(index)} className="px-2 py-1 bg-green-500 text-white rounded">+</button>
              <button onClick={() => handleDecrement(index)} className="px-2 py-1 bg-red-500 text-white rounded">-</button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 p-4 bg-white rounded shadow">
        <h2 className="text-xl font-bold">Total Count</h2>
        <p className="text-lg">{totalCount}</p>
      </div>
      <div className="mt-4 p-4 bg-white rounded shadow">
        <h2 className="text-xl font-bold">History</h2>
        <button onClick={clearHistory} className="px-4 py-2 bg-red-500 text-white rounded mb-2">Clear History</button>
        <button onClick={exportToCSV} className="px-4 py-2 bg-green-500 text-white rounded mb-2 ml-2">Export to CSV</button>
        <ul className="list-disc pl-5">
          {history.map((entry, index) => (
            <li key={index}>{`${entry.timestamp} - ${entry.action}`}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CounterPage;