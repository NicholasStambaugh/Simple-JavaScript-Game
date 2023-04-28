// Define canvas and context variables
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

// Set canvas dimensions
canvas.width = 800;
canvas.height = 600;

// Define player object
const player = {
  x: canvas.width / 2,
  y: canvas.height - 50,
  radius: 25,
  color: "blue",
  speed: 5,
  dx: 0,
  dy: 0
};

// Define enemy object
class Enemy {
  constructor(x, y, radius, color, speed) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.speed = speed;
  }
}

// Define bullet object
class Bullet {
  constructor(x, y, radius, color, speed) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.speed = speed;
  }
}

// Initialize game objects
let enemies = [];
let bullets = [];

// Spawn enemies
function spawnEnemies() {
  setInterval(() => {
    const radius = Math.random() * (30 - 10) + 10;
    let x;
    let y;
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
      y = Math.random() * canvas.height;
    } else {
      x = Math.random() * canvas.width;
      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
    }
    const color = "red";
    const speed = Math.random() * (6 - 1) + 1;
    const enemy = new Enemy(x, y, radius, color, speed);
    enemies.push(enemy);
  }, 1000);
}

// Draw player
function drawPlayer() {
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  ctx.fillStyle = player.color;
  ctx.fill();
}

// Draw enemies
function drawEnemies() {
  enemies.forEach(enemy => {
    ctx.beginPath();
    ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
    ctx.fillStyle = enemy.color;
    ctx.fill();
  });
}

// Draw bullets
function drawBullets() {
  bullets.forEach(bullet => {
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
    ctx.fillStyle = bullet.color;
    ctx.fill();
  });
}

// Move player
function movePlayer() {
  player.x += player.dx;
  player.y += player.dy;

  // Detect wall collision
  if (player.x + player.radius > canvas.width) {
    player.x = canvas.width - player.radius;
  }
  if (player.x - player.radius < 0) {
    player.x = player.radius;
  }
  if (player.y + player.radius > canvas.height) {
    player.y = canvas.height - player.radius;
  }
  if (player.y - player.radius < 0) {
    player.y = player.radius;
  }
}

// Move enemies
function moveEnemies() {
  enemies.forEach(enemy => {
    const angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
    enemy.x += enemy.speed * Math.cos(angle);
    enemy.y += enemy.speed * Math.sin(angle);
  });
}

// Move bullets
function moveBullets() {
  bullets.forEach(bullet => {
    bullet.x += bullet.speed * Math.cos(bullet.angle);
    bullet.y += bullet.speed * Math.sin(bullet.angle);
  });
}

// Detect collision between player and enemy
function detectPlayerEnemyCollision() {
  enemies.forEach(enemy => {
    const distance = Math.hypot(player.x - enemy.x, player.y - enemy.y);
    if (distance - player.radius - enemy.radius < 1) {
      cancelAnimationFrame(animationId);
    }
  });
}

// Detect collision between bullet and enemy
function detectBulletEnemyCollision() {
  enemies.forEach((enemy, enemyIndex) => {
    bullets.forEach((bullet, bulletIndex) => {
      const distance = Math.hypot(bullet.x - enemy.x, bullet.y - enemy.y);
      if (distance - bullet.radius - enemy.radius < 1) {
        setTimeout(() => {
          enemies.splice(enemyIndex, 1);
          bullets.splice(bulletIndex, 1);
        }, 0);
      }
    });
  });
}

// Game loop
function animate() {
  animationId = requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawEnemies();
  drawBullets();
  movePlayer();
  moveEnemies();
  moveBullets();
  detectPlayerEnemyCollision();
  detectBulletEnemyCollision();
}

// Event listeners for player movement
window.addEventListener("keydown", event => {
  switch (event.keyCode) {
    case 37: // left arrow
      player.dx = -player.speed;
      break;
    case 38: // up arrow
      player.dy = -player.speed;
      break;
    case 39: // right arrow
      player.dx = player.speed;
      break;
    case 40: // down arrow
      player.dy = player.speed;
      break;
  }
});

window.addEventListener("keyup", event => {
  switch (event.keyCode) {
    case 37: // left arrow
      player.dx = 0;
      break;
    case 38: // up arrow
      player.dy = 0;
      break;
    case 39: // right arrow
      player.dx = 0;
      break;
    case 40: // down arrow
      player.dy = 0;
      break;
  }
});

// Event listener for shooting
window.addEventListener("click", event => {
  const angle = Math.atan2(
    event.clientY - player.y,
    event.clientX - player.x
  );
  const velocity = {
    x: Math.cos(angle) * 5,
    y: Math.sin(angle) * 5
  };
  const bullet = new Bullet(
    player.x,
    player.y,
    5,
    "white",
    5,
    angle,
    velocity
  );
  bullets.push(bullet);
});



// Start game
spawnEnemies();
animate();
