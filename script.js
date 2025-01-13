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

    // Reset any existing charts
    if (solChart) solChart.destroy();
    if (networkChart) networkChart.destroy();
    if (volumeChart) volumeChart.destroy();
    if (mevChart) mevChart.destroy();
    if (sandwichChart) sandwichChart.destroy();

    solChart = null;
    networkChart = null;
    volumeChart = null;
    mevChart = null;
    sandwichChart = null;

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
                    // Show disclaimer before showing main content
                    showDisclaimer(() => {
                        loadingContainer.style.display = 'none';
                        mainContent.style.display = 'block';
                        document.body.style.overflow = 'auto';
                        mainContent.classList.add('visible');
                        
                        // Initialize main content only if not already initialized
                        if (!isInitialized) {
                            initializeMainContent();
                            isInitialized = true;
                        }
                    });
                }, 500);
            }
        }, 30);
    } else {
        console.error('Progress bar element not found');
    }
}

// Show disclaimer modal
function showDisclaimer(callback) {
    const disclaimerModal = document.createElement('div');
    disclaimerModal.className = 'disclaimer-modal';
    disclaimerModal.innerHTML = `
        <div class="disclaimer-content">
            <h3>Beta Version Notice</h3>
            <div class="disclaimer-text">
                <p>Welcome to JitoX Dashboard Beta!</p>
                <p>Please note:</p>
                <ul>
                    <li>Users who haven't initialized with /get_wallet command and made a deposit may see demo statistics.</li>
                    <li>Verified users with deposits will see their actual performance metrics.</li>
                    <li>We're continuously improving the platform with daily updates.</li>
                </ul>
                <p>Found a bug? Report it to <span class="highlight">@jitoxai</span> and receive compensation for your contribution.</p>
                <div class="disclaimer-footer">
                    <button class="cyber-button" id="disclaimerAccept">I Understand</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(disclaimerModal);

    // Add styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        .disclaimer-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(10, 10, 10, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            backdrop-filter: blur(5px);
        }
        .disclaimer-content {
            background: #13111C;
            border: 1px solid rgba(0, 255, 255, 0.2);
            border-radius: 15px;
            padding: 2rem;
            max-width: 600px;
            width: 90%;
            color: #fff;
            box-shadow: 0 0 30px rgba(0, 255, 255, 0.1);
        }
        .disclaimer-content h3 {
            color: #00ffff;
            font-size: 1.5rem;
            margin-bottom: 1.5rem;
            text-align: center;
        }
        .disclaimer-text {
            font-size: 1rem;
            line-height: 1.6;
        }
        .disclaimer-text p {
            margin-bottom: 1rem;
        }
        .disclaimer-text ul {
            margin: 1rem 0;
            padding-left: 1.5rem;
        }
        .disclaimer-text li {
            margin-bottom: 0.5rem;
            color: rgba(255, 255, 255, 0.8);
        }
        .highlight {
            color: #00ffff;
            font-weight: bold;
        }
        .disclaimer-footer {
            margin-top: 2rem;
            text-align: center;
        }
        #disclaimerAccept {
            background: linear-gradient(45deg, #00ffff, #00ff88);
            border: none;
            padding: 0.8rem 2rem;
            border-radius: 25px;
            color: #0a0a0a;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        #disclaimerAccept:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 255, 255, 0.3);
        }
    `;
    document.head.appendChild(style);

    // Handle accept button click
    document.getElementById('disclaimerAccept').addEventListener('click', () => {
        disclaimerModal.remove();
        style.remove();
        if (callback) callback();
    });
}

// Single event listener for DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize loading screen
    initializeLoadingScreen();
});

// ... rest of the existing code ...