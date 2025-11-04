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

let playerLives = 5;
let gameOver = false;
let invincibleTimer = 0;

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
    if (invincibleTimer > 0 && Math.floor(invincibleTimer / 10) % 2 === 0) {
        ctx.globalAlpha = 0.3;
    }
    else {
        ctx.globalAlpha = 1.0;
    }
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    //player
    ctx.fillStyle = "lightgray";
    const gunWidth = 10;
    const gunHeight = 20;
    const gunX = player.x + player.width / 2 - gunWidth / 2;
    const gunY = player.y - gunHeight;
    ctx.fillRect(gunX, gunY, gunWidth, gunHeight);
    ctx.globalAlpha = 1.0;
    //gun
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
    let playerHit = false;
    enemies.forEach((enemy, index) => {
        enemy.y += enemy.speed;
        if (enemy.color === "green") {
            enemy.x += enemy.dir * 4;
            if (enemy.x <= 0 || enemy.x + enemy.width >= canvas.width) {
                enemy.dir *= -1;
                enemy.speed = 2 + Math.random();
            }
        }
    
        if (!playerHit &&
            invincibleTimer <= 0 &&
            enemy.x < player.x + player.width &&
            enemy.x + enemy.width > player.x &&
            enemy.y < player.y + player.height &&
            enemy.y + enemy.height > player.y) {
                enemies.splice(index, 1);
                playerLives--;
                invincibleTimer = 120;
                playerHit = true;
                if (playerLives <= 0) {
                    gameOver = true;
                }
        }
        if (enemy.y > canvas.height) {
            enemies.splice(index, 1);
        }
    });
}

function drawEffects() {
    effects.forEach((effect, index) => {
        ctx.save();
        ctx.translate(effect.x, effect.y);
        if (effect.shape === "star") {
            ctx.rotate(effect.rotation);
            ctx.beginPath();
            const spikes = 5;
            const outerRadius = effect.radius;
            const innerRadius = effect.radius / 2;
            for (let i = 0; i < spikes*2; i++) {
                const r = (i % 2 === 0) ? outerRadius : innerRadius;
                const angle = (i * Math.PI) / spikes;
                const x = Math.cos(angle) * r;
                const y = Math.sin(angle) * r;
                i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
            }
        ctx.closePath();
        ctx.fillStyle = effect.color;
        ctx.fill();
        }
        else {
            ctx.beginPath();
            ctx.arc(0, 0, effect.radius, 0, Math.PI * 2);
            ctx.fillStyle = effect.color;
            ctx.fill();
        }
        ctx.restore();
        effect.x += effect.vx;
        effect.y += effect.vy;
        effect.vy += 0.1; // gravity effect
        effect.radius *= 0.95; // shrink effect
        effect.life--;
        if (effect.shape === "star") {
            effect.rotation += effect.spin;
        }
        if (effect.life <= 0) {
            effects.splice(index, 1);
        }
    });
}

function createExplosion(x, y, color) {
    for (let i = 0; i < 20; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1;
        effects.push({
            x: x,
            y: y,
            radius: Math.random() * 3 + 2,
            color: color,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 30
        });
    }
}

function createStarExplosion(x, y) {
    for (let i = 0; i < 15; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2 + 1;
        effects.push({
            x: x,
            y: y,
            radius: Math.random() * 3 + 1,
            color: "white",
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 40,
            shape: "star",
            rotation: Math.random() * Math.PI * 2,
            spin: (Math.random() - 0.5) * 0.2
        });
    }
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
                    createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemy.color);
                    createStarExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
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
    let heartText = "";
    for (let i = 0; i < playerLives; i++) {
        heartText += "❤️";
    }
    ctx.fillStyle = "red";
    ctx.font = "25px Arial";
    ctx.fillText(heartText.trim(), 10, 60);

    if (gameOver) {
        ctx.fillStyle = "red";
        ctx.font = "50px Arial";
        ctx.fillText("GAME OVER", canvas.width / 2 - 150, canvas.height / 2);
        return;
    }

    if (invincibleTimer > 0) {
        invincibleTimer--;
    }

    requestAnimationFrame(update);
}

setInterval(spawnEnemy, 1500);

update();
