/**
 * JITOX TERMINAL - API MODULE
 * Dedicated module for all backend communication
 * Handles wallet polling, user data, and trading operations
 */

class JitoXAPI {
    constructor() {
        this.baseURL = 'https://api.jitox.ai';
        this.pollingInterval = null;
        this.pollingActive = false;
        this.maxRetries = 3;
        this.retryDelay = 1000; // 1 second
    }

    /**
     * Fetch user's wallet address from backend
     * @param {string} userId - Telegram user ID
     * @returns {Promise<Object>} Wallet data or error
     */
    async fetchWallet(userId) {
        try {
            console.log(`[API] Fetching wallet for user: ${userId}`);
            
            const response = await fetch(`${this.baseURL}/get_wallet?user_id=${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'JitoX-Terminal/1.0'
                },
                timeout: 10000 // 10 second timeout
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('[API] Wallet fetch successful:', data);
            
            return {
                success: true,
                data: data
            };

        } catch (error) {
            console.error('[API] Wallet fetch failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Start polling for wallet address
     * @param {string} userId - Telegram user ID
     * @param {Function} onSuccess - Callback for successful wallet fetch
     * @param {Function} onError - Callback for errors
     * @param {number} interval - Polling interval in milliseconds (default: 5000)
     */
    startWalletPolling(userId, onSuccess, onError, interval = 5000) {
        if (this.pollingActive) {
            console.log('[API] Polling already active, stopping previous instance');
            this.stopWalletPolling();
        }

        console.log(`[API] Starting wallet polling for user: ${userId}, interval: ${interval}ms`);
        this.pollingActive = true;

        const poll = async () => {
            if (!this.pollingActive) return;

            try {
                const result = await this.fetchWallet(userId);
                
                if (result.success && result.data.wallet) {
                    console.log('[API] Wallet found, stopping polling');
                    this.stopWalletPolling();
                    onSuccess(result.data);
                } else if (result.success && !result.data.wallet) {
                    // No wallet yet, continue polling
                    console.log('[API] No wallet found, continuing to poll...');
                } else {
                    // Error occurred
                    console.error('[API] Polling error:', result.error);
                    onError(result.error);
                }
            } catch (error) {
                console.error('[API] Polling exception:', error);
                onError(error.message);
            }
        };

        // Initial poll
        poll();

        // Set up interval
        this.pollingInterval = setInterval(poll, interval);
    }

    /**
     * Stop wallet polling
     */
    stopWalletPolling() {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
            this.pollingInterval = null;
        }
        this.pollingActive = false;
        console.log('[API] Wallet polling stopped');
    }

    /**
     * Fetch user's trading balance
     * @param {string} userId - Telegram user ID
     * @returns {Promise<Object>} Balance data or error
     */
    async fetchBalance(userId) {
        try {
            console.log(`[API] Fetching balance for user: ${userId}`);
            
            const response = await fetch(`${this.baseURL}/get_balance?user_id=${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'JitoX-Terminal/1.0'
                },
                timeout: 10000
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('[API] Balance fetch successful:', data);
            
            return {
                success: true,
                data: data
            };

        } catch (error) {
            console.error('[API] Balance fetch failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Fetch user's PNL data
     * @param {string} userId - Telegram user ID
     * @param {string} period - Time period (24h, 7d, 30d, all)
     * @returns {Promise<Object>} PNL data or error
     */
    async fetchPNL(userId, period = '24h') {
        try {
            console.log(`[API] Fetching PNL for user: ${userId}, period: ${period}`);
            
            const response = await fetch(`${this.baseURL}/get_pnl?user_id=${userId}&period=${period}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'JitoX-Terminal/1.0'
                },
                timeout: 10000
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('[API] PNL fetch successful:', data);
            
            return {
                success: true,
                data: data
            };

        } catch (error) {
            console.error('[API] PNL fetch failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Fetch recent operations/transactions
     * @param {string} userId - Telegram user ID
     * @param {string} filter - Filter type (all, arbitrage, sandwich, liquidation)
     * @param {number} limit - Number of operations to fetch (default: 10)
     * @returns {Promise<Object>} Operations data or error
     */
    async fetchOperations(userId, filter = 'all', limit = 10) {
        try {
            console.log(`[API] Fetching operations for user: ${userId}, filter: ${filter}, limit: ${limit}`);
            
            const response = await fetch(`${this.baseURL}/get_operations?user_id=${userId}&filter=${filter}&limit=${limit}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'JitoX-Terminal/1.0'
                },
                timeout: 10000
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('[API] Operations fetch successful:', data);
            
            return {
                success: true,
                data: data
            };

        } catch (error) {
            console.error('[API] Operations fetch failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Fetch global MEV statistics
     * @returns {Promise<Object>} MEV stats or error
     */
    async fetchMEVStats() {
        try {
            console.log('[API] Fetching global MEV statistics');
            
            const response = await fetch(`${this.baseURL}/get_mev_stats`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'JitoX-Terminal/1.0'
                },
                timeout: 10000
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('[API] MEV stats fetch successful:', data);
            
            return {
                success: true,
                data: data
            };

        } catch (error) {
            console.error('[API] MEV stats fetch failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Fetch SOL price from CoinGecko
     * @returns {Promise<number>} SOL price in USD
     */
    async fetchSOLPrice() {
        try {
            console.log('[API] Fetching SOL price from CoinGecko');
            
            const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'JitoX-Terminal/1.0'
                },
                timeout: 5000
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            const price = data.solana?.usd || 100; // Fallback to $100 if API fails
            
            console.log(`[API] SOL price fetch successful: $${price}`);
            return price;

        } catch (error) {
            console.error('[API] SOL price fetch failed:', error);
            return 100; // Fallback price
        }
    }

    /**
     * Submit deposit request
     * @param {string} userId - Telegram user ID
     * @param {number} amount - Amount in SOL
     * @returns {Promise<Object>} Deposit result or error
     */
    async submitDeposit(userId, amount) {
        try {
            console.log(`[API] Submitting deposit request for user: ${userId}, amount: ${amount} SOL`);
            
            const response = await fetch(`${this.baseURL}/submit_deposit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'JitoX-Terminal/1.0'
                },
                body: JSON.stringify({
                    user_id: userId,
                    amount: amount
                }),
                timeout: 15000
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('[API] Deposit submission successful:', data);
            
            return {
                success: true,
                data: data
            };

        } catch (error) {
            console.error('[API] Deposit submission failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Submit withdrawal request
     * @param {string} userId - Telegram user ID
     * @param {number} amount - Amount in SOL
     * @returns {Promise<Object>} Withdrawal result or error
     */
    async submitWithdrawal(userId, amount) {
        try {
            console.log(`[API] Submitting withdrawal request for user: ${userId}, amount: ${amount} SOL`);
            
            const response = await fetch(`${this.baseURL}/submit_withdrawal`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'JitoX-Terminal/1.0'
                },
                body: JSON.stringify({
                    user_id: userId,
                    amount: amount
                }),
                timeout: 15000
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('[API] Withdrawal submission successful:', data);
            
            return {
                success: true,
                data: data
            };

        } catch (error) {
            console.error('[API] Withdrawal submission failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get user's tier based on balance
     * @param {number} balance - User's balance in SOL
     * @returns {Object} Tier information
     */
    getUserTier(balance) {
        if (balance >= 15) {
            return {
                name: 'PREDATOR',
                level: 3,
                color: '#ff4444',
                description: 'Highest priority execution with all strategies unlocked'
            };
        } else if (balance >= 5) {
            return {
                name: 'OPERATOR',
                level: 2,
                color: '#ffbb00',
                description: 'Advanced sandwich patterns and priority routing'
            };
        } else if (balance > 0) {
            return {
                name: 'SCOUT',
                level: 1,
                color: '#00ffff',
                description: 'Basic arbitrage and sandwich operations'
            };
        } else {
            return {
                name: 'RECRUIT',
                level: 0,
                color: '#666666',
                description: 'No active deployment'
            };
        }
    }

    /**
     * Format wallet address for display
     * @param {string} address - Full wallet address
     * @returns {string} Formatted address (first 4 + last 4 characters)
     */
    formatWalletAddress(address) {
        if (!address || address.length < 8) return address;
        return `${address.slice(0, 4)}...${address.slice(-4)}`;
    }

    /**
     * Format SOL amount for display
     * @param {number} amount - Amount in SOL
     * @param {number} decimals - Number of decimal places (default: 2)
     * @returns {string} Formatted amount
     */
    formatSOLAmount(amount, decimals = 2) {
        if (typeof amount !== 'number') return '0.00';
        return amount.toFixed(decimals);
    }

    /**
     * Format USD amount for display
     * @param {number} amount - Amount in USD
     * @returns {string} Formatted amount with commas
     */
    formatUSDAmount(amount) {
        if (typeof amount !== 'number') return '$0.00';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }

    /**
     * Calculate time ago string
     * @param {Date} date - Date to calculate from
     * @returns {string} Time ago string
     */
    getTimeAgo(date) {
        if (!date) return 'Unknown';
        
        const now = new Date();
        const diff = now - date;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        if (minutes > 0) return `${minutes}m ago`;
        return 'Just now';
    }

    /**
     * Generate random profit for simulation
     * @returns {number} Random profit amount
     */
    generateRandomProfit() {
        // Exponential distribution favoring lower values
        const rand = Math.random();
        const minProfit = 0.2;
        const maxProfit = 14;
        const lambda = 0.5;
        const profit = minProfit + (-Math.log(1 - rand * 0.95) / lambda);
        return Math.min(profit, maxProfit);
    }

    /**
     * Generate random operation for simulation
     * @returns {Object} Random operation data
     */
    generateRandomOperation() {
        const operations = ['Arbitrage', 'Sandwich', 'Liquidation'];
        const dexes = ['Jupiter', 'Orca', 'Raydium', 'Serum'];
        const operation = operations[Math.floor(Math.random() * operations.length)];
        const dex = dexes[Math.floor(Math.random() * dexes.length)];
        const profit = this.generateRandomProfit();
        const time = new Date(Date.now() - Math.random() * 3600000); // Within last hour

        return {
            type: operation,
            dex: dex,
            profit: profit,
            time: time,
            status: 'completed'
        };
    }
}

// Create global API instance
window.jitoxAPI = new JitoXAPI();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JitoXAPI;
}
