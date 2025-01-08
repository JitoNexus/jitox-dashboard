// Global variables for charts and previous values
let solChart, mevChart, sandwichChart, aiPerformanceChart;
let previousStats = {
    'Active Searchers': 5000,
    'Active MEV Operations': 500,
    'Ongoing Arbitrage': 100,
    'Ongoing Sandwich': 200
};

// Maximum allowed change per update (as percentage of range)
const MAX_CHANGE_PERCENT = 0.05;

function getSmoothedValue(currentValue, targetValue, maxChangePercent) {
    const difference = targetValue - currentValue;
    const maxChange = Math.abs(currentValue * maxChangePercent);
    if (Math.abs(difference) <= maxChange) return targetValue;
    return currentValue + (Math.sign(difference) * maxChange);
}

document.addEventListener('DOMContentLoaded', () => {
    if (typeof Chart === 'undefined') {
        console.error('Chart.js not loaded');
        return;
    }

    // Initialize charts
    initializeCharts();
    initializeTabs();

    // Start continuous updates
    startContinuousUpdates();
});

function startContinuousUpdates() {
    // Update everything every second
    setInterval(() => {
        updateAllCharts();
        updateAllStats();
    }, 1000);
}

function updateAllStats() {
    // Statistics tab ranges
    const ranges = {
        'Active Searchers': { min: 2500, max: 10000 },
        'Active MEV Operations': { min: 100, max: 1232 },
        'Ongoing Arbitrage': { min: 10, max: 523 },
        'Ongoing Sandwich': { min: 24, max: 721 }
    };

    // Update each statistic with animation
    document.querySelectorAll('.cyber-card .card-content').forEach(card => {
        const title = card.querySelector('h2')?.textContent;
        const valueElement = card.querySelector('.stat-value');
        
        if (title && valueElement && ranges[title]) {
            const range = ranges[title];
            const currentValue = parseInt(valueElement.textContent.replace(/,/g, '')) || 0;
            
            // Calculate new value with smaller change
            const maxChange = Math.floor((range.max - range.min) * 0.1); // Only allow 10% range change
            const minNewValue = Math.max(currentValue - maxChange, range.min);
            const maxNewValue = Math.min(currentValue + maxChange, range.max);
            const newValue = Math.floor(Math.random() * (maxNewValue - minNewValue + 1)) + minNewValue;
            
            // Animate the number change
            animateValue(valueElement, currentValue, newValue, 4000); // 4 second animation
        }
    });
}

function animateValue(element, start, end, duration) {
    const range = end - start;
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Use easeInOutQuart for even smoother animation
        const easing = progress < 0.5
            ? 8 * progress * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 4) / 2;
        
        const current = Math.floor(start + (range * easing));
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// Update stats every 10 seconds
setInterval(updateAllStats, 10000);

// Update charts every 8 seconds
setInterval(updateAllCharts, 8000);

function updateAlertTimes() {
    const alerts = document.querySelectorAll('.alert-item .time');
    alerts.forEach((alert, index) => {
        const minutes = parseInt(alert.textContent) + 1;
        alert.textContent = `${minutes}m ago`;
    });
}

// Previous chart data storage
let previousChartData = {
    sol: Array(24).fill(500),
    mev: [100, 200, 100, 50],
    sandwich: [30, 25, 20]
};

function updateAllCharts() {
    // Update SOL Gained Chart with smooth transitions
    if (solChart) {
        const targetData = Array(24).fill(0).map(() => getRandomData(100, 1000));
        const smoothedData = targetData.map((target, i) => 
            getSmoothedValue(previousChartData.sol[i], target, 0.1)
        );
        previousChartData.sol = smoothedData;
        solChart.data.datasets[0].data = smoothedData;
        solChart.update('none');
    }

    // Update MEV Operations Chart with smooth transitions
    if (mevChart) {
        const targetData = [
            getRandomData(10, 523),
            getRandomData(24, 721),
            getRandomData(10, 300),
            getRandomData(5, 200)
        ];
        const smoothedData = targetData.map((target, i) => 
            getSmoothedValue(previousChartData.mev[i], target, 0.1)
        );
        previousChartData.mev = smoothedData;
        mevChart.data.datasets[0].data = smoothedData;
        mevChart.update('none');
    }

    // Update Sandwich Chart with smooth transitions
    if (sandwichChart) {
        const total = getRandomData(24, 721);
        const targetData = [
            Math.floor(total * 0.4),
            Math.floor(total * 0.35),
            Math.floor(total * 0.25)
        ];
        const smoothedData = targetData.map((target, i) => 
            getSmoothedValue(previousChartData.sandwich[i], target, 0.1)
        );
        previousChartData.sandwich = smoothedData;
        sandwichChart.data.datasets[0].data = smoothedData;
        sandwichChart.update('none');
    }

    // Update AI Performance Chart with smooth transitions
    if (aiPerformanceChart) {
        const lastValue = aiPerformanceChart.data.datasets[0].data[23] || 85;
        const targetValue = getRandomData(70, 100);
        const smoothedValue = getSmoothedValue(lastValue, targetValue, 0.05);
        const newData = [...aiPerformanceChart.data.datasets[0].data.slice(1), smoothedValue];
        aiPerformanceChart.data.datasets[0].data = newData;
        aiPerformanceChart.update('none');
    }
}

function initializeCharts() {
    try {
        // SOL Gained Chart
        solChart = new Chart(
            document.getElementById('solGainedChart'),
            {
                type: 'line',
                data: {
                    labels: Array(24).fill('').map((_, i) => `${23-i}h`),
                    datasets: [{
                        label: 'SOL Gained',
                        data: Array(24).fill(0).map(() => getRandomData(100, 1000)),
                        borderColor: '#ff00ff',
                        backgroundColor: 'rgba(255, 0, 255, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: {
                        duration: 2000,  // Slower animation
                        easing: 'easeInOutQuart'
                    },
                    plugins: {
                        legend: {
                            display: true,
                            labels: { color: '#00ffff' }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { color: 'rgba(0, 255, 255, 0.1)' },
                            ticks: { color: '#00ffff' }
                        },
                        x: {
                            grid: { color: 'rgba(0, 255, 255, 0.1)' },
                            ticks: { color: '#00ffff' }
                        }
                    }
                }
            }
        );

        // MEV Operations Chart with matching ranges
        mevChart = new Chart(
            document.getElementById('mevOpsChart'),
            {
                type: 'bar',
                data: {
                    labels: ['Arbitrage', 'Sandwich', 'Liquidation', 'Other'],
                    datasets: [{
                        label: 'Active Operations',
                        data: [
                            getRandomData(10, 523),  // Arbitrage range
                            getRandomData(24, 721),  // Sandwich range
                            getRandomData(10, 300),  // Liquidation
                            getRandomData(5, 200)    // Other
                        ],
                        backgroundColor: [
                            'rgba(0, 255, 255, 0.5)',
                            'rgba(255, 0, 255, 0.5)',
                            'rgba(255, 255, 0, 0.5)',
                            'rgba(0, 255, 0, 0.5)'
                        ],
                        borderColor: [
                            '#00ffff',
                            '#ff00ff',
                            '#ffff00',
                            '#00ff00'
                        ],
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: {
                        duration: 2000,  // Slower animation
                        easing: 'easeInOutQuart'
                    },
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { color: 'rgba(0, 255, 255, 0.1)' },
                            ticks: { color: '#00ffff' }
                        },
                        x: {
                            grid: { color: 'rgba(0, 255, 255, 0.1)' },
                            ticks: { color: '#00ffff' }
                        }
                    }
                }
            }
        );

        // Sandwich Opportunities Chart
        sandwichChart = new Chart(
            document.getElementById('sandwichChart'),
            {
                type: 'doughnut',
                data: {
                    labels: ['High Profit', 'Medium Profit', 'Low Profit'],
                    datasets: [{
                        data: [15, 25, 16],
                        backgroundColor: [
                            'rgba(255, 0, 255, 0.8)',
                            'rgba(0, 255, 255, 0.8)',
                            'rgba(255, 255, 0, 0.8)'
                        ],
                        borderColor: '#000033',
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: {
                        duration: 2000,  // Slower animation
                        easing: 'easeInOutQuart'
                    },
                    plugins: {
                        legend: {
                            display: true,
                            position: 'bottom',
                            labels: { color: '#00ffff' }
                        }
                    }
                }
            }
        );

        console.log('Charts initialized successfully');
    } catch (error) {
        console.error('Error initializing charts:', error);
    }
}

function initializeAIDashboard() {
    // AI Performance Chart
    const aiPerformanceCtx = document.getElementById('aiPerformanceChart');
    if (aiPerformanceCtx) {
        aiPerformanceChart = new Chart(aiPerformanceCtx, {
            type: 'line',
            data: {
                labels: Array(24).fill('').map((_, i) => `${23-i}h`),
                datasets: [{
                    label: 'Success Rate',
                    data: Array(24).fill(0).map(() => getRandomData(70, 100)),
                    borderColor: '#ff00ff',
                    backgroundColor: 'rgba(255, 0, 255, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 750,
                    easing: 'linear'
                },
                plugins: {
                    legend: {
                        display: true,
                        labels: { color: '#00ffff' }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 60,
                        max: 100,
                        grid: { color: 'rgba(0, 255, 255, 0.1)' },
                        ticks: { color: '#00ffff' }
                    },
                    x: {
                        grid: { color: 'rgba(0, 255, 255, 0.1)' },
                        ticks: { color: '#00ffff' }
                    }
                }
            }
        });
    }
}

function initializeTabs() {
    const tabs = document.querySelectorAll('.cyber-button');
    const sections = document.querySelectorAll('.content-section');

    // Hide all sections except statistics initially
    sections.forEach(section => {
        if (!section.classList.contains('statistics-section')) {
            section.style.display = 'none';
        }
    });

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;

            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');

            // Hide all sections with fade out
            sections.forEach(section => {
                section.style.opacity = '0';
                setTimeout(() => {
                    section.style.display = 'none';
                }, 300);
            });

            // Show selected section with fade in
            const targetSection = document.querySelector(`.${targetTab}-section`);
            if (targetSection) {
                setTimeout(() => {
                    targetSection.style.display = 'block';
                    setTimeout(() => {
                        targetSection.style.opacity = '1';
                    }, 50);
                }, 300);
                
                // Initialize appropriate charts
                if (targetTab === 'statistics') {
                    initializeCharts();
                } else if (targetTab === 'ai') {
                    initializeAIDashboard();
                }
            }
        });
    });
}

// Utility functions
function getRandomData(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}