// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Initialize GSAP timeline for wallet animation
        const tl = gsap.timeline({ repeat: -1 });

        // Wallet animation
        if (document.querySelector('.wallet-body')) {
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
        }

        // Coin animations
        if (document.querySelector('.coin.sol')) {
            gsap.to('.coin.sol', {
                y: -30,
                rotation: 10,
                duration: 2,
                ease: 'power1.inOut',
                repeat: -1,
                yoyo: true
            });
        }

        if (document.querySelector('.coin.eth')) {
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
        if (document.querySelector('.wallet')) {
            gsap.to('.wallet', {
                scale: 1.05,
                duration: 2,
                ease: 'power1.inOut',
                repeat: -1,
                yoyo: true
            });
        }

        // Text animation
        if (document.querySelector('.text-gradient')) {
            gsap.to('.text-gradient', {
                opacity: 0.7,
                duration: 1.5,
                ease: 'power1.inOut',
                repeat: -1,
                yoyo: true
            });
        }
    } catch (error) {
        console.error('Error initializing animations:', error);
    }
}); 