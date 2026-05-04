// Configuração inicial
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar funcionalidades
    initNavigation();
    initSurpriseBox();
    initAnimations();
    initDateDisplay();
    initScrollEffects();
});

// Navegação entre seções
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class de todos os links e seções
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // Adiciona active class ao link clicado
            this.classList.add('active');
            
            // Mostra a seção correspondente
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
                
                // Scroll suave para a seção
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Caixa de surpresa interativa
function initSurpriseBox() {
    const surpriseBox = document.querySelector('.surprise-box');
    let isOpen = false;

    surpriseBox.addEventListener('click', function() {
        if (!isOpen) {
            this.classList.add('open');
            isOpen = true;
            
            // Adiciona efeito de confetes
            createConfetti();
            
            // Toca som de surpresa (se disponível)
            playSurpriseSound();
        }
    });
}

// Efeito de confetes
function createConfetti() {
    const colors = ['#ff6b6b', '#ff8e8e', '#ffa8a8', '#667eea', '#764ba2', '#ffd93d'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.top = '-10px';
            confetti.style.borderRadius = '50%';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '1000';
            
            document.body.appendChild(confetti);
            
            // Animação de queda
            const fallAnimation = confetti.animate([
                { transform: 'translateY(0px) rotate(0deg)', opacity: 1 },
                { transform: `translateY(${window.innerHeight + 100}px) rotate(360deg)`, opacity: 0 }
            ], {
                duration: 3000 + Math.random() * 2000,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            });
            
            fallAnimation.onfinish = () => {
                confetti.remove();
            };
        }, i * 50);
    }
}

// Som de surpresa (usando Web Audio API)
function playSurpriseSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
        console.log('Audio não suportado neste navegador');
    }
}

// Animações e efeitos visuais
function initAnimations() {
    // Animação de corações flutuantes
    createFloatingHearts();
    
    // Efeito parallax no header
    window.addEventListener('scroll', handleParallax);
    
    // Animação de entrada dos cards
    observeElements();
}

// Criar corações flutuantes
function createFloatingHearts() {
    const heartContainer = document.querySelector('.hearts-bg');
    
    setInterval(() => {
        if (Math.random() > 0.7) { // 30% de chance a cada intervalo
            const heart = document.createElement('div');
            heart.innerHTML = '💖';
            heart.style.position = 'absolute';
            heart.style.left = Math.random() * 100 + '%';
            heart.style.top = '100%';
            heart.style.fontSize = '20px';
            heart.style.pointerEvents = 'none';
            heart.style.zIndex = '1';
            heart.style.animation = 'floatUp 4s linear forwards';
            
            heartContainer.appendChild(heart);
            
            // Remove o coração após a animação
            setTimeout(() => {
                if (heart.parentNode) {
                    heart.parentNode.removeChild(heart);
                }
            }, 4000);
        }
    }, 2000);
}

// Adicionar animação CSS para corações flutuantes
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Efeito parallax
function handleParallax() {
    const scrolled = window.pageYOffset;
    const header = document.querySelector('.header');
    const hearts = document.querySelector('.hearts-bg');
    
    if (header && hearts) {
        hearts.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
}

// Observer para animações de entrada
function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            }
        });
    }, { threshold: 0.1 });
    
    // Observar cards de memórias
    document.querySelectorAll('.memory-card').forEach(card => {
        observer.observe(card);
    });
    
    // Observar cards de mensagens
    document.querySelectorAll('.message-card').forEach(card => {
        observer.observe(card);
    });
    
    // Observar itens da galeria
    document.querySelectorAll('.gallery-item').forEach(item => {
        observer.observe(item);
    });
}

// Exibir data atual
function initDateDisplay() {
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        const now = new Date();
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
        };
        dateElement.textContent = now.toLocaleDateString('pt-BR', options);
    }
}

// Efeitos de scroll
function initScrollEffects() {
    let ticking = false;
    
    function updateScrollEffects() {
        const scrolled = window.pageYOffset;
        const nav = document.querySelector('.nav');
        
        if (nav) {
            if (scrolled > 100) {
                nav.style.background = 'rgba(255,255,255,0.98)';
                nav.style.boxShadow = '0 8px 32px rgba(0,0,0,0.15)';
            } else {
                nav.style.background = 'rgba(255,255,255,0.95)';
                nav.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)';
            }
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

// Efeitos especiais para interações
document.addEventListener('click', function(e) {
    // Efeito de ripple nos botões
    if (e.target.classList.contains('nav-link') || e.target.classList.contains('memory-card')) {
        createRippleEffect(e);
    }
});

function createRippleEffect(e) {
    const element = e.target;
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('div');
    ripple.style.position = 'absolute';
    ripple.style.width = size + 'px';
    ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.background = 'rgba(255,255,255,0.6)';
    ripple.style.borderRadius = '50%';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s linear';
    ripple.style.pointerEvents = 'none';
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Adicionar animação CSS para ripple
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Mensagens dinâmicas
function showRandomMessage() {
    const messages = [
        "Você é a luz da minha vida! ✨",
        "Cada dia ao seu lado é especial! 💕",
        "Seu sorriso ilumina meu mundo! 😊",
        "Te amo mais que as palavras podem dizer! ❤️",
        "Você é minha inspiração diária! 🌟"
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    // Criar notificação temporária
    const notification = document.createElement('div');
    notification.textContent = randomMessage;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.background = 'linear-gradient(135deg, #ff6b6b, #ff8e8e)';
    notification.style.color = 'white';
    notification.style.padding = '15px 25px';
    notification.style.borderRadius = '25px';
    notification.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
    notification.style.zIndex = '1000';
    notification.style.fontWeight = '600';
    notification.style.animation = 'slideInRight 0.5s ease-out';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease-in forwards';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}

// Adicionar animações CSS para notificações
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyle);

// Mostrar mensagem aleatória a cada 30 segundos
setInterval(showRandomMessage, 30000);

// Efeito de digitação para o título principal
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Aplicar efeito de digitação ao título principal após carregar
window.addEventListener('load', function() {
    const mainTitle = document.querySelector('.main-title');
    if (mainTitle) {
        const originalText = mainTitle.textContent;
        typeWriter(mainTitle, originalText, 150);
    }
});

// Easter egg: sequência de teclas para mensagem especial
let keySequence = [];
const secretCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

document.addEventListener('keydown', function(e) {
    keySequence.push(e.code);
    
    if (keySequence.length > secretCode.length) {
        keySequence.shift();
    }
    
    if (keySequence.join(',') === secretCode.join(',')) {
        showSecretMessage();
        keySequence = [];
    }
});

function showSecretMessage() {
    const secretDiv = document.createElement('div');
    secretDiv.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 9999; display: flex; align-items: center; justify-content: center;">
            <div style="background: white; padding: 40px; border-radius: 20px; text-align: center; max-width: 500px; margin: 20px;">
                <h2 style="color: #ff6b6b; font-family: 'Dancing Script', cursive; font-size: 2.5rem; margin-bottom: 20px;">🎉 Easter Egg Encontrado! 🎉</h2>
                <p style="font-size: 1.2rem; color: #666; line-height: 1.6; margin-bottom: 20px;">
                    Parabéns! Você descobriu uma mensagem secreta! 
                </p>
                <p style="font-size: 1.1rem; color: #ff6b6b; font-weight: 600;">
                    Você é realmente especial para mim! Este site foi feito com muito carinho e cada detalhe foi pensado para te fazer sorrir. 
                    Te amo infinitamente! ❤️
                </p>
                <button onclick="this.parentElement.parentElement.remove()" style="background: linear-gradient(135deg, #ff6b6b, #ff8e8e); color: white; border: none; padding: 15px 30px; border-radius: 25px; font-size: 1.1rem; font-weight: 600; cursor: pointer; margin-top: 20px;">
                    Fechar
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(secretDiv);
}