const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

const startScreen = document.getElementById("startScreen");
const startButton = document.getElementById("startButton");

let gameStarted = false;

let player = {
    x: 375,
    y: 500,
    width: 50,
    height: 50,
    color: "lightblue",
    velocity: 0
};


startButton.addEventListener("click", () => {
    startScreen.style.display = "none";
    gameStarted = true;
    update();
    setInterval(spawnEnemy, 1500);
});

let keys = { left: false, right: false, space: false };
let bullets = [];
let enemies = [];
let effects = [];
let score = 0;

window.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") keys.left = true;
    if (e.key === "ArrowRight") keys.right = true;
    if (e.key === " ") keys.space = true;
})

window.addEventListener("keyup", e => {
    if (e.key === "ArrowLeft") keys.left = false;
    if (e.key === "ArrowRight") keys.right = false;
    if (e.key === " ") keys.space = false;
});

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.fillStyle = "lightgray";
    const gunWidth = 10;
    const gunHeight = 20;
    const gunX = player.x + player.width / 2 - gunWidth / 2;
    const gunY = player.y - gunHeight;
    ctx.fillRect(gunX, gunY, gunWidth, gunHeight);
}

function drawBullets() {
    ctx.fillStyle = "lime";
    bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

function updateBullets() {
    bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed;
        if (bullet.y + bullet.height < 0) {
            bullets.splice(index, 1);
        }
    });
}

function shootBullet() {
    bullets.push({
        x: player.x + player.width / 2 - 2.5,
        y: player.y - 10,
        width: 5,
        height: 10,
        speed: 6
    });
}

let canShoot = true;
function handleShooting() {
    if (keys.space && canShoot) {
        shootBullet();
        canShoot = false;
        setTimeout(() => { canShoot = true; }, 100);
    }
}

function spawnEnemy() {
    const strongCount = enemies.filter(e => e.color === "red").length;
    const greenCount = enemies.filter(e => e.color === "green").length;
    const canSpawnStrong = strongCount < 3;
    const canSpawnGreen = greenCount < 1;
    const rand = Math.random();
    let type;
    if (rand < 0.2 && canSpawnGreen) type = "green";
    else if (rand < 0.5 && canSpawnStrong) type = "red";
    else type = "yellow";
    let width, height, color, speed, health;
    if (type === "red") {
        width = 60; height = 60; color = "red"; speed = 0.33; health = 8;
    }
    else if (type === "green") {
        width = 25; height = 25; color = "green"; speed = 0.5; health = 1;
    }
    else {
        width = 40; height = 40; color = "yellow"; speed = 1; health = 3;
    }
    enemies.push({
        x: Math.random() * (canvas.width - width),
        y: -height,
        width: width,
        height: height,
        color: color,
        speed: speed,
        health: health,
        flash: 0,
        scale: 1,
        dir: Math.random() < 0.5 ? -1 : 1,
    });
}

function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.save();
        const centerX = enemy.x + enemy.width / 2;
        const centerY = enemy.y + enemy.height / 2;
        ctx.translate(centerX, centerY);
        ctx.scale(enemy.scale, enemy.scale);
        ctx.translate(-centerX, -centerY);
        ctx.fillStyle = enemy.flash > 0 ? "lightgray" : enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        if (enemy.flash > 0) enemy.flash--;
        ctx.restore();
        if (enemy.scale > 1) {
            if (enemy.color === "red") {
                enemy.scale -= 0.02;
            } else {
                enemy.scale -= 0.05;
            }
        }
    });
}

function updateEnemies() {
    enemies.forEach((enemy, index) => {
        enemy.y += enemy.speed;
        if (enemy.color === "green") {
            enemy.x += enemy.dir * 4;
            if (enemy.x <= 0 || enemy.x + enemy.width >= canvas.width) {
                enemy.dir *= -1;
                enemy.speed = 2 + Math.random();
            }
        }
        if (enemy.y > canvas.height) {
            enemies.splice(index, 1);
        }
    });
}

function drawEffects() {
    effects.forEach((effect, index) => {
        ctx.fillStyle = effect.color;
        ctx.beginPath();
        ctx.arc(effect.x, effect.y, effect.radius, 0, Math.PI * 2);
        ctx.fill();
        effect.life--;
        if (effect.life <= 0) {
            effects.splice(index, 1);
        }
    });
}

function checkCollisions() {
    bullets.forEach((bullet, bIndex) => {
        enemies.forEach((enemy, eIndex) => {
            if (bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y) {
                enemy.health -= 1;
                bullets.splice(bIndex, 1);
                enemy.flash = 4;

                if (enemy.color === "red") {
                    enemy.scale = 1.1;
                }
                else {
                    enemy.scale = 1.2;
                }

                if (enemy.health <= 0) {
                    if (enemy.color === "red") score += 300;
                    else if (enemy.color === "yellow") score += 100;
                    else if (enemy.color === "green") score += 400;
                    effects.push({
                        x: enemy.x + enemy.width / 2,
                        y: enemy.y + enemy.height / 2,
                        radius: 30,
                        color: "orange",
                        life: 15
                    });
                    enemies.splice(eIndex, 1);
                }
            }
        });
    });
}

function update() {
    if (!gameStarted) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const acceleration = 0.5;
    const maxVelocity = 5;

    if (keys.left) player.velocity -= acceleration;
    else if (keys.right) player.velocity += acceleration;
    else player.velocity *= 0.8;

    if (player.velocity > maxVelocity) player.velocity = maxVelocity;
    if (player.velocity < -maxVelocity) player.velocity = -maxVelocity;

    player.x += player.velocity;
    if (player.x < 0) { player.x = 0; player.velocity = 0; }
    if (player.x + player.width > canvas.width) { player.x = canvas.width - player.width; player.velocity = 0; }


    handleShooting();
    updateBullets();
    updateEnemies();
    checkCollisions();

    drawBullets();
    drawPlayer();
    drawEnemies();
    drawEffects();
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 30);

    requestAnimationFrame(update);
}

setInterval(spawnEnemy, 1500);

update();
