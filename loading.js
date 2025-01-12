// Initialize GSAP timeline
const tl = gsap.timeline({ repeat: -1 });

// Wallet animation
tl.to('.wallet-body', {
    rotateY: 15,
    rotateX: -10,
    duration: 2,
    ease: 'power1.inOut'
})
.to('.wallet-body', {
    rotateY: -15,
    rotateX: 10,
    duration: 2,
    ease: 'power1.inOut'
});

// Create particles
function createParticles() {
    const particles = document.querySelector('.particles');
    const colors = ['#6E56CF', '#00ff88', '#ffffff'];
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '2px';
        particle.style.height = '2px';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.borderRadius = '50%';
        particle.style.opacity = '0';
        particles.appendChild(particle);

        // Random starting position around the wallet
        const startX = Math.random() * 300 - 150;
        const startY = Math.random() * 300 - 150;

        // Animate each particle
        gsap.to(particle, {
            x: startX,
            y: startY,
            opacity: Math.random() * 0.5 + 0.2,
            duration: Math.random() * 2 + 1,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut',
            delay: Math.random() * 2
        });
    }
}

// Progress bar animation with callback
function animateProgress(onComplete) {
    const progress = document.querySelector('.progress');
    gsap.to(progress, {
        width: '100%',
        duration: 3,
        ease: 'power1.inOut',
        onComplete: () => {
            if (onComplete) onComplete();
        }
    });
}

// Coin animations
function animateCoins() {
    gsap.to('.coin.sol', {
        y: -30,
        rotation: 10,
        duration: 2,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true
    });

    gsap.to('.coin.eth', {
        y: -20,
        rotation: -10,
        duration: 2,
        delay: 0.5,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true
    });
}

// Scale animation for the wallet
function pulseWallet() {
    gsap.to('.wallet', {
        scale: 1.05,
        duration: 2,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true
    });
}

// Text animation
function animateText() {
    gsap.to('.text-gradient', {
        opacity: 0.7,
        duration: 1.5,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true
    });
}

// Hide loading screen
function hideLoadingScreen() {
    const loadingContainer = document.querySelector('.loading-container');
    const mainContent = document.querySelector('.main-content');
    
    loadingContainer.classList.add('hidden');
    if (mainContent) {
        mainContent.classList.add('visible');
    }
}

// Initialize all animations
window.addEventListener('load', () => {
    createParticles();
    animateCoins();
    pulseWallet();
    animateText();
    
    // Start progress bar animation and hide loading screen when complete
    animateProgress(() => {
        setTimeout(hideLoadingScreen, 500); // Add a small delay for smoother transition
    });
}); 