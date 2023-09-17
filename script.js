
//Массив условий для победы
const winConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]

const cellElements = document.querySelectorAll('.cell')
const board = document.querySelector('.board')
const winElement = document.querySelector('.win')
const restartButton = document.querySelector('.restartButton')
const winText = document.querySelector('.win__message')
let circleTurn;

function saveGame() {
  const gameState = {
    circleTurn: circleTurn,
    cellStates: [],
  };

  cellElements.forEach((cell) => {
    gameState.cellStates.push(cell.classList.value);
  });

  localStorage.setItem("ticTacToeGame", JSON.stringify(gameState));
}

function loadGame() {
    const savedGame = localStorage.getItem("ticTacToeGame");
    if (savedGame) {
        const gameState = JSON.parse(savedGame);
        circleTurn = gameState.circleTurn;
        cellElements.forEach((cell, index) => {
          cell.className = gameState.cellStates[index];
      });
      if (!isDraw()) {
          setBoardHoverClass();
      }
    } 
      
}

startGame();
loadGame();

restartButton.addEventListener('click', startGame)

//При старте игры убираем классы всех клеток, заново инициализируем одноразовый слушатель клика 
function startGame() {
  circleTurn = false
  cellElements.forEach(cell => {
    cell.classList.remove("x")
    cell.classList.remove("circle")
    cell.removeEventListener('click', handleClick)
    cell.addEventListener('click', handleClick, { once: true })
  })
  setBoardHoverClass()
  winElement.classList.remove('show')
}

//Обработка клика по клетке
function handleClick(e) {
    const cell = e.target;
     //Определяем какой класс нужно добавить клетке в зависимости от очереди
    const currentClass = circleTurn ? "circle" : "x";
    placeMark(cell, currentClass);
    //Проверяем стадию игры, в случае победы или ничьи завершаем, иначе меняем очередь
    if (checkWin(currentClass)) {
      endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        setBoardHoverClass();
        saveGame(); // Сохранение текущего состояние игры
    }
}


//Обрабатываем вывод в конце игры для ничьи и победы какого либо из игроков
function endGame(draw) {
  if (draw) {
    winText.innerText = 'Ничья!'
  } else {
    winText.innerText = `${circleTurn ? "Нолики" : "Крестики"} выиграли!`
  }
  winElement.classList.add('show')
}

//Ничья определяется при заполнении всех клеток без победной комбинаци
function isDraw() {
  return [...cellElements].every(cell => {
    return cell.classList.contains("x") || cell.classList.contains("circle")
  })
}

//Добавляем текущий класс на клетку
function placeMark(cell, currentClass) {
  cell.classList.add(currentClass)
}

//Смена очереди хода
function swapTurns() {
  circleTurn = !circleTurn
}

//Выдаем ноавй класс на клетку в зависимости от очереди
function setBoardHoverClass() {
  board.classList.remove("x")
  board.classList.remove("circle")
  if (circleTurn) {
    board.classList.add("circle")
  } else {
    board.classList.add("x")
  }
}

//Проверяем победные комбинации
function checkWin(currentClass) {
  //Если какая либо из победных комбинаций
  return winConditions.some(combination => {
    //соответствует наличию классов в клетках на поле
    return combination.every(index => {
      return cellElements[index].classList.contains(currentClass)
    })
  })
  //то присуждается победа
}