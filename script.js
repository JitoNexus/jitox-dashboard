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

// Performance optimizations
let isUpdating = false;
let scrollTimeout;

// Mobile optimization for animations
const isMobile = window.innerWidth <= 768;

// Update network quality bars animation
function updateNetworkQuality() {
    const bars = document.querySelectorAll('.quality-bars .bar');
    const quality = Math.floor(Math.random() * 4) + 1; // 1-4 bars
    
    bars.forEach((bar, index) => {
        if (index < quality) {
            bar.classList.add('active');
        } else {
            bar.classList.remove('active');
        }
    });
}

// Smooth status updates
function updateStatus() {
    const statusCircle = document.querySelector('.status-circle');
    const connectionIndicator = document.querySelector('.connection-indicator');
    
    // Simulate status changes
    const isProtectionActive = Math.random() > 0.1;
    const isConnected = Math.random() > 0.05;
    
    statusCircle.classList.toggle('active', isProtectionActive);
    connectionIndicator.classList.toggle('connected', isConnected);
    
    // Update latency
    const latency = Math.floor(Math.random() * 20) + 8;
    document.querySelector('.latency').textContent = `Latency: ${latency}ms`;
}

// Initialize mobile-optimized animations
function initializeMobileAnimations() {
    if (isMobile) {
        // Reduce animation frequency on mobile
        setInterval(updateNetworkQuality, 3000);
        setInterval(updateStatus, 5000);
        
        // Add touch feedback
        const buttons = document.querySelectorAll('.cyber-button');
        buttons.forEach(button => {
            button.addEventListener('touchstart', () => {
                button.classList.add('touched');
            });
            button.addEventListener('touchend', () => {
                button.classList.remove('touched');
            });
        });
        
        // Optimize scroll performance
        let scrollTimeout;
        const content = document.querySelector('.content-section');
        content.addEventListener('scroll', () => {
            if (!content.classList.contains('scrolling')) {
                content.classList.add('scrolling');
            }
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                content.classList.remove('scrolling');
            }, 150);
        }, { passive: true });
    }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    initializeMobileAnimations();
    updateNetworkQuality();
    updateStatus();
});

// Handle orientation changes
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        updateNetworkQuality();
        updateStatus();
    }, 300);
});

// Throttle scroll events
function throttleScroll(callback) {
    if (!isUpdating) {
        isUpdating = true;
        requestAnimationFrame(() => {
            callback();
            isUpdating = false;
        });
    }
}

// Handle scroll events
document.addEventListener('scroll', () => {
    throttleScroll(() => {
        // Add any scroll-based animations or updates here
    });
}, { passive: true });

function getSmoothedValue(currentValue, targetValue, maxChangePercent) {
    const difference = targetValue - currentValue;
    const maxChange = Math.abs(currentValue * maxChangePercent);
    if (Math.abs(difference) <= maxChange) return targetValue;
    return currentValue + (Math.sign(difference) * maxChange);
}

document.addEventListener('DOMContentLoaded', () => {
    initializeLoadingSequence();
    // Initialize other components
    initializeCharts();
    initializeTabs();
    addHexagonalBackground();
    startContinuousUpdates();
});

// Loading Screen Handler
document.addEventListener('DOMContentLoaded', () => {
    initializeLoadingSequence();
});

function initializeLoadingSequence() {
    const loadingOverlay = document.querySelector('.loading-overlay');
    const mainContent = document.querySelector('.main-content');
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.querySelector('.progress-text');
    const statusItems = document.querySelectorAll('.status-item');
    
    mainContent.style.opacity = '0';
    let progress = 0;
    const totalSteps = statusItems.length;
    const stepProgress = 100 / totalSteps;
    
    statusItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '1';
            progress += stepProgress;
            progressBar.style.width = `${progress}%`;
            progressText.textContent = `${Math.round(progress)}%`;
            
            if (index === totalSteps - 1) {
                setTimeout(() => {
                    loadingOverlay.classList.add('fade-out');
                    mainContent.style.opacity = '1';
                    mainContent.style.transition = 'opacity 0.5s ease-out';
                    initializeCharts();
                    startNetworkUpdates();
                }, 1000);
            }
        }, (index + 1) * 1000);
    });
}

// Network Stats Updates
function startNetworkUpdates() {
    updateNetworkStats();
    setInterval(updateNetworkStats, 2000);
}

function updateNetworkStats() {
    const tps = document.querySelector('[data-stat="tps"]');
    const blockHeight = document.querySelector('[data-stat="block-height"]');
    const gasPrice = document.querySelector('[data-stat="gas-price"]');
    const latency = document.querySelector('[data-stat="latency"]');
    
    // Simulate real-time updates with random variations
    const currentTPS = Math.floor(Math.random() * (3000 - 2000) + 2000);
    const currentBlock = parseInt(blockHeight.textContent.replace(/,/g, '')) + Math.floor(Math.random() * 10);
    const currentGas = (Math.random() * (0.001 - 0.0001) + 0.0001).toFixed(6);
    const currentLatency = (Math.random() * (0.2 - 0.05) + 0.05).toFixed(3);
    
    animateValue(tps, parseInt(tps.textContent), currentTPS, 1000, value => `${value.toLocaleString()}`);
    animateValue(blockHeight, parseInt(blockHeight.textContent.replace(/,/g, '')), currentBlock, 1000, value => value.toLocaleString());
    animateValue(gasPrice, parseFloat(gasPrice.textContent), parseFloat(currentGas), 1000, value => value.toFixed(6));
    animateValue(latency, parseFloat(latency.textContent), parseFloat(currentLatency), 1000, value => `${value.toFixed(3)}s`);
    
    // Update connection status indicator color based on latency
    const statusIndicator = document.querySelector('.status-indicator');
    if (currentLatency < 0.1) {
        statusIndicator.style.background = '#00ff00';
        statusIndicator.style.boxShadow = '0 0 10px #00ff00';
    } else if (currentLatency < 0.15) {
        statusIndicator.style.background = '#ffff00';
        statusIndicator.style.boxShadow = '0 0 10px #ffff00';
    } else {
        statusIndicator.style.background = '#ff0000';
        statusIndicator.style.boxShadow = '0 0 10px #ff0000';
    }
}

function animateValue(element, start, end, duration, formatter) {
    const range = end - start;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = start + (range * progress);
        element.textContent = formatter(Math.round(current * 100) / 100);
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// Initialize continuous updates
function startContinuousUpdates() {
    // Update network stats every 2 seconds
    setInterval(() => {
        updateNetworkStats();
    }, 2000);
    
    // Update charts every 5 seconds
    setInterval(() => {
        updateAllCharts();
    }, 5000);
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

// Update stats every 10 seconds
setInterval(updateAllStats, 10000);

// Chart optimization
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
        duration: 0 // Disable animations for better performance
    },
    elements: {
        line: {
            tension: 0.1 // Reduce line tension for better performance
        },
        point: {
            radius: 2 // Smaller points for better performance
        }
    },
    plugins: {
        legend: {
            display: false // Hide legend for better performance
        }
    },
    scales: {
        y: {
            beginAtZero: true,
            grid: {
                display: false // Hide grid for better performance
            },
            ticks: {
                maxTicksLimit: 5 // Limit number of ticks for better performance
            }
        },
        x: {
            grid: {
                display: false // Hide grid for better performance
            },
            ticks: {
                maxTicksLimit: 6 // Limit number of ticks for better performance
            }
        }
    }
};

// Optimize chart updates
function updateAllCharts() {
    if (document.hidden) return; // Skip updates when page is not visible
    
    requestAnimationFrame(() => {
        if (solChart) solChart.update('none');
        if (mevChart) mevChart.update('none');
        if (sandwichChart) sandwichChart.update('none');
        if (aiPerformanceChart) aiPerformanceChart.update('none');
    });
}

// Optimize chart initialization
function initializeCharts() {
    try {
        // SOL Gained Chart
        const solCtx = document.getElementById('solGainedChart');
        if (solCtx) {
            solChart = new Chart(solCtx, {
                type: 'line',
                data: {
                    labels: Array(12).fill('').map((_, i) => `${11-i}h`),
                    datasets: [{
                        data: Array(12).fill(0).map(() => getRandomData(100, 1000)),
                        borderColor: '#ff00ff',
                        backgroundColor: 'rgba(255, 0, 255, 0.1)',
                        fill: true
                    }]
                },
                options: chartOptions
            });
        }

        // MEV Operations Chart
        const mevCtx = document.getElementById('mevOpsChart');
        if (mevCtx) {
            mevChart = new Chart(mevCtx, {
                type: 'bar',
                data: {
                    labels: ['Arb', 'Sand', 'Liq', 'Other'],
                    datasets: [{
                        data: [
                            getRandomData(10, 500),
                            getRandomData(24, 700),
                            getRandomData(10, 300),
                            getRandomData(5, 200)
                        ],
                        backgroundColor: [
                            'rgba(0, 255, 255, 0.7)',
                            'rgba(255, 0, 255, 0.7)',
                            'rgba(255, 255, 0, 0.7)',
                            'rgba(0, 255, 0, 0.7)'
                        ]
                    }]
                },
                options: chartOptions
            });
        }

        // Sandwich Opportunities Chart
        const sandwichCtx = document.getElementById('sandwichChart');
        if (sandwichCtx) {
            sandwichChart = new Chart(sandwichCtx, {
                type: 'doughnut',
                data: {
                    labels: ['High', 'Med', 'Low'],
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
                    ...chartOptions,
                    cutout: '60%',
                    radius: '90%'
                }
            });
        }

        console.log('Charts initialized with optimized settings');
    } catch (error) {
        console.error('Error initializing charts:', error);
    }
}

// Optimize performance with throttling
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Throttle chart updates
const throttledChartUpdate = throttle(updateAllCharts, 1000);

// Update charts with throttling
setInterval(throttledChartUpdate, 2000);

function initializeAIDashboard() {
    // Update AI stats
    const aiStats = {
        'AI Success Rate': { value: '98.5%', min: 95, max: 99.9 },
        'Active Strategies': { value: '12', min: 8, max: 15 },
        'Patterns Identified': { value: '247', min: 200, max: 300 }
    };

    document.querySelectorAll('.ai-section .stat-value').forEach(stat => {
        const title = stat.parentElement.querySelector('h2').textContent;
        if (aiStats[title]) {
            animateValue(stat, 
                parseInt(stat.textContent) || 0,
                parseInt(aiStats[title].value) || 0,
                2000
            );
        }
    });

    // Initialize AI Performance Chart if not already initialized
    if (!aiPerformanceChart) {
        const ctx = document.getElementById('aiPerformanceChart');
        if (ctx) {
            aiPerformanceChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: Array(24).fill('').map((_, i) => `${23-i}h`),
                    datasets: [{
                        label: 'AI Performance',
                        data: Array(24).fill(0).map(() => getRandomData(85, 99)),
                        borderColor: '#ff00ff',
                        backgroundColor: 'rgba(255, 0, 255, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: false,
                            min: 80,
                            max: 100,
                            grid: { color: 'rgba(0, 255, 255, 0.1)' },
                            ticks: { color: '#00ffff' }
                        }
                    }
                }
            });
        }
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

    const leaderboardSection = document.querySelector('.leaderboard-section');
    if (!leaderboardSection.querySelector('.leaderboard-table')) {
        const table = document.createElement('div');
        table.className = 'leaderboard-table cyber-card';
        
        leaderboardData.forEach(entry => {
            const row = document.createElement('div');
            row.className = 'leaderboard-row';
            row.innerHTML = `
                <span class="rank">#${entry.rank}</span>
                <span class="address">${entry.address}</span>
                <span class="profit">${entry.profit} SOL</span>
                <span class="success">${entry.success}%</span>
                <span class="ops">${entry.ops}</span>
            `;
            table.appendChild(row);
        });
        
        leaderboardSection.appendChild(table);
    }
}

function initializeAnalytics() {
    const analyticsSection = document.querySelector('.analytics-section');
    if (!analyticsSection.querySelector('.analytics-grid')) {
        const grid = document.createElement('div');
        grid.className = 'analytics-grid';
        grid.innerHTML = `
            <div class="cyber-card">
                <h3 class="chart-title">Network Analysis</h3>
                <canvas id="networkAnalysisChart"></canvas>
            </div>
            <div class="cyber-card">
                <h3 class="chart-title">Performance Metrics</h3>
                <canvas id="performanceMetricsChart"></canvas>
            </div>
        `;
        analyticsSection.appendChild(grid);
        
        // Initialize charts
        initializeAnalyticsCharts();
    }
}

function initializeAlerts() {
    const alertsSection = document.querySelector('.alerts-section');
    if (!alertsSection.querySelector('.alerts-container')) {
        const container = document.createElement('div');
        container.className = 'alerts-container';
        container.innerHTML = `
            <div class="cyber-card">
                <h3>Live MEV Alerts</h3>
                <div class="alerts-feed"></div>
            </div>
        `;
        alertsSection.appendChild(container);
        
        // Add some sample alerts
        updateAlerts();
    }
}

function initializeStrategies() {
    const strategiesSection = document.querySelector('.strategy-section');
    if (!strategiesSection.querySelector('.strategies-grid')) {
        const grid = document.createElement('div');
        grid.className = 'strategies-grid';
        grid.innerHTML = `
            <div class="cyber-card">
                <h3>Active Strategies</h3>
                <div class="strategy-list"></div>
            </div>
            <div class="cyber-card">
                <h3>Strategy Performance</h3>
                <canvas id="strategyPerformanceChart"></canvas>
            </div>
        `;
        strategiesSection.appendChild(grid);
        
        // Initialize strategy data
        updateStrategies();
    }
}

function initializeTabs() {
    const tabs = document.querySelectorAll('.cyber-button');
    const sections = document.querySelectorAll('.content-section');

    // Initially hide all sections except statistics
    sections.forEach(section => {
        if (section.classList.contains('statistics-section')) {
            section.style.display = 'block';
            section.style.opacity = '1';
        } else {
            section.style.display = 'none';
            section.style.opacity = '0';
        }
    });

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetSection = tab.getAttribute('data-tab');

            // Update active state of tabs
            tabs.forEach(t => {
                t.classList.remove('active');
            });
            tab.classList.add('active');

            // Hide all sections
            sections.forEach(section => {
                if (section.classList.contains(`${targetSection}-section`)) {
                    section.style.display = 'block';
                    setTimeout(() => {
                        section.style.opacity = '1';
                    }, 50);
                } else {
                    section.style.opacity = '0';
                    setTimeout(() => {
                        section.style.display = 'none';
                    }, 300);
                }
            });

            // Initialize content for the selected section
            switch(targetSection) {
                case 'statistics':
                    updateAllStats();
                    updateAllCharts();
                    break;
                case 'ai':
                    initializeAIDashboard();
                    break;
                case 'leaderboard':
                    initializeLeaderboard();
                    break;
                case 'analytics':
                    initializeAnalytics();
                    break;
                case 'alerts':
                    initializeAlerts();
                    break;
                case 'strategy':
                    initializeStrategies();
                    break;
            }
        });
    });
}

function initializeSectionContent(section) {
    switch(section) {
        case 'statistics':
            updateAllStats();
            updateAllCharts();
            break;
        case 'ai':
            initializeAIDashboard();
            break;
        case 'leaderboard':
            initializeLeaderboard();
            break;
        case 'analytics':
            initializeAnalytics();
            break;
        case 'alerts':
            initializeAlerts();
            break;
        case 'strategy':
            initializeStrategies();
            break;
    }
}

// Add hexagonal background pattern to all sections
function addHexagonalBackground() {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        const hexGrid = document.createElement('div');
        hexGrid.className = 'hex-grid';
        section.appendChild(hexGrid);

        // Create hexagon elements
        for (let i = 0; i < 20; i++) {
            const hex = document.createElement('div');
            hex.className = 'hex';
            hex.style.left = `${Math.random() * 100}%`;
            hex.style.top = `${Math.random() * 100}%`;
            hex.style.animationDelay = `${Math.random() * 5}s`;
            hexGrid.appendChild(hex);
        }
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

// Generate random SOL profit between 0.05 and 14.92
function getRandomProfit() {
    return (Math.random() * (14.92 - 0.05) + 0.05).toFixed(2);
}

// Get random time within last 5 minutes
function getRandomTime() {
    const minutes = Math.floor(Math.random() * 5);
    return minutes === 0 ? 'Just now' : `${minutes}m ago`;
}

// Generate random volume
function getRandomVolume() {
    return Math.floor(Math.random() * (50000 - 1000) + 1000);
}

// Random DEX selection
function getRandomDEX() {
    const dexes = ['Raydium', 'Orca', 'Jupiter', 'Mango', 'Serum'];
    return dexes[Math.floor(Math.random() * dexes.length)];
}

// Random token pairs
function getRandomPair() {
    const tokens = ['SOL', 'USDC', 'BONK', 'JUP', 'RAY', 'ORCA'];
    const token1 = tokens[Math.floor(Math.random() * tokens.length)];
    let token2;
    do {
        token2 = tokens[Math.floor(Math.random() * tokens.length)];
    } while (token2 === token1);
    return `${token1}/${token2}`;
}

function updateLiveMEVActivity() {
    if (document.hidden) return; // Skip updates when page is not visible
    
    const activityFeed = document.querySelector('.mev-activity-feed');
    if (!activityFeed) return;

    const activityTypes = [
        {
            type: 'arbitrage',
            icon: 'fa-arrow-trend-up',
            template: () => ({
                description: `High-profit arbitrage opportunity on ${getRandomDEX()}`,
                details: `Profit: ${getRandomProfit()} SOL | Gas: ${Math.floor(Math.random() * 20 + 5)} GWEI`
            })
        },
        {
            type: 'sandwich',
            icon: 'fa-layer-group',
            template: () => ({
                description: `Sandwich attack executed on ${getRandomPair()}`,
                details: `Profit: ${getRandomProfit()} SOL | Risk: ${Math.random() > 0.5 ? 'Low' : 'Medium'}`
            })
        },
        {
            type: 'liquidity',
            icon: 'fa-water',
            template: () => ({
                description: `Large liquidity movement detected in ${getRandomPair()} pool`,
                details: `Volume: ${getRandomVolume()} SOL | DEX: ${getRandomDEX()}`
            })
        },
        {
            type: 'optimization',
            icon: 'fa-microchip',
            template: () => ({
                description: 'AI Strategy optimization completed',
                details: `Performance +${(Math.random() * 5).toFixed(1)}% | New patterns: ${Math.floor(Math.random() * 5 + 1)}`
            })
        }
    ];

    // Generate 10 random activities
    const activities = Array(10).fill(null).map(() => {
        const activityType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
        const { description, details } = activityType.template();
        return {
            time: getRandomTime(),
            icon: activityType.icon,
            description,
            details,
            priority: Math.random() > 0.7 ? 'high-priority' : Math.random() > 0.5 ? 'medium-priority' : ''
        };
    });

    // Sort by time (Just now first, then by minutes)
    activities.sort((a, b) => {
        if (a.time === 'Just now') return -1;
        if (b.time === 'Just now') return 1;
        return parseInt(a.time) - parseInt(b.time);
    });

    activityFeed.innerHTML = '';
    activities.forEach(activity => {
        const item = document.createElement('div');
        item.className = `activity-item ${activity.priority}`;
        item.innerHTML = `
            <div class="activity-time">${activity.time}</div>
            <div class="activity-description">
                <i class="fas ${activity.icon}"></i>
                ${activity.description}
                <div class="activity-details">${activity.details}</div>
            </div>
        `;
        activityFeed.appendChild(item);
    });
}

// Update activity feed every 5 seconds
setInterval(updateLiveMEVActivity, 5000);

// Initial call
updateLiveMEVActivity();

// Update intervals based on visibility
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Reduce update frequency when page is not visible
        clearInterval(chartUpdateInterval);
        clearInterval(activityUpdateInterval);
    } else {
        // Resume normal update frequency
        chartUpdateInterval = setInterval(updateAllCharts, 2000);
        activityUpdateInterval = setInterval(updateLiveMEVActivity, 5000);
    }
});

// Security Status Updates
function updateSecurityStatus() {
    const isSecure = window.location.protocol === 'https:';
    const secureBadge = document.querySelector('.secure-badge');
    if (secureBadge) {
        secureBadge.style.display = isSecure ? 'flex' : 'none';
    }
}

// Connection Status Updates
function updateConnectionStatus() {
    const statusIndicator = document.querySelector('.status-indicator');
    const statusText = document.querySelector('.status-text');
    
    if (window.solana && window.solana.isConnected) {
        statusIndicator.style.background = '#00ff00';
        statusIndicator.style.boxShadow = '0 0 10px #00ff00';
        statusText.textContent = 'Connected to Solana';
    } else {
        statusIndicator.style.background = '#ff0000';
        statusIndicator.style.boxShadow = '0 0 10px #ff0000';
        statusText.textContent = 'Disconnected';
    }
}

// Initialize Security Features
document.addEventListener('DOMContentLoaded', () => {
    updateSecurityStatus();
    updateConnectionStatus();
    
    // Update connection status periodically
    setInterval(updateConnectionStatus, 5000);
});

// Network Stats Update with smooth transitions
function updateNetworkStats() {
    const stats = {
        networkTPS: {
            elem: document.getElementById('networkTPS'),
            min: 4000,
            max: 5000,
            format: (val) => val.toLocaleString()
        },
        blockHeight: {
            elem: document.getElementById('blockHeight'),
            min: 219584932,
            max: 219585032,
            format: (val) => val.toLocaleString()
        },
        gasPrice: {
            elem: document.getElementById('gasPrice'),
            min: 0.000001,
            max: 0.000002,
            format: (val) => val.toFixed(6)
        },
        networkLatency: {
            elem: document.getElementById('networkLatency'),
            min: 10,
            max: 15,
            format: (val) => `${val}ms`
        }
    };

    Object.entries(stats).forEach(([key, stat]) => {
        if (stat.elem) {
            const currentValue = parseFloat(stat.elem.textContent.replace(/[^0-9.-]+/g, ""));
            const targetValue = stat.min + Math.random() * (stat.max - stat.min);
            
            animateValue(stat.elem, currentValue, targetValue, 2000, stat.format);
        }
    });
}

// Mini Charts for Stats
function initializeMiniCharts() {
    document.querySelectorAll('.stat-chart.mini').forEach(chart => {
        const ctx = document.createElement('canvas');
        chart.appendChild(ctx);
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array(10).fill(''),
                datasets: [{
                    data: Array(10).fill(0).map(() => Math.random() * 100),
                    borderColor: 'rgba(0, 255, 255, 0.5)',
                    borderWidth: 1,
                    fill: true,
                    backgroundColor: 'rgba(0, 255, 255, 0.1)',
                    tension: 0.4,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { display: false },
                    y: { display: false }
                },
                animation: false
            }
        });
    });
}

// MEV Distribution Chart
function initializeMEVDistributionChart() {
    const ctx = document.getElementById('mevDistributionChart');
    if (!ctx) return;

    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array(24).fill('').map((_, i) => `${23-i}h`),
            datasets: [
                {
                    label: 'Arbitrage',
                    data: Array(24).fill(0).map(() => Math.random() * 100),
                    borderColor: 'rgba(0, 255, 255, 1)',
                    backgroundColor: 'rgba(0, 255, 255, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Sandwich',
                    data: Array(24).fill(0).map(() => Math.random() * 100),
                    borderColor: 'rgba(255, 0, 255, 1)',
                    backgroundColor: 'rgba(255, 0, 255, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Liquidation',
                    data: Array(24).fill(0).map(() => Math.random() * 100),
                    borderColor: 'rgba(255, 255, 0, 1)',
                    backgroundColor: 'rgba(255, 255, 0, 0.1)',
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 51, 0.9)',
                    borderColor: 'rgba(0, 255, 255, 0.5)',
                    borderWidth: 1,
                    titleColor: '#00ffff',
                    bodyColor: '#fff',
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.raw.toFixed(1)} ops`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(0, 255, 255, 0.1)',
                        borderColor: 'rgba(0, 255, 255, 0.5)'
                    },
                    ticks: { color: '#00ffff' }
                },
                y: {
                    grid: {
                        color: 'rgba(0, 255, 255, 0.1)',
                        borderColor: 'rgba(0, 255, 255, 0.5)'
                    },
                    ticks: { color: '#00ffff' }
                }
            }
        }
    });
}

// Profit Analysis Chart
function initializeProfitAnalysisChart() {
    const ctx = document.getElementById('profitAnalysisChart');
    if (!ctx) return;

    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Array(24).fill('').map((_, i) => `${23-i}h`),
            datasets: [{
                label: 'Profit (SOL)',
                data: Array(24).fill(0).map(() => Math.random() * 20),
                backgroundColor: 'rgba(0, 255, 255, 0.3)',
                borderColor: 'rgba(0, 255, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 51, 0.9)',
                    borderColor: 'rgba(0, 255, 255, 0.5)',
                    borderWidth: 1,
                    titleColor: '#00ffff',
                    bodyColor: '#fff',
                    callbacks: {
                        label: function(context) {
                            return `Profit: ${context.raw.toFixed(2)} SOL`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(0, 255, 255, 0.1)',
                        borderColor: 'rgba(0, 255, 255, 0.5)'
                    },
                    ticks: { color: '#00ffff' }
                },
                y: {
                    grid: {
                        color: 'rgba(0, 255, 255, 0.1)',
                        borderColor: 'rgba(0, 255, 255, 0.5)'
                    },
                    ticks: { 
                        color: '#00ffff',
                        callback: function(value) {
                            return value.toFixed(1) + ' SOL';
                        }
                    }
                }
            }
        }
    });
}

// Initialize all charts
document.addEventListener('DOMContentLoaded', function() {
    initializeMiniCharts();
    const mevChart = initializeMEVDistributionChart();
    const profitChart = initializeProfitAnalysisChart();

    // Update network stats every 2 seconds
    setInterval(updateNetworkStats, 2000);

    // Update charts every 5 seconds
    setInterval(() => {
        if (mevChart && profitChart) {
            mevChart.data.datasets.forEach(dataset => {
                dataset.data = dataset.data.map(() => Math.random() * 100);
            });
            profitChart.data.datasets[0].data = profitChart.data.datasets[0].data.map(() => Math.random() * 20);
            
            mevChart.update('none');
            profitChart.update('none');
        }
    }, 5000);

    // Time filter functionality
    document.querySelectorAll('.time-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            // Update chart data based on selected time range
            // ... (implement time range filtering logic)
        });
    });
});