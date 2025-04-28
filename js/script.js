// Poema sobre o Minas Summit e minha jornada - refeito com inspiração solicitada
const poemStanzas = [
    [
        "Do Pará para o mundo digital,",
        "Desenvolvedor com networking especial,",
        "Comunicativo, conectado, sempre profissional,",
        "Na Amplitude ambiental, meu potencial é exponencial!"
    ],
    [
        "Minas Summit vem aí, inovação sem igual,",
        "IA em destaque, futuro global,",
        "10 mil mentes, 150 startups a brilhar,",
        "No Minascentro, vamos transformar!"
    ],
    [
        "Do Pará trago o calor da floresta,",
        "Para Minas, tecnologia manifesta,",
        "Com partículas de código no ar,",
        "Este poema é meu selo para ingressar!",
        "Thuane, a jornada apenas começou!"

    ]
];

console.log("🚀 Script inicialmente carregado");

// Controle de rolagem
let currentStanzaIndex = 0;
let totalStanzas = poemStanzas.length;
let autoScrollEnabled = true;
let stanzaElements = [];
let experienceStarted = false;

// Configuração do Three.js
let scene, camera, renderer, particleGroups = [];
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

// Variáveis para áudio
let audioContext, backgroundMusic, audioSource, analyser, gainNode;
let isPlaying = false;

// Esperamos que o DOM esteja completamente carregado antes de selecionar elementos
document.addEventListener('DOMContentLoaded', () => {
    console.log("🔍 DOM Carregado - Selecionando elementos");
    
    // DOM Elements - Movidos para dentro do evento DOMContentLoaded
    const startButton = document.getElementById('start-button');
    const toggleMusicButton = document.getElementById('toggle-music');
    const toggleScrollButton = document.getElementById('toggle-scroll');
    const poemContainer = document.getElementById('poem-container');
    const poemElement = document.getElementById('poem');
    const authorInfo = document.querySelector('.author-info');
    const progressBar = document.getElementById('progress-bar');
    const container = document.getElementById('container');
    const welcomeScreen = document.getElementById('welcome-screen');
    const harpSound = document.getElementById('harp-sound');
    
    // Log de todos os elementos selecionados para depuração
    console.log({
        startButton,
        toggleMusicButton,
        toggleScrollButton,
        poemContainer,
        poemElement,
        authorInfo,
        progressBar,
        container,
        welcomeScreen,
        harpSound
    });
    
    // Verificar explicitamente se o botão de início existe
    if (!startButton) {
        console.error("❌ ERRO: Botão 'start-button' não encontrado no DOM");
        return; // Sair se o elemento crítico não existir
    } else {
        console.log("✅ Botão de início encontrado:", startButton);
        
        // Adicionar um event listener inline para teste
        startButton.onclick = function() {
            console.log("🖱️ Botão clicado via onclick!");
            alert("Botão clicado! Iniciando jornada...");
            startJourney();
        };
        
        // Também adicionar o event listener normal para garantir
        startButton.addEventListener('click', function() {
            console.log("🖱️ Botão clicado via addEventListener!");
            startJourney();
        });
    }
    
    // Controle de rolagem automática
    if (toggleScrollButton) {
        toggleScrollButton.addEventListener('click', () => {
            autoScrollEnabled = !autoScrollEnabled;
            updateScrollButtonState();
            
            // Continuar a rolagem se a opção estiver ativada
            if (autoScrollEnabled && currentStanzaIndex < totalStanzas) {
                scrollToStanza(currentStanzaIndex);
            }
        });
    }
    
    // Função para atualizar o texto do botão de rolagem
    function updateScrollButtonState() {
        if (toggleScrollButton) {
            toggleScrollButton.textContent = autoScrollEnabled ? '✅ Rolagem Auto' : '❌ Rolagem Auto';
        }
    }
    
    if (toggleMusicButton) {
        toggleMusicButton.addEventListener('click', toggleMusic);
    }
    
    document.addEventListener('mousemove', onDocumentMouseMove);
    window.addEventListener('resize', onWindowResize);
    
    // Permitir desativar/ativar rolagem automática clicando no poema
    document.addEventListener('click', (e) => {
        if (e.target.closest('#poem') && currentStanzaIndex > 0) {
            autoScrollEnabled = !autoScrollEnabled;
            if (autoScrollEnabled && currentStanzaIndex < totalStanzas) {
                scrollToStanza(currentStanzaIndex);
            }
        }
    });
    
    // Precarregar som da harpa se o elemento existir
    if (harpSound) {
        try {
            harpSound.load();
            console.log("🔊 Som de harpa pré-carregado");
        } catch (e) {
            console.error("❌ Erro ao carregar som da harpa:", e);
        }
    } else {
        console.error("❌ Elemento de áudio 'harp-sound' não encontrado");
    }
    
    // Função para iniciar a jornada - transição inicial
    function startJourney() {
        console.log("🏁 Função startJourney chamada");
        
        if (experienceStarted) {
            console.log("⚠️ Experiência já iniciada, ignorando clique");
            return;
        }
        
        console.log("✨ Iniciando jornada");
        experienceStarted = true;
        
        // Remover a tela de boas-vindas imediatamente para simplificar
        if (welcomeScreen) {
            welcomeScreen.style.display = 'none';
        }
        
        // Iniciar experiência diretamente sem esperar transições
        initExperience();
    }

    // Função para iniciar a experiência principal
    function initExperience() {
        console.log("🚀 Iniciando experiência principal");
        
        // Mostrar controles de música e rolagem
        if (toggleMusicButton) {
            toggleMusicButton.classList.remove('hidden');
        }
        
        if (toggleScrollButton) {
            toggleScrollButton.classList.remove('hidden');
            updateScrollButtonState();
        }
        
        // Inicializar Three.js com sistema de partículas aprimorado
        initThree();
        
        // Animação para mostrar as partículas
        setTimeout(() => {
            const canvas = document.querySelector('canvas');
            if (canvas) {
                console.log("🎨 Tornando canvas visível");
                canvas.classList.add('visible');
            } else {
                console.error("❌ Canvas não encontrado");
            }
        }, 300);
        
        // Inicializar áudio
        initAudio();
        
        // Preparar e mostrar o poema com estrutura de estrofes
        displayPoem();
        
        // Iniciar animação
        animate();
        
        // Mostrar o container do poema IMEDIATAMENTE
        if (poemContainer) {
            console.log("📝 Mostrando container do poema imediatamente");
            poemContainer.classList.add('visible');
            poemContainer.style.opacity = "1";
            poemContainer.style.transform = "translateY(0)";
            
            // Começar a rolagem automática após um delay
            setTimeout(() => {
                if (autoScrollEnabled) {
                    console.log("📜 Iniciando rolagem automática");
                    scrollToStanza(0);
                }
            }, 500);
        } else {
            console.error("❌ poemContainer é null");
        }
    }
    
    // Função para exibir o poema com estrutura de estrofes - atualizada para usar elementos do escopo local
    function displayPoem() {
        console.log("📝 Exibindo poema");
        
        if (!poemElement) {
            console.error("❌ poemElement não encontrado");
            return;
        }
        
        poemElement.classList.remove('hidden');
        poemElement.style.display = 'flex';
        poemElement.style.opacity = '1';
        poemElement.style.visibility = 'visible';
        
        // Limpar conteúdo existente
        poemElement.innerHTML = '';
        stanzaElements = [];
        
        // Criar cada estrofe como um elemento separado
        poemStanzas.forEach((stanza, stanzaIndex) => {
            const stanzaElement = document.createElement('div');
            stanzaElement.className = 'poem-stanza';
            stanzaElement.id = `stanza-${stanzaIndex}`;
            stanzaElement.style.opacity = '1';
            stanzaElement.style.visibility = 'visible';
            
            // Adicionar cada linha da estrofe
            stanza.forEach((line, lineIndex) => {
                const lineElement = document.createElement('p');
                lineElement.className = 'poem-line';
                lineElement.innerHTML = line;
                
                // Forçar visibilidade para todas as linhas
                setTimeout(() => {
                    lineElement.style.opacity = '1';
                    lineElement.style.transform = 'translateY(0)';
                    lineElement.classList.add('visible');
                }, lineIndex * 100); // Pequeno delay entre as linhas
                
                stanzaElement.appendChild(lineElement);
            });
            
            poemElement.appendChild(stanzaElement);
            stanzaElements.push(stanzaElement);
        });
        
        // Mostrar informações do autor no final
        if (authorInfo) {
            authorInfo.classList.remove('hidden');
            authorInfo.classList.add('visible');
            authorInfo.style.opacity = '1';
        }
    }
    
    // Função para rolar para uma estrofe específica - ajustada para rolagem mais suave e lenta
    function scrollToStanza(index) {
        console.log(`📜 Rolando para estrofe ${index}`);
        
        if (index >= totalStanzas) {
            // Chegamos ao final do poema
            updateProgressBar(1);
            return;
        }
        
        currentStanzaIndex = index;
        
        // Atualizar a barra de progresso
        updateProgressBar(currentStanzaIndex / (totalStanzas - 1));
        
        // Tornar a estrofe atual visível
        const stanza = stanzaElements[index];
        if (stanza) {
            stanza.classList.add('visible');
            
            // Rolar suavemente para a estrofe com efeito mais lento
            if (container) {
                const stanzaTop = stanza.offsetTop - 100; // Ajuste para centralizar melhor
                
                // Usar animação suave para rolagem mais controlada
                smoothScrollTo(container, stanzaTop, 2000); // 2 segundos para a rolagem
            } else {
                // Fallback se container não existir
                stanza.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            
            // Programar a próxima rolagem se a rolagem automática estiver ativada
            if (autoScrollEnabled && index < totalStanzas - 1) {
                // Tempo baseado no número de linhas na estrofe atual - mais lento agora
                const linesCount = poemStanzas[index].length;
                const delay = linesCount * 4000; // 4 segundos por linha para uma leitura mais tranquila
                
                setTimeout(() => {
                    scrollToStanza(index + 1);
                }, delay);
            }
        } else {
            console.error(`❌ Estrofe ${index} não encontrada`);
        }
    }
    
    // Função para rolagem suave personalizada
    function smoothScrollTo(element, to, duration) {
        const start = element.scrollTop;
        const change = to - start;
        const increment = 20; // 20ms para frames suaves
        let currentTime = 0;
        
        function animateScroll() {
            currentTime += increment;
            const val = easeInOutQuad(currentTime, start, change, duration);
            element.scrollTop = val;
            if (currentTime < duration) {
                setTimeout(animateScroll, increment);
            }
        }
        
        // Função de easing para movimento suave
        function easeInOutQuad(t, b, c, d) {
            t /= d/2;
            if (t < 1) return c/2*t*t + b;
            t--;
            return -c/2 * (t*(t-2) - 1) + b;
        }
        
        animateScroll();
    }
    
    // Atualizar a barra de progresso
    function updateProgressBar(percentage) {
        if (progressBar) {
            progressBar.style.width = `${percentage * 100}%`;
        }
    }
});

// Estas funções precisam ser globais
function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    
    // Verificar se camera e renderer estão definidos antes de usar
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        console.log("🔄 Janela redimensionada com sucesso");
    }
}

function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.05;
    mouseY = (event.clientY - windowHalfY) * 0.05;
}

// Inicializar Three.js com sistema de partículas melhorado
function initThree() {
    try {
        console.log("🎨 Inicializando Three.js");
        
        // Cena
        scene = new THREE.Scene();
        
        // Câmera com perspectiva
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.z = 1000;
        
        // Renderer com anti-aliasing
        renderer = new THREE.WebGLRenderer({ 
            alpha: true,
            antialias: true 
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        
        // Adicionar classe three-canvas e definir visibilidade imediatamente
        const threeCanvas = renderer.domElement;
        threeCanvas.classList.add('three-canvas');
        threeCanvas.classList.add('visible');
        threeCanvas.style.opacity = '1'; // Forçar visibilidade
        document.body.appendChild(threeCanvas);
        
        // Criar múltiplos grupos de partículas para efeitos diferentes
        createParticleSystem();
        
        console.log("✅ Three.js inicializado com sucesso");
    } catch (error) {
        console.error("❌ Erro ao inicializar Three.js:", error);
    }
}

// Criar sistema de partículas com múltiplas camadas
function createParticleSystem() {
    console.log("✨ Criando sistema de partículas");
    
    try {
        // Grupo 1: Partículas principais (azuis)
        createParticleGroup({
            count: 1000,
            size: 5,
            spread: 2000,
            color: 0x00c9ff,
            opacity: 0.7,
            speedFactor: 1
        });
        
        // Grupo 2: Partículas secundárias (menores, brancas)
        createParticleGroup({
            count: 500,
            size: 2,
            spread: 1500,
            color: 0xffffff,
            opacity: 0.5,
            speedFactor: 0.5
        });
        
        // Grupo 3: Partículas de destaque (verdes)
        createParticleGroup({
            count: 200,
            size: 3,
            spread: 1800,
            color: 0x92fe9d,
            opacity: 0.8,
            speedFactor: 1.5
        });
        
        console.log(`✅ Sistema de partículas criado com ${particleGroups.length} grupos`);
    } catch (error) {
        console.error("❌ Erro ao criar sistema de partículas:", error);
    }
}

// Função para criar um grupo de partículas com parâmetros específicos
function createParticleGroup(params) {
    try {
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const sizes = [];
        
        for (let i = 0; i < params.count; i++) {
            const x = (Math.random() - 0.5) * params.spread;
            const y = (Math.random() - 0.5) * params.spread;
            const z = (Math.random() - 0.5) * params.spread;
            
            vertices.push(x, y, z);
            sizes.push(params.size * (Math.random() * 0.5 + 0.5));
        }
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
        
        const material = new THREE.PointsMaterial({
            size: params.size,
            color: params.color,
            transparent: true,
            opacity: params.opacity,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });
        
        const particleGroup = {
            particles: new THREE.Points(geometry, material),
            speedFactor: params.speedFactor,
            rotationDirection: Math.random() > 0.5 ? 1 : -1
        };
        
        scene.add(particleGroup.particles);
        particleGroups.push(particleGroup);
    } catch (error) {
        console.error("❌ Erro ao criar grupo de partículas:", error);
    }
}

// Função de animação aprimorada
function animate() {
    requestAnimationFrame(animate);
    
    if (!scene || !camera || !renderer) {
        console.warn("⚠️ Scene, camera ou renderer não estão definidos");
        return;
    }
    
    try {
        // Animar cada grupo de partículas de forma independente
        particleGroups.forEach((group, index) => {
            group.particles.rotation.x += 0.0003 * group.speedFactor * group.rotationDirection;
            group.particles.rotation.y += 0.0005 * group.speedFactor * group.rotationDirection;
            group.particles.rotation.z += 0.0002 * group.speedFactor;
        });
        
        // Efeito parallax com a câmera
        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);
        
        // Analisar áudio e atualizar visualização se estiver tocando
        if (isPlaying && analyser) {
            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(dataArray);
            
            // Calcular média do volume para influenciar as partículas
            const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
            const normalizedAverage = average / 256;
            
            // Aplicar efeitos baseados em áudio a cada grupo de partículas
            particleGroups.forEach((group, index) => {
                const positions = group.particles.geometry.attributes.position.array;
                const sizes = group.particles.geometry.attributes.size.array;
                
                for (let i = 0; i < sizes.length; i++) {
                    // Ajustar tamanho das partículas com base no áudio
                    sizes[i] = (4 + index) * (Math.random() * 0.5 + 0.5) * (1 + normalizedAverage);
                    
                    // Aplicar movimento baseado em frequências diferentes para cada grupo
                    const frequencyBand = Math.floor(i % dataArray.length);
                    const frequencyValue = dataArray[frequencyBand] / 256;
                    
                    if (frequencyValue > 0.5) {  // Apenas partículas afetadas por frequências altas
                        const index3 = i * 3;
                        const moveFactor = frequencyValue * group.speedFactor * 0.5;
                        
                        positions[index3] += (Math.random() - 0.5) * moveFactor;
                        positions[index3 + 1] += (Math.random() - 0.5) * moveFactor;
                        positions[index3 + 2] += (Math.random() - 0.5) * moveFactor;
                    }
                }
                
                group.particles.geometry.attributes.position.needsUpdate = true;
                group.particles.geometry.attributes.size.needsUpdate = true;
            });
        }
        
        renderer.render(scene, camera);
    } catch (error) {
        console.error("❌ Erro na função de animação:", error);
    }
}

// Inicializar áudio
function initAudio() {
    try {
        console.log("🎵 Inicializando áudio");
        
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        backgroundMusic = new Audio('midia/musicafundo.mp3');
        backgroundMusic.loop = true;
        
        audioSource = audioContext.createMediaElementSource(backgroundMusic);
        analyser = audioContext.createAnalyser();
        gainNode = audioContext.createGain();
        
        audioSource.connect(analyser);
        analyser.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        analyser.fftSize = 256;
        gainNode.gain.value = 0.5;
        
        // Iniciar música quando tudo estiver pronto
        toggleMusic();
        
        console.log("✅ Áudio inicializado com sucesso");
    } catch (error) {
        console.error("❌ Erro ao inicializar áudio:", error);
    }
}

// Alternar música ligada/desligada
function toggleMusic() {
    console.log("🎵 Alternando música");
    
    if (audioContext && backgroundMusic) {
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        
        if (!isPlaying) {
            backgroundMusic.play()
                .then(() => {
                    isPlaying = true;
                    const toggleMusicButton = document.getElementById('toggle-music');
                    if (toggleMusicButton) {
                        toggleMusicButton.textContent = '🔊 Música';
                    }
                    console.log("✅ Música iniciada");
                })
                .catch(error => {
                    console.error("❌ Erro ao iniciar áudio:", error);
                    isPlaying = false;
                    const toggleMusicButton = document.getElementById('toggle-music');
                    if (toggleMusicButton) {
                        toggleMusicButton.textContent = '🔇 Música';
                    }
                });
        } else {
            backgroundMusic.pause();
            isPlaying = false;
            const toggleMusicButton = document.getElementById('toggle-music');
            if (toggleMusicButton) {
                toggleMusicButton.textContent = '🔇 Música';
            }
            console.log("⏸️ Música pausada");
        }
    } else {
        console.error("❌ audioContext ou backgroundMusic não estão definidos");
    }
}