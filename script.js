// Wait for all resources to load
window.addEventListener('load', () => {
    console.log('Window loaded, starting initialization...');
    initializeLoadingSequence();
});

// Global variables
let isInitialized = false;
let networkChart = null;
let volumeChart = null;
let solGainedChart = null;

// Chart configuration
const chartConfig = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false
        }
    },
    scales: {
        x: {
            grid: {
                color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
                color: 'rgba(255, 255, 255, 0.7)'
            }
        },
        y: {
            grid: {
                color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
                color: 'rgba(255, 255, 255, 0.7)'
            }
        }
    }
};

// Initialize loading sequence
function initializeLoadingSequence() {
    try {
        // Get required elements
        const loadingContainer = document.getElementById('loadingContainer');
        const mainContent = document.getElementById('mainContent');
        const cyberParticles = document.getElementById('cyberParticles');
        const loadingProgress = document.getElementById('loadingProgress');
        const statusItems = document.querySelectorAll('.status-item');

        // Debug logging
        console.log('Loading container:', loadingContainer);
        console.log('Main content:', mainContent);
        console.log('Cyber particles:', cyberParticles);
        console.log('Loading progress:', loadingProgress);
        console.log('Status items:', statusItems);

        // Verify essential elements exist
        if (!loadingContainer || !mainContent || !loadingProgress) {
            console.error('Essential elements not found');
            document.body.innerHTML = `
                <div style="color: white; padding: 20px; text-align: center;">
                    <h1>Loading Error</h1>
                    <p>Unable to initialize application. Please refresh the page.</p>
                </div>
            `;
            return;
        }

        console.log('Starting loading sequence...');

        // Ensure main content is hidden initially
        mainContent.style.display = 'none';
        mainContent.style.opacity = '0';
        loadingContainer.style.display = 'flex';

        // Create particles if container exists
        if (cyberParticles) {
            createParticles(cyberParticles);
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
        document.body.innerHTML = `
            <div style="color: white; padding: 20px; text-align: center;">
                <h1>Error</h1>
                <p>An error occurred while loading. Please refresh the page.</p>
                <p>Error details: ${error.message}</p>
            </div>
        `;
    }
}

// Create particles for the loading screen
function createParticles(container) {
    try {
        if (!container) return;
        
        container.innerHTML = '';
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'cyber-particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 10}s`;
            container.appendChild(particle);
        }
    } catch (error) {
        console.error('Error creating particles:', error);
    }
}

// Initialize charts
function initializeCharts() {
    try {
        // Network Activity Chart
        const networkCtx = document.getElementById('networkActivityChart')?.getContext('2d');
        if (networkCtx) {
            networkChart = new Chart(networkCtx, {
                type: 'line',
                data: {
                    labels: Array.from({length: 24}, (_, i) => `${i}:00`),
                    datasets: [{
                        data: Array.from({length: 24}, () => Math.random() * 1000),
                        borderColor: '#00ffff',
                        backgroundColor: 'rgba(0, 255, 255, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: chartConfig
            });
        }

        // Volume Distribution Chart
        const volumeCtx = document.getElementById('volumeDistributionChart')?.getContext('2d');
        if (volumeCtx) {
            volumeChart = new Chart(volumeCtx, {
                type: 'bar',
                data: {
                    labels: ['DEX', 'Lending', 'NFT', 'Options', 'Other'],
                    datasets: [{
                        data: [40, 20, 15, 15, 10],
                        backgroundColor: '#ff00ff',
                        borderRadius: 4
                    }]
                },
                options: chartConfig
            });
        }

        // SOL Gained Chart
        const solCtx = document.getElementById('solGainedChart')?.getContext('2d');
        if (solCtx) {
            solGainedChart = new Chart(solCtx, {
                type: 'line',
                data: {
                    labels: Array.from({length: 24}, (_, i) => `${23-i}h`),
                    datasets: [{
                        data: Array.from({length: 24}, () => Math.random() * 100),
                        borderColor: '#00ff88',
                        backgroundColor: 'rgba(0, 255, 136, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: chartConfig
            });
        }
    } catch (error) {
        console.error('Error initializing charts:', error);
    }
}

// Initialize tab switching
function initializeTabs() {
    try {
        const tabs = document.querySelectorAll('.cyber-button');
        const sections = document.querySelectorAll('.content-section');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetSection = tab.getAttribute('data-tab');
                
                // Update active states
                tabs.forEach(t => t.classList.remove('active'));
                sections.forEach(s => s.style.display = 'none');
                
                tab.classList.add('active');
                document.querySelector(`.${targetSection}-section`).style.display = 'block';
            });
        });
    } catch (error) {
        console.error('Error initializing tabs:', error);
    }
}

// Complete loading and show main content
function completeLoading(loadingContainer, mainContent) {
    try {
        if (!loadingContainer || !mainContent) {
            console.error('Missing elements for complete loading');
            return;
        }

        setTimeout(() => {
            loadingContainer.style.opacity = '0';
            setTimeout(() => {
                loadingContainer.style.display = 'none';
                mainContent.style.display = 'block';
                setTimeout(() => {
                    mainContent.style.opacity = '1';
                    isInitialized = true;
                    console.log('Loading sequence completed');
                    
                    // Initialize main content components
                    initializeCharts();
                    initializeTabs();
                }, 50);
            }, 500);
        }, 500);
    } catch (error) {
        console.error('Error completing loading:', error);
    }
}

// Export functions for use in other files
window.initializeLoadingSequence = initializeLoadingSequence;
window.completeLoading = completeLoading;