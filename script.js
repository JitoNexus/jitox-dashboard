// Initialize variables for charts
let solChart = null;
let mevChart = null;
let chartUpdateInterval = null;
let activityUpdateInterval = null;

// Initialize dashboard with error handling
async function initializeDashboard(skipUserCheck = false) {
    console.log('Initializing dashboard...');
    try {
        // Show loading state
        document.body.classList.add('loading');
        
        // Initialize sections if they exist
        const statsSection = document.querySelector('.stats-grid');
        const chartsSection = document.querySelector('.charts-grid');
        
        if (statsSection) {
            console.log('Initializing stats...');
            updateAllStats();
        }
        
        if (chartsSection) {
            console.log('Initializing charts...');
            destroyCharts(); // Ensure charts are destroyed before reinitializing
            initializeCharts();
        }

        // Start update intervals
        if (!chartUpdateInterval) {
            chartUpdateInterval = setInterval(updateAllCharts, 2000);
        }
        if (!activityUpdateInterval) {
            activityUpdateInterval = setInterval(updateLiveMEVActivity, 5000);
        }

        // Update connection status
        updateConnectionStatus();

        // Show content after initialization
        document.body.classList.remove('loading');
        document.body.classList.remove('not-logged');
        
        // Mark dashboard as accessed
        sessionStorage.setItem('dashboardAccessed', 'true');
        
        console.log('Dashboard initialized successfully');
        return true;
    } catch (error) {
        console.error('Error initializing dashboard:', error);
        document.body.classList.remove('loading');
        
        // Show error message to user
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = 'Failed to initialize dashboard. Please try again.';
        document.body.appendChild(errorMessage);
        setTimeout(() => errorMessage.remove(), 5000);
        
        return false;
    }
}

// Destroy existing charts
function destroyCharts() {
    if (solChart) {
        solChart.destroy();
        solChart = null;
    }
    if (mevChart) {
        mevChart.destroy();
        mevChart = null;
    }
}

// Initialize charts
function initializeCharts() {
    // SOL Gained Chart
    const solCtx = document.getElementById('solGainedChart')?.getContext('2d');
    if (solCtx) {
        solChart = new Chart(solCtx, {
            type: 'line',
            data: {
                labels: ['11h', '9h', '7h', '5h', '3h', '1h'],
                datasets: [{
                    label: 'SOL Gained',
                    data: [500, 200, 100, 800, 400, 300],
                    borderColor: '#ff00ff',
                    tension: 0.4,
                    fill: true,
                    backgroundColor: 'rgba(255, 0, 255, 0.1)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 255, 255, 0.1)'
                        },
                        ticks: { color: '#00ffff' }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0, 255, 255, 0.1)'
                        },
                        ticks: { color: '#00ffff' }
                    }
                }
            }
        });
    }

    // MEV Operations Chart
    const mevCtx = document.getElementById('mevOpsChart')?.getContext('2d');
    if (mevCtx) {
        mevChart = new Chart(mevCtx, {
            type: 'bar',
            data: {
                labels: ['Arbitrage', 'Sandwich', 'Liquidation', 'Other'],
                datasets: [{
                    data: [300, 450, 200, 150],
                    backgroundColor: ['#00ffff', '#ff00ff', '#ffff00', '#00ff00'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 255, 255, 0.1)'
                        },
                        ticks: { color: '#00ffff' }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0, 255, 255, 0.1)'
                        },
                        ticks: { color: '#00ffff' }
                    }
                }
            }
        });
    }
}

// Update all stats
function updateAllStats() {
    // Update active searchers
    const activeSearchers = document.querySelector('.stats-grid .cyber-card:nth-child(1) .stat-value');
    if (activeSearchers) {
        activeSearchers.textContent = getRandomData(4000, 6000);
    }

    // Update active MEV operations
    const activeMEV = document.querySelector('.stats-grid .cyber-card:nth-child(2) .stat-value');
    if (activeMEV) {
        activeMEV.textContent = getRandomData(100, 200);
    }

    // Update ongoing arbitrage
    const ongoingArb = document.querySelector('.stats-grid .cyber-card:nth-child(3) .stat-value');
    if (ongoingArb) {
        ongoingArb.textContent = getRandomData(40, 70);
    }

    // Update ongoing sandwich
    const ongoingSandwich = document.querySelector('.stats-grid .cyber-card:nth-child(4) .stat-value');
    if (ongoingSandwich) {
        ongoingSandwich.textContent = getRandomData(180, 280);
    }
}

// Update charts with new data
function updateAllCharts() {
    if (solChart) {
        solChart.data.datasets[0].data = Array.from({length: 6}, () => getRandomData(100, 1000));
        solChart.update();
    }
    
    if (mevChart) {
        mevChart.data.datasets[0].data = [
            getRandomData(200, 400),
            getRandomData(300, 500),
            getRandomData(150, 250),
            getRandomData(100, 200)
        ];
        mevChart.update();
    }
}

// Update live MEV activity
function updateLiveMEVActivity() {
    const activityFeed = document.querySelector('.mev-activity-feed');
    if (!activityFeed) return;

    const activities = [
        { type: 'arbitrage', description: 'Arbitrage opportunity detected', priority: 'high' },
        { type: 'sandwich', description: 'Sandwich trade executed', priority: 'medium' },
        { type: 'liquidation', description: 'Liquidation opportunity found', priority: 'high' }
    ];

    const activity = activities[Math.floor(Math.random() * activities.length)];
    const time = new Date().toLocaleTimeString();

    const activityItem = document.createElement('div');
    activityItem.className = `activity-item ${activity.priority}-priority`;
    activityItem.innerHTML = `
        <div class="activity-time">${time}</div>
        <div class="activity-description">
            <i class="fas fa-bolt"></i> ${activity.description}
        </div>
        <div class="activity-details">Profit potential: ${getRandomData(1, 10)} SOL</div>
    `;

    activityFeed.insertBefore(activityItem, activityFeed.firstChild);
    if (activityFeed.children.length > 10) {
        activityFeed.removeChild(activityFeed.lastChild);
    }
}

// Connection status check
async function updateConnectionStatus() {
    const statusIndicator = document.querySelector('.status-indicator');
    const statusText = document.querySelector('.status-text');
    
    if (statusIndicator && statusText) {
        statusIndicator.style.background = '#00ff00';
        statusIndicator.style.boxShadow = '0 0 10px #00ff00';
        statusText.textContent = 'Connected to Solana';
    }
}

// Utility function for random data
function getRandomData(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Handle visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Clear intervals when page is hidden
        if (chartUpdateInterval) {
            clearInterval(chartUpdateInterval);
            chartUpdateInterval = null;
        }
        if (activityUpdateInterval) {
            clearInterval(activityUpdateInterval);
            activityUpdateInterval = null;
        }
    } else {
        // Restart intervals when page becomes visible
        if (!chartUpdateInterval) {
            chartUpdateInterval = setInterval(updateAllCharts, 2000);
        }
        if (!activityUpdateInterval) {
            activityUpdateInterval = setInterval(updateLiveMEVActivity, 5000);
        }
    }
});