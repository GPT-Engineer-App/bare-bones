import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { CSVLink } from "react-csv";
import { supabase } from './integrations/supabase/index.js';

function App() {
  const [counts, setCounts] = useState({ PET: 0, HDP: 0, glass: 0, carton: 0, can: 0 });
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState('all');
  const [csvData, setCsvData] = useState([]);
  const [lockout, setLockout] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [persistentCount, setPersistentCount] = useState(0);

  useEffect(() => {
    const fetchPersistentCount = async () => {
      const { data, error } = await supabase
        .from('persistent_counts')
        .select('count')
        .single();
      if (data) {
        setPersistentCount(data.count);
      }
    };
    fetchPersistentCount();
  }, []);

  const updatePersistentCount = async (newCount) => {
    const { data, error } = await supabase
      .from('persistent_counts')
      .update({ count: newCount })
      .eq('id', 1);
    if (error) {
      console.error('Error updating persistent count:', error);
    }
  };

  const commands = [
    {
      command: 'start counting',
      callback: () => console.log('Counting started')
    },
    {
      command: 'count :number *',
      callback: (number, type) => {
        const normalizedType = type.toLowerCase();
        const typeMapping = {
          'pet': 'PET',
          'pet 1 plastic bottles': 'PET',
          'hdp': 'HDP',
          'hdpe 2 plastic bottles': 'HDP',
          'glass': 'glass',
          'glass containers': 'glass',
          'carton': 'carton',
          'cardboard cartons': 'carton',
          'can': 'can',
          'aluminum cans': 'can'
        };
        const containerType = typeMapping[normalizedType];
        if (containerType && counts.hasOwnProperty(containerType)) {
          const newCounts = { ...counts, [containerType]: counts[containerType] + parseInt(number) };
          setCounts(newCounts);
          setHistory([...history, { type: containerType, count: newCounts[containerType], timestamp: new Date().toLocaleString() }]);
          const newSessionCount = sessionCount + parseInt(number);
          setSessionCount(newSessionCount);
          const newPersistentCount = persistentCount + parseInt(number);
          setPersistentCount(newPersistentCount);
          updatePersistentCount(newPersistentCount);
        }
      }
    },
    {
      command: 'reset *',
      callback: (type) => {
        const normalizedType = type.toLowerCase();
        const typeMapping = {
          'pet': 'PET',
          'pet 1 plastic bottles': 'PET',
          'hdp': 'HDP',
          'hdpe 2 plastic bottles': 'HDP',
          'glass': 'glass',
          'glass containers': 'glass',
          'carton': 'carton',
          'cardboard cartons': 'carton',
          'can': 'can',
          'aluminum cans': 'can'
        };
        const containerType = typeMapping[normalizedType];
        if (containerType && counts.hasOwnProperty(containerType)) {
          const newCounts = { ...counts, [containerType]: 0 };
          setCounts(newCounts);
          setHistory([...history, { type: containerType, count: 0, timestamp: new Date().toLocaleString() }]);
        }
      }
    },
    {
      command: 'lock out *',
      callback: (type) => {
        const normalizedType = type.toLowerCase();
        const typeMapping = {
          'pet': 'PET',
          'pet 1 plastic bottles': 'PET',
          'hdp': 'HDP',
          'hdpe 2 plastic bottles': 'HDP',
          'glass': 'glass',
          'glass containers': 'glass',
          'carton': 'carton',
          'cardboard cartons': 'carton',
          'can': 'can',
          'aluminum cans': 'can'
        };
        const containerType = typeMapping[normalizedType];
        if (containerType && counts.hasOwnProperty(containerType)) {
          setLockout(containerType);
          console.log(`Locked out ${containerType}`);
          // Add audible noise indication here
        }
      }
    },
    {
      command: 'unlock *',
      callback: (type) => {
        const normalizedType = type.toLowerCase();
        const typeMapping = {
          'pet': 'PET',
          'pet 1 plastic bottles': 'PET',
          'hdp': 'HDP',
          'hdpe 2 plastic bottles': 'HDP',
          'glass': 'glass',
          'glass containers': 'glass',
          'carton': 'carton',
          'cardboard cartons': 'carton',
          'can': 'can',
          'aluminum cans': 'can'
        };
        const containerType = typeMapping[normalizedType];
        if (lockout === containerType) {
          setLockout(null);
          console.log(`Unlocked ${containerType}`);
          // Add audible noise indication here
        }
      }
    },
    {
      command: ':number',
      callback: (number) => {
        if (lockout && counts.hasOwnProperty(lockout)) {
          const newCounts = { ...counts, [lockout]: counts[lockout] + parseInt(number) };
          setCounts(newCounts);
          setHistory([...history, { type: lockout, count: newCounts[lockout], timestamp: new Date().toLocaleString() }]);
          const newSessionCount = sessionCount + parseInt(number);
          setSessionCount(newSessionCount);
          const newPersistentCount = persistentCount + parseInt(number);
          setPersistentCount(newPersistentCount);
          updatePersistentCount(newPersistentCount);
        }
      }
    },
    {
      command: 'lock screen',
      callback: () => {
        setIsLocked(true);
        console.log('Screen locked');
      }
    },
    {
      command: 'unlock screen',
      callback: () => {
        setIsLocked(false);
        console.log('Screen unlocked');
      }
    }
  ];

  const { transcript, resetTranscript } = useSpeechRecognition({ commands });

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const clearHistory = () => {
    setHistory([]);
  };

  const generateCsvData = () => {
    const data = filter === 'all' ? history : history.filter(entry => entry.type === filter);
    const csv = data.map(entry => ({
      Timestamp: entry.timestamp,
      Type: entry.type,
      Count: entry.count
    }));
    setCsvData(csv);
  };

  const filteredHistory = filter === 'all' ? history : history.filter(entry => entry.type === filter);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-5xl font-bold mb-4">Voice-Activated Counting</h1>
      <p className="text-lg text-gray-700 mb-4">This app recognizes voice commands to count different types of containers.</p>
      <button
        className="btn btn-primary mb-4"
        onClick={SpeechRecognition.startListening}
      >
        Start Listening
      </button>
      <button
        className="btn btn-secondary mb-4"
        onClick={SpeechRecognition.stopListening}
      >
        Stop Listening
      </button>
      <button
        className="btn btn-danger mb-4"
        onClick={resetTranscript}
      >
        Reset Transcript
      </button>
      <div className="text-lg text-gray-700 mb-4">Transcript: {transcript}</div>
      <div className="text-lg text-gray-700 mb-4">Counts:</div>
      <ul>
        {Object.keys(counts).map((key) => (
          <li key={key} className="text-lg text-gray-700">{key}: {counts[key]}</li>
        ))}
      </ul>
      <div className="text-lg text-gray-700 mb-4">Session Count: {sessionCount}</div>
      <div className="text-lg text-gray-700 mb-4">Persistent Count: {persistentCount}</div>
      <div className="text-lg text-gray-700 mb-4">History:</div>
      <div className="mb-4">
        <label className="mr-2">Filter by type:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="select select-bordered">
          <option value="all">All</option>
          {Object.keys(counts).map((key) => (
            <option key={key} value={key}>{key}</option>
          ))}
        </select>
      </div>
      <button
        className="btn btn-warning mb-4"
        onClick={clearHistory}
      >
        Clear History
      </button>
      <button
        className="btn btn-success mb-4"
        onClick={generateCsvData}
      >
        Generate CSV
      </button>
      <CSVLink
        data={csvData}
        filename={`count_history_${filter}.csv`}
        className="btn btn-info mb-4"
        target="_blank"
      >
        Export CSV
      </CSVLink>
      <ul>
        {filteredHistory.map((entry, index) => (
          <li key={index} className="text-lg text-gray-700">{entry.timestamp} - {entry.type}: {entry.count}</li>
        ))}
      </ul>
      {isLocked && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center text-white">
          <h2 className="text-4xl mb-4">Lock Screen</h2>
          <div className="text-lg mb-4">Counts:</div>
          <ul>
            {Object.keys(counts).map((key) => (
              <li key={key} className="text-lg">{key}: {counts[key]}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;