/**
 * JITOX TERMINAL - MAIN SCRIPT
 * Telegram Mini App integration and state management
 * Handles initialization, UI state, and real-time updates
 */

class JitoXTerminal {
    constructor() {
        this.user = null;
        this.wallet = null;
        this.balance = 0;
        this.currentState = 'armory';
        this.charts = {};
        this.updateIntervals = {};
        this.solPrice = 100; // Fallback price
        
        // Bind methods
        this.init = this.init.bind(this);
        this.handleTelegramUser = this.handleTelegramUser.bind(this);
        this.handleWalletSuccess = this.handleWalletSuccess.bind(this);
        this.handleWalletError = this.handleWalletError.bind(this);
        this.updateLastUpdateTime = this.updateLastUpdateTime.bind(this);
    }

    /**
     * Initialize the terminal
     */
    async init() {
        try {
            console.log('[TERMINAL] Initializing JitoX Terminal...');
            
            // Start initialization sequence
            await this.startInitializationSequence();
            
            // Initialize Telegram Mini App
            await this.initializeTelegram();
            
            // Wait for predator demonstration to complete
            setTimeout(() => {
                this.showMainTerminal();
                this.initializeUI();
            }, 6000);
            
    } catch (error) {
            console.error('[TERMINAL] Initialization failed:', error);
            this.showError('Initialization failed. Please refresh the page.');
        }
    }

    /**
     * Start the predator demonstration sequence
     */
    async startInitializationSequence() {
        console.log('[TERMINAL] Starting predator demonstration...');
        
        // Wait for coins to drift in and get absorbed
        setTimeout(() => {
            this.triggerShockwave();
        }, 2000);
        
        // Start profit counter animation
        setTimeout(() => {
            this.animateProfitCounter();
        }, 2500);
        
        // Complete sequence and transition
        setTimeout(() => {
            this.completePredatorDemo();
        }, 5000);
    }

    /**
     * Trigger the shockwave effect
     */
    triggerShockwave() {
        const shockwave = document.getElementById('shockwave');
        if (shockwave) {
            shockwave.style.animation = 'shockwave-expand 0.8s ease-out forwards';
        }
        
        // Make coins disappear when shockwave hits
        const coins = document.querySelectorAll('.sol-coin');
        coins.forEach((coin, index) => {
            setTimeout(() => {
                coin.style.opacity = '0';
                coin.style.transform = 'scale(0) translate(0, -50px)';
            }, 200 + (index * 100));
        });
    }

    /**
     * Animate the profit counter
     */
    animateProfitCounter() {
        const profitAmount = document.querySelector('.profit-amount');
        if (!profitAmount) return;
        
        const coins = document.querySelectorAll('.sol-coin');
        let totalProfit = 0;
        let currentIndex = 0;
        
        const updateCounter = () => {
            if (currentIndex < coins.length) {
                const coinValue = parseFloat(coins[currentIndex].dataset.value) || 0;
                totalProfit += coinValue;
                profitAmount.textContent = `+${totalProfit.toFixed(2)} SOL`;
                currentIndex++;
                setTimeout(updateCounter, 200);
            }
        };
        
        updateCounter();
    }

    /**
     * Complete the predator demonstration
     */
    completePredatorDemo() {
        console.log('[TERMINAL] Predator demonstration complete');
        // The transition will be handled by the main init sequence
    }

    /**
     * Show main terminal interface
     */
    showMainTerminal() {
        const initSequence = document.getElementById('initSequence');
        const mainTerminal = document.getElementById('mainTerminal');
        
        if (initSequence && mainTerminal) {
            initSequence.style.opacity = '0';
            setTimeout(() => {
                initSequence.classList.add('hidden');
                mainTerminal.classList.remove('hidden');
                mainTerminal.style.opacity = '1';
            }, 500);
        }
    }

    /**
     * Initialize Telegram Mini App
     */
    async initializeTelegram() {
        try {
            console.log('[TERMINAL] Initializing Telegram Mini App...');
            
            // Check if Telegram WebApp is available
            if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
                Telegram.WebApp.ready();
                Telegram.WebApp.expand();
                
                // Get user data
                const user = Telegram.WebApp.initDataUnsafe?.user;
                if (user) {
                    this.user = user;
                    this.handleTelegramUser(user);
            } else {
                    console.warn('[TERMINAL] No user data available from Telegram');
                    this.showError('Unable to authenticate with Telegram. Please open this app from the bot.');
            }
        } else {
                console.warn('[TERMINAL] Telegram WebApp not available, using fallback');
                this.showError('Telegram Mini App not detected. Please open this app from the bot.');
            }
            
        } catch (error) {
            console.error('[TERMINAL] Telegram initialization failed:', error);
            this.showError('Telegram initialization failed. Please refresh the page.');
        }
    }

    /**
     * Handle Telegram user data
     */
    handleTelegramUser(user) {
        console.log('[TERMINAL] Telegram user data received:', user);
        
        // Update operator info in header
        const operatorName = document.getElementById('operatorName');
        const operatorId = document.getElementById('operatorId');
        
        if (operatorName) {
            operatorName.textContent = user.username || 'Anonymous';
        }
        
        if (operatorId) {
            operatorId.textContent = user.id.toString();
        }
        
        // Start wallet polling
        this.startWalletPolling();
        
        // Start real-time updates
        this.startRealTimeUpdates();
    }

    /**
     * Start wallet polling
     */
    startWalletPolling() {
        if (!this.user) {
            console.error('[TERMINAL] No user data available for wallet polling');
            return;
        }

        console.log('[TERMINAL] Starting wallet polling...');
        
        jitoxAPI.startWalletPolling(
            this.user.id.toString(),
            this.handleWalletSuccess,
            this.handleWalletError,
            5000 // Poll every 5 seconds
        );
    }

    /**
     * Handle successful wallet fetch
     */
    handleWalletSuccess(walletData) {
        console.log('[TERMINAL] Wallet data received:', walletData);
        
        this.wallet = walletData.wallet;
        
        // Update wallet display
        const walletAddress = document.getElementById('walletAddress');
        const copyBtn = document.getElementById('copyAddressBtn');
        
        if (walletAddress && this.wallet) {
            const formattedAddress = jitoxAPI.formatWalletAddress(this.wallet);
            walletAddress.textContent = formattedAddress;
        }
        
        if (copyBtn) {
            copyBtn.classList.remove('hidden');
        }
        
        // Check if user has balance to determine state
        this.checkUserBalance();
    }

    /**
     * Handle wallet polling error
     */
    handleWalletError(error) {
        console.error('[TERMINAL] Wallet polling error:', error);
    }

    /**
     * Check user balance and determine terminal state
     */
    async checkUserBalance() {
        if (!this.user) return;
        
        try {
            const result = await jitoxAPI.fetchBalance(this.user.id.toString());
            
            if (result.success && result.data.balance !== undefined) {
                this.balance = parseFloat(result.data.balance) || 0;
            } else {
                console.warn('[TERMINAL] Balance check failed, using default state');
                this.balance = 0;
        }
    } catch (error) {
            console.error('[TERMINAL] Balance check error:', error);
            this.balance = 0;
        }
        
        // Update terminal state based on balance
        this.updateTerminalState();
    }

    /**
     * Update terminal state based on balance
     */
    updateTerminalState() {
        const armoryState = document.getElementById('armoryState');
        const warRoomState = document.getElementById('warRoomState');
        
        if (this.balance > 0) {
            // User has balance, show war room
            this.currentState = 'warroom';
            if (armoryState) armoryState.classList.add('hidden');
            if (warRoomState) warRoomState.classList.remove('hidden');
            
            // Initialize war room components
            this.initializeWarRoom();
        } else {
            // No balance, show armory
            this.currentState = 'armory';
            if (armoryState) armoryState.classList.remove('hidden');
            if (warRoomState) warRoomState.classList.add('hidden');
        }
        
        console.log(`[TERMINAL] State updated to: ${this.currentState}, balance: ${this.balance} SOL`);
    }

    /**
     * Initialize war room components
     */
    initializeWarRoom() {
        this.initializeCharts();
        this.initializeProfitTicker();
        this.updateBalanceDisplay();
        this.startWarRoomUpdates();
    }

    /**
     * Initialize charts
     */
    initializeCharts() {
        try {
        // Strategy Performance Chart
            const strategyCtx = document.getElementById('strategyChart')?.getContext('2d');
        if (strategyCtx) {
                this.charts.strategy = new Chart(strategyCtx, {
                type: 'line',
                data: {
                        labels: Array.from({length: 24}, (_, i) => `${i}:00`),
                    datasets: [
                        {
                            label: 'Arbitrage',
                                data: Array.from({length: 24}, () => 95 + Math.random() * 5),
                            borderColor: '#00ffff',
                            backgroundColor: 'rgba(0, 255, 255, 0.1)',
                            fill: true,
                            tension: 0.4
                        },
                        {
                            label: 'Sandwich',
                                data: Array.from({length: 24}, () => 90 + Math.random() * 8),
                        borderColor: '#ff00ff',
                            backgroundColor: 'rgba(255, 0, 255, 0.1)',
                        fill: true,
                            tension: 0.4
                        }
                    ]
                },
                options: {
                        responsive: true,
                        maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top',
                            labels: {
                                    color: '#ffffff',
                                    font: {
                                        family: 'JetBrains Mono'
                                    }
                                }
                            }
                        },
                        scales: {
                            x: {
                                grid: {
                                    color: 'rgba(255, 255, 255, 0.1)'
                                },
                                ticks: {
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    font: {
                                        family: 'JetBrains Mono'
                                    }
                                }
                            },
                            y: {
                                grid: {
                                    color: 'rgba(255, 255, 255, 0.1)'
                                },
                                ticks: {
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    font: {
                                        family: 'JetBrains Mono'
                                    }
                            }
                        }
                    },
                    animation: {
                        duration: 1000
                    }
                }
            });
        }

        // Pattern Recognition Chart
            const patternCtx = document.getElementById('patternChart')?.getContext('2d');
        if (patternCtx) {
                this.charts.pattern = new Chart(patternCtx, {
                type: 'radar',
                data: {
                    labels: ['Market Making', 'Arbitrage', 'Liquidations', 'Flash Loans', 'Sandwich', 'Other'],
                        datasets: [
                            {
                        label: 'Success Rate',
                        data: [85, 95, 75, 80, 90, 70],
                        borderColor: '#00ffff',
                        backgroundColor: 'rgba(0, 255, 255, 0.2)',
                        pointBackgroundColor: '#00ffff',
                        pointBorderColor: '#fff',
                        borderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6
                    },
                    {
                        label: 'Profit Potential',
                        data: [75, 90, 85, 70, 85, 65],
                        borderColor: '#ff00ff',
                        backgroundColor: 'rgba(255, 0, 255, 0.2)',
                        pointBackgroundColor: '#ff00ff',
                        pointBorderColor: '#fff',
                        borderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6
                            }
                        ]
                },
                options: {
                        responsive: true,
                        maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top',
                            labels: {
                                color: '#ffffff',
                                font: {
                                        family: 'JetBrains Mono'
                                    }
                                }
                        }
                    },
                    scales: {
                        r: {
                            min: 0,
                            max: 100,
                            beginAtZero: true,
                            angleLines: {
                                color: 'rgba(255, 255, 255, 0.1)',
                                lineWidth: 1
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)',
                                circular: true
                            },
                            pointLabels: {
                                color: '#ffffff',
                                font: {
                                        family: 'JetBrains Mono',
                                    size: 12,
                                    weight: 'bold'
                                }
                            },
                            ticks: {
                                color: '#ffffff',
                                backdropColor: 'transparent',
                                stepSize: 20,
                                font: {
                                        family: 'JetBrains Mono',
                                    size: 10
                                }
                            }
                        }
                    },
                    animation: {
                        duration: 2000,
                        easing: 'easeInOutQuart'
                    }
                }
            });
        }

            console.log('[TERMINAL] Charts initialized successfully');
    } catch (error) {
            console.error('[TERMINAL] Chart initialization failed:', error);
        }
    }

    /**
     * Initialize profit ticker
     */
    initializeProfitTicker() {
        const profitTicker = document.getElementById('profitTicker');
        if (!profitTicker) return;
        
        // Add initial ticker items
        for (let i = 0; i < 5; i++) {
            this.addProfitTickerItem();
        }
    }

    /**
     * Add profit ticker item
     */
    addProfitTickerItem() {
        const profitTicker = document.getElementById('profitTicker');
        if (!profitTicker) return;
        
        const operation = jitoxAPI.generateRandomOperation();
        const profit = jitoxAPI.generateRandomProfit();
        
        const tickerItem = document.createElement('div');
        tickerItem.className = 'ticker-item';
        tickerItem.innerHTML = `
            <div class="operation">${operation.type}: ${operation.dex}</div>
            <div class="profit">+${profit.toFixed(2)} SOL</div>
            <div class="time">${jitoxAPI.getTimeAgo(operation.time)}</div>
        `;
        
        // Add to top of ticker
        profitTicker.insertBefore(tickerItem, profitTicker.firstChild);
        
        // Remove old items if too many
        while (profitTicker.children.length > 10) {
            profitTicker.removeChild(profitTicker.lastChild);
        }
    }

    /**
     * Update balance display
     */
    updateBalanceDisplay() {
        const tradingBalance = document.getElementById('tradingBalance');
        const tradingBalanceUSD = document.getElementById('tradingBalanceUSD');
        const totalPNL = document.getElementById('totalPNL');
        const pnlPercentage = document.getElementById('pnlPercentage');
        
        if (tradingBalance) {
            tradingBalance.textContent = `${jitoxAPI.formatSOLAmount(this.balance)} SOL`;
        }
        
        if (tradingBalanceUSD) {
            const usdValue = this.balance * this.solPrice;
            tradingBalanceUSD.textContent = jitoxAPI.formatUSDAmount(usdValue);
        }
        
        // Simulate PNL (in production, this would come from API)
        const pnl = this.balance * 0.15; // 15% return simulation
        const pnlPercent = 15.0;
        
        if (totalPNL) {
            totalPNL.textContent = `+${jitoxAPI.formatSOLAmount(pnl)} SOL`;
        }
        
        if (pnlPercentage) {
            pnlPercentage.textContent = `+${pnlPercent.toFixed(2)}%`;
        }
    }

    /**
     * Start real-time updates
     */
    startRealTimeUpdates() {
        // Update last update time every second
        this.updateIntervals.lastUpdate = setInterval(this.updateLastUpdateTime, 1000);
        
        // Update SOL price every 30 seconds
        this.updateIntervals.solPrice = setInterval(async () => {
            this.solPrice = await jitoxAPI.fetchSOLPrice();
            this.updateBalanceDisplay();
        }, 30000);
        
        console.log('[TERMINAL] Real-time updates started');
    }

    /**
     * Start war room specific updates
     */
    startWarRoomUpdates() {
        if (this.currentState !== 'warroom') return;
        
        // Add new profit ticker items every 10 seconds
        this.updateIntervals.profitTicker = setInterval(() => {
            this.addProfitTickerItem();
        }, 10000);
        
        // Update charts every 20 seconds
        this.updateIntervals.charts = setInterval(() => {
            this.updateCharts();
        }, 20000);
        
        console.log('[TERMINAL] War room updates started');
    }

    /**
     * Update charts
     */
    updateCharts() {
        // Update Strategy Performance Chart
        if (this.charts.strategy) {
            this.charts.strategy.data.datasets.forEach(dataset => {
                dataset.data = dataset.data.map(value => 
                    Math.max(85, Math.min(100, value + (Math.random() - 0.5) * 2))
                );
            });
            this.charts.strategy.update('none');
        }
        
        // Update Pattern Recognition Chart
        if (this.charts.pattern) {
            this.charts.pattern.data.datasets.forEach(dataset => {
                dataset.data = dataset.data.map(value => 
                    Math.max(60, Math.min(100, value + (Math.random() - 0.5) * 3))
                );
            });
            this.charts.pattern.update('none');
        }
    }

    /**
     * Update last update time
     */
    updateLastUpdateTime() {
        const lastUpdate = document.getElementById('lastUpdate');
        if (lastUpdate) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            lastUpdate.textContent = timeString;
        }
    }

    /**
     * Initialize UI components
     */
    initializeUI() {
        // Mark as initialized
        console.log('[TERMINAL] UI initialization complete');
    }

    /**
     * Show error message
     */
    showError(message) {
        console.error('[TERMINAL] Error:', message);
        
        // Create error overlay
        const errorOverlay = document.createElement('div');
        errorOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            color: #ff4444;
            font-family: 'JetBrains Mono', monospace;
            text-align: center;
        `;
        
        errorOverlay.innerHTML = `
            <div>
                <h2>TERMINAL ERROR</h2>
                <p>${message}</p>
                <button onclick="location.reload()" style="
                    background: #6E56CF;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-top: 20px;
                ">RELOAD TERMINAL</button>
        </div>
    `;
    
        document.body.appendChild(errorOverlay);
    }

    /**
     * Cleanup intervals
     */
    cleanup() {
        Object.values(this.updateIntervals).forEach(interval => {
            if (interval) clearInterval(interval);
        });
        this.updateIntervals = {};
        
        // Stop wallet polling
        jitoxAPI.stopWalletPolling();
        
        console.log('[TERMINAL] Cleanup complete');
    }
}

// Global functions for HTML onclick handlers
window.copyWalletAddress = function() {
    if (window.jitoxTerminal && window.jitoxTerminal.wallet) {
        navigator.clipboard.writeText(window.jitoxTerminal.wallet)
            .then(() => {
                // Show success feedback
                const copyBtn = document.getElementById('copyAddressBtn');
                if (copyBtn) {
                    const originalText = copyBtn.textContent;
                    copyBtn.textContent = 'COPIED!';
                    copyBtn.style.background = '#00ff88';
                    
                    setTimeout(() => {
                        copyBtn.textContent = originalText;
                        copyBtn.style.background = '';
                    }, 2000);
                }
            })
            .catch(err => {
                console.error('Failed to copy wallet address:', err);
            });
    }
};

// Initialize terminal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('[TERMINAL] DOM loaded, initializing...');
    
    // Create global terminal instance
    window.jitoxTerminal = new JitoXTerminal();
    
    // Start initialization
    window.jitoxTerminal.init();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.jitoxTerminal) {
        window.jitoxTerminal.cleanup();
    }
});