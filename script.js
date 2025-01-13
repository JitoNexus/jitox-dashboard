// Global variables
let isInitialized = false;

// Initialize loading sequence
function initializeLoadingSequence() {
    try {
        // Get required elements
        const loadingContainer = document.getElementById('loadingContainer');
        const mainContent = document.getElementById('mainContent');
        const cyberParticles = document.getElementById('cyberParticles');
        const loadingProgress = document.getElementById('loadingProgress');
        const statusItems = document.querySelectorAll('.status-item');

        // Verify essential elements exist
        if (!loadingContainer || !mainContent || !loadingProgress) {
            console.error('Essential elements not found');
            return;
        }

        console.log('Starting loading sequence...');

        // Create particles if container exists
        if (cyberParticles) {
            cyberParticles.innerHTML = '';
            for (let i = 0; i < 20; i++) {
                const particle = document.createElement('div');
                particle.className = 'cyber-particle';
                particle.style.left = `${Math.random() * 100}%`;
                particle.style.top = `${Math.random() * 100}%`;
                particle.style.animationDelay = `${Math.random() * 10}s`;
                cyberParticles.appendChild(particle);
            }
        }

        // Initialize progress
        let currentProgress = 0;
        loadingProgress.style.width = '0%';

        // Progress interval
        const interval = setInterval(() => {
            if (currentProgress >= 100) {
                clearInterval(interval);
                completeLoading(loadingContainer, mainContent);
                return;
            }

            currentProgress += 1;
            loadingProgress.style.width = `${currentProgress}%`;

            // Update status items if they exist
            if (statusItems.length > 0) {
                if (currentProgress >= 30) statusItems[0]?.classList.add('completed');
                if (currentProgress >= 60) statusItems[1]?.classList.add('completed');
                if (currentProgress >= 90) statusItems[2]?.classList.add('completed');
            }
        }, 30);

    } catch (error) {
        console.error('Error in loading sequence:', error);
        // Attempt to show main content even if loading fails
        const mainContent = document.getElementById('mainContent');
        if (mainContent) {
            mainContent.style.display = 'block';
            mainContent.style.opacity = '1';
        }
    }
}

// Complete loading and show main content
function completeLoading(loadingContainer, mainContent) {
    try {
        setTimeout(() => {
            if (loadingContainer) loadingContainer.style.display = 'none';
            if (mainContent) {
                mainContent.style.display = 'block';
                mainContent.style.opacity = '1';
            }
            isInitialized = true;
            console.log('Loading sequence completed');
        }, 500);
    } catch (error) {
        console.error('Error completing loading:', error);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLoadingSequence);
} else {
    initializeLoadingSequence();
}

// Remove problematic function calls
function updateConnectionStatus() {
    // Function removed to prevent errors
    console.log('Connection status update skipped');
}

// Export functions for use in other files
window.initializeLoadingSequence = initializeLoadingSequence;
window.completeLoading = completeLoading;