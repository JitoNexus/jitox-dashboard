// Global variables for charts
let solChart, mevChart, sandwichChart, aiPerformanceChart;

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
    // Update statistics section stats with fixed selector and new ranges
    const statsUpdates = {
        'Active Searchers': getRandomData(2500, 10000),
        'Active MEV Operations': getRandomData(100, 1232),
        'Ongoing Arbitrage': getRandomData(10, 523),
        'Ongoing Sandwich': getRandomData(24, 721)
    };

    Object.entries(statsUpdates).forEach(([key, value]) => {
        // Fixed selector to find the correct stat value element
        const statTitle = document.evaluate(
            `//h2[contains(text(), '${key}')]`,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;
        
        if (statTitle) {
            const statValue = statTitle.nextElementSibling;
            if (statValue && statValue.classList.contains('stat-value')) {
                const currentValue = parseInt(statValue.textContent.replace(/,/g, ''));
                animateValue(statValue, currentValue, value, 1000);
            }
        }
    });

    // Update AI dashboard stats with matching ranges
    const aiStats = {
        'detected-opportunities': getRandomData(100, 1232), // Match MEV Operations
        'successful-predictions': getRandomData(80, 100),
        'active-strategies': getRandomData(10, 50),
        'avg-response-time': (Math.random() * 0.1 + 0.1).toFixed(3)
    };

    Object.entries(aiStats).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            if (id === 'avg-response-time') {
                element.textContent = `${value}s`;
            } else {
                const currentValue = parseInt(element.textContent.replace(/,/g, ''));
                animateValue(element, currentValue, value, 1000);
            }
        }
    });

    // Update alert times
    updateAlertTimes();
}

function updateAlertTimes() {
    const alerts = document.querySelectorAll('.alert-item .time');
    alerts.forEach((alert, index) => {
        const minutes = parseInt(alert.textContent) + 1;
        alert.textContent = `${minutes}m ago`;
    });
}

function updateAllCharts() {
    // Update SOL Gained Chart with matching ranges
    if (solChart) {
        const newSolData = Array(24).fill(0).map(() => getRandomData(100, 1000));
        solChart.data.datasets[0].data = newSolData;
        solChart.update('none');
    }

    // Update MEV Operations Chart with matching ranges
    if (mevChart) {
        const newMevData = [
            getRandomData(10, 523),  // Arbitrage range
            getRandomData(24, 721),  // Sandwich range
            getRandomData(10, 300),  // Liquidation
            getRandomData(5, 200)    // Other
        ];
        mevChart.data.datasets[0].data = newMevData;
        mevChart.update('none');
    }

    // Update Sandwich Chart with matching ranges
    if (sandwichChart) {
        const total = getRandomData(24, 721); // Match Sandwich range
        const high = Math.floor(total * 0.4);
        const medium = Math.floor(total * 0.35);
        const low = total - high - medium;
        
        const newSandwichData = [high, medium, low];
        sandwichChart.data.datasets[0].data = newSandwichData;
        sandwichChart.update('none');
    }

    // Update AI Performance Chart
    if (aiPerformanceChart) {
        const newData = [...aiPerformanceChart.data.datasets[0].data.slice(1), getRandomData(70, 100)];
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
                        duration: 750,
                        easing: 'linear'
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
                        duration: 750,
                        easing: 'linear'
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

function animateValue(obj, start, end, duration) {
    if (start === end) return;
    const range = end - start;
    let current = start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range));
    const timer = setInterval(() => {
        current += increment;
        obj.textContent = current.toLocaleString();
        if (current === end) {
            clearInterval(timer);
        }
    }, stepTime);
}