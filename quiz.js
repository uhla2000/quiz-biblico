let quiz = [];
let currentQuestion = 0;
let score = 0;
let selectedQuestions = [];

async function loadDefaultQuestions() {
  const response = await fetch("perguntas.json");
  return await response.json();
}

async function loadQuestions() {
  const saved = localStorage.getItem("quizQuestions");
  if (saved) {
    quiz = JSON.parse(saved);
  } else {
    quiz = await loadDefaultQuestions();
    localStorage.setItem("quizQuestions", JSON.stringify(quiz));
  }
}

function startQuiz(numQuestions) {
  document.getElementById("start-screen").classList.add("hidden");
  document.getElementById("quiz-container").classList.remove("hidden");
  currentQuestion = 0;
  score = 0;
  selectedQuestions = shuffleArray([...quiz]).slice(0, numQuestions);
  showQuestion();
}

function showQuestion() {
  const questionEl = document.getElementById("question");
  const answersEl = document.getElementById("answers");
  const resultEl = document.getElementById("result");
  const imageContainer = document.getElementById("image-container");
  const scoreEl = document.getElementById("score");

  resultEl.textContent = "";
  answersEl.innerHTML = "";
  scoreEl.textContent = "";
  imageContainer.innerHTML = "";

  if (currentQuestion >= selectedQuestions.length) {
    questionEl.textContent = "Fim do Quiz!";
    scoreEl.textContent = `Sua pontuação: ${score} de ${selectedQuestions.length}`;
    document.getElementById("restart").style.display = "block";
    return;
  }

  const q = selectedQuestions[currentQuestion];
  questionEl.textContent = q.question;

  if (q.image) {
    const img = document.createElement("img");
    img.src = q.image;
    imageContainer.appendChild(img);
  }

  q.answers.forEach(answer => {
    const btn = document.createElement("button");
    btn.textContent = answer;
    btn.className = "answer";
    btn.onclick = () => checkAnswer(answer);
    answersEl.appendChild(btn);
  });
}

function checkAnswer(selected) {
  const correct = selectedQuestions[currentQuestion].correct;
  const resultEl = document.getElementById("result");

  if (selected === correct) {
    score++;
    resultEl.textContent = "✔️ Correto!";
    resultEl.style.color = "green";
  } else {
    resultEl.textContent = `❌ Errado. Resposta certa: ${correct}`;
    resultEl.style.color = "red";
  }

  currentQuestion++;
  setTimeout(showQuestion, 2000);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

document.getElementById("restart").onclick = () => {
  location.reload();
};

function showAddForm() {
  document.getElementById("start-screen").classList.add("hidden");
  document.getElementById("add-question-container").classList.remove("hidden");
}

function backToMenu() {
  document.getElementById("add-question-container").classList.add("hidden");
  document.getElementById("start-screen").classList.remove("hidden");
}

document.getElementById("add-question-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const newQuestion = document.getElementById("new-question").value.trim();
  const answer1 = document.getElementById("answer1").value.trim();
  const answer2 = document.getElementById("answer2").value.trim();
  const answer3 = document.getElementById("answer3").value.trim();
  const answer4 = document.getElementById("answer4").value.trim();
  const correct = document.getElementById("correct-answer").value.trim();
  const image = document.getElementById("image-url").value.trim();

  const answers = [answer1, answer2, answer3, answer4];

  if (!answers.includes(correct)) {
    alert("A resposta correta deve estar entre as opções.");
    return;
  }

  const newEntry = {
    question: newQuestion,
    answers: answers,
    correct: correct
  };

  if (image) {
    newEntry.image = image;
  }

  quiz.push(newEntry);
  localStorage.setItem("quizQuestions", JSON.stringify(quiz));
  alert("Pergunta adicionada com sucesso!");
  this.reset();
});

loadQuestions();