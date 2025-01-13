// Initialize GSAP timeline for wallet animation
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

// Coin animations
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

// Scale animation for the wallet
gsap.to('.wallet', {
    scale: 1.05,
    duration: 2,
    ease: 'power1.inOut',
    repeat: -1,
    yoyo: true
});

// Text animation
gsap.to('.text-gradient', {
    opacity: 0.7,
    duration: 1.5,
    ease: 'power1.inOut',
    repeat: -1,
    yoyo: true
}); 