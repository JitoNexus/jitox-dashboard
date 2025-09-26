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
        this.isInitialized = false;
        this.currentState = 'armory'; // 'armory' or 'warroom'
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
            
            // Wait for initialization sequence to complete
            setTimeout(() => {
                this.showMainTerminal();
                this.initializeUI();
            }, 4000);
            
        } catch (error) {
            console.error('[TERMINAL] Initialization failed:', error);
            this.showError('Initialization failed. Please refresh the page.');
        }
    }

    /**
     * Start the initialization sequence
     */
    async startInitializationSequence() {
        const statusLines = document.querySelectorAll('.status-line');
        
        // Animate status lines
        statusLines.forEach((line, index) => {
            setTimeout(() => {
                line.style.opacity = '1';
                line.style.transform = 'translateX(0)';
            }, 500 + (index * 500));
        });
        
        // Show welcome message
        setTimeout(() => {
            const welcome = document.querySelector('.init-welcome');
            if (welcome) {
                welcome.style.opacity = '1';
            }
        }, 3000);
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
        const walletStatus = document.getElementById('walletStatus');
        
        if (walletAddress && this.wallet) {
            const formattedAddress = jitoxAPI.formatWalletAddress(this.wallet);
            walletAddress.innerHTML = `
                <span class="address-text" title="${this.wallet}">${formattedAddress}</span>
            `;
        }
        
        if (copyBtn) {
            copyBtn.classList.remove('hidden');
        }
        
        if (walletStatus) {
            walletStatus.innerHTML = `
                <i class="fas fa-circle status-dot" style="color: #00ff88;"></i>
                <span>Connected</span>
            `;
        }
        
        // Check if user has balance to determine state
        this.checkUserBalance();
    }

    /**
     * Handle wallet polling error
     */
    handleWalletError(error) {
        console.error('[TERMINAL] Wallet polling error:', error);
        
        const walletStatus = document.getElementById('walletStatus');
        if (walletStatus) {
            walletStatus.innerHTML = `
                <i class="fas fa-circle status-dot" style="color: #ff4444;"></i>
                <span>Error: ${error}</span>
            `;
        }
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
                this.updateTerminalState();
            } else {
                console.warn('[TERMINAL] Balance check failed, using default state');
                this.balance = 0;
                this.updateTerminalState();
            }
        } catch (error) {
            console.error('[TERMINAL] Balance check error:', error);
            this.balance = 0;
            this.updateTerminalState();
        }
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
        this.initializeProfitFeed();
        this.initializeOperations();
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
     * Initialize profit feed
     */
    initializeProfitFeed() {
        const profitFeed = document.getElementById('profitFeed');
        if (!profitFeed) return;
        
        // Add initial feed items
        for (let i = 0; i < 5; i++) {
            this.addProfitFeedItem();
        }
    }

    /**
     * Add profit feed item
     */
    addProfitFeedItem() {
        const profitFeed = document.getElementById('profitFeed');
        if (!profitFeed) return;
        
        const operation = jitoxAPI.generateRandomOperation();
        const profit = jitoxAPI.generateRandomProfit();
        
        const feedItem = document.createElement('div');
        feedItem.className = 'feed-item';
        feedItem.innerHTML = `
            <div class="operation">${operation.type}: ${operation.dex}</div>
            <div class="profit">+${profit.toFixed(2)} SOL</div>
            <div class="time">${jitoxAPI.getTimeAgo(operation.time)}</div>
        `;
        
        // Add to top of feed
        profitFeed.insertBefore(feedItem, profitFeed.firstChild);
        
        // Remove old items if too many
        while (profitFeed.children.length > 10) {
            profitFeed.removeChild(profitFeed.lastChild);
        }
    }

    /**
     * Initialize operations list
     */
    initializeOperations() {
        const operationsList = document.getElementById('operationsList');
        if (!operationsList) return;
        
        // Add initial operations
        for (let i = 0; i < 8; i++) {
            this.addOperationItem();
        }
    }

    /**
     * Add operation item
     */
    addOperationItem() {
        const operationsList = document.getElementById('operationsList');
        if (!operationsList) return;
        
        const operation = jitoxAPI.generateRandomOperation();
        const profit = jitoxAPI.generateRandomProfit();
        
        const operationItem = document.createElement('div');
        operationItem.className = 'operation-item';
        operationItem.innerHTML = `
            <div class="operation-details">
                <div class="operation-type">${operation.type}</div>
                <div class="operation-info">${operation.dex} • ${operation.status}</div>
            </div>
            <div class="operation-profit">+${profit.toFixed(2)} SOL</div>
            <div class="operation-time">${jitoxAPI.getTimeAgo(operation.time)}</div>
        `;
        
        // Add to top of list
        operationsList.insertBefore(operationItem, operationsList.firstChild);
        
        // Remove old items if too many
        while (operationsList.children.length > 15) {
            operationsList.removeChild(operationsList.lastChild);
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
            totalPNL.className = 'pnl-amount positive';
        }
        
        if (pnlPercentage) {
            pnlPercentage.textContent = `+${pnlPercent.toFixed(2)}%`;
            pnlPercentage.className = 'pnl-percentage positive';
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
        
        // Update metrics every 5 seconds
        this.updateIntervals.metrics = setInterval(() => {
            this.updateMetrics();
        }, 5000);
        
        // Add new profit feed items every 10 seconds
        this.updateIntervals.profitFeed = setInterval(() => {
            this.addProfitFeedItem();
        }, 10000);
        
        // Add new operations every 15 seconds
        this.updateIntervals.operations = setInterval(() => {
            this.addOperationItem();
        }, 15000);
        
        // Update charts every 20 seconds
        this.updateIntervals.charts = setInterval(() => {
            this.updateCharts();
        }, 20000);
        
        console.log('[TERMINAL] War room updates started');
    }

    /**
     * Update metrics
     */
    updateMetrics() {
        // Update Total Pooled SOL
        const totalPooled = document.getElementById('totalPooled');
        if (totalPooled) {
            const baseValue = 3760.5;
            const variation = (Math.random() - 0.5) * 100;
            const newValue = baseValue + variation;
            totalPooled.textContent = jitoxAPI.formatSOLAmount(newValue, 1);
        }
        
        // Update MEV Extracted
        const mevExtracted = document.getElementById('mevExtracted');
        if (mevExtracted) {
            const baseValue = 892.5;
            const variation = (Math.random() - 0.5) * 50;
            const newValue = baseValue + variation;
            mevExtracted.textContent = jitoxAPI.formatSOLAmount(newValue, 1);
        }
        
        // Update Active Strategies
        const activeStrategies = document.getElementById('activeStrategies');
        if (activeStrategies) {
            const baseValue = 12;
            const variation = Math.floor((Math.random() - 0.5) * 4);
            const newValue = Math.max(8, Math.min(16, baseValue + variation));
            activeStrategies.textContent = newValue.toString();
        }
        
        // Update Success Rate
        const successRate = document.getElementById('successRate');
        if (successRate) {
            const baseValue = 98.5;
            const variation = (Math.random() - 0.5) * 2;
            const newValue = Math.max(95, Math.min(100, baseValue + variation));
            successRate.textContent = `${jitoxAPI.formatSOLAmount(newValue, 1)}%`;
        }
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
        // Initialize chart controls
        this.initializeChartControls();
        
        // Initialize operations filter
        this.initializeOperationsFilter();
        
        // Initialize PNL period selector
        this.initializePNLPeriodSelector();
        
        // Mark as initialized
        this.isInitialized = true;
        
        console.log('[TERMINAL] UI initialization complete');
    }

    /**
     * Initialize chart controls
     */
    initializeChartControls() {
        const chartBtns = document.querySelectorAll('.chart-btn');
        chartBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                chartBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');
                
                // Update chart data based on period
                const period = btn.dataset.period;
                this.updateChartPeriod(period);
            });
        });
    }

    /**
     * Initialize operations filter
     */
    initializeOperationsFilter() {
        const operationsFilter = document.getElementById('operationsFilter');
        if (operationsFilter) {
            operationsFilter.addEventListener('change', (e) => {
                const filter = e.target.value;
                this.filterOperations(filter);
            });
        }
    }

    /**
     * Initialize PNL period selector
     */
    initializePNLPeriodSelector() {
        const pnlPeriod = document.getElementById('pnlPeriod');
        if (pnlPeriod) {
            pnlPeriod.addEventListener('change', (e) => {
                const period = e.target.value;
                this.updatePNLPeriod(period);
            });
        }
    }

    /**
     * Update chart period
     */
    updateChartPeriod(period) {
        console.log(`[TERMINAL] Updating chart period to: ${period}`);
        // In production, this would fetch new data from API
        // For now, just log the change
    }

    /**
     * Filter operations
     */
    filterOperations(filter) {
        console.log(`[TERMINAL] Filtering operations by: ${filter}`);
        // In production, this would filter the operations list
        // For now, just log the change
    }

    /**
     * Update PNL period
     */
    updatePNLPeriod(period) {
        console.log(`[TERMINAL] Updating PNL period to: ${period}`);
        // In production, this would fetch new PNL data from API
        // For now, just log the change
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
                    const originalText = copyBtn.innerHTML;
                    copyBtn.innerHTML = '<i class="fas fa-check"></i> COPIED!';
                    copyBtn.style.background = '#00ff88';
                    
                    setTimeout(() => {
                        copyBtn.innerHTML = originalText;
                        copyBtn.style.background = '';
                    }, 2000);
                }
            })
            .catch(err => {
                console.error('Failed to copy wallet address:', err);
            });
    }
};

window.toggleTerminalState = function() {
    if (window.jitoxTerminal) {
        // Toggle between armory and war room for development
        if (window.jitoxTerminal.currentState === 'armory') {
            window.jitoxTerminal.balance = 10; // Simulate balance
            window.jitoxTerminal.updateTerminalState();
        } else {
            window.jitoxTerminal.balance = 0;
            window.jitoxTerminal.updateTerminalState();
        }
    }
};

window.showDepositModal = function() {
    alert('Deposit functionality will be implemented in production.');
};

window.showWithdrawModal = function() {
    alert('Withdrawal functionality will be implemented in production.');
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
