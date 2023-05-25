const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');
const spanRecord = document.querySelector('#record');
const pResult = document.querySelector('#result');

let canvasSize;
let elementsSize;
let level = 0;
let lives = 3;


let timeStart;
let timePlayer;
let timeInterval;

const playerPosition = {
  x: undefined,
  y: undefined,
};

const giftPosition = {
  x: undefined,
  y: undefined,
}

let enemiesPosition = [];

window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);

function fixNumber (n) {
  return Number(n.toFixed(2));
}

function setCanvasSize() {
  if (window.innerHeight > window.innerWidth) {
    canvasSize = window.innerWidth * 0.8;
  } else {
    canvasSize = window.innerHeight * 0.8;
  }

  canvasSize = Number(canvasSize.toFixed(0));
  
  canvas.setAttribute('width', canvasSize);
  canvas.setAttribute('height', canvasSize);
  
  elementsSize = canvasSize / 10;


  playerPosition.x = undefined;
  playerPosition.y = undefined;

  startGame();
}

function startGame() {
  console.log({ canvasSize, elementsSize });

  game.font = elementsSize + 'px Verdana';
  game.textAlign = 'end';

  const map = maps[level];

  if (!map) {
    gameWin();
    return;
  }

  if (!timeStart) {
    timeStart = Date.now();
    timeInterval = setInterval(showTime, 100);
    showRecord();
  }

  const mapRows = map.trim().split('\n');
  const mapRowCols = mapRows.map(row => row.trim().split(''));
  console.log({map, mapRows, mapRowCols});

  showLives();


  enemiesPosition = [];
  game.clearRect(0,0,canvasSize, canvasSize);
  mapRowCols.forEach((row, rowI) => {
    row.forEach((col, colI) => {
      const emoji = emojis[col];
      const posX = elementsSize * (colI + 1);
      const posY = elementsSize * (rowI + 1);

      if (col == 'O') {
        if (!playerPosition.x && !playerPosition.y) {
          playerPosition.x = posX;
          playerPosition.y = posY;
          console.log({playerPosition});
        }
      }else if (col == 'I'){
        giftPosition.x = posX;
        giftPosition.y = posY;
      }else if (col == 'X'){
        enemiesPosition.push({
          x: posX,
          y: posY,
        })
      }      
      game.fillText(emoji, posX, posY);
    });
  });

  movePlayer();
}

function movePlayer() {
  const giftCollisionX = playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3);
  const giftCollisionY = playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3);
  const giftCollision = giftCollisionX && giftCollisionY;

  if (giftCollision) {
    levelwin();
    console.log('eres el papu, al siguiente level')
  }

  const enemiesCollision = enemiesPosition.find(enemies => {
   const enemiesCollisionX = enemies.x.toFixed(3) == playerPosition.x.toFixed(3);
   const enemiesCollisionY =  enemies.y.toFixed(3) == playerPosition.y.toFixed(3);
   return enemiesCollisionX && enemiesCollisionY;
  });

  if (enemiesCollision) {
    levelFail();    
  }
  game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
}

function levelwin () {
  console.log('eres el papu 😎, pal siguiente level')
  level ++;
  startGame();
}

function levelFail () {
  console.log('chocaste el auto 😣😶')
  lives--;

  if (lives <= 0){
    level = 0;
    lives = 3;
    timeStart = undefined;
  }

  playerPosition.x = undefined;
  playerPosition.y = undefined;
  startGame();  
}

function gameWin () {
  console.log ('finish him fawless victory 🙀🏁☝')
  clearInterval(timeInterval);

  
  const recordTime = localStorage.getItem('record:time');
  const playerTime = Date.now() - timeStart;
  
  if (recordTime) {
    if (recordTime >= playerTime) {
      localStorage.setItem('record_time', playerTime);
      pResult.innerHTML = 'RECORD BREAKER';
    } else {
      pResult.innerHTML ='ERES MUY LENTOOOOOOO  😁😁😁';
    }
  } else {
    localStorage.setItem('record_time', playerTime);
    pResult.innerHTML = 'first time'
  }
  
  console.log({recordTime, playerTime});  
}

function showLives () {
  const  heartsArray = Array(lives).fill(emojis['HEART']);

  spanLives.innerHTML = "";
  heartsArray.forEach(heart => spanLives.append(heart));

}

function showTime () {
  spanTime.innerHTML = Date.now() - timeStart;
}

function showRecord () {
  spanRecord.innerHTML = localStorage.getItem('record_time');
}



window.addEventListener('keydown', moveByKeys);
btnUp.addEventListener('click', moveUp);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);
btnDown.addEventListener('click', moveDown);

function moveByKeys(event) {
  if (event.key == 'ArrowUp') moveUp();
  else if (event.key == 'ArrowLeft') moveLeft();
  else if (event.key == 'ArrowRight') moveRight();
  else if (event.key == 'ArrowDown') moveDown();
}
function moveUp() {
  console.log('Me quiero mover hacia arriba');

  if ((playerPosition.y - elementsSize) < elementsSize) {
    console.log('OUT');
  } else {
    playerPosition.y -= elementsSize;
    startGame();
  }
}
function moveLeft() {
  console.log('Me quiero mover hacia izquierda');

  if ((playerPosition.x - elementsSize) < elementsSize) {
    console.log('OUT');
  } else {
    playerPosition.x -= elementsSize;
    startGame();
  }
}
function moveRight() {
  console.log('Me quiero mover hacia derecha');

  if ((playerPosition.x + elementsSize) > canvasSize) {
    console.log('OUT');
  } else {
    playerPosition.x += elementsSize;
    startGame();
  }
}
function moveDown() {
  console.log('Me quiero mover hacia abajo');
  
  if ((playerPosition.y + elementsSize) > canvasSize) {
    console.log('OUT');
  } else {
    playerPosition.y += elementsSize;
    startGame();
  }
}