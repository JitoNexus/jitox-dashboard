// Global variables for charts and previous values
let solChart = null, mevChart = null, sandwichChart = null, networkChart = null, volumeChart = null;
let isInitialized = false;
let previousStats = {
    'Active Searchers': 5000,
    'Active MEV Operations': 500,
    'Ongoing Arbitrage': 100,
    'Ongoing Sandwich': 200
};

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
            usePointStyle: true
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
            options: chartDefaults
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
                        data: Array(24).fill(0).map(() => Math.random() * 1000 + 500),
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

// Initialize loading sequence
function initializeLoadingSequence() {
    try {
        const elements = {
            loadingContainer: document.getElementById('loadingContainer'),
            mainContent: document.getElementById('mainContent'),
            cyberParticles: document.getElementById('cyberParticles'),
            loadingProgress: document.getElementById('loadingProgress'),
            statusItems: document.querySelectorAll('.status-item')
        };

        // Check if all required elements exist
        for (const [key, element] of Object.entries(elements)) {
            if (!element || (element instanceof NodeList && element.length === 0)) {
                console.error(`Required element "${key}" not found`);
                return;
            }
        }

        console.log('Initializing loading sequence...');

        // Create particles
        if (elements.cyberParticles) {
            elements.cyberParticles.innerHTML = '';
            for (let i = 0; i < 20; i++) {
                const particle = document.createElement('div');
                particle.className = 'cyber-particle';
                particle.style.left = `${Math.random() * 100}%`;
                particle.style.top = `${Math.random() * 100}%`;
                particle.style.animationDelay = `${Math.random() * 10}s`;
                elements.cyberParticles.appendChild(particle);
            }
        }

        // Initialize progress
        let currentProgress = 0;
        elements.loadingProgress.style.width = '0%';
        elements.statusItems.forEach(item => item.classList.remove('completed'));

        const interval = setInterval(() => {
            currentProgress += 1;
            elements.loadingProgress.style.width = `${currentProgress}%`;

            // Update status items
            if (currentProgress >= 30) {
                elements.statusItems[0]?.classList.add('completed');
            }
            if (currentProgress >= 60) {
                elements.statusItems[1]?.classList.add('completed');
            }
            if (currentProgress >= 90) {
                elements.statusItems[2]?.classList.add('completed');
            }

            if (currentProgress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    // Hide loading screen and show main content
                    elements.loadingContainer.style.display = 'none';
                    elements.mainContent.style.display = 'block';
                    elements.mainContent.style.opacity = '1';
                    isInitialized = true;
                    console.log('Loading sequence completed');
                }, 500);
            }
        }, 30);
    } catch (error) {
        console.error('Error in loading sequence:', error);
    }
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, starting initialization...');
    initializeLoadingSequence();
});

// Initialize Time Selector
function initializeTimeSelector() {
    const timeButtons = document.querySelectorAll('.time-selector button');
    timeButtons.forEach(button => {
        button.addEventListener('click', () => {
            timeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            // Update chart data based on selected time range
            updateChartData(button.textContent);
        });
    });
}

// Initialize Chart Controls
function initializeChartControls() {
    const expandButtons = document.querySelectorAll('.chart-control-btn');
    expandButtons.forEach(button => {
        button.addEventListener('click', function() {
            const chartContainer = this.closest('.chart-card');
            if (chartContainer) {
                chartContainer.classList.toggle('expanded');
                // Update chart size when expanded
                Chart.instances.forEach(chart => chart.resize());
            }
        });
    });
}

// Start continuous updates
function startUpdates() {
    // Update stats and charts every 2 seconds
    setInterval(() => {
        updateNetworkStats();
        updateChartData();
    }, 2000);
}

// Update chart data based on time range
function updateChartData(timeRange = '24H') {
    try {
        if (networkChart) {
            const newData = Array(24).fill(0).map(() => Math.random() * 1000 + 500);
            networkChart.data.datasets[0].data = newData;
            networkChart.update('none');
        }
        
        if (volumeChart) {
            const newData = [
                Math.random() * 40 + 20,
                Math.random() * 30 + 10,
                Math.random() * 20 + 5,
                Math.random() * 15 + 5,
                Math.random() * 10 + 5
            ];
            volumeChart.data.datasets[0].data = newData;
            volumeChart.update('none');
        }
        
        if (solChart) {
            const newData = Array(24).fill(0).map(() => Math.random() * 1000 + 500);
            solChart.data.datasets[0].data = newData;
            solChart.update('none');
        }
    } catch (error) {
        console.error('Error updating chart data:', error);
    }
}

// Update network stats
function updateNetworkStats() {
    const tpsElement = document.getElementById('currentTPS');
    if (tpsElement) {
        const newTPS = Math.floor(Math.random() * 500) + 2000;
        tpsElement.textContent = newTPS.toLocaleString();
        
        // Animate the value change
        tpsElement.style.transform = 'scale(1.1)';
        setTimeout(() => {
            tpsElement.style.transform = 'scale(1)';
        }, 200);
    }
}

// Initialize tab switching
function initializeTabs() {
    const tabs = document.querySelectorAll('.cyber-nav .cyber-button');
    const sections = document.querySelectorAll('.content-section');

    // Hide all sections except statistics
    sections.forEach(section => {
        if (!section.classList.contains('statistics-section')) {
            section.style.display = 'none';
        }
    });

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetSection = tab.getAttribute('data-tab');

            // Update active states
            tabs.forEach(t => t.classList.remove('active'));
            sections.forEach(s => s.style.display = 'none');
            
            tab.classList.add('active');
            const targetElement = document.querySelector(`.${targetSection}-section`);
            if (targetElement) {
                targetElement.style.display = 'block';
                // Update charts if showing statistics
                if (targetSection === 'statistics') {
                    updateChartData();
                }
            }
        });
    });
}