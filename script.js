// Chart.js configuration with cyberpunk theme
Chart.defaults.color = '#00ffff';
Chart.defaults.borderColor = 'rgba(0, 255, 255, 0.1)';

// Utility function for random data
function getRandomData(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Animated value counter
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.innerHTML = Math.floor(progress * (end - start) + start).toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
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
                duration: 1000,
                easing: 'easeInOutQuart'
            },
            plugins: {
                title: {
                    display: true,
                    text: 'SOL Gained (24h)',
                    color: '#00ffff',
                    font: {
                        size: 16,
                        family: "'Courier New', monospace"
                    }
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    grid: {
                        color: 'rgba(0, 255, 255, 0.1)'
                    }
                },
                x: {
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
            plugins: {
                title: {
                    display: true,
                    text: 'Active MEV Operations',
                    color: '#00ffff',
                    font: {
                        size: 16,
                        family: "'Courier New', monospace"
                    }
                },
                legend: {
                    display: false
                }
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
            plugins: {
                title: {
                    display: true,
                    text: 'Sandwich Opportunities',
                    color: '#00ffff',
                    font: {
                        size: 16,
                        family: "'Courier New', monospace"
                    }
                }
            }
        }
    });

    // Update charts periodically
    setInterval(() => {
        // Update SOL Gained Chart
        solGainedChart.data.datasets[0].data = solGainedChart.data.datasets[0].data.map(() => 
            getRandomData(100, 500)
        );
        solGainedChart.update('none');

        // Update MEV Operations
        mevOpsChart.data.datasets[0].data = [
            getRandomData(15, 25),
            getRandomData(50, 60),
            getRandomData(10, 20),
            getRandomData(5, 10)
        ];
        mevOpsChart.update('none');

        // Update Sandwich Opportunities
        sandwichChart.data.datasets[0].data = [
            getRandomData(10, 20),
            getRandomData(20, 30),
            getRandomData(10, 20)
        ];
        sandwichChart.update('none');

        // Animate stat values
        document.querySelectorAll('.stat-value').forEach(el => {
            animateValue(el, parseInt(el.innerHTML) - 10, parseInt(el.innerHTML) + getRandomData(-5, 5), 1000);
        });
    }, 3000);
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initCharts();

    // Add hover effects to cyber-cards
    document.querySelectorAll('.cyber-card').forEach(card => {
        card.addEventListener('mouseover', () => {
            card.style.transform = 'scale(1.02) translateY(-5px)';
            card.style.boxShadow = '0 10px 30px rgba(0, 255, 255, 0.3)';
        });
        
        card.addEventListener('mouseout', () => {
            card.style.transform = 'scale(1) translateY(0)';
            card.style.boxShadow = '0 5px 20px rgba(0, 255, 255, 0.2)';
        });
    });

    // Add click effects to cyber-buttons
    document.querySelectorAll('.cyber-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const buttons = document.querySelectorAll('.cyber-button');
            buttons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
        });
    });
});