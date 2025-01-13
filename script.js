// Global variables for charts and previous values
let solChart = null, mevChart = null, sandwichChart = null, networkChart = null, volumeChart = null;
let isInitialized = false;
let previousStats = {
    'Active Searchers': 5000,
    'Active MEV Operations': 500,
    'Ongoing Arbitrage': 100,
    'Ongoing Sandwich': 200
};

// Maximum allowed change per update (as percentage of range)
const MAX_CHANGE_PERCENT = 0.05;

// Performance optimizations
let isUpdating = false;
let scrollTimeout;

// Chart Configurations
const chartDefaults = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
        duration: 1000,
        easing: 'easeInOutQuart'
    },
    plugins: {
        legend: {
            display: false
        },
        tooltip: {
            enabled: true,
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(16, 20, 24, 0.95)',
            titleColor: '#fff',
            bodyColor: 'rgba(255, 255, 255, 0.8)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            padding: 12,
            boxPadding: 6,
            usePointStyle: true,
            callbacks: {
                label: function(context) {
                    let label = context.dataset.label || '';
                    if (label) {
                        label += ': ';
                    }
                    label += context.parsed.y.toFixed(2);
                    return label;
                }
            }
        }
    },
    scales: {
        x: {
            grid: {
                color: 'rgba(255, 255, 255, 0.05)',
                drawBorder: false
            },
            ticks: {
                color: 'rgba(255, 255, 255, 0.6)'
            }
        },
        y: {
            grid: {
                color: 'rgba(255, 255, 255, 0.05)',
                drawBorder: false
            },
            ticks: {
                color: 'rgba(255, 255, 255, 0.6)',
                callback: function(value) {
                    return value.toLocaleString();
                }
            }
        }
    }
};

// Create gradient for charts
function createGradient(ctx, colorStart, colorEnd) {
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, colorStart);
    gradient.addColorStop(1, colorEnd);
    return gradient;
}

// Initialize Network Activity Chart
function initializeNetworkChart() {
    try {
        const ctx = document.getElementById('networkActivityChart')?.getContext('2d');
        if (!ctx) return;

        if (networkChart) {
            networkChart.destroy();
            networkChart = null;
        }
        
        const gradient = createGradient(ctx, 'rgba(0, 240, 255, 0.5)', 'rgba(0, 240, 255, 0)');
        
        networkChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array(24).fill('').map((_, i) => `${i}:00`),
                datasets: [{
                    label: 'Network Activity',
                    data: Array(24).fill(0).map(() => Math.random() * 1000 + 500),
                    borderColor: '#00f0ff',
                    backgroundColor: gradient,
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                ...chartDefaults,
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    } catch (error) {
        console.error('Error initializing network chart:', error);
    }
}

// Initialize Volume Distribution Chart
function initializeVolumeChart() {
    try {
        const ctx = document.getElementById('volumeDistributionChart')?.getContext('2d');
        if (!ctx) return;

        if (volumeChart) {
            volumeChart.destroy();
            volumeChart = null;
        }
        
        const gradient = createGradient(ctx, 'rgba(0, 255, 136, 0.5)', 'rgba(0, 255, 136, 0)');
        
        volumeChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['DEX', 'Lending', 'NFT', 'Options', 'Other'],
                datasets: [{
                    label: 'Volume Distribution',
                    data: [45, 25, 15, 10, 5],
                    backgroundColor: gradient,
                    borderColor: '#00ff88',
                    borderWidth: 2,
                    borderRadius: 8
                }]
            },
            options: chartDefaults
        });
    } catch (error) {
        console.error('Error initializing volume chart:', error);
    }
}

// Initialize all charts
function initializeCharts() {
    try {
        // SOL Gained Chart
        const solCtx = document.getElementById('solGainedChart')?.getContext('2d');
        if (solCtx) {
            if (solChart) {
                solChart.destroy();
                solChart = null;
            }
            
            const solGradient = createGradient(solCtx, 'rgba(255, 0, 255, 0.5)', 'rgba(255, 0, 255, 0)');
            solChart = new Chart(solCtx, {
                type: 'line',
                data: {
                    labels: Array(24).fill('').map((_, i) => `${23-i}h`),
                    datasets: [{
                        data: Array(24).fill(0).map(() => getRandomData(100, 1000)),
                        borderColor: '#ff00ff',
                        backgroundColor: solGradient,
                        fill: true,
                        pointBackgroundColor: '#ff00ff',
                        pointBorderColor: '#ffffff'
                    }]
                },
                options: chartDefaults
            });
        }

        // Initialize other charts
        initializeNetworkChart();
        initializeVolumeChart();
    } catch (error) {
        console.error('Error initializing charts:', error);
    }
}

// Initialize main content
function initializeMainContent() {
    try {
        // Initialize charts
        initializeCharts();
        // Initialize other components
        initializeTimeSelector();
        initializeChartControls();
        startUpdates();
    } catch (error) {
        console.error('Error initializing main content:', error);
    }
}

// Loading Screen Initialization
function initializeLoadingScreen() {
    console.log('Initializing loading screen');
    
    const loadingContainer = document.getElementById('loadingContainer');
    const mainContent = document.querySelector('.main-content');
    
    if (!loadingContainer || !mainContent) {
        console.error('Loading screen elements not found');
        return;
    }

    // Ensure loading container is visible and main content is hidden
    loadingContainer.style.display = 'flex';
    mainContent.style.display = 'none';
    document.body.style.overflow = 'hidden';
    
    // Create particles
    const particlesContainer = document.getElementById('cyberParticles');
    if (particlesContainer) {
        particlesContainer.innerHTML = ''; // Clear existing particles
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'cyber-particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 10}s`;
            particlesContainer.appendChild(particle);
        }
    }
    
    // Initialize progress
    let currentProgress = 0;
    const progress = document.getElementById('loadingProgress');
    const statusItems = document.querySelectorAll('.status-item');
    
    if (progress) {
        progress.style.width = '0%';
        statusItems.forEach(item => item.classList.remove('completed'));
        
        const interval = setInterval(() => {
            currentProgress += 1;
            progress.style.width = `${currentProgress}%`;
            
            // Update status items
            if (currentProgress >= 30 && statusItems[0]) {
                statusItems[0].classList.add('completed');
            }
            if (currentProgress >= 60 && statusItems[1]) {
                statusItems[1].classList.add('completed');
            }
            if (currentProgress >= 90 && statusItems[2]) {
                statusItems[2].classList.add('completed');
            }
            
            if (currentProgress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    loadingContainer.style.display = 'none';
                    mainContent.style.display = 'block';
                    document.body.style.overflow = 'auto';
                    mainContent.classList.add('visible');
                    
                    // Initialize main content only if not already initialized
                    if (!isInitialized) {
                        initializeMainContent();
                        isInitialized = true;
                    }
                }, 500);
            }
        }, 30);
    } else {
        console.error('Progress bar element not found');
    }
}

// Single event listener for DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    // Remove any existing event listeners
    const oldListeners = document.querySelectorAll('*');
    oldListeners.forEach(element => {
        element.replaceWith(element.cloneNode(true));
    });
    
    // Initialize loading screen
    initializeLoadingScreen();
});

// ... rest of the existing code ...