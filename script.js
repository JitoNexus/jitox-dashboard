// Wait for both DOM and Chart.js to be ready
document.addEventListener('DOMContentLoaded', () => {
    if (typeof Chart === 'undefined') {
        console.error('Chart.js not loaded');
        return;
    }

    // Initialize charts
    initializeCharts();
});

function initializeCharts() {
    try {
        // SOL Gained Chart
        const solChart = new Chart(
            document.getElementById('solGainedChart'),
            {
                type: 'line',
                data: {
                    labels: ['1h', '2h', '3h', '4h', '5h'],
                    datasets: [{
                        label: 'SOL Gained',
                        data: [12, 19, 3, 5, 2],
                        borderColor: '#ff00ff',
                        backgroundColor: 'rgba(255, 0, 255, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            labels: {
                                color: '#00ffff'
                            }
                        }
                    },
                    scales: {
                        y: {
                            grid: {
                                color: 'rgba(0, 255, 255, 0.1)'
                            },
                            ticks: {
                                color: '#00ffff'
                            }
                        },
                        x: {
                            grid: {
                                color: 'rgba(0, 255, 255, 0.1)'
                            },
                            ticks: {
                                color: '#00ffff'
                            }
                        }
                    }
                }
            }
        );

        // MEV Operations Chart
        const mevChart = new Chart(
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
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            grid: {
                                color: 'rgba(0, 255, 255, 0.1)'
                            },
                            ticks: {
                                color: '#00ffff'
                            }
                        },
                        x: {
                            grid: {
                                color: 'rgba(0, 255, 255, 0.1)'
                            },
                            ticks: {
                                color: '#00ffff'
                            }
                        }
                    }
                }
            }
        );

        // Sandwich Opportunities Chart
        const sandwichChart = new Chart(
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
                    plugins: {
                        legend: {
                            display: true,
                            position: 'bottom',
                            labels: {
                                color: '#00ffff'
                            }
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