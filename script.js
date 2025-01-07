// Chart.js configuration with cyberpunk theme
Chart.defaults.color = '#00ffff';
Chart.defaults.borderColor = 'rgba(0, 255, 255, 0.1)';
Chart.defaults.font.family = "'Courier New', monospace";

// Utility function for random data
function getRandomData(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Animated value counter
function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start).toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Update stats
function updateStats() {
    const stats = {
        'Active Searchers': getRandomData(5900, 6000),
        'Active MEV Operations': getRandomData(750, 800),
        'Ongoing Arbitrage': getRandomData(15, 25),
        'Ongoing Sandwich': getRandomData(50, 60)
    };

    Object.entries(stats).forEach(([key, value]) => {
        const element = document.querySelector(`.cyber-card:has(h2:contains('${key}')) .stat-value`);
        if (element) {
            const currentValue = parseInt(element.innerHTML.replace(/,/g, ''));
            animateValue(element, currentValue, value, 1000);
        }
    });
}

// Initialize charts
function initCharts() {
    // SOL Gained Chart
    const solCtx = document.getElementById('solGainedChart').getContext('2d');
    const solGainedChart = new Chart(solCtx, {
        type: 'line',
        data: {
            labels: Array(24).fill('').map((_, i) => `${23-i}h`),
            datasets: [{
                label: 'SOL Gained',
                data: Array(24).fill(0).map(() => getRandomData(100, 500)),
                borderColor: '#ff00ff',
                backgroundColor: 'rgba(255, 0, 255, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 750,
                easing: 'easeInOutQuart'
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 255, 255, 0.1)'
                    }
                }
            }
        }
    });

    // MEV Operations Chart
    const mevCtx = document.getElementById('mevOpsChart').getContext('2d');
    const mevOpsChart = new Chart(mevCtx, {
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
                duration: 750
            }
        }
    });

    // Sandwich Opportunities Chart
    const sandwichCtx = document.getElementById('sandwichChart').getContext('2d');
    const sandwichChart = new Chart(sandwichCtx, {
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
                duration: 750
            }
        }
    });

    // Update charts and stats periodically
    setInterval(() => {
        // Update SOL Gained Chart
        solGainedChart.data.datasets[0].data = Array(24).fill(0).map(() => getRandomData(100, 500));
        solGainedChart.update('none');

        // Update MEV Operations Chart
        mevOpsChart.data.datasets[0].data = [
            getRandomData(15, 25),
            getRandomData(50, 60),
            getRandomData(10, 20),
            getRandomData(5, 10)
        ];
        mevOpsChart.update('none');

        // Update Sandwich Chart
        sandwichChart.data.datasets[0].data = [
            getRandomData(10, 20),
            getRandomData(20, 30),
            getRandomData(10, 20)
        ];
        sandwichChart.update('none');

        // Update stats
        updateStats();
    }, 2000);
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initCharts();
    updateStats(); // Initial stats update
});