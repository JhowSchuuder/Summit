// Script para criar partículas sutis na tela de boas-vindas que remetem a IA

document.addEventListener('DOMContentLoaded', () => {
    // Verificar se a tela de boas-vindas existe
    const welcomeScreen = document.getElementById('welcome-screen');
    if (!welcomeScreen) return;
    
    // Criar o canvas para as partículas
    const canvas = document.createElement('canvas');
    canvas.className = 'welcome-particles';
    welcomeScreen.appendChild(canvas);
    
    // Configuração do canvas
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Estilização do canvas
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1';
    
    // Configurações das partículas
    const particlesArray = [];
    const numberOfParticles = 60;
    const colors = ['rgba(0, 201, 255, 0.3)', 'rgba(146, 254, 157, 0.3)', 'rgba(255, 255, 255, 0.2)'];
    
    // Classe Partícula
    class Particle {
        constructor() {
            this.size = Math.random() * 3 + 1;
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.speedX = Math.random() * 0.3 - 0.15;
            this.speedY = Math.random() * 0.3 - 0.15;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.opacity = Math.random() * 0.5 + 0.1;
            this.connected = [];
        }
        
        // Atualizar posição
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Voltar para o canvas quando sair da tela
            if (this.x > canvas.width) this.x = 0;
            else if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            else if (this.y < 0) this.y = canvas.height;
        }
        
        // Desenhar partícula
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        
        // Encontrar partículas próximas e desenhar conexões
        connect() {
            this.connected = [];
            for (let i = 0; i < particlesArray.length; i++) {
                const particle = particlesArray[i];
                if (particle === this) continue;
                
                const distance = Math.hypot(this.x - particle.x, this.y - particle.y);
                if (distance < 100) {
                    this.connected.push(particle);
                    ctx.beginPath();
                    ctx.strokeStyle = this.color;
                    ctx.globalAlpha = 0.2 * (1 - distance / 100);
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(this.x, this.y);
                    ctx.lineTo(particle.x, particle.y);
                    ctx.stroke();
                }
            }
        }
    }
    
    // Criar as partículas
    function init() {
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }
    
    // Animar partículas
    function animate() {
        if (!welcomeScreen.classList.contains('fade-out')) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Atualizar e desenhar cada partícula
            particlesArray.forEach(particle => {
                particle.update();
                particle.draw();
                particle.connect();
            });
            
            requestAnimationFrame(animate);
        }
    }
    
    // Redimensionar o canvas
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
    
    // Inicializar e animar
    init();
    animate();
});