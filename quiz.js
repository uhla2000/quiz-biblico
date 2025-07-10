let quiz = [];
let currentQuestion = 0;
let score = 0;

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
  showQuestion();
}

function showQuestion() {
  const questionEl = document.getElementById("question");
  const answersEl = document.getElementById("answers");
  const resultEl = document.getElementById("result");
  const imageContainer = document.getElementById("image-container");
  const scoreEl = document.getElementById("score");
  const restartBtn = document.getElementById("restart");

  resultEl.textContent = "";
  answersEl.innerHTML = "";
  scoreEl.textContent = "";
  imageContainer.innerHTML = "";

  restartBtn.style.display = "none";

  if (currentQuestion >= quiz.length) {
    questionEl.textContent = "Fim do Quiz!";
    scoreEl.textContent = `Sua pontuação: ${score} de ${quiz.length}`;
    restartBtn.style.display = "block";
    return;
  }

  const q = quiz[currentQuestion];
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
  const correct = quiz[currentQuestion].correct;
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

document.getElementById("restart").onclick = () => {
  currentQuestion = 0;
  score = 0;
  showQuestion();
};

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

  if (currentQuestion >= quiz.length - 1) {
    document.getElementById("restart").style.display = "block";
  }
});

loadQuestions();