import React, { useState, useEffect } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Typography,
  Grid,
} from "@mui/material";

// Define the initial state for the game
const initialState = {
  questions: [],
  answers: [],
  score: 0,
  feedback: "",
  loading: true,
  error: false,
};

// Define the main component for the game
const Game = () => {
  // Use the useState hook to store the game state
  const [state, setState] = useState(initialState);

  // Use the useEffect hook to fetch the questions and the photographs from the API
  useEffect(() => {

    // Define the async function to fetch the data
    const fetchData = async () => {
      try {
        //questions.forEach(q => {
        //  console.log(q)
        //})

        let randomNumbers = Array.from({length: 4}, () => Math.floor(Math.random() * 9 + 4));
        let uniqueRandomNumbers = [...new Set(randomNumbers)];
        while (uniqueRandomNumbers.length !== 4) {
          uniqueRandomNumbers.push(Math.floor(Math.random() * 9 + 4))
        }
        console.log(randomNumbers)
        console.log(uniqueRandomNumbers)

        let questions = []
        for (let index = 0; index < uniqueRandomNumbers.length; index++) {
          let i = uniqueRandomNumbers[index].toString()
          let response = await fetch(`https://custom-trivia-api.com/one?project=regalo_2023&id=${i}`)
            .then(response => response.json())
            .then(json => questions[index] = json)
        }

        
        questions.forEach(q => {
          console.log(q)
        })


        // Check if the response is ok
        if (response.ok) {
          // Parse the response as JSON
          console.log('everything okay')
          const data = await response.json();
          const answers = object.answers.split(';');

          // Get the results array from the data
          const results = data.results;

          // Map the results array to get the questions and the photographs
          const questions = results.map((result) => {
            // Get the question, the correct answer, and the incorrect answers from the result
            const { question, correct_answer, incorrect_answers } = result;

            // Decode the HTML entities in the question and the answers
            const decodedQuestion = decodeURIComponent(question);
            const decodedCorrectAnswer = decodeURIComponent(correct_answer);
            const decodedIncorrectAnswers = incorrect_answers.map((answer) =>
              decodeURIComponent(answer)
            );

            // Shuffle the answers array to randomize the order
            const answers = shuffleArray([
              ...decodedIncorrectAnswers,
              decodedCorrectAnswer,
            ]);

            // Get a random photograph from the Unsplash API based on the question
            const photoUrl = `https://source.unsplash.com/featured/?${decodedQuestion}`;

            // Return an object with the question, the answers, and the photo URL
            return {
              question: decodedQuestion,
              answers,
              photoUrl,
            };
          });

          // Update the state with the questions and set the loading to false
          setState((prevState) => ({
            ...prevState,
            questions,
            loading: false,
          }));
        } else {
          // Throw an error if the response is not ok
          throw new Error("Something went wrong");
        }
      } catch (error) {
        // Catch the error and update the state with the error message and set the error to true
        setState((prevState) => ({
          ...prevState,
          feedback: error.message,
          error: true,
        }));
      }
    };

    // Invoke the async function
    fetchData();
  }, []);

  // Use the useEffect hook to check the user's answers and update the score
  useEffect(() => {
    // Get the answers array from the state
    const { answers } = state;

    // Check if the answers array has four elements
    if (answers.length === 4) {
      // Get the questions array from the state
      const { questions } = state;

      // Initialize a variable to store the score
      let score = 0;

      // Loop through the questions and the answers arrays
      for (let i = 0; i < questions.length; i++) {
        // Get the correct answer from the question object
        const correctAnswer = questions[i].correct_answer;

        // Get the user's answer from the answers array
        const userAnswer = answers[i];

        // Compare the correct answer and the user's answer
        if (correctAnswer === userAnswer) {
          // Increment the score by one if they match
          score++;
        }
      }

      // Update the state with the score and the feedback message
      setState((prevState) => ({
        ...prevState,
        score,
        feedback: `You scored ${score} out of 4!`,
      }));
    }
  }, [state.answers]);

  // Define the function to handle the user's selection
  const handleSelect = (index, answer) => {
    // Update the state with the user's answer at the given index
    setState((prevState) => ({
      ...prevState,
      answers: [...prevState.answers.slice(0, index), answer, ...prevState.answers.slice(index + 1)],
    }));
  };

  // Define the function to reset the game
  const handleReset = () => {
    // Reset the state to the initial state
    setState(initialState);
  };

  // Define the function to shuffle an array
  const shuffleArray = (array) => {
    // Copy the array
    const copy = [...array];

    // Loop through the array
    for (let i = copy.length - 1; i > 0; i--) {
      // Get a random index
      const j = Math.floor(Math.random() * (i + 1));

      // Swap the elements at i and j
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }

    // Return the shuffled array
    return copy;
  };

  // Get the loading, error, questions, score, and feedback from the state
  const { loading, error, questions, score, feedback } = state;

  // Return the JSX for the game component
  return (
    <div>
      <Typography variant="h3" gutterBottom>
        Photo Quiz
      </Typography>
      {loading && <Typography variant="h5">Loading...</Typography>}
      {error && <Typography variant="h5" color="error">{feedback}</Typography>}
      {!loading && !error && (
        <Grid container spacing={2} direction="column">
          {questions.map((question, index) => (
            <Grid item key={index}>
              <Card>
                <CardMedia
                  component="img"
                  height="300"
                  image={question.photoUrl}
                  alt={question.question}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {question.question}
                  </Typography>
                </CardContent>
                <CardActions>
                  {question.answers.map((answer, i) => (
                    <Button
                      key={i}
                      variant="contained"
                      color="primary"
                      onClick={() => handleSelect(index, answer)}
                      disabled={state.answers[index]}
                    >
                      {answer}
                    </Button>
                  ))}
                </CardActions>
              </Card>
            </Grid>
          ))}
          <Grid item>
            <Typography variant="h4" gutterBottom>
              Score: {score}
            </Typography>
            <Typography variant="h5" gutterBottom>
              {feedback}
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleReset}
            >
              Play Again
            </Button>
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default Game;