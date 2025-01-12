// Global stats for persistence
let globalStats = JSON.parse(localStorage.getItem('globalStats')) || {
    totalProfit: 245.8,
    lastUpdate: Date.now()
};

// Helper function to get a random value within a range
function getRandomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

// Helper function to format numbers without decimals
function formatNumber(value) {
    return Math.round(value).toLocaleString();
}

// Helper function to get smoothed value changes
function getSmoothedValue(current, min, max) {
    const change = (Math.random() - 0.5) * (max - min) * 0.05;
    const newValue = current + change;
    return Math.max(min, Math.min(max, newValue));
}

// Initialize stats with random values within ranges
let previousStats = JSON.parse(localStorage.getItem('dashboardStats')) || {
    activeSearchers: Math.floor(getRandomInRange(200, 300)),
    activeMEV: Math.floor(getRandomInRange(1500, 2000)),
    ongoingArbitrage: Math.floor(getRandomInRange(100, 200)),
    ongoingSandwich: Math.floor(getRandomInRange(50, 150)),
    successRate: 98.7,
    avgProfit: getRandomInRange(0.2, 4),
    avgLatency: 0.12,
    patternsFound: Math.floor(getRandomInRange(162, 9182)),
    threatsBlocked: Math.floor(getRandomInRange(0, 1282)),
    uptime: getRandomInRange(98, 100)
};

// Function to update stats with controlled ranges
function updateStats() {
    const now = Date.now();
    const hoursSinceLastUpdate = (now - globalStats.lastUpdate) / (1000 * 60 * 60);
    
    // Update total profit with consistent upward trend
    const dailyIncrease = (10000 - globalStats.totalProfit) / 30; // Spread increase over 30 days
    globalStats.totalProfit += dailyIncrease * (hoursSinceLastUpdate / 24);
    globalStats.lastUpdate = now;
    
    // Update other stats within specified ranges
    previousStats = {
        activeSearchers: Math.floor(getSmoothedValue(previousStats.activeSearchers, 200, 300)),
        activeMEV: Math.floor(getSmoothedValue(previousStats.activeMEV, 1500, 2000)),
        ongoingArbitrage: Math.floor(getSmoothedValue(previousStats.ongoingArbitrage, 100, 200)),
        ongoingSandwich: Math.floor(getSmoothedValue(previousStats.ongoingSandwich, 50, 150)),
        successRate: Math.min(100, getSmoothedValue(previousStats.successRate, 98, 100)),
        avgProfit: getSmoothedValue(previousStats.avgProfit, 0.2, 4),
        avgLatency: 0.12,
        patternsFound: Math.floor(getSmoothedValue(previousStats.patternsFound, 162, 9182)),
        threatsBlocked: Math.floor(getSmoothedValue(previousStats.threatsBlocked, 0, 1282)),
        uptime: Math.min(100, getSmoothedValue(previousStats.uptime, 98, 100))
    };
    
    // Update DOM elements
    document.querySelectorAll('[data-stat]').forEach(element => {
        const stat = element.dataset.stat;
        let value = previousStats[stat];
        
        if (stat === 'avgProfit') {
            element.textContent = value.toFixed(1) + ' SOL';
        } else if (stat === 'successRate' || stat === 'uptime') {
            element.textContent = value.toFixed(2) + '%';
        } else if (stat === 'avgLatency') {
            element.textContent = value.toFixed(2) + 's';
        } else {
            element.textContent = formatNumber(value);
        }
    });
    
    // Save updated stats
    localStorage.setItem('dashboardStats', JSON.stringify(previousStats));
    localStorage.setItem('globalStats', JSON.stringify(globalStats));
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const loadingOverlay = document.querySelector('.loading-overlay');
    const mainContent = document.querySelector('.main-content');
    const progressBar = document.querySelector('.progress-bar');
    const progressPercentage = document.querySelector('.progress-percentage');
    const statusItems = document.querySelectorAll('.status-item');
    let progress = 0;

    // Show loading screen initially
    loadingOverlay.style.display = 'flex';
    mainContent.style.opacity = '0';

    // Handle tab switching
    document.querySelectorAll('.cyber-button[data-tab]').forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            
            // Update button states
            document.querySelectorAll('.cyber-button[data-tab]').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update section visibility
            document.querySelectorAll('.content-section').forEach(section => {
                section.style.display = section.id === targetTab ? 'block' : 'none';
            });
            
            // Refresh stats when switching to stats tab
            if (targetTab === 'stats') {
                updateStats();
            }
        });
    });

    // Initialize sections visibility
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = section.id === 'stats' ? 'block' : 'none';
    });

    // Simulate loading progress
    const interval = setInterval(() => {
        progress += 2;
        progressBar.style.width = `${progress}%`;
        progressPercentage.textContent = `${progress}%`;

        // Show status items progressively
        if (progress >= 30) statusItems[0].classList.add('visible');
        if (progress >= 60) statusItems[1].classList.add('visible');
        if (progress >= 90) statusItems[2].classList.add('visible');

        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                loadingOverlay.style.opacity = '0';
                loadingOverlay.style.visibility = 'hidden';
                mainContent.style.opacity = '1';
                
                // Initialize stats and start updates
                updateStats();
                setInterval(updateStats, 5000);
            }, 500);
        }
    }, 50);
});