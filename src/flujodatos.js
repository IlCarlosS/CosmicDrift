const canvas = document.getElementById('spaceCanvas');
const ctx = canvas.getContext('2d');
const ufoImg = new Image();
ufoImg.src = 'img/asset/ufo.svg';
const rocketImg = new Image();
rocketImg.src = 'img/asset/jetpack.svg';
// Tamaño del jugador y enemigos
const playerWidth = 50;
const playerHeight = 30;
const enemySize = 30;
const bulletWidth = 4;
const bulletHeight = 10;

// Estado del juego
let playerX = canvas.width / 2 - playerWidth / 2;
let bullets = [];
let enemies = [];
let keys = {};

// Crear enemigos
function spawnEnemies(rows = 4, cols = 11) {
  enemies = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      enemies.push({
        x: 80 + c * 80,
        y: 50 + r * 60,
        alive: true
      });
    }
  }
}

// Dibujar jugador
function drawPlayer() {
  ctx.drawImage(rocketImg, playerX, canvas.height - playerHeight - 10, playerWidth, playerHeight);
}

// Dibujar enemigos
function drawEnemies() {
  enemies.forEach(enemy => {
    if (enemy.alive) {
      ctx.drawImage(ufoImg, enemy.x, enemy.y, enemySize, enemySize);
    }
  });
}

// Dibujar balas
function drawBullets() {
  ctx.fillStyle = '#F0F0F0';
  bullets.forEach(bullet => {
    ctx.fillRect(bullet.x, bullet.y, bulletWidth, bulletHeight);
  });
}

// Actualizar balas
function updateBullets() {
  bullets = bullets.filter(bullet => bullet.y > 0);
  bullets.forEach(bullet => {
    bullet.y -= 5;

    enemies.forEach(enemy => {
      if (
        enemy.alive &&
        bullet.x < enemy.x + enemySize &&
        bullet.x + bulletWidth > enemy.x &&
        bullet.y < enemy.y + enemySize &&
        bullet.y + bulletHeight > enemy.y
      ) {
        enemy.alive = false;
        bullet.y = -10; // Eliminar bala
      }
    });
  });
}

// Movimiento del jugador
function updatePlayer() {
  if (keys['ArrowLeft'] && playerX > 0) {
    playerX -= 5;
  }
  if (keys['ArrowRight'] && playerX < canvas.width - playerWidth) {
    playerX += 5;
  }
}

// Disparo
let lastShotTime = 0;
const shotCooldown = 700; // milisegundos 
function shoot() {
  const now = Date.now();
  if (now - lastShotTime >= shotCooldown) {
    bullets.push({
      x: playerX + playerWidth / 2 - bulletWidth / 2,
      y: canvas.height - playerHeight - 15
    });
    lastShotTime = now;
  }
}

let enemyDirection = 1; // 1 = derecha, -1 = izquierda

function updateEnemies() {
  let edgeReached = false;

  enemies.forEach(enemy => {
    if (enemy.alive) {
      enemy.x += enemyDirection * 0.5;

      if (enemy.x <= 0 || enemy.x + enemySize >= canvas.width) {
        edgeReached = true;
      }
    }
  });

  if (edgeReached) {
    enemyDirection *= -1;
    enemies.forEach(enemy => {
      if (enemy.alive) {
        enemy.y += 20;
      }
    });
  }
}

let enemyBullets = [];
let lastEnemyShot = 0;
const enemyShotCooldown = 400;

function enemyShoot() {
  const now = Date.now();
  if (now - lastEnemyShot >= enemyShotCooldown) {
    const shooters = enemies.filter(e => e.alive);
    if (shooters.length > 0) {
      const shooter = shooters[Math.floor(Math.random() * shooters.length)];
      enemyBullets.push({
        x: shooter.x + enemySize / 2,
        y: shooter.y + enemySize
      });
      lastEnemyShot = now;
    }
  }
}

function updateEnemyBullets() {
  enemyBullets = enemyBullets.filter(b => b.y < canvas.height);
  enemyBullets.forEach(bullet => {
    bullet.y += 4;

    // Colisión con jugador
    if (
      bullet.x > playerX &&
      bullet.x < playerX + playerWidth &&
      bullet.y > canvas.height - playerHeight - 10 &&
      bullet.y < canvas.height - 10
    ) {
      gameOver();
    }
  });
}

function drawEnemyBullets() {
  ctx.fillStyle = '#FF0033';
  enemyBullets.forEach(bullet => {
    ctx.fillRect(bullet.x, bullet.y, bulletWidth, bulletHeight);
  });
}

function checkEnemyCollisionWithPlayer() {
  enemies.forEach(enemy => {
    if (
      enemy.alive &&
      enemy.y + enemySize >= canvas.height - playerHeight - 10 &&
      enemy.x < playerX + playerWidth &&
      enemy.x + enemySize > playerX
    ) {
      gameOver();
    }
  });
}

//musica
const bgMusic = new Audio('img/asset/Overboard - The Grey Room _ Golden Palms.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.4;
const alertMusic = new Audio('img/asset/Nebula - The Grey Room _ Density & Time.mp3');
alertMusic.volume= 0.4;

//victoria
function checkVictory() {
  const allDead = enemies.every(enemy => !enemy.alive);
  if (allDead) {
    bgMusic.pause();
    bgMusic.currentTime = 0;
    alertMusic.play();
    setTimeout(() => {
      alert("¡Felicidades! Has detenido la invasión.");
      alertMusic.pause();
      alertMusic.currentTime = 0;
      document.location.reload();
    }, 100); // pequeña pausa para evitar conflicto visual
  }
}

function gameOver() {
  bgMusic.pause();
  bgMusic.currentTime = 0;
  alertMusic.play();
  alert("¡Has sido destruido! Misión fallida");
  alertMusic.pause();
  alertMusic.currentTime = 0;
  document.location.reload(); // reinicia el juego
}

// Loop principal
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updatePlayer();
  updateBullets();
  updateEnemies();
  updateEnemyBullets();
  enemyShoot();
  checkEnemyCollisionWithPlayer();
  checkVictory();
  drawPlayer();
  drawEnemies();
  drawBullets();
  drawEnemyBullets();
  requestAnimationFrame(gameLoop);
}

// Eventos de teclado
document.addEventListener('keydown', e => {
  keys[e.key] = true;
  if (e.key.toLowerCase() === 'z') shoot();
});
document.addEventListener('keyup', e => {
  keys[e.key] = false;
});

// Iniciar juego
let gameStarted = false;
canvas.addEventListener('click', () => {
  if (!gameStarted) {
    gameStarted = true;
    startGame();
  }
});

function startGame() {
  spawnEnemies();
  bgMusic.play();
  gameLoop();
}
