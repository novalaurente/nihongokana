'use client';

import { useState, useEffect } from 'react';
import { shuffleArray } from './utils';
import { quizData } from './quizData';
import Filterbar from './components/Filterbar';
import Questionscard from './components/Questionscard';

interface IQuestions {
  character: string;
  answer: string;
  wrongAnswers: string[];
  topic: string;
  lesson: string;
}

export default function App() {
  const [questions, setQuestions] = useState<IQuestions[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Using an index instead of the question itself
  const [currentChoices, setCurrentChoices] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState('');
  const [isResultVisible, setIsResultVisible] = useState(true);

  const [selectedType, setSelectedType] = useState('HSK Lesson');
  const [selectedLesson, setSelectedLesson] = useState('All');
  const [options, setOptions] = useState<string[]>([]);

  let filteredQuizData: IQuestions[];

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
  const handleAnswer = (selectedAnswer: string) => {
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
  const handleRestartQuiz = () => {
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
    <div className='bg-[#F5F9EA] mx-auto h-screen md:w-screen lg:w-screen'>
      <div className='flex flex-col justify-between'>
        <header className='py-6 md:py-12 flex justify-center text-2xl'>Nihongo Quiz App</header>
        <Filterbar
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          selectedLesson={selectedLesson}
          setSelectedLesson={setSelectedLesson}
          options={options}
        />
        <Questionscard
          questions={questions}
          currentQuestionIndex={currentQuestionIndex}
          score={score}
          result={result}
          isResultVisible={isResultVisible}
          currentChoices={currentChoices}
          handleAnswer={handleAnswer}
          handleRestartQuiz={handleRestartQuiz}
        />
        <footer className='flex justify-center pt-10 pb-2 md:pt-20'>
          <p className='text-xs'>Made with ♡ by stargirl.codes</p>
        </footer>
      </div>
    </div>
  );
}
