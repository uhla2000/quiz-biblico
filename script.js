
const numPerguntas = 5; // ou 10, conforme a escolha do jogador
let todasPerguntas = [];
let perguntasUsadas = JSON.parse(localStorage.getItem('perguntasUsadas')) || [];

function getRandomQuestions(lista, quantidade) {
  const embaralhadas = [...lista].sort(() => 0.5 - Math.random());
  return embaralhadas.slice(0, quantidade);
}

function carregarPerguntas() {
  fetch("perguntas.json")
    .then(res => res.json())
    .then(dados => {
      todasPerguntas = dados;

      let disponiveis = todasPerguntas.filter((_, i) => !perguntasUsadas.includes(i));

      if (disponiveis.length < numPerguntas) {
        perguntasUsadas = [];
        localStorage.removeItem('perguntasUsadas');
        disponiveis = [...todasPerguntas];
      }

      const selecionadas = getRandomQuestions(disponiveis, numPerguntas);
      selecionadas.forEach(q => {
        const index = todasPerguntas.indexOf(q);
        if (!perguntasUsadas.includes(index)) perguntasUsadas.push(index);
      });

      localStorage.setItem('perguntasUsadas', JSON.stringify(perguntasUsadas));

      iniciarQuiz(selecionadas);
    });
}

function iniciarQuiz(perguntas) {
  const container = document.getElementById("quiz-container");
  container.innerHTML = "<ol>" + perguntas.map(q =>
    `<li><strong>${q.question}</strong><br>${q.answers.map(a => `<button>${a}</button>`).join(" ")}</li>`
  ).join("") + "</ol>";
}

carregarPerguntas();
