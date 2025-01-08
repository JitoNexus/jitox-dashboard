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
    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: true,
        mirror: false
    });

    if (typeof Chart === 'undefined') {
        console.error('Chart.js not loaded');
        return;
    }

    // Initialize charts
    initializeCharts();
    initializeTabs();
    initializeLoadingStates();

    // Start continuous updates
    startContinuousUpdates();
});

function initializeLoadingStates() {
    // Hide loading overlay after initialization
    setTimeout(() => {
        const loadingOverlay = document.querySelector('.loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.classList.add('hidden');
        }
    }, 2000);

    // Add loading state to charts
    document.querySelectorAll('.chart-loading').forEach(loader => {
        loader.classList.add('active');
    });

    // Remove loading state after charts are initialized
    setTimeout(() => {
        document.querySelectorAll('.chart-loading').forEach(loader => {
            loader.classList.remove('active');
        });
    }, 1500);
}

function startContinuousUpdates() {
    setInterval(() => {
        updateAllCharts();
        updateAllStats();
        updateFooterTimestamp();
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
    
    function easeOutQuart(x) {
        return 1 - Math.pow(1 - x, 4);
    }
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easedProgress = easeOutQuart(progress);
        const current = Math.floor(start + (range * easedProgress));
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
        // Show loading state
        document.querySelectorAll('.chart-loading').forEach(loader => {
            loader.classList.add('active');
        });

        // Initialize charts with enhanced styling
        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            },
            plugins: {
                legend: {
                    display: true,
                    labels: { 
                        color: '#00ffff',
                        font: {
                            family: 'Courier New',
                            size: 12
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { 
                        color: 'rgba(0, 255, 255, 0.1)',
                        borderColor: 'rgba(0, 255, 255, 0.5)'
                    },
                    ticks: { 
                        color: '#00ffff',
                        font: {
                            family: 'Courier New',
                            size: 12
                        }
                    }
                },
                x: {
                    grid: { 
                        color: 'rgba(0, 255, 255, 0.1)',
                        borderColor: 'rgba(0, 255, 255, 0.5)'
                    },
                    ticks: { 
                        color: '#00ffff',
                        font: {
                            family: 'Courier New',
                            size: 12
                        }
                    }
                }
            }
        };

        // Initialize charts with enhanced options
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
                        tension: 0.4,
                        borderWidth: 2,
                        pointBackgroundColor: '#ff00ff',
                        pointBorderColor: '#ffffff',
                        pointRadius: 4,
                        pointHoverRadius: 6
                    }]
                },
                options: {
                    ...chartOptions,
                    plugins: {
                        ...chartOptions.plugins,
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 51, 0.9)',
                            titleColor: '#00ffff',
                            bodyColor: '#ffffff',
                            borderColor: '#ff00ff',
                            borderWidth: 1,
                            padding: 10,
                            displayColors: false
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

        // Hide loading state after initialization
        setTimeout(() => {
            document.querySelectorAll('.chart-loading').forEach(loader => {
                loader.classList.remove('active');
            });
        }, 1500);

        console.log('Charts initialized successfully');
    } catch (error) {
        console.error('Error initializing charts:', error);
        // Show error state in UI
        document.querySelectorAll('.chart-card').forEach(card => {
            card.classList.add('error-state');
        });
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

function initializeLeaderboard() {
    const leaderboardData = [
        { rank: 1, address: '0x7f...3a2b', profit: 1245, success: 98.5, ops: 1234 },
        { rank: 2, address: '0x3d...9f4c', profit: 987, success: 97.8, ops: 1089 },
        { rank: 3, address: '0x5e...2d1a', profit: 856, success: 96.5, ops: 945 },
        { rank: 4, address: '0x1a...8c4d', profit: 743, success: 95.9, ops: 867 },
        { rank: 5, address: '0x9b...4e2f', profit: 621, success: 95.2, ops: 756 }
    ];

    const tableBody = document.querySelector('.leaderboard-table');
    if (!tableBody) return;

    leaderboardData.forEach(entry => {
        const row = document.createElement('div');
        row.className = 'table-row';
        row.innerHTML = `
            <span class="rank">#${entry.rank}</span>
            <span class="address">${entry.address}</span>
            <span class="profit">${entry.profit.toLocaleString()} SOL</span>
            <span class="success">${entry.success}%</span>
            <span class="ops">${entry.ops.toLocaleString()}</span>
        `;
        tableBody.appendChild(row);
    });
}

function initializeAnalytics() {
    // Network Analysis Chart
    const networkCtx = document.getElementById('networkAnalysisChart');
    if (networkCtx) {
        new Chart(networkCtx, {
            type: 'line',
            data: {
                labels: Array(24).fill('').map((_, i) => `${23-i}h`),
                datasets: [{
                    label: 'Network Load',
                    data: Array(24).fill(0).map(() => getRandomData(50, 100)),
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
                    duration: 2000,
                    easing: 'easeInOutQuart'
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(0, 255, 255, 0.1)' },
                        ticks: { color: '#00ffff' }
                    }
                }
            }
        });
    }

    // Block Distribution Chart
    const blockCtx = document.getElementById('blockDistributionChart');
    if (blockCtx) {
        new Chart(blockCtx, {
            type: 'bar',
            data: {
                labels: ['0-2s', '2-4s', '4-6s', '6-8s', '8-10s'],
                datasets: [{
                    label: 'Block Time Distribution',
                    data: [45, 30, 15, 7, 3],
                    backgroundColor: 'rgba(0, 255, 255, 0.5)',
                    borderColor: '#00ffff',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 2000,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }
}

function initializeAlerts() {
    const alertStream = document.querySelector('.alert-stream');
    if (!alertStream) return;

    const alerts = [
        { type: 'success', title: 'High Profit Opportunity', message: 'Detected 1.2 SOL arbitrage', time: '2m ago' },
        { type: 'info', title: 'New Strategy Deployed', message: 'Sandwich Pro v3.1 activated', time: '5m ago' },
        { type: 'warning', title: 'Network Congestion', message: 'Increased gas prices detected', time: '8m ago' }
    ];

    alerts.forEach(alert => {
        const alertEl = document.createElement('div');
        alertEl.className = `alert-item ${alert.type}`;
        alertEl.innerHTML = `
            <i class="fas fa-${alert.type === 'success' ? 'check-circle' : alert.type === 'info' ? 'info-circle' : 'exclamation-triangle'}"></i>
            <div class="alert-details">
                <span class="alert-title">${alert.title}</span>
                <span class="alert-info">${alert.message}</span>
            </div>
            <span class="time">${alert.time}</span>
        `;
        alertStream.appendChild(alertEl);
    });

    // Alert Distribution Chart
    const alertCtx = document.getElementById('alertsDistributionChart');
    if (alertCtx) {
        new Chart(alertCtx, {
            type: 'doughnut',
            data: {
                labels: ['High Priority', 'Medium Priority', 'Low Priority'],
                datasets: [{
                    data: [35, 45, 20],
                    backgroundColor: [
                        'rgba(255, 0, 255, 0.8)',
                        'rgba(0, 255, 255, 0.8)',
                        'rgba(255, 255, 0, 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 2000,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }
}

function initializeStrategies() {
    const strategyCtx = document.getElementById('strategyPerformanceChart');
    if (strategyCtx) {
        new Chart(strategyCtx, {
            type: 'line',
            data: {
                labels: Array(24).fill('').map((_, i) => `${23-i}h`),
                datasets: [{
                    label: 'Sandwich Pro',
                    data: Array(24).fill(0).map(() => getRandomData(80, 100)),
                    borderColor: '#ff00ff',
                    tension: 0.4
                }, {
                    label: 'Arbitrage Engine',
                    data: Array(24).fill(0).map(() => getRandomData(70, 90)),
                    borderColor: '#00ffff',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 2000,
                    easing: 'easeInOutQuart'
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
            section.style.opacity = '0';
        }
    });

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;

            // Update aria-selected states
            tabs.forEach(t => {
                t.setAttribute('aria-selected', 'false');
                t.classList.remove('active');
            });
            tab.setAttribute('aria-selected', 'true');
            tab.classList.add('active');

            // Fade out all sections
            sections.forEach(section => {
                section.style.opacity = '0';
                setTimeout(() => {
                    section.style.display = 'none';
                }, 300);
            });

            // Show and fade in target section
            const targetSection = document.querySelector(`.${targetTab}-section`);
            if (targetSection) {
                setTimeout(() => {
                    targetSection.style.display = 'block';
                    // Trigger AOS animations
                    AOS.refresh();
                    setTimeout(() => {
                        targetSection.style.opacity = '1';
                    }, 50);
                }, 300);
            }
        });
    });
}

// Utility functions
function getRandomData(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Update footer timestamp
function updateFooterTimestamp() {
    const updateTime = document.querySelector('.update-time');
    if (updateTime) {
        updateTime.textContent = 'Just now';
        setTimeout(() => {
            updateTime.textContent = '1s ago';
        }, 1000);
    }
}

// Loading Screen Handler
document.addEventListener('DOMContentLoaded', () => {
    const loadingOverlay = document.querySelector('.loading-overlay');
    const mainContent = document.querySelector('.main-content');
    const spinnerCube = document.createElement('div');
    spinnerCube.className = 'spinner-cube';
    document.querySelector('.cyber-spinner').appendChild(spinnerCube);

    // Add cyber grid
    const cyberGrid = document.createElement('div');
    cyberGrid.className = 'cyber-grid';
    loadingOverlay.appendChild(cyberGrid);

    // Initialize loading screen
    document.body.classList.add('loading');

    // Simulate loading progress
    setTimeout(() => {
        loadingOverlay.classList.add('fade-out');
        document.body.classList.remove('loading');
        mainContent.classList.add('visible');
        
        // Remove loading overlay after animation
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
        }, 500);

        // Initialize charts and start updates
        initializeCharts();
        startUpdates();
    }, 2000);
});

function startUpdates() {
    // Update stats and charts every 2 seconds
    setInterval(() => {
        updateAllStats();
        updateAllCharts();
    }, 2000);
}