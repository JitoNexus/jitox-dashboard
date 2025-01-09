// Initialize variables for charts
let solChart = null;
let mevChart = null;
let sandwichChart = null;
let aiPerformanceChart = null;
let chartUpdateInterval = null;
let activityUpdateInterval = null;

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
            headers: { 'Content-Type': 'application/json' },
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

// Initialize Security Features
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Initialize security features first
        updateSecurityStatus();
        await updateConnectionStatus();
        
        // Check login status
        const user = localStorage.getItem('telegramUser');
        if (user) {
            document.body.classList.remove('not-logged');
            await initializeDashboard();
        } else {
            document.body.classList.add('not-logged');
        }
        
        // Set up intervals only if logged in
        if (!document.body.classList.contains('not-logged')) {
            setInterval(updateConnectionStatus, 10000);
            
            // Update charts if visible
            if (!document.hidden) {
                chartUpdateInterval = setInterval(updateAllCharts, 2000);
                activityUpdateInterval = setInterval(updateLiveMEVActivity, 5000);
            }
        }
    } catch (error) {
        console.error('Error during initialization:', error);
        document.body.classList.add('not-logged');
    }
});

// Telegram Authentication Handler
async function onTelegramAuth(user) {
    try {
        localStorage.setItem('telegramUser', JSON.stringify(user));
        document.body.classList.remove('not-logged');
        document.body.classList.add('loading');
        await initializeDashboard();
    } catch (error) {
        console.error('Error during authentication:', error);
        document.body.classList.add('not-logged');
    }
}

// Initialize dashboard with error handling
async function initializeDashboard() {
    try {
        const user = JSON.parse(localStorage.getItem('telegramUser'));
        if (!user) {
            throw new Error('No user data found');
        }

        await updateUserProfile(user);
        
        const statsSection = document.querySelector('.statistics-section');
        const aiSection = document.querySelector('.ai-section');
        
        if (statsSection) {
            initializeCharts();
            updateAllStats();
        }
        
        if (aiSection) {
            initializeAIDashboard();
        }
        
        document.body.classList.remove('loading');
    } catch (error) {
        console.error('Error initializing dashboard:', error);
        document.body.classList.add('not-logged');
        localStorage.removeItem('telegramUser');
    }
}

// Update user profile with error handling
async function updateUserProfile(user) {
    try {
        const elements = {
            photo: document.getElementById('userPhoto'),
            name: document.getElementById('userName'),
            id: document.getElementById('userId'),
            wallet: document.getElementById('userWallet'),
            balance: document.getElementById('walletBalance')
        };
        
        if (elements.photo) elements.photo.src = user.photo_url || '';
        if (elements.name) elements.name.textContent = user.username || 'Anonymous';
        if (elements.id) elements.id.textContent = user.id || 'Unknown';
        
        if (elements.wallet) {
            const wallet = await fetchUserWallet(user.id);
            elements.wallet.textContent = wallet || 'Not connected';
            
            if (wallet && elements.balance) {
                await updateWalletBalance(wallet, elements.balance);
            }
        }
    } catch (error) {
        console.error('Error updating profile:', error);
    }
}

// Fetch user's wallet information
async function fetchUserWallet(userId) {
    try {
        const apiUrl = window.location.hostname === 'localhost' 
            ? 'http://localhost:8000/get_wallet'
            : 'https://api.jitox.ai/get_wallet';
            
        const response = await fetch(`${apiUrl}?user_id=${userId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();
        return data.wallet;
    } catch (error) {
        console.error('Error fetching wallet:', error);
        return null;
    }
}