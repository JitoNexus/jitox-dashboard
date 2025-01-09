// Initialize variables for charts
let solChart = null;
let mevChart = null;
let sandwichChart = null;
let aiPerformanceChart = null;
let chartUpdateInterval = null;
let activityUpdateInterval = null;

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
    if (sandwichChart) {
        sandwichChart.destroy();
        sandwichChart = null;
    }
    if (aiPerformanceChart) {
        aiPerformanceChart.destroy();
        aiPerformanceChart = null;
    }
}

// Security status check
function updateSecurityStatus() {
    const isSecure = window.location.protocol === 'https:';
    const secureBadge = document.querySelector('.secure-badge');
    if (secureBadge) {
        secureBadge.style.display = isSecure ? 'flex' : 'none';
    }
}

// Connection status check
async function updateConnectionStatus() {
    const statusIndicator = document.querySelector('.status-indicator');
    const statusText = document.querySelector('.status-text');
    
    try {
        const response = await fetch('https://api.mainnet-beta.solana.com', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR_API_KEY' // Replace with your API key
            },
            body: JSON.stringify({ "jsonrpc": "2.0", "id": 1, "method": "getHealth" })
        });
        
        if (response.ok) {
            statusIndicator.style.background = '#00ff00';
            statusIndicator.style.boxShadow = '0 0 10px #00ff00';
            statusText.textContent = 'Connected to Solana';
        } else {
            throw new Error('Network response was not ok');
        }
    } catch (error) {
        console.error('Connection error:', error);
        statusIndicator.style.background = '#ff0000';
        statusIndicator.style.boxShadow = '0 0 10px #ff0000';
        statusText.textContent = 'Disconnected';
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

// Update wallet balance
async function updateWalletBalance(wallet, balanceElement) {
    try {
        const response = await fetch('https://api.mainnet-beta.solana.com', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "jsonrpc": "2.0",
                "id": 1,
                "method": "getBalance",
                "params": [wallet]
            })
        });

        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        if (data.result?.value) {
            const balance = data.result.value / 1000000000; // Convert lamports to SOL
            balanceElement.textContent = `${balance.toFixed(2)} SOL`;
        } else {
            balanceElement.textContent = '0 SOL';
        }
    } catch (error) {
        console.error('Error fetching balance:', error);
        balanceElement.textContent = '0 SOL';
    }
}

// Initialize AI Dashboard
function initializeAIDashboard() {
    const aiPerformanceCtx = document.getElementById('aiPerformanceChart')?.getContext('2d');
    if (aiPerformanceCtx) {
        aiPerformanceChart = new Chart(aiPerformanceCtx, {
            type: 'line',
            data: {
                labels: ['6h', '5h', '4h', '3h', '2h', '1h'],
                datasets: [{
                    label: 'Success Rate',
                    data: [98, 97, 99, 98, 99, 98],
                    borderColor: '#00ffff',
                    tension: 0.4
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
                        beginAtZero: false,
                        min: 90,
                        max: 100,
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

// Utility function for random data
function getRandomData(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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

// Update user profile with error handling
async function updateUserProfile(user) {
    try {
        const elements = {
            photo: document.querySelector('#userPhoto'),
            name: document.querySelector('#userName'),
            id: document.querySelector('#userId'),
            wallet: document.querySelector('#userWallet'),
            balance: document.querySelector('#walletBalance')
        };
        
        // Update profile elements if they exist
        if (elements.photo && user.photo_url) elements.photo.src = user.photo_url;
        if (elements.name) elements.name.textContent = user.username || 'Anonymous';
        if (elements.id) elements.id.textContent = user.id || 'Unknown';
        
        // Mock wallet for development
        const mockWallet = '5FHwkrdxkjgwkGpF6jbQEdC3JDjKL6LYJfpwvfpHQDGe';
        if (elements.wallet) {
            elements.wallet.textContent = mockWallet;
            if (elements.balance) elements.balance.textContent = '0 SOL';
        }
        
        return true;
    } catch (error) {
        console.error('Error updating profile:', error);
        return false;
    }
}

// Initialize dashboard with error handling
async function initializeDashboard() {
    try {
        const user = JSON.parse(localStorage.getItem('telegramUser'));
        if (!user) {
            throw new Error('No user data found');
        }

        // Update profile first
        const profileUpdated = await updateUserProfile(user);
        if (!profileUpdated) {
            console.warn('Profile update failed, continuing with initialization');
        }
        
        // Initialize sections if they exist
        const statsSection = document.querySelector('.statistics-section');
        const aiSection = document.querySelector('.ai-section');
        
        if (statsSection) {
            destroyCharts(); // Ensure charts are destroyed before reinitializing
            initializeCharts();
            updateAllStats();
        }
        
        if (aiSection) {
            initializeAIDashboard();
        }

        // Show content after initialization
        document.body.classList.remove('loading');
        return true;
    } catch (error) {
        console.error('Error initializing dashboard:', error);
        document.body.classList.add('not-logged');
        document.body.classList.remove('loading');
        localStorage.removeItem('telegramUser');
        return false;
    }
}

// Telegram Authentication Handler
async function onTelegramAuth(user) {
    try {
        console.log('Telegram auth successful:', user);
        
        // Clear any existing state
        destroyCharts();
        if (chartUpdateInterval) clearInterval(chartUpdateInterval);
        if (activityUpdateInterval) clearInterval(activityUpdateInterval);
        
        // Save user data and update UI
        localStorage.setItem('telegramUser', JSON.stringify(user));
        document.body.classList.remove('not-logged');
        document.body.classList.add('loading');
        
        // Initialize dashboard
        const initialized = await initializeDashboard();
        if (!initialized) {
            throw new Error('Dashboard initialization failed');
        }
        
        // Set up intervals after successful login
        setInterval(updateConnectionStatus, 10000);
        if (!document.hidden) {
            chartUpdateInterval = setInterval(updateAllCharts, 2000);
            activityUpdateInterval = setInterval(updateLiveMEVActivity, 5000);
        }
        
        document.body.classList.remove('loading');
    } catch (error) {
        console.error('Error during authentication:', error);
        document.body.classList.add('not-logged');
        document.body.classList.remove('loading');
        localStorage.removeItem('telegramUser');
        
        // Show error message to user
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = 'Login failed. Please try again.';
        document.body.appendChild(errorMessage);
        setTimeout(() => errorMessage.remove(), 5000);
    }
}

// Initialize Security Features
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Initialize security features first
        updateSecurityStatus();
        
        // Check login status
        const user = localStorage.getItem('telegramUser');
        if (user) {
            document.body.classList.remove('not-logged');
            document.body.classList.add('loading');
            
            const initialized = await initializeDashboard();
            if (!initialized) {
                throw new Error('Dashboard initialization failed');
            }
            
            // Set up intervals only if logged in
            setInterval(updateConnectionStatus, 10000);
            
            // Update charts and activity if visible
            if (!document.hidden) {
                if (chartUpdateInterval) clearInterval(chartUpdateInterval);
                if (activityUpdateInterval) clearInterval(activityUpdateInterval);
                
                chartUpdateInterval = setInterval(updateAllCharts, 2000);
                activityUpdateInterval = setInterval(updateLiveMEVActivity, 5000);
            }
            
            document.body.classList.remove('loading');
        } else {
            document.body.classList.add('not-logged');
        }
    } catch (error) {
        console.error('Error during initialization:', error);
        document.body.classList.add('not-logged');
        document.body.classList.remove('loading');
        localStorage.removeItem('telegramUser');
    }
});