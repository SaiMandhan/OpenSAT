import React, { useState, useEffect } from 'react';
import { getUserProgress, getAccuracy } from './apiUtils';

const ProgressView = ({ userId }) => {
  const [quizResults, setQuizResults] = useState({
    totalQuestions: 0,
    correctQuestions: 0,
    incorrectQuestions: 0
  });
  const [weeklyAccuracy, setWeeklyAccuracy] = useState(0);
  const [monthlyAccuracy, setMonthlyAccuracy] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user progress
        const progressResponse = await getUserProgress(userId);
        if (progressResponse.type === 'success') {
          const questions = progressResponse.data;
          const correct = questions.filter(q => q.correct).length;
          setQuizResults({
            totalQuestions: questions.length,
            correctQuestions: correct,
            incorrectQuestions: questions.length - correct
          });
        }

        // Fetch weekly accuracy
        const weeklyResponse = await getAccuracy(userId, 'week');
        if (weeklyResponse.type === 'success') {
          setWeeklyAccuracy(weeklyResponse.data.averageAccuracy);
        }

        // Fetch monthly accuracy
        const monthlyResponse = await getAccuracy(userId, 'month');
        if (monthlyResponse.type === 'success') {
          setMonthlyAccuracy(monthlyResponse.data.averageAccuracy);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const getMotivationalMessage = (accuracy) => {
    if (accuracy >= 90) return "Excellent work! You're SAT ready!";
    if (accuracy >= 80) return "Great job! Keep pushing your limits!";
    if (accuracy >= 70) return "Good progress. Stay focused!";
    if (accuracy >= 60) return "You're improving. Don't give up!";
    return "Keep practicing. Every mistake is a learning opportunity!";
  };

  const accuracy = quizResults.totalQuestions === 0 ? 0 : 
    ((quizResults.correctQuestions / quizResults.totalQuestions) * 100).toFixed(1);
  const motivationalMessage = getMotivationalMessage(parseFloat(accuracy));

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex justify-center items-center p-4">
      <div className="bg-white/10 rounded-xl p-8 backdrop-blur-lg w-full max-w-md shadow-xl">
        <h1 className="text-2xl font-bold text-white mb-6">
          Performance Metrics
        </h1>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-white/80">Correct</h3>
            <p className="text-green-300 text-3xl font-bold">
              {quizResults.correctQuestions}
            </p>
          </div>
          <div>
            <h3 className="text-white/80">Incorrect</h3>
            <p className="text-red-300 text-3xl font-bold">
              {quizResults.incorrectQuestions}
            </p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <h3 className="text-white/80 mb-2">Overall Accuracy</h3>
            <div className="h-4 bg-white/20 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  parseFloat(accuracy) >= 70 ? 'bg-green-400' : 'bg-orange-400'
                }`}
                style={{ width: `${accuracy}%` }}
              />
            </div>
            <p className="text-4xl font-bold text-white mt-2">{accuracy}%</p>
          </div>

          <div>
            <h3 className="text-white/80 mb-2">Weekly Accuracy</h3>
            <div className="h-4 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-400 rounded-full transition-all duration-500"
                style={{ width: `${weeklyAccuracy}%` }}
              />
            </div>
            <p className="text-lg font-semibold text-white mt-1">{weeklyAccuracy.toFixed(1)}%</p>
          </div>

          <div>
            <h3 className="text-white/80 mb-2">Monthly Accuracy</h3>
            <div className="h-4 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-purple-400 rounded-full transition-all duration-500"
                style={{ width: `${monthlyAccuracy}%` }}
              />
            </div>
            <p className="text-lg font-semibold text-white mt-1">{monthlyAccuracy.toFixed(1)}%</p>
          </div>
        </div>

        <div className="bg-white/20 p-4 rounded-lg text-white text-center">
          {motivationalMessage}
        </div>
      </div>
    </div>
  );
};

export default ProgressView;