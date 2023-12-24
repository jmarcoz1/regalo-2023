import React, { useEffect, useState } from 'react';
import { Button, Card, CardContent, Typography, Stack, Box } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';  
import './MyGame.css';

async function fetchData() {
  let uniqueRandomNumbers = new Set();
  while (uniqueRandomNumbers.size !== 13) {
    uniqueRandomNumbers.add(Math.floor(Math.random() * 13 + 4));
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

const Question = ({ question, answers, correctAnswer, onNext }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  const handleSubmit = () => {
    if (selectedAnswer.replace(';', '') === correctAnswer.replace(';', '')) {
      setIsCorrect(true);
      document.body.style.backgroundColor = 'green';
      setTimeout(() => document.body.style.backgroundColor = '', 1000);
      onNext();
    } else {
      setIsCorrect(false);
      document.body.style.backgroundColor = 'red';
      setTimeout(() => document.body.style.backgroundColor = '', 1000);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Card sx={{ backgroundColor: '#1B4242', width: '80%', margin: '0 auto', py: 2 }}>
        <CardContent>
          <Typography variant="h5" sx={{ color: '#9EC8B9', textAlign: 'center', py: 2 }}>{question}</Typography>
          <Stack direction="column" spacing={2}>
            {answers.map((answer, index) => (
              <Button
                key={index}
                variant="outlined"
                color={answer === selectedAnswer ? 'secondary' : 'blues'}
                onClick={() => setSelectedAnswer(answer)}
              >
                {answer}
              </Button>
            ))}
            <Button variant="contained" color="blues" onClick={handleSubmit}>
              Enviar
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
};

const MyGame = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData().then((data) => {
      setQuestions(data);
      setIsLoading(false);
    });
  }, []);
  console.log(questions)

  const handleNext = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const handleCorrect = () => {
    setCorrectAnswers((prevCorrectAnswers) => prevCorrectAnswers + 1);
  };

  return (
    <div sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', height: '100vh' }}>
      <ThemeProvider theme={theme}>
        <Typography variant="h2" sx={{ color: '#9EC8B9', textAlign: 'center' }}>Scott's trivia</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          {isLoading ? (
            <Typography variant="h4" sx={{ color: '#9EC8B9', textAlign: 'center', px: 2, py: 2 }}>
              Cargando...
            </Typography>
          ) : currentQuestionIndex < questions.length ? (
            <Question
              question={questions[currentQuestionIndex].question}
              answers={questions[currentQuestionIndex].answers.split(';')}
              correctAnswer={questions[currentQuestionIndex].trueAnswers}
              onNext={handleNext}
              onCorrect={handleCorrect}
            />
          ) : (
            <Typography variant="h4" sx={{ color: '#9EC8B9', textAlign: 'center', px: 2, py: 2 }}>
              Has respondido todas las preguntas.
              El pin para abrir el regalo es 5698.
            </Typography>
          )}
        </Box>
      </ThemeProvider>
    </div>
  );
};
export default MyGame;
