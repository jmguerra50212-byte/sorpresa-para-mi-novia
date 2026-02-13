// Variables globales
let currentStep = 0;
let gameScore = 0;
let gameHearts = [];
let gameInterval = null;
let messageInterval = null;

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    createFloatingHearts();
    setInterval(createFloatingHearts, 2000);
});

// Crear corazones flotantes de fondo
function createFloatingHearts() {
    const hearts = ['💖', '💕', '💗', '💓', '💝', '❤️', '🧡', '💛', '🎮', '💎', '⭐'];
    const heart = document.createElement('div');
    heart.className = 'heart-float';
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDuration = (Math.random() * 3 + 5) + 's';
    heart.style.fontSize = (Math.random() * 10 + 15) + 'px';
    document.querySelector('.hearts-background').appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 10000);
}

// Iniciar la experiencia
function startExperience() {
    const mainCard = document.getElementById('mainCard');
    mainCard.style.display = 'none';
    
    // Mostrar mensajes secuencialmente
    showMessages();
}

// Mostrar mensajes uno por uno
function showMessages() {
    const messages = ['msg1', 'msg2', 'msg3', 'msg4'];
    let delay = 0;
    
    messages.forEach((msgId, index) => {
        setTimeout(() => {
            const msg = document.getElementById(msgId);
            msg.classList.remove('hidden');
            
            // Después del último mensaje, mostrar la foto y luego el mensaje final
            if (index === messages.length - 1) {
                setTimeout(() => {
                    hideMessages();
                    showPhoto();
                }, 3000);
            }
        }, delay);
        delay += 2500;
    });
}

// Ocultar mensajes
function hideMessages() {
    const messages = document.querySelectorAll('.message');
    messages.forEach(msg => {
        msg.classList.add('hidden');
    });
}

// Mostrar juego
function showGame() {
    const gameContainer = document.getElementById('gameContainer');
    gameContainer.classList.remove('hidden');
    gameScore = 0;
    document.getElementById('score').textContent = gameScore;
    
    startGame();
}

// Iniciar juego
function startGame() {
    // Limpiar corazones anteriores
    gameHearts.forEach(heart => {
        if (heart.parentNode) {
            heart.parentNode.removeChild(heart);
        }
    });
    gameHearts = [];
    
    // Crear corazones cada 1.5 segundos
    gameInterval = setInterval(() => {
        createGameHeart();
    }, 1500);
    
    // Detener el juego después de 30 segundos
    setTimeout(() => {
        endGame();
    }, 30000);
}

// Crear corazón en el juego
function createGameHeart() {
    const gameArea = document.getElementById('gameArea');
    const hearts = ['💖', '💕', '💗', '💓', '💝', '❤️', '🎮', '💎', '⭐'];
    
    const heart = document.createElement('div');
    heart.className = 'game-heart';
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    
    const size = Math.random() * 30 + 40;
    heart.style.fontSize = size + 'px';
    heart.style.left = Math.random() * (gameArea.offsetWidth - size) + 'px';
    heart.style.top = Math.random() * (gameArea.offsetHeight - size) + 'px';
    
    // Hacer que el corazón desaparezca después de 3 segundos
    setTimeout(() => {
        if (heart.parentNode) {
            heart.classList.add('clicked');
            setTimeout(() => {
                if (heart.parentNode) {
                    heart.parentNode.removeChild(heart);
                }
                const index = gameHearts.indexOf(heart);
                if (index > -1) {
                    gameHearts.splice(index, 1);
                }
            }, 500);
        }
    }, 3000);
    
    // Click en el corazón
    heart.addEventListener('click', function() {
        if (!this.classList.contains('clicked')) {
            this.classList.add('clicked');
            gameScore += 10;
            document.getElementById('score').textContent = gameScore;
            
            // Efecto de partículas
            createParticles(this);
            
            setTimeout(() => {
                if (this.parentNode) {
                    this.parentNode.removeChild(this);
                }
                const index = gameHearts.indexOf(this);
                if (index > -1) {
                    gameHearts.splice(index, 1);
                }
            }, 500);
        }
    });
    
    gameArea.appendChild(heart);
    gameHearts.push(heart);
}

// Crear partículas al hacer clic
function createParticles(element) {
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.textContent = '✨';
        particle.style.position = 'fixed';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.fontSize = '20px';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '1000';
        particle.style.animation = `particleFloat 1s ease-out forwards`;
        particle.style.animationDelay = (i * 0.1) + 's';
        
        const angle = (Math.PI * 2 * i) / 5;
        const distance = 50;
        const finalX = x + Math.cos(angle) * distance;
        const finalY = y + Math.sin(angle) * distance;
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.style.transform = `translate(${finalX - x}px, ${finalY - y}px)`;
            particle.style.opacity = '0';
        }, 10);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 1000);
    }
}

// Agregar animación de partículas al CSS dinámicamente
const style = document.createElement('style');
style.textContent = `
    @keyframes particleFloat {
        to {
            opacity: 0;
            transform: translate(var(--tx, 0), var(--ty, 0)) scale(0);
        }
    }
`;
document.head.appendChild(style);

// Terminar juego
function endGame() {
    if (gameInterval) {
        clearInterval(gameInterval);
    }
    
    // Remover corazones restantes
    gameHearts.forEach(heart => {
        if (heart.parentNode) {
            heart.classList.add('clicked');
            setTimeout(() => {
                if (heart.parentNode) {
                    heart.parentNode.removeChild(heart);
                }
            }, 500);
        }
    });
    gameHearts = [];
    
    // Mostrar mensaje final después de un momento
    setTimeout(() => {
        showFinalMessage();
    }, 1000);
}

// Reiniciar juego
function restartGame() {
    const gameContainer = document.getElementById('gameContainer');
    gameContainer.classList.add('hidden');
    setTimeout(() => {
        showGame();
    }, 300);
}

// Mostrar foto especial
function showPhoto() {
    const photoContainer = document.getElementById('photoContainer');
    photoContainer.classList.remove('hidden');
    
    // Después de 4 segundos, mostrar el mensaje final
    setTimeout(() => {
        showFinalMessage();
    }, 4000);
}

// Mostrar mensaje final
function showFinalMessage() {
    const finalMessage = document.getElementById('finalMessage');
    finalMessage.classList.remove('hidden');
}

