// Initialize animations when DOM is ready
function initializeAnimations() {
    try {
        // Check if GSAP is available
        if (typeof gsap === 'undefined') {
            console.error('GSAP not loaded');
            return;
        }

        console.log('Initializing animations...');

        // Initialize GSAP timeline for wallet animation
        const tl = gsap.timeline({ repeat: -1 });

        // Wallet animation
        const walletBody = document.querySelector('.wallet-body');
        if (walletBody) {
            tl.to(walletBody, {
                rotateY: 15,
                rotateX: -10,
                duration: 2,
                ease: 'power1.inOut'
            })
            .to(walletBody, {
                rotateY: -15,
                rotateX: 10,
                duration: 2,
                ease: 'power1.inOut'
            });
        }

        // Coin animations
        const solCoin = document.querySelector('.coin.sol');
        if (solCoin) {
            gsap.to(solCoin, {
                y: -30,
                rotation: 10,
                duration: 2,
                ease: 'power1.inOut',
                repeat: -1,
                yoyo: true
            });
        }

        const ethCoin = document.querySelector('.coin.eth');
        if (ethCoin) {
            gsap.to(ethCoin, {
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
        const wallet = document.querySelector('.wallet');
        if (wallet) {
            gsap.to(wallet, {
                scale: 1.05,
                duration: 2,
                ease: 'power1.inOut',
                repeat: -1,
                yoyo: true
            });
        }

        // Text animation
        const textGradient = document.querySelector('.text-gradient');
        if (textGradient) {
            gsap.to(textGradient, {
                opacity: 0.7,
                duration: 1.5,
                ease: 'power1.inOut',
                repeat: -1,
                yoyo: true
            });
        }

        console.log('Animations initialized successfully');
    } catch (error) {
        console.error('Error initializing animations:', error);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAnimations);
} else {
    initializeAnimations();
}

// Export function for use in other files
window.initializeAnimations = initializeAnimations; 