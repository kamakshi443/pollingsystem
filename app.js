import express from "express";
const app = express();
const port = 3000;

app.use(express.json());

let questions = [];

// Function to generate a dynamic link for voting
function generateVoteLink(questionId, optionId) {
  return `http://localhost:${port}/questions/${questionId}/options/${optionId}/add_vote`;
}

// Route to create a question
app.post("/questions/create", (req, res) => {
  const newQuestion = {
    id: questions.length + 1,
    title: req.body.question,
    options: [],
  };
  questions.push(newQuestion);
  res.json({ message: "Question created successfully" });
});

// Route to add options to a specific question
app.post("/questions/:questionId/options/create", (req, res) => {
  const questionId = req.params.questionId;
  const optionText = req.body.option;

  console.log("req body", req.body)
  const optionId = questions[questionId - 1].options.length + 1;
  const newOption = {
    id: optionId,
    text: optionText,
    votes: 0,
    link_to_vote: generateVoteLink(questionId, optionId),
  };
  questions[questionId - 1].options.push(newOption);
  res.json({ message: "Option added successfully" });
});

// Route to increment the count of votes
app.post("/questions/:questionId/options/:optionId/add_vote", (req, res) => {
  const questionId = req.params.questionId;
  const optionId = req.params.optionId;
  questions[questionId - 1].options[optionId - 1].votes++;
  res.json({ message: "Vote added successfully" });
});

//   /questions/:id/delete (To delete a question):

app.delete("/questions/:id/delete", (req, res) => {
  const questionId = req.params.id;
  if (questions[questionId].options.some((option) => option.votes > 0)) {
    res
      .status(400)
      .json({ error: "Cannot delete a question with votes on options" });
  } else {
    questions.splice(questionId, 1);
    res.json({ message: "Question deleted successfully" });
  }
});
//   /options/:id/delete (To delete an option):
app.delete('/options/:id/delete', (req, res) => {
    const questionId = req.params.id;
    const optionId = req.body.optionId;
    if (questions[questionId].options[optionId].votes > 0) {
      res.status(400).json({ error: 'Cannot delete an option with votes' });
    } else {
      questions[questionId].options.splice(optionId, 1);
      res.json({ message: 'Option deleted successfully' });
    }
  });
  
// Route to view a question and its options
app.get("/questions/:questionId", (req, res) => {
  const questionId = req.params.questionId;
  const question = questions[questionId - 1];
  res.json({ ...question });
});

// Get all questions
app.get('/questions', (req, res) => {
    res.json({ questions });
  });
  
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
