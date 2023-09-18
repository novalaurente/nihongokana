import React from 'react';

interface IQuestions {
  character: string;
  pinyin: string;
  answer: string;
  wrongAnswers: string[];
  topic: string;
  lesson: string;
}
interface Questionscardprops {
  questions: IQuestions[];
  currentQuestionIndex: number;
  score: number;
  result: string;
  isResultVisible: boolean;
  isPinyinVisible: boolean;
  currentChoices: string[];
  handleAnswer: (value: string) => void;
  handleRestartQuiz: () => void;
}

export default function Questionscard({
  questions,
  currentQuestionIndex,
  score,
  result,
  isResultVisible,
  isPinyinVisible,
  currentChoices,
  handleAnswer,
  handleRestartQuiz,
}: Questionscardprops) {
  return (
    <div>
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
            {isPinyinVisible && <p className='mt-2'>{questions[currentQuestionIndex].pinyin}</p>}
          </div>
          <div className='my-4 w-full flex items-center justify-center'>
            <ul className='w-5/6 flex flex-wrap items-center justify-center'>
              {currentChoices.map((choice: string) => (
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
            onClick={handleRestartQuiz}>
            Restart
          </button>
        </div>
      )}
    </div>
  );
}
