import React, { useEffect, useState } from 'react';
import { Button, Card, CardContent, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';  
import './MyGame.css';

async function fetchData() {
  let uniqueRandomNumbers = new Set();
  while (uniqueRandomNumbers.size !== 4) {
    uniqueRandomNumbers.add(Math.floor(Math.random() * 9 + 4));
  }
  let uRNArray = [...uniqueRandomNumbers];

  let questions = []
  for (let index = 0; index < uRNArray.length; index++) {
    let i = uRNArray[index].toString()
    let response = await fetch(`https://custom-trivia-api.com/one?project=regalo_2023&id=${i}`)
    let json = await response.json();
    questions[index] = json;
  }

  return questions;
}

const theme = createTheme({
  palette: {
    blues: {
      main: '#F7E987',
      light: '#9EC8B9',
      dark: '#1B4242',
      contrastText: '#5B9A8B',
    },
  },
  typography: {
    fontFamily: 'Fjalla One',
  }
})

const Question = ({ question, answers, correctAnswer }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  const handleSubmit = () => {
    if (selectedAnswer.replace(';', '') === correctAnswer.replace(';', '')) {
      setIsCorrect(true);
      document.body.style.backgroundColor = 'green';
    } else {
      setIsCorrect(false);
      document.body.style.backgroundColor = 'red';
    }
  };

  return (
    <ThemeProvider theme={theme}>
    <Card sx={{ backgroundColor: '#1B4242', width: '80%', margin: '0 auto', py: 2 }}>
      <CardContent>
        <Typography variant="h5" sx={{ color: '#9EC8B9' }}>{question}</Typography>
        {answers.map((answer, index) => (
          <Button key={index} variant="outlined" color="blues" onClick={() => setSelectedAnswer(answer)}>
            {answer}
          </Button>
        ))}
        <Button variant="contained" color="blues" onClick={handleSubmit}>
          Enviar
        </Button>
        {isCorrect !== null && (
          <Typography variant="h6" sx={{ color: '#9EC8B9' }}>{isCorrect ? 'Correct!' : 'Incorrect!'}</Typography>
        )}
      </CardContent>
    </Card>
    </ThemeProvider>
  );
};

const MyGame = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetchData().then((data) => {
      setQuestions(data);
    });
  }, []);
  console.log(questions)
  return (
    <div sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      {questions.map((q, index) => (
        <Question
          key={index}
          question={q.question}
          answers={q.answers.split(';')}
          correctAnswer={q.trueAnswers}
        />
      ))}
    </div>
  );
};

export default MyGame;
