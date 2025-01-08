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

function initializeLoadingSequence() {
    const loadingOverlay = document.querySelector('.loading-overlay');
    const mainContent = document.querySelector('.main-content');
    const progressBar = document.querySelector('.progress-bar');
    const progressPercentage = document.querySelector('.progress-percentage');
    const statusItems = document.querySelectorAll('.status-item');
    
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 1;
        if (progressPercentage) {
            progressPercentage.textContent = `${progress}%`;
        }
        
        // Update status items based on progress
        if (progress >= 30) statusItems[0].classList.add('completed');
        if (progress >= 60) statusItems[1].classList.add('completed');
        if (progress >= 90) statusItems[2].classList.add('completed');
        
        if (progress >= 100) {
            clearInterval(progressInterval);
            setTimeout(() => {
                document.body.classList.remove('loading');
                loadingOverlay.classList.add('hidden');
                mainContent.classList.add('visible');
            }, 500);
        }
    }, 30); // Adjust timing as needed
}

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
        const activeSection = document.querySelector('.content-section[style*="display: block"]');
        if (activeSection) {
            const sectionType = activeSection.classList[1].replace('-section', '');
            initializeSectionContent(sectionType);
        }
    }, 2000);
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
    if (!document.hidden) {
        // Only update charts if the page is visible
        if (solChart) solChart.update('none');
        if (mevChart) mevChart.update('none');
        if (sandwichChart) sandwichChart.update('none');
        if (aiPerformanceChart) aiPerformanceChart.update('none');
    }
}

function initializeCharts() {
    try {
        const commonOptions = {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: { 
                        color: '#00ffff',
                        font: {
                            family: 'Courier New',
                            size: 14
                        },
                        padding: 20
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 51, 0.9)',
                    titleColor: '#00ffff',
                    bodyColor: '#ffffff',
                    borderColor: '#ff00ff',
                    borderWidth: 1,
                    padding: 15,
                    displayColors: false,
                    titleFont: {
                        size: 16
                    },
                    bodyFont: {
                        size: 14
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
                            size: 14
                        },
                        padding: 10
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
                            size: 14
                        },
                        padding: 10
                    }
                }
            }
        };

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
                        tension: 0.4,
                        borderWidth: 3,
                        pointRadius: 5,
                        pointHoverRadius: 8
                    }]
                },
                options: commonOptions
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
                        data: [
                            getRandomData(10, 523),
                            getRandomData(24, 721),
                            getRandomData(10, 300),
                            getRandomData(5, 200)
                        ],
                        backgroundColor: [
                            'rgba(0, 255, 255, 0.7)',
                            'rgba(255, 0, 255, 0.7)',
                            'rgba(255, 255, 0, 0.7)',
                            'rgba(0, 255, 0, 0.7)'
                        ],
                        borderColor: [
                            '#00ffff',
                            '#ff00ff',
                            '#ffff00',
                            '#00ff00'
                        ],
                        borderWidth: 2,
                        borderRadius: 5
                    }]
                },
                options: {
                    ...commonOptions,
                    plugins: {
                        ...commonOptions.plugins,
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        ...commonOptions.scales,
                        y: {
                            ...commonOptions.scales.y,
                    grid: {
                                display: true,
                                color: 'rgba(0, 255, 255, 0.1)'
                            }
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
                        data: [35, 45, 20],
                        backgroundColor: [
                            'rgba(255, 0, 255, 0.8)',
                            'rgba(0, 255, 255, 0.8)',
                            'rgba(255, 255, 0, 0.8)'
                        ],
                        borderColor: '#000033',
                        borderWidth: 2,
                        hoverOffset: 15
                    }]
                },
                options: {
                    ...commonOptions,
                    cutout: '60%',
                    radius: '90%',
            plugins: {
                        ...commonOptions.plugins,
                legend: {
                            position: 'bottom',
                    labels: {
                                padding: 20,
                                font: {
                                    size: 14
                                }
                            }
                        }
                    }
                }
            }
        );

        console.log('Charts initialized successfully');
    } catch (error) {
        console.error('Error initializing charts:', error);
        document.querySelectorAll('.chart-card').forEach(card => {
            card.classList.add('error-state');
        });
    }
}

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

// Telegram Authentication Handler
async function onTelegramAuth(user) {
    // Save user data
    localStorage.setItem('telegramUser', JSON.stringify(user));
    
    // Remove not-logged class to show dashboard
    document.body.classList.remove('not-logged');
    document.body.classList.add('loading');
    
    // Initialize dashboard with user data
    await initializeDashboard(user);
}

// Check if user is already logged in
function checkLoginStatus() {
    const user = localStorage.getItem('telegramUser');
    if (user) {
        document.body.classList.remove('not-logged');
        document.body.classList.add('loading');
        initializeDashboard(JSON.parse(user));
    }
}

// Initialize dashboard with user data
async function initializeDashboard(user) {
    // Update header with user info
    updateUserProfile(user);
    
    // Initialize the rest of the dashboard
    initializeLoadingSequence();
}

// Update user profile information
function updateUserProfile(user) {
    console.log('Updating user profile with data:', user);
    
    // Update profile photo
    const userPhoto = document.getElementById('userPhoto');
    if (userPhoto) {
        if (user.photo_url) {
            userPhoto.src = user.photo_url;
            userPhoto.style.display = 'block';
        } else {
            userPhoto.src = 'https://via.placeholder.com/120x120.png?text=No+Photo';
        }
    }

    // Update user information
    const userName = document.getElementById('userName');
    const userId = document.getElementById('userId');
    
    if (userName) {
        const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
        userName.textContent = fullName || 'Anonymous';
    }
    
    if (userId) {
        userId.textContent = user.id || 'Not available';
    }

    // Fetch wallet information
    fetchUserWallet(user.id);
}

// Fetch user's wallet information
async function fetchUserWallet(userId) {
    try {
        const walletElement = document.getElementById('userWallet');
        const balanceElement = document.getElementById('walletBalance');
        
        if (walletElement && balanceElement) {
            walletElement.textContent = 'Fetching wallet...';
            balanceElement.textContent = '...';
            
            try {
                // Your bot's API endpoint
                const response = await fetch(`http://YOUR_SERVER_IP:8000/get_wallet?user_id=${userId}`);
                const data = await response.json();
                
                if (data && data.wallet) {
                    walletElement.textContent = data.wallet;
                    
                    // Fetch balance
                    await updateWalletBalance(data.wallet, balanceElement);
                } else {
                    walletElement.textContent = 'No wallet assigned';
                    balanceElement.textContent = '0 SOL';
                }
            } catch (error) {
                console.error('Error fetching from API:', error);
                walletElement.textContent = 'Error fetching wallet';
                balanceElement.textContent = 'Error';
            }
        }
    } catch (error) {
        console.error('Error in fetchUserWallet:', error);
    }
}

// Helper function to update wallet balance
async function updateWalletBalance(walletAddress, balanceElement) {
    try {
        const connection = new solanaWeb3.Connection('https://api.mainnet-beta.solana.com');
        const publicKey = new solanaWeb3.PublicKey(walletAddress);
        const balance = await connection.getBalance(publicKey);
        balanceElement.textContent = `${(balance / solanaWeb3.LAMPORTS_PER_SOL).toFixed(4)} SOL`;
    } catch (error) {
        console.error('Error fetching balance:', error);
        balanceElement.textContent = 'Error fetching balance';
    }
}

// Update user statistics with more realistic data
function updateUserStats() {
    const stats = {
        totalProfit: (Math.random() * 10).toFixed(2),
        totalOperations: Math.floor(Math.random() * 100),
        successRate: (Math.random() * 20 + 80).toFixed(1)
    };

    const elements = {
        totalProfit: document.getElementById('totalProfit'),
        totalOperations: document.getElementById('totalOperations'),
        successRate: document.getElementById('successRate')
    };

    if (elements.totalProfit) elements.totalProfit.textContent = `${stats.totalProfit} SOL`;
    if (elements.totalOperations) elements.totalOperations.textContent = stats.totalOperations;
    if (elements.successRate) elements.successRate.textContent = `${stats.successRate}%`;
}

// Update user stats every 30 seconds
setInterval(updateUserStats, 30000);

// Logout function
function logout() {
    localStorage.removeItem('telegramUser');
    window.location.reload();
}

// Call checkLoginStatus when page loads
document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
});

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