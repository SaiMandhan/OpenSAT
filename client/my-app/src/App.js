import React, { useState } from 'react';
import QuestionView from './QuestionView';
import ProgressView from './ProgressView';

function App() {
  const [view, setView] = useState('question'); 
  const userId = "test-user-123"; 
  const currentQuestionId = "281a4f3b";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600">
      <div className="container mx-auto px-4">
        <div className="py-4 flex justify-center">
          <button
            onClick={() => setView(view === 'question' ? 'progress' : 'question')}
            className="bg-white/20 hover:bg-white/30 text-white font-bold py-2 px-6 rounded-full backdrop-blur-lg transition-all duration-300"
          >
            Switch to {view === 'question' ? 'Progress' : 'Question'} View
          </button>
        </div>
        
        {view === 'question' ? (
          <QuestionView userId={userId} currentQuestionId={currentQuestionId} />
        ) : (
          <ProgressView userId={userId} />
        )}
      </div>
    </div>
  );
}

export default App;