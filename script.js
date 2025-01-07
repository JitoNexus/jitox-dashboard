// Wait for both DOM and Chart.js to be ready
document.addEventListener('DOMContentLoaded', () => {
    if (typeof Chart === 'undefined') {
        console.error('Chart.js not loaded');
        return;
    }

    // Initialize charts
    initializeCharts();
    
    // Initialize tab switching
    initializeTabs();
});

// Tab switching functionality
function initializeTabs() {
    const tabs = document.querySelectorAll('.cyber-button');
    const sections = document.querySelectorAll('.content-section');

    console.log('Found tabs:', tabs.length);
    console.log('Found sections:', sections.length);

    // Hide all sections except statistics initially
    sections.forEach(section => {
        if (!section.classList.contains('statistics-section')) {
            section.style.display = 'none';
        }
    });

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            console.log('Clicked tab:', targetTab);

            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');

            // Hide all sections
            sections.forEach(section => {
                section.style.display = 'none';
                console.log('Section:', section.className);
            });

            // Show selected section
            const targetSection = document.querySelector(`.${targetTab}-section`);
            if (targetSection) {
                console.log('Showing section:', targetTab);
                targetSection.style.display = 'block';
                
                // Initialize appropriate charts
                if (targetTab === 'statistics') {
                    initializeCharts();
                } else if (targetTab === 'ai') {
                    initializeAIDashboard();
                }
            } else {
                console.error('Section not found:', targetTab);
            }
        });
    });
}

function initializeAIDashboard() {
    // AI Performance Chart
    const aiPerformanceCtx = document.getElementById('aiPerformanceChart');
    if (aiPerformanceCtx) {
        new Chart(aiPerformanceCtx, {
            type: 'line',
            data: {
                labels: Array(24).fill('').map((_, i) => `${23-i}h`),
                datasets: [{
                    label: 'Success Rate',
                    data: Array(24).fill(0).map(() => Math.random() * 30 + 70), // 70-100% success rate
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
                        labels: { color: '#00ffff' }
                    },
                    title: {
                        display: true,
                        text: 'AI Performance (24h)',
                        color: '#00ffff'
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

    // Update AI stats periodically
    setInterval(updateAIStats, 2000);
}

function updateAIStats() {
    const stats = {
        'detected-opportunities': Math.floor(Math.random() * 100 + 400),
        'successful-predictions': Math.floor(Math.random() * 20 + 80),
        'active-strategies': Math.floor(Math.random() * 10 + 20),
        'avg-response-time': (Math.random() * 0.1 + 0.1).toFixed(3)
    };

    Object.entries(stats).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            if (id === 'avg-response-time') {
                element.textContent = `${value}s`;
            } else {
                element.textContent = value.toString();
            }
        }
    });
}

// Original chart initialization function
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