'use client';

import React, { useState, useEffect } from 'react';
import { shuffleArray } from './utils';
import { quizData } from './quizData';

export default function App() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Using an index instead of the question itself
  const [currentChoices, setCurrentChoices] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState('');
  const [isResultVisible, setIsResultVisible] = useState(true);
  const [isPinyinVisible, setIsPinyinVisible] = useState(true);

  const [selectedType, setSelectedType] = useState('HSK Lesson');
  const [options, setOptions] = useState<string[]>([]);
  const [selectedLesson, setSelectedLesson] = useState('All');

  let filteredQuizData: any;

  if (selectedLesson === 'All') {
    filteredQuizData = [...quizData];
  } else {
    if (selectedType === 'HSK Lesson') {
      filteredQuizData = quizData.filter((item) => item.lesson === selectedLesson);
    } else if (selectedType === 'Topic') {
      filteredQuizData = quizData.filter((item) => item.topic === selectedLesson);
    }
  }

  // Function to handle the user's answer submission
  const handleAnswer = (selectedAnswer: any) => {
    if (selectedAnswer === questions[currentQuestionIndex].answer) {
      setScore((prevScore) => prevScore + 1);
      setResult('Correct!');
    } else {
      setResult('Wrong!');
    }

    if (currentQuestionIndex === questions.length) {
      // All questions have been displayed
      // Show a restart button or any other desired UI
      return;
    }

    setIsResultVisible(true);
    const timeout = setTimeout(() => {
      setIsResultVisible(false);
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }, 2000);
  };

  // Function to restart the quiz
  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    // Shuffle the questions again to start a new quiz
    const shuffledQuestions = shuffleArray(filteredQuizData);
    setQuestions(shuffledQuestions);
  };

  useEffect(() => {
    // Shuffle the quizData to avoid repeating questions
    const shuffledQuestions = shuffleArray(filteredQuizData);
    setQuestions(shuffledQuestions);
    setCurrentQuestionIndex(0); // Reset to the first question
    setScore(0);
  }, [selectedLesson]);

  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      const currentQuestion = questions[currentQuestionIndex];
      const shuffledAnswers = shuffleArray([
        ...currentQuestion.wrongAnswers,
        currentQuestion.answer,
      ]);
      setCurrentChoices(shuffledAnswers);
    }
  }, [currentQuestionIndex, questions]);

  useEffect(() => {
    if (selectedType === 'HSK Lesson') {
      setOptions(
        Array.from(
          quizData
            .map((item) => item.lesson)
            .filter((value, index, self) => self.indexOf(value) === index)
            .sort((a: any, b: any) => a - b)
        )
      );
    } else if (selectedType === 'Topic') {
      setOptions(
        Array.from(
          quizData
            .map((item) => item.topic)
            .filter((value, index, self) => self.indexOf(value) === index)
        )
      );
    }
  }, [selectedType]);

  return (
    <div className='bg-[#FAF1E6] mx-auto h-screen md:w-screen lg:w-screen'>
      <div className='flex flex-col justify-between'>
        <div>
          <div className='py-6 md:py-12 flex justify-center text-2xl'>Mandarin Quiz App</div>
          <div className='px-10 flex flex-col justify-center md:flex-row md:items-center md:w-full md:mx-auto md:p-6'>
            <label className='mb-2 mr-2 flex flex-row items-center text-sm md:mb-0 md:text-base'>
              Select type:
              <select
                className='cursor-pointer p-2 rounded border border-solid border-gray-400 ml-2'
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}>
                <option value='HSK Lesson'>HSK Lesson</option>
                <option value='Topic'>Topic</option>
              </select>
            </label>
            <label className='mb-2 mr-2 flex flex-row items-center text-sm md:mb-0 md:text-base'>
              {selectedType === 'HSK Lesson' ? 'Select chapter: ' : 'Select topic: '}
              <select
                className='cursor-pointer p-2 rounded border border-solid border-gray-400 ml-2'
                value={selectedLesson}
                onChange={(e) => setSelectedLesson(e.target.value)}>
                <option value='All'>All</option>
                {options.map((item: any) => {
                  return (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  );
                })}
              </select>
            </label>
            <button
              className='bg-[#B6C867] hover:bg-[#95a93d] rounded p-2 w-24 md:w-36 text-sm md:text-base'
              onClick={() => setIsPinyinVisible(!isPinyinVisible)}>
              {isPinyinVisible ? 'Hide' : 'Show'} Pinyin
            </button>
          </div>

          {questions.length > 0 && currentQuestionIndex < questions.length ? (
            <div className='py-2 flex flex-col justify-center items-center'>
              <div className='w-full flex my-2 py-2 px-10 justify-between text-sm md:my-4 md:w-2/5 md:px-6 md:text-base'>
                <p>
                  Question {currentQuestionIndex + 1} of {questions.length}
                </p>
                <p>Score: {score}</p>
              </div>
              <div className='mb-4 h-10 text-lg'>
                {isResultVisible && result.length !== 0 ? result : null}
              </div>
              <div className='bg-[#FFC074] w-2/3 md:w-1/4 h-[100px] md:h-[125px] p-2 flex flex-col justify-center items-center rounded-md'>
                <p className='text-3xl md:text-6xl'>{questions[currentQuestionIndex].character}</p>
                {isPinyinVisible && (
                  <p className='mt-2'>{questions[currentQuestionIndex].pinyin}</p>
                )}
              </div>
              <div className='my-4 w-full flex items-center justify-center'>
                <ul className='w-5/6 flex flex-wrap items-center justify-center'>
                  {currentChoices.map((choice) => (
                    <li
                      className='w-28 h-28 flex items-center justify-center m-4 md:p-4 md:m-4 border border-solid border-gray-400 rounded-md text-center cursor-pointer hover:bg-[#B6C867]'
                      key={choice}
                      onClick={() => handleAnswer(choice)}>
                      {choice}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className='flex flex-col items-center'>
              <div className='m-4 p-4 flex flex-col items-center'>
                <p>Quiz completed!</p>
                <p className='text-xl m-4'>
                  Your score: {score} / {questions.length}
                </p>
              </div>
              <button
                className='bg-[#B6C867] hover:bg-[#95a93d] rounded p-4 w-24 mb-72'
                onClick={restartQuiz}>
                Restart
              </button>
            </div>
          )}
        </div>
        <footer className='flex justify-center pt-10 pb-2 md:pt-20'>
          <p className='text-xs'>Made with ♡ by stargirl.codes</p>
        </footer>
      </div>
    </div>
  );
}
