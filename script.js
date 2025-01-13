// Global variables for charts and previous values
let solChart, mevChart, sandwichChart, aiPerformanceChart, volumeChart, networkChart;
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

// Chart Configurations
const chartDefaults = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
        duration: 1000,
        easing: 'easeInOutQuart'
    },
    plugins: {
        legend: {
            display: false
        },
        tooltip: {
            enabled: true,
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(16, 20, 24, 0.95)',
            titleColor: '#fff',
            bodyColor: 'rgba(255, 255, 255, 0.8)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            padding: 12,
            boxPadding: 6,
            usePointStyle: true,
            callbacks: {
                label: function(context) {
                    let label = context.dataset.label || '';
                    if (label) {
                        label += ': ';
                    }
                    label += context.parsed.y.toFixed(2);
                    return label;
                }
            }
        }
    },
    scales: {
        x: {
            grid: {
                color: 'rgba(255, 255, 255, 0.05)',
                drawBorder: false
            },
            ticks: {
                color: 'rgba(255, 255, 255, 0.6)'
            }
        },
        y: {
            grid: {
                color: 'rgba(255, 255, 255, 0.05)',
                drawBorder: false
            },
            ticks: {
                color: 'rgba(255, 255, 255, 0.6)',
                callback: function(value) {
                    return value.toLocaleString();
                }
            }
        }
    }
};

// Create gradient for charts
function createGradient(ctx, colorStart, colorEnd) {
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, colorStart);
    gradient.addColorStop(1, colorEnd);
    return gradient;
}

// Initialize Network Activity Chart
function initializeNetworkChart() {
    const ctx = document.getElementById('networkActivityChart').getContext('2d');
    const gradient = createGradient(ctx, 'rgba(0, 240, 255, 0.5)', 'rgba(0, 240, 255, 0)');
    
    networkChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array(24).fill('').map((_, i) => `${i}:00`),
            datasets: [{
                label: 'Network Activity',
                data: Array(24).fill(0).map(() => Math.random() * 1000 + 500),
                borderColor: '#00f0ff',
                backgroundColor: gradient,
                borderWidth: 2,
                pointRadius: 0,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            ...chartDefaults,
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// Initialize Volume Distribution Chart
function initializeVolumeChart() {
    const ctx = document.getElementById('volumeDistributionChart').getContext('2d');
    const gradient = createGradient(ctx, 'rgba(0, 255, 136, 0.5)', 'rgba(0, 255, 136, 0)');
    
    volumeChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['DEX', 'Lending', 'NFT', 'Options', 'Other'],
            datasets: [{
                label: 'Volume Distribution',
                data: [45, 25, 15, 10, 5],
                backgroundColor: gradient,
                borderColor: '#00ff88',
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            ...chartDefaults,
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    max: 50,
                    ticks: {
                        callback: value => `${value}%`
                    }
                }
            }
        }
    });
}

// Update Network Stats
function updateNetworkStats() {
    const tpsElement = document.getElementById('currentTPS');
    if (tpsElement) {
        setInterval(() => {
            const newTPS = Math.floor(Math.random() * 500) + 2000;
            tpsElement.textContent = newTPS.toLocaleString();
            
            // Animate the value change
            tpsElement.style.transform = 'scale(1.1)';
            setTimeout(() => {
                tpsElement.style.transform = 'scale(1)';
            }, 200);
        }, 3000);
    }
}

// Initialize Time Selector
function initializeTimeSelector() {
    const timeButtons = document.querySelectorAll('.time-selector button');
    timeButtons.forEach(button => {
        button.addEventListener('click', () => {
            timeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            // Update chart data based on selected time range
            updateChartData(button.textContent);
        });
    });
}

// Initialize Chart Controls
function initializeChartControls() {
    const expandButtons = document.querySelectorAll('.chart-control-btn');
    expandButtons.forEach(button => {
        button.addEventListener('click', function() {
            const chartContainer = this.closest('.chart-card');
            if (chartContainer) {
                chartContainer.classList.toggle('expanded');
                // Update chart size when expanded
                Chart.instances.forEach(chart => chart.resize());
            }
        });
    });
}

// Initialize all components
document.addEventListener('DOMContentLoaded', () => {
    initializeNetworkChart();
    initializeVolumeChart();
    updateNetworkStats();
    initializeTimeSelector();
    initializeChartControls();
    
    // Add smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});

// Wait for document to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize loading sequence
    initializeLoadingSequence();
    
    // Initialize other components
    initializeCharts();
    initializeTabs();
    addHexagonalBackground();
    startContinuousUpdates();
    
    // Add scroll event listener
    document.addEventListener('scroll', () => {
        throttleScroll(() => {
            // Add any scroll-based animations or updates here
        });
    }, { passive: true });
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

function getSmoothedValue(currentValue, targetValue, maxChangePercent) {
    const difference = targetValue - currentValue;
    const maxChange = Math.abs(currentValue * maxChangePercent);
    if (Math.abs(difference) <= maxChange) return targetValue;
    return currentValue + (Math.sign(difference) * maxChange);
}

function initializeLoadingSequence() {
    const loadingOverlay = document.querySelector('.loading-overlay');
    const mainContent = document.querySelector('.main-content');
    const progressBar = document.querySelector('.progress-bar');
    const progressPercentage = document.querySelector('.progress-percentage');
    const statusItems = document.querySelectorAll('.status-item');
    
    if (!loadingOverlay || !mainContent || !progressBar || !progressPercentage) {
        console.error('Required elements not found');
        return;
    }
    
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 1;
        progressPercentage.textContent = `${progress}%`;
        
        // Update status items based on progress
        if (statusItems.length > 0 && progress >= 30) statusItems[0].classList.add('completed');
        if (statusItems.length > 1 && progress >= 60) statusItems[1].classList.add('completed');
        if (statusItems.length > 2 && progress >= 90) statusItems[2].classList.add('completed');
        
        if (progress >= 100) {
            clearInterval(progressInterval);
            setTimeout(() => {
                document.body.classList.remove('loading');
                loadingOverlay.classList.add('hidden');
                mainContent.classList.add('visible');
            }, 500);
        }
    }, 30);
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
    
    function easeOutExpo(x) {
        return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
    }
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easedProgress = easeOutExpo(progress);
        const current = Math.floor(start + (range * easedProgress));
        
        element.textContent = current.toLocaleString();
        element.style.textShadow = `0 0 ${10 * (1 - progress)}px rgba(0, 255, 255, ${0.5 * (1 - progress)})`;
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// Update stats every 10 seconds
setInterval(updateAllStats, 10000);

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
        // SOL Gained Chart with enhanced visuals
        const solCtx = document.getElementById('solGainedChart')?.getContext('2d');
        if (solCtx) {
            const solGradient = createGradient(solCtx, 'rgba(255, 0, 255, 0.5)', 'rgba(255, 0, 255, 0)');

            solChart = new Chart(solCtx, {
                type: 'line',
                data: {
                    labels: Array(24).fill('').map((_, i) => `${23-i}h`),
                    datasets: [{
                        data: Array(24).fill(0).map(() => getRandomData(100, 1000)),
                        borderColor: '#ff00ff',
                        backgroundColor: solGradient,
                        fill: true,
                        pointBackgroundColor: '#ff00ff',
                        pointBorderColor: '#ffffff'
                    }]
                },
                options: {
                    ...chartDefaults,
                    plugins: {
                        ...chartDefaults.plugins,
                        tooltip: {
                            ...chartDefaults.plugins.tooltip,
                            callbacks: {
                                label: function(context) {
                                    return `SOL Gained: ${context.parsed.y.toFixed(2)}`;
                                }
                            }
                        }
                    }
                }
            });
        }

        // Initialize other charts
        initializeNetworkChart();
        initializeVolumeChart();
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

// Loading Screen Initialization
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing loading screen');
    
    const loadingContainer = document.getElementById('loadingContainer');
    const mainContent = document.querySelector('.main-content');
    
    if (!loadingContainer || !mainContent) {
        console.error('Loading screen elements not found');
        return;
    }

    // Ensure loading container is visible and main content is hidden
    loadingContainer.style.display = 'flex';
    mainContent.style.display = 'none';
    document.body.style.overflow = 'hidden';
    
    // Create particles
    const particlesContainer = document.getElementById('cyberParticles');
    if (particlesContainer) {
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'cyber-particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 10}s`;
            particlesContainer.appendChild(particle);
        }
    }
    
    // Initialize progress
    let currentProgress = 0;
    const progress = document.getElementById('loadingProgress');
    const statusItems = document.querySelectorAll('.status-item');
    
    if (progress) {
        const interval = setInterval(() => {
            currentProgress += 1;
            progress.style.width = `${currentProgress}%`;
            
            // Update status items
            if (currentProgress >= 30 && statusItems[0]) statusItems[0].classList.add('completed');
            if (currentProgress >= 60 && statusItems[1]) statusItems[1].classList.add('completed');
            if (currentProgress >= 90 && statusItems[2]) statusItems[2].classList.add('completed');
            
            if (currentProgress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    loadingContainer.style.display = 'none';
                    mainContent.style.display = 'block';
                    document.body.style.overflow = 'auto';
                    mainContent.classList.add('visible');
                    
                    // Initialize main content
                    initializeCharts();
                    initializeTimeSelector();
                    initializeChartControls();
                    startUpdates();
                }, 500);
            }
        }, 30);
    }
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

// Initialize advanced charts
function initializeAdvancedCharts() {
    // SOL Gained Chart with enhanced visuals
    const solCtx = document.getElementById('solGainedChart')?.getContext('2d');
    if (solCtx) {
        const solGradient = createGradient(solCtx, [
            'rgba(255, 0, 255, 0.5)',
            'rgba(255, 0, 255, 0.1)',
            'rgba(255, 0, 255, 0)'
        ]);

        solChart = new Chart(solCtx, {
            type: 'line',
            data: {
                labels: Array(24).fill('').map((_, i) => `${23-i}h`),
                datasets: [{
                    data: Array(24).fill(0).map(() => getRandomData(100, 1000)),
                    borderColor: '#ff00ff',
                    backgroundColor: solGradient,
                    fill: true,
                    pointBackgroundColor: '#ff00ff',
                    pointBorderColor: '#ffffff'
                }]
            },
            options: {
                ...advancedChartOptions,
                plugins: {
                    ...advancedChartOptions.plugins,
                    tooltip: {
                        ...advancedChartOptions.plugins.tooltip,
                        callbacks: {
                            label: function(context) {
                                return `SOL Gained: ${context.parsed.y.toFixed(2)}`;
                            }
                        }
                    }
                }
            }
        });
    }

    // Network Activity Chart (New)
    const networkCtx = document.getElementById('networkActivityChart')?.getContext('2d');
    if (networkCtx) {
        const networkGradient = createGradient(networkCtx, [
            'rgba(0, 255, 255, 0.5)',
            'rgba(0, 255, 255, 0.1)',
            'rgba(0, 255, 255, 0)'
        ]);

        networkChart = new Chart(networkCtx, {
            type: 'line',
            data: {
                labels: Array(60).fill('').map((_, i) => `${i}s`),
                datasets: [{
                    data: Array(60).fill(0).map(() => getRandomData(50, 200)),
                    borderColor: '#00ffff',
                    backgroundColor: networkGradient,
                    fill: true,
                    pointBackgroundColor: '#00ffff',
                    pointBorderColor: '#ffffff'
                }]
            },
            options: {
                ...advancedChartOptions,
                animation: {
                    duration: 0
                },
                plugins: {
                    ...advancedChartOptions.plugins,
                    tooltip: {
                        ...advancedChartOptions.plugins.tooltip,
                        callbacks: {
                            label: function(context) {
                                return `TPS: ${context.parsed.y.toFixed(0)}`;
                            }
                        }
                    }
                }
            }
        });
    }

    // Volume Distribution Chart (New)
    const volumeCtx = document.getElementById('volumeDistributionChart')?.getContext('2d');
    if (volumeCtx) {
        volumeChart = new Chart(volumeCtx, {
            type: 'polarArea',
            data: {
                labels: ['DEX-A', 'DEX-B', 'DEX-C', 'DEX-D', 'Others'],
                datasets: [{
                    data: [45, 25, 15, 10, 5],
                    backgroundColor: [
                        'rgba(255, 0, 255, 0.7)',
                        'rgba(0, 255, 255, 0.7)',
                        'rgba(255, 255, 0, 0.7)',
                        'rgba(0, 255, 0, 0.7)',
                        'rgba(255, 165, 0, 0.7)'
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        ticks: {
                            display: false
                        },
                        grid: {
                            color: 'rgba(0, 255, 255, 0.1)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: '#00ffff',
                            font: {
                                family: 'Courier New',
                                size: 11
                            }
                        }
                    }
                }
            }
        });
    }
}

// Real-time network stats update
function updateNetworkStats() {
    if (networkChart && !document.hidden) {
        const newData = getRandomData(50, 200);
        networkChart.data.datasets[0].data.shift();
        networkChart.data.datasets[0].data.push(newData);
        networkChart.update('none');
    }
}

// Start real-time updates
setInterval(updateNetworkStats, 1000);