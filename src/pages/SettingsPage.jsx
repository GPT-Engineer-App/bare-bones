import React, { useState, useCallback } from 'react';

const SettingsPage = () => {
  const [keywords, setKeywords] = useState(['keyword1', 'keyword2']);
  const [newKeyword, setNewKeyword] = useState('');
  

  const handleAddKeyword = () => {
    if (newKeyword.trim() !== '') {
      setKeywords([...keywords, newKeyword.trim()]);
      setNewKeyword('');
      
    }
  };

  const handleRemoveKeyword = useCallback((index) => {
    
    setKeywords((prevKeywords) => prevKeywords.filter((_, i) => i !== index));
    }, []);

  

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Settings Page</h1>
      <div className="mb-4">
        <h2 className="text-xl font-bold">Keywords</h2>
        <div className="flex space-x-2 mb-2">
          <input
            type="text"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            className="px-2 py-1 border rounded"
            placeholder="Add new keyword"
          />
          <button onClick={handleAddKeyword} className="px-4 py-2 bg-blue-500 text-white rounded">Add</button>
        </div>
        <ul className="list-disc pl-5">
          {keywords.map((keyword, index) => (
            <li key={index} className="flex justify-between items-center">
              {keyword}
              <button onClick={() => handleRemoveKeyword(index)} className="px-2 py-1 bg-red-500 text-white rounded">Remove</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SettingsPage;