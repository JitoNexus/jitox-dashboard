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
    // Update statistics section stats
    const statsUpdates = {
        'Active Searchers': getRandomData(5900, 6000),
        'Active MEV Operations': getRandomData(750, 800),
        'Ongoing Arbitrage': getRandomData(15, 25),
        'Ongoing Sandwich': getRandomData(50, 60)
    };

    Object.entries(statsUpdates).forEach(([key, value]) => {
        const element = document.querySelector(`h2.cyber-text:contains('${key}')`).nextElementSibling;
        if (element) {
            animateValue(element, parseInt(element.textContent.replace(/,/g, '')), value, 1000);
        }
    });

    // Update AI dashboard stats
    const aiStats = {
        'detected-opportunities': getRandomData(400, 500),
        'successful-predictions': getRandomData(80, 100),
        'active-strategies': getRandomData(20, 30),
        'avg-response-time': (Math.random() * 0.1 + 0.1).toFixed(3)
    };

    Object.entries(aiStats).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            if (id === 'avg-response-time') {
                element.textContent = `${value}s`;
            } else {
                animateValue(element, parseInt(element.textContent), value, 1000);
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
    // Update SOL Gained Chart
    if (solChart) {
        solChart.data.datasets[0].data = Array(24).fill(0).map(() => getRandomData(100, 500));
        solChart.update('none');
    }

    // Update MEV Operations Chart
    if (mevChart) {
        mevChart.data.datasets[0].data = [
            getRandomData(15, 25),
            getRandomData(50, 60),
            getRandomData(10, 20),
            getRandomData(5, 10)
        ];
        mevChart.update('none');
    }

    // Update Sandwich Chart
    if (sandwichChart) {
        sandwichChart.data.datasets[0].data = [
            getRandomData(10, 20),
            getRandomData(20, 30),
            getRandomData(10, 20)
        ];
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
                        data: Array(24).fill(0).map(() => getRandomData(100, 500)),
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

        // MEV Operations Chart
        mevChart = new Chart(
            document.getElementById('mevOpsChart'),
            {
                type: 'bar',
                data: {
                    labels: ['Arbitrage', 'Sandwich', 'Liquidation', 'Other'],
                    datasets: [{
                        label: 'Active Operations',
                        data: [20, 56, 15, 8],
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