// Wait for all resources to load
window.addEventListener('load', () => {
    console.log('Window loaded, starting initialization...');
    initializeTelegramLogin();
    checkExistingSession();
    
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.error('Chart.js not loaded');
        document.body.innerHTML = `
            <div style="color: white; padding: 20px; text-align: center;">
                <h1>Loading Error</h1>
                <p>Required libraries not loaded. Please check your internet connection and refresh the page.</p>
            </div>
        `;
        return;
    }

    // Replace placeholder image with a data URI
    const userPhoto = document.getElementById('userPhoto');
    if (userPhoto) {
        userPhoto.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiMyQjI2NDAiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjM1IiByPSIyMCIgZmlsbD0iIzZFNTZDRiIvPjxwYXRoIGQ9Ik0xMCw5MCBDMTAsOTAgNDUsNzAgOTAsOTAgTDkwLDEwMCBMMTAsMTAwIFoiIGZpbGw9IiM2RTU2Q0YiLz48L3N2Zz4=';
        userPhoto.onerror = function() {
            this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiMyQjI2NDAiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjM1IiByPSIyMCIgZmlsbD0iIzZFNTZDRiIvPjxwYXRoIGQ9Ik0xMCw5MCBDMTAsOTAgNDUsNzAgOTAsOTAgTDkwLDEwMCBMMTAsMTAwIFoiIGZpbGw9IiM2RTU2Q0YiLz48L3N2Zz4=';
        };
    }

    initializeLoadingSequence();
});

// Telegram Login Configuration
function initializeTelegramLogin() {
    console.log('Initializing Telegram login...');
    const telegramLoginDiv = document.getElementById('telegram-login');
    if (!telegramLoginDiv) {
        console.error('Telegram login div not found');
        return;
    }

    // Clear any existing content
    telegramLoginDiv.innerHTML = '';

    try {
        // Create Telegram Login button
        const script = document.createElement('script');
        script.async = false; // Changed to false to ensure sequential loading
        script.src = "https://telegram.org/js/telegram-widget.js?22";
        script.setAttribute('data-telegram-login', 'jitoxai_bot');
        script.setAttribute('data-size', 'large');
        script.setAttribute('data-radius', '8');
        script.setAttribute('data-request-access', 'write');
        script.setAttribute('data-userpic', 'true');
        script.setAttribute('data-onauth', 'window.onTelegramAuth(user)');
        script.setAttribute('data-auth-type', 'popup');
        
        // Insert the widget
        telegramLoginDiv.appendChild(script);
        console.log('Telegram login widget initialized');
    } catch (error) {
        console.error('Error initializing Telegram login:', error);
    }
}

// Handle Telegram Authentication - Global function
window.onTelegramAuth = function(user) {
    console.log('Telegram auth callback received:', user);
    
    try {
        // Validate the authentication data
        if (!user || !user.id) {
            console.error('Invalid authentication data received');
            return;
        }
        
        // Store user data first
        localStorage.setItem('telegramUser', JSON.stringify(user));
        console.log('User data stored in localStorage');
        
        // Update UI elements
        const loginStatus = document.getElementById('loginStatus');
        const userName = document.getElementById('userName');
        const userId = document.getElementById('userId');
        const userInfo = document.getElementById('userInfo');
        const telegramLogin = document.querySelector('.telegram-login');
        
        if (loginStatus) loginStatus.textContent = 'Connected';
        if (userName) userName.textContent = user.username || 'Anonymous';
        if (userId) userId.textContent = user.id;
        
        // Show user info and hide login button
        if (userInfo) {
            userInfo.style.display = 'block';
            userInfo.classList.add('visible');
        }
        if (telegramLogin) telegramLogin.style.display = 'none';
        
        // Update profile avatar if available
        if (user.photo_url) {
            const avatar = document.querySelector('.profile-avatar');
            if (avatar) {
                avatar.innerHTML = `<img src="${user.photo_url}" alt="Profile Photo">`;
            }
        }
        
        // Fetch wallet info if available
        fetchUserWallet(user.id);
        
        console.log('Login successful, UI updated');
    } catch (error) {
        console.error('Error in Telegram auth callback:', error);
    }
};

// Check for existing session on page load
function checkExistingSession() {
    console.log('Checking for existing session...');
    try {
        const savedUser = localStorage.getItem('telegramUser');
        if (savedUser) {
            const user = JSON.parse(savedUser);
            console.log('Found existing session:', user);
            window.onTelegramAuth(user);
        } else {
            console.log('No existing session found');
            // Show login button
            const telegramLogin = document.querySelector('.telegram-login');
            if (telegramLogin) telegramLogin.style.display = 'block';
        }
    } catch (error) {
        console.error('Error checking existing session:', error);
        localStorage.removeItem('telegramUser');
    }
}

// Initialize everything when the window loads
window.addEventListener('load', () => {
    console.log('Window loaded, starting initialization...');
    try {
        initializeTelegramLogin();
        checkExistingSession();
    } catch (error) {
        console.error('Error during initialization:', error);
    }
});

// Fetch user's wallet information
async function fetchUserWallet(userId) {
    try {
        console.log('Fetching wallet for user:', userId);
        const response = await fetch(`https://api.jitox.ai/get_wallet?user_id=${userId}`);
        const walletElement = document.getElementById('userWallet');
        
        if (!walletElement) {
            console.error('Wallet element not found');
            return;
        }

        console.log('API Response:', response);
        
        if (response.ok) {
            const data = await response.json();
            console.log('Wallet data:', data);
            
            if (data.wallet) {
                // Display the wallet with proper formatting
                const shortWallet = `${data.wallet.slice(0, 4)}...${data.wallet.slice(-4)}`;
                walletElement.innerHTML = `
                    <span title="${data.wallet}" style="cursor: pointer" onclick="copyWallet('${data.wallet}')">
                        ${shortWallet} <i class="fas fa-copy"></i>
                    </span>`;
            } else {
                // No wallet found, show instructions with bot username
                walletElement.innerHTML = `
                    <span style="color: #ff9800">
                        Use /get_wallet in @jitoxai_bot
                    </span>`;
            }
        } else {
            console.error('API error:', response.status, response.statusText);
            // API error, show instructions with bot username
            walletElement.innerHTML = `
                <span style="color: #ff9800">
                    Use /get_wallet in @jitoxai_bot
                </span>`;
        }
    } catch (error) {
        console.error('Error fetching wallet:', error);
        // Network error, show instructions with bot username
        const walletElement = document.getElementById('userWallet');
        if (walletElement) {
            walletElement.innerHTML = `
                <span style="color: #ff9800">
                    Use /get_wallet in @jitoxai_bot
                </span>`;
        }
    }
}

// Add wallet copy function
function copyWallet(wallet) {
    navigator.clipboard.writeText(wallet)
        .then(() => {
            // Show a temporary success message
            const walletElement = document.getElementById('userWallet');
            const originalContent = walletElement.innerHTML;
            walletElement.innerHTML = `
                <span style="color: #00ff00">
                    Copied! <i class="fas fa-check"></i>
                </span>`;
            
            // Restore original content after 2 seconds
            setTimeout(() => {
                walletElement.innerHTML = originalContent;
            }, 2000);
        })
        .catch(err => {
            console.error('Error copying wallet:', err);
        });
}

// Add to window object for global access
window.copyWallet = copyWallet;

// Logout function
function logout() {
    // Clear stored data
    localStorage.removeItem('telegramUser');
    
    // Reset UI
    document.getElementById('loginStatus').textContent = 'Not Connected';
    document.getElementById('userName').textContent = '-';
    document.getElementById('userId').textContent = '-';
    document.getElementById('userWallet').textContent = 'Not connected';
    
    // Show login button and hide user info
    document.getElementById('userInfo').style.display = 'none';
    document.querySelector('.telegram-login').style.display = 'block';
    
    // Reset avatar to default
    const avatar = document.querySelector('.profile-avatar');
    if (avatar) {
        avatar.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" id="userPhoto">
                <rect width="100" height="100" fill="#2B2640"/>
                <circle cx="50" cy="35" r="20" fill="#6E56CF"/>
                <path d="M10,90 C10,90 45,70 90,90 L90,100 L10,100 Z" fill="#6E56CF"/>
            </svg>
        `;
    }
    
    // Reinitialize login widget
    initializeTelegramLogin();
}

// Add to window object for global access
window.logout = logout;

// Global variables
let isInitialized = false;
let networkChart = null;
let volumeChart = null;
let solGainedChart = null;
let strategyPerformanceChart = null;
let patternRecognitionChart = null;
let aiAccuracyChart = null;

// Chart configuration
const chartConfig = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false
        }
    },
    scales: {
        x: {
            grid: {
                color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
                color: 'rgba(255, 255, 255, 0.7)'
            }
        },
        y: {
            grid: {
                color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
                color: 'rgba(255, 255, 255, 0.7)'
            }
        }
    }
};

// Initialize loading sequence
function initializeLoadingSequence() {
    try {
        // Get required elements
        const loadingContainer = document.getElementById('loadingContainer');
        const mainContent = document.getElementById('mainContent');
        const cyberParticles = document.getElementById('cyberParticles');
        const loadingProgress = document.getElementById('loadingProgress');
        const statusItems = document.querySelectorAll('.status-item');

        // Debug logging
        console.log('Loading container:', loadingContainer);
        console.log('Main content:', mainContent);
        console.log('Cyber particles:', cyberParticles);
        console.log('Loading progress:', loadingProgress);
        console.log('Status items:', statusItems);

        // Verify essential elements exist
        if (!loadingContainer || !mainContent || !loadingProgress) {
            console.error('Essential elements not found');
            document.body.innerHTML = `
                <div style="color: white; padding: 20px; text-align: center;">
                    <h1>Loading Error</h1>
                    <p>Unable to initialize application. Please refresh the page.</p>
                </div>
            `;
            return;
        }

        console.log('Starting loading sequence...');

        // Reset initial states
        document.body.style.overflow = 'hidden';
        mainContent.style.display = 'none';
        mainContent.style.opacity = '0';
        mainContent.classList.remove('visible');
        
        loadingContainer.style.display = 'flex';
        loadingContainer.style.opacity = '1';
        loadingContainer.style.transition = 'opacity 0.5s ease';

        // Reset loading progress
        loadingProgress.style.width = '0%';
        loadingProgress.style.transition = 'width 0.3s ease';

        // Reset status items
        statusItems.forEach(item => {
            item.classList.remove('completed');
        });

        // Create particles if container exists
        if (cyberParticles) {
            createParticles(cyberParticles);
        }

        // Simulate loading progress
        let currentProgress = 0;
        const interval = setInterval(() => {
            if (currentProgress >= 100) {
                clearInterval(interval);
                completeLoading(loadingContainer, mainContent);
                return;
            }

            currentProgress += 1;
            loadingProgress.style.width = `${currentProgress}%`;

            // Update status items
            if (statusItems.length > 0) {
                if (currentProgress >= 30) {
                    statusItems[0]?.classList.add('completed');
                    console.log('Network connection established');
                }
                if (currentProgress >= 60) {
                    statusItems[1]?.classList.add('completed');
                    console.log('Data synchronization complete');
                }
                if (currentProgress >= 90) {
                    statusItems[2]?.classList.add('completed');
                    console.log('Interface loaded');
                }
            }
        }, 30);

    } catch (error) {
        console.error('Error in loading sequence:', error);
        document.body.innerHTML = `
            <div style="color: white; padding: 20px; text-align: center;">
                <h1>Error</h1>
                <p>An error occurred while loading. Please refresh the page.</p>
                <p>Error details: ${error.message}</p>
            </div>
        `;
    }
}

// Create particles for the loading screen
function createParticles(container) {
    try {
        if (!container) return;
        
        container.innerHTML = '';
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'cyber-particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 10}s`;
            container.appendChild(particle);
        }
    } catch (error) {
        console.error('Error creating particles:', error);
    }
}

// Initialize charts
function initializeCharts() {
    try {
        if (typeof Chart === 'undefined') {
            console.error('Chart.js not loaded');
            return;
        }

        // Set default Chart.js options
        Chart.defaults.color = '#ffffff';
        Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.1)';
        
        // Network Activity Chart
        const networkCtx = document.getElementById('networkActivityChart')?.getContext('2d');
        if (networkCtx) {
            if (networkChart) networkChart.destroy();
            networkChart = new Chart(networkCtx, {
            type: 'line',
            data: {
                    labels: Array.from({length: 24}, (_, i) => `${i}:00`),
                datasets: [{
                        data: Array.from({length: 24}, () => Math.random() * 1000),
                        borderColor: '#00ffff',
                        backgroundColor: 'rgba(0, 255, 255, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
                options: {
                    ...chartConfig,
                    animation: {
                        duration: 1000
                    }
                }
            });
        }

        // Volume Distribution Chart
        const volumeCtx = document.getElementById('volumeDistributionChart')?.getContext('2d');
        if (volumeCtx) {
            if (volumeChart) volumeChart.destroy();
            volumeChart = new Chart(volumeCtx, {
            type: 'bar',
            data: {
                labels: ['DEX', 'Lending', 'NFT', 'Options', 'Other'],
                datasets: [{
                        data: [40, 20, 15, 15, 10],
                        backgroundColor: '#ff00ff',
                        borderRadius: 4
                    }]
                },
                options: {
                    ...chartConfig,
                    animation: {
                        duration: 1000
                    }
                }
            });
        }

        // SOL Gained Chart
        const solCtx = document.getElementById('solGainedChart')?.getContext('2d');
        if (solCtx) {
            if (solGainedChart) solGainedChart.destroy();
            solGainedChart = new Chart(solCtx, {
                type: 'line',
                data: {
                    labels: Array.from({length: 24}, (_, i) => `${23-i}h`),
                    datasets: [{
                        data: Array.from({length: 24}, () => Math.random() * 100),
                        borderColor: '#00ff88',
                        backgroundColor: 'rgba(0, 255, 136, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    ...chartConfig,
                    animation: {
                        duration: 1000
                    }
                }
            });
        }

        // Strategy Performance Chart
        const strategyCtx = document.getElementById('strategyPerformanceChart')?.getContext('2d');
        if (strategyCtx) {
            if (strategyPerformanceChart) strategyPerformanceChart.destroy();
            strategyPerformanceChart = new Chart(strategyCtx, {
                type: 'line',
                data: {
                    labels: Array.from({length: 7}, (_, i) => `Day ${i + 1}`),
                    datasets: [
                        {
                            label: 'Arbitrage',
                            data: Array.from({length: 7}, () => 95 + Math.random() * 5),
                            borderColor: '#00ffff',
                            backgroundColor: 'rgba(0, 255, 255, 0.1)',
                            fill: true,
                            tension: 0.4
                        },
                        {
                            label: 'Sandwich',
                            data: Array.from({length: 7}, () => 90 + Math.random() * 8),
                        borderColor: '#ff00ff',
                            backgroundColor: 'rgba(255, 0, 255, 0.1)',
                        fill: true,
                            tension: 0.4
                        }
                    ]
                },
                options: {
                    ...chartConfig,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top',
                            labels: {
                                color: '#ffffff'
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
        const patternCtx = document.getElementById('patternRecognitionChart')?.getContext('2d');
        if (patternCtx) {
            if (patternRecognitionChart) patternRecognitionChart.destroy();
            patternRecognitionChart = new Chart(patternCtx, {
                type: 'radar',
                data: {
                    labels: ['Market Making', 'Arbitrage', 'Liquidations', 'Flash Loans', 'Sandwich', 'Other'],
                    datasets: [{
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
                    }]
                },
                options: {
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top',
                            labels: {
                                color: '#ffffff',
                                font: {
                                    size: 12
                                },
                                padding: 20
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleColor: '#00ffff',
                            bodyColor: '#ffffff',
                            borderColor: '#00ffff',
                            borderWidth: 1,
                            padding: 10
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
                                    size: 12,
                                    weight: 'bold'
                                }
                            },
                            ticks: {
                                color: '#ffffff',
                                backdropColor: 'transparent',
                                stepSize: 20,
                                font: {
                                    size: 10
                                }
                            }
                        }
                    },
                    animation: {
                        duration: 2000,
                        easing: 'easeInOutQuart'
                    },
                    elements: {
                        line: {
                            tension: 0.4
                        }
                    }
                }
            });
        }

        // AI Accuracy Trend Chart
        const accuracyCtx = document.getElementById('aiAccuracyChart')?.getContext('2d');
        if (accuracyCtx) {
            if (aiAccuracyChart) aiAccuracyChart.destroy();
            aiAccuracyChart = new Chart(accuracyCtx, {
                type: 'line',
                data: {
                    labels: Array.from({length: 12}, (_, i) => `${i * 2}h`),
                    datasets: [{
                        data: Array.from({length: 12}, () => 95 + Math.random() * 5),
                        borderColor: '#ff00ff',
                        backgroundColor: 'rgba(255, 0, 255, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    ...chartConfig,
                    scales: {
                        y: {
                            min: 90,
                            max: 100,
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            ticks: {
                                color: '#ffffff'
                            }
                        }
                    },
                    animation: {
                        duration: 1000
                    }
                }
            });
        }

        console.log('Charts initialized successfully');
    } catch (error) {
        console.error('Error initializing charts:', error);
    }
}

// Initialize tab switching
function initializeTabs() {
    try {
        const tabs = document.querySelectorAll('.cyber-button');
        const sections = document.querySelectorAll('.content-section');

        // Hide all sections initially
        sections.forEach(section => {
            section.style.display = 'none';
            section.classList.remove('active');
        });

        // Show statistics section by default
        const statisticsSection = document.querySelector('.statistics-section');
        if (statisticsSection) {
            statisticsSection.style.display = 'block';
            statisticsSection.classList.add('active');
            
            // Set the corresponding tab as active
            const statisticsTab = document.querySelector('[data-tab="statistics"]');
            if (statisticsTab) {
                statisticsTab.classList.add('active');
            }
        }

        // Add click handlers to tabs
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetSection = tab.getAttribute('data-tab');
                
                // Update active states
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Hide all sections with transition
                sections.forEach(section => {
                    section.classList.remove('active');
                    setTimeout(() => {
                        section.style.display = 'none';
                    }, 300); // Match this with CSS transition duration
                });
                
                // Show target section with transition
                const targetElement = document.querySelector(`.${targetSection}-section`);
                if (targetElement) {
                    setTimeout(() => {
                        targetElement.style.display = 'block';
                        // Force a reflow
                        targetElement.offsetHeight;
                        targetElement.classList.add('active');
                    }, 300);
                }
            });
        });

        console.log('Tab initialization completed');
    } catch (error) {
        console.error('Error initializing tabs:', error);
    }
}

// Complete loading and show main content
function completeLoading(loadingContainer, mainContent) {
    try {
        if (!loadingContainer || !mainContent) {
            console.error('Missing elements for complete loading');
            return;
        }

        console.log('Completing loading sequence...');

        // First, initialize the main content components while loading screen is still visible
                initializeCharts();
                initializeTabs();

        // Add visible class to main content (this will be used for the transition)
        mainContent.classList.add('visible');

        // Start the transition sequence
        setTimeout(() => {
            // Fade out loading container
            loadingContainer.style.opacity = '0';
            loadingContainer.style.transition = 'opacity 0.5s ease';

            setTimeout(() => {
                // Hide loading container
                loadingContainer.style.display = 'none';

                // Show main content
                mainContent.style.display = 'block';
                
                // Force a reflow before setting opacity
                mainContent.offsetHeight;
                
                // Fade in main content
                mainContent.style.opacity = '1';
                mainContent.style.transition = 'opacity 0.5s ease';

                // Set initial active section
                const initialSection = document.querySelector('.statistics-section');
                if (initialSection) {
                    initialSection.style.display = 'block';
                    initialSection.classList.add('active');
                }

                // Mark initialization as complete
                isInitialized = true;
                console.log('Loading sequence completed successfully');
            }, 500);
        }, 500);
    } catch (error) {
        console.error('Error completing loading:', error);
    }
}

// Export functions for use in other files
window.initializeLoadingSequence = initializeLoadingSequence;
window.completeLoading = completeLoading;

// Alerts Management
class AlertsManager {
    constructor() {
        this.alerts = [];
        this.stats = {
            active: 24,
            highPriority: 5,
            responseTime: 1.2
        };
        this.initializeEventListeners();
        this.startRealTimeUpdates();
    }

    initializeEventListeners() {
        // Filter buttons
        document.querySelectorAll('.filter-group .cyber-button').forEach(button => {
        button.addEventListener('click', () => {
                this.filterAlerts(button.dataset.filter);
                // Update active state
                document.querySelectorAll('.filter-group .cyber-button').forEach(btn => {
                    btn.classList.remove('active');
                });
            button.classList.add('active');
            });
        });

        // Search functionality
        const searchInput = document.querySelector('.cyber-search input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchAlerts(e.target.value);
            });
        }
    }

    filterAlerts(type) {
        const alertCards = document.querySelectorAll('.alert-card');
        alertCards.forEach(card => {
            if (type === 'all' || card.classList.contains(`${type}-priority`)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    searchAlerts(query) {
        const alertCards = document.querySelectorAll('.alert-card');
        query = query.toLowerCase();
        
        alertCards.forEach(card => {
            const content = card.textContent.toLowerCase();
            if (content.includes(query)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    updateStats() {
        // Cache DOM queries
        if (!this._statsElements) {
            this._statsElements = {
                activeAlerts: document.querySelector('.alerts-stats .cyber-card:nth-child(1) .stat-value'),
                highPriority: document.querySelector('.alerts-stats .cyber-card:nth-child(2) .stat-value'),
                responseTime: document.querySelector('.alerts-stats .cyber-card:nth-child(3) .stat-value')
            };
        }

        // Batch DOM updates
        requestAnimationFrame(() => {
            if (this._statsElements.activeAlerts) {
                this._statsElements.activeAlerts.textContent = this.stats.active;
            }
            if (this._statsElements.highPriority) {
                this._statsElements.highPriority.textContent = this.stats.highPriority;
            }
            if (this._statsElements.responseTime) {
                this._statsElements.responseTime.textContent = this.stats.responseTime + 's';
            }
        });
    }

    addNewAlert(alert) {
        const alertsGrid = document.querySelector('.alerts-grid');
        if (!alertsGrid) return;

        // Create element outside of DOM
        const alertCard = document.createElement('div');
        alertCard.className = `alert-card ${alert.priority}-priority new`;
        
        // Use template literal once
        const html = `
            <div class="alert-header">
                <div class="alert-type">
                    <i class="fas ${this.getPriorityIcon(alert.priority)}"></i>
                    <span>${alert.priority.charAt(0).toUpperCase() + alert.priority.slice(1)} Priority</span>
                </div>
                <div class="alert-time">Just now</div>
            </div>
            <div class="alert-content">
                <h3>${alert.title}</h3>
                <p>${alert.description}</p>
                <div class="alert-details">
                    ${alert.details.map(detail => `
                        <span class="detail-item">
                            <i class="fas ${detail.icon}"></i> ${detail.text}
                        </span>
                    `).join('')}
                </div>
            </div>
            <div class="alert-actions">
                <button class="cyber-button">${alert.primaryAction}</button>
                <button class="cyber-button">${alert.secondaryAction}</button>
            </div>
        `;

        // Set innerHTML once
        alertCard.innerHTML = html;

        // Use requestAnimationFrame for DOM updates
        requestAnimationFrame(() => {
            // Add to the beginning of the grid
            alertsGrid.insertBefore(alertCard, alertsGrid.firstChild);

            // Limit number of alerts to prevent memory issues
            while (alertsGrid.children.length > 20) {
                alertsGrid.removeChild(alertsGrid.lastChild);
            }

            // Remove animation class after animation completes
            setTimeout(() => {
                alertCard.classList.remove('new');
            }, 1000);

            // Update stats
            this.stats.active++;
            if (alert.priority === 'high') {
                this.stats.highPriority++;
            }
            this.updateStats();
        });
    }

    getPriorityIcon(priority) {
        switch (priority) {
            case 'high':
                return 'fa-exclamation-triangle';
            case 'medium':
                return 'fa-bell';
            case 'low':
                return 'fa-info-circle';
            default:
                return 'fa-bell';
        }
    }

    addFeedItem(item) {
        const feedContainer = document.querySelector('.feed-container');
        if (!feedContainer) return;

        const feedItem = document.createElement('div');
        feedItem.className = 'feed-item';
        
        // Set innerHTML once
        feedItem.innerHTML = `
            <div class="feed-time">Just now</div>
            <div class="feed-content">
                <i class="fas ${item.icon}"></i>
                <span>${item.message}</span>
            </div>
        `;

        // Use requestAnimationFrame for DOM updates
        requestAnimationFrame(() => {
            // Add to the beginning of the feed
            feedContainer.insertBefore(feedItem, feedContainer.firstChild);

            // Limit feed items
            while (feedContainer.children.length > 5) {
                feedContainer.removeChild(feedContainer.lastChild);
            }
        });
    }

    startRealTimeUpdates() {
        // Throttle update frequency and batch updates
        let updatePending = false;
        let lastUpdate = Date.now();
        const UPDATE_INTERVAL = 5000; // 5 seconds
        const THROTTLE_THRESHOLD = 100; // 100ms

        const performUpdate = () => {
            const now = Date.now();
            if (now - lastUpdate < THROTTLE_THRESHOLD) {
                return;
            }

            // Batch DOM updates
            const updates = [];

            // Queue updates instead of performing them immediately
            if (Math.random() < 0.3) {
                updates.push(() => this.addNewAlert(this.generateRandomAlert()));
            }

            if (Math.random() < 0.4) {
                updates.push(() => this.addFeedItem(this.generateRandomFeedItem()));
            }

            // Update response time
            this.stats.responseTime = (Math.random() * 0.4 + 1).toFixed(1);

            // Use requestAnimationFrame for smooth updates
            requestAnimationFrame(() => {
                // Execute all queued updates
                updates.forEach(update => update());
                // Update stats once at the end
                this.updateStats();
                lastUpdate = now;
                updatePending = false;
            });
        };

        // Use more efficient interval handling
        const intervalId = setInterval(() => {
            if (!updatePending) {
                updatePending = true;
                performUpdate();
            }
        }, UPDATE_INTERVAL);

        // Cleanup function
        return () => clearInterval(intervalId);
    }

    generateRandomAlert() {
        const priorities = ['high', 'medium', 'low'];
        const priority = priorities[Math.floor(Math.random() * priorities.length)];
        const profit = generateRandomProfit(); // Get random profit between 0.2 and 14 SOL
        
        const alerts = [
            {
                priority: 'high',
                title: 'Large Transaction Detected',
                description: 'Unusual transaction volume detected on Jupiter. Potential MEV opportunity identified.',
                details: [
                    { icon: 'fa-coins', text: `Profit: ${profit} SOL` },
                    { icon: 'fa-clock', text: `Execution Time: ${Math.floor(Math.random() * 200 + 100)}ms` }
                ],
                primaryAction: 'Track',
                secondaryAction: 'Analyze'
            },
            {
                priority: 'medium',
                title: 'New Pattern Identified',
                description: 'Recurring arbitrage pattern detected between Orca and Raydium.',
                details: [
                    { icon: 'fa-coins', text: `Profit: ${profit} SOL` },
                    { icon: 'fa-clock', text: `Execution Time: ${Math.floor(Math.random() * 200 + 100)}ms` }
                ],
                primaryAction: 'Track',
                secondaryAction: 'Analyze'
            },
            {
                priority: 'low',
                title: 'MEV Opportunity',
                description: 'Potential arbitrage opportunity identified on Solana network.',
                details: [
                    { icon: 'fa-coins', text: `Profit: ${profit} SOL` },
                    { icon: 'fa-clock', text: `Execution Time: ${Math.floor(Math.random() * 200 + 100)}ms` }
                ],
                primaryAction: 'Track',
                secondaryAction: 'Analyze'
            }
        ];

        return alerts.find(alert => alert.priority === priority);
    }

    generateRandomFeedItem() {
        const feedItems = [
            { icon: 'fa-sync', message: 'Network synchronization complete' },
            { icon: 'fa-shield-alt', message: 'Security check passed: All systems normal' },
            { icon: 'fa-chart-bar', message: 'Performance metrics updated' },
            { icon: 'fa-database', message: 'Database optimization completed' },
            { icon: 'fa-network-wired', message: 'New node connected to network' }
        ];

        return feedItems[Math.floor(Math.random() * feedItems.length)];
    }
}

// Update charts with new data
function updateCharts() {
    try {
        // Network Activity Chart
        if (networkChart) {
            const newData = networkChart.data.datasets[0].data.slice(1);
            newData.push(Math.random() * 1000);
            networkChart.data.datasets[0].data = newData;
            networkChart.update('none'); // Use 'none' mode for better performance
        }
        
        // Volume Distribution Chart
        if (volumeChart) {
            volumeChart.data.datasets[0].data = volumeChart.data.datasets[0].data.map(
                value => Math.max(5, Math.min(95, value + (Math.random() - 0.5) * 5))
            );
            volumeChart.update('none');
        }
        
        // Pattern Recognition Chart
        if (patternRecognitionChart) {
            // Update success rate dataset
            patternRecognitionChart.data.datasets[0].data = patternRecognitionChart.data.datasets[0].data.map(
                value => Math.max(70, Math.min(98, value + (Math.random() - 0.5) * 2))
            );
            // Update profit potential dataset
            patternRecognitionChart.data.datasets[1].data = patternRecognitionChart.data.datasets[1].data.map(
                value => Math.max(65, Math.min(95, value + (Math.random() - 0.5) * 2))
            );
            patternRecognitionChart.update('none');
        }

        // AI Accuracy Chart
        if (aiAccuracyChart) {
            const newAccuracyData = aiAccuracyChart.data.datasets[0].data.slice(1);
            newAccuracyData.push(95 + Math.random() * 5);
            aiAccuracyChart.data.datasets[0].data = newAccuracyData;
            aiAccuracyChart.update('none');
        }

        // Strategy Performance Chart
        if (strategyPerformanceChart) {
            strategyPerformanceChart.data.datasets.forEach(dataset => {
                dataset.data = dataset.data.map(
                    value => Math.max(90, Math.min(100, value + (Math.random() - 0.5) * 2))
                );
            });
            strategyPerformanceChart.update('none');
        }
    } catch (error) {
        console.error('Error updating charts:', error);
    }
}

// Start real-time updates with improved frequencies
function startRealTimeUpdates() {
    // Performance optimization: Use RequestAnimationFrame for smooth animations
    let lastChartUpdate = 0;
    let lastStatsUpdate = 0;
    let lastMEVUpdate = 0;
    let lastAIUpdate = 0;

    const CHART_UPDATE_INTERVAL = 2000; // 2 seconds
    const STATS_UPDATE_INTERVAL = 1000; // 1 second
    const MEV_UPDATE_INTERVAL = 5000; // 5 seconds
    const AI_UPDATE_INTERVAL = 100; // Update AI stats every 100ms

    function animate(timestamp) {
        // Update charts
        if (timestamp - lastChartUpdate >= CHART_UPDATE_INTERVAL) {
            if (document.visibilityState === 'visible') {
                updateCharts();
                lastChartUpdate = timestamp;
            }
        }

        // Update MEV stats
        if (timestamp - lastMEVUpdate >= MEV_UPDATE_INTERVAL) {
            if (document.visibilityState === 'visible') {
                updateMEVStats();
                lastMEVUpdate = timestamp;
            }
        }

        // Update other stats
        if (timestamp - lastStatsUpdate >= STATS_UPDATE_INTERVAL) {
            if (document.visibilityState === 'visible') {
                updateOtherStats();
                updateNetworkStatus();
                updateLastUpdateTime();
                lastStatsUpdate = timestamp;
            }
        }

        // Update AI strategies more frequently
        if (timestamp - lastAIUpdate >= AI_UPDATE_INTERVAL) {
            if (document.visibilityState === 'visible') {
                updateAIStrategies();
                lastAIUpdate = timestamp;
            }
        }

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);

    // Update network status randomly
    function updateNetworkStatus() {
        const statusIndicator = document.querySelector('.status-indicator');
        const statusText = document.querySelector('.status-text');
        if (statusIndicator && statusText) {
            const isHealthy = Math.random() > 0.1; // 90% chance of healthy status
            statusIndicator.style.background = isHealthy ? '#00ff00' : '#ff0000';
            statusIndicator.style.boxShadow = `0 0 10px ${isHealthy ? '#00ff00' : '#ff0000'}`;
            statusText.textContent = isHealthy ? 'Connected to Solana' : 'Reconnecting...';
        }
    }

    // Update last update time
    function updateLastUpdateTime() {
        const updateTime = document.querySelector('.update-time');
        if (updateTime) {
            updateTime.textContent = 'Just now';
        }
    }

    // Add dynamic hover effects for cyber-cards
    document.querySelectorAll('.cyber-card').forEach(card => {
        card.addEventListener('mouseover', () => {
            card.style.transform = 'translateY(-5px) scale(1.02)';
            card.style.boxShadow = '0 8px 20px rgba(0, 255, 255, 0.2)';
        });

        card.addEventListener('mouseout', () => {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = '0 0 15px rgba(0, 255, 255, 0.1)';
        });
    });

    // Add pulse animation to important stats
    setInterval(() => {
        document.querySelectorAll('.stat-value').forEach(stat => {
            stat.style.animation = 'pulse 0.5s ease';
        setTimeout(() => {
                stat.style.animation = '';
            }, 500);
        });
    }, 5000);

    // Cleanup function
    return () => {
        document.removeEventListener('visibilitychange', updateNetworkStatus);
    };
}

// Enhanced updateStats function with smoother transitions
function updateStats() {
    try {
        updateMEVStats();
        
        // Rest of your existing updateStats code...
        
    } catch (error) {
        console.error('Error updating stats:', error);
    }
}

// Function to update Total Pooled SOL with smooth transitions
function updateTotalPooled() {
    const pooledElement = document.querySelector('.total-pooled .stat-value');
    const trendElement = document.querySelector('.total-pooled .stat-trend');
    const volumeElement = document.querySelector('.total-pooled .stat-details');
    
    if (!pooledElement || !trendElement || !volumeElement) return;
    
    try {
        // Base value and trend calculation
        const baseValue = 3760.5;
        const time = Date.now() / 1000;
        
        // Create a smooth upward trend with small variations
        const trendFactor = Math.sin(time * 0.1) * 50;
        const microVariation = Math.sin(time * 0.5) * 2;
        
        // Calculate current SOL value
        const currentSOL = baseValue + trendFactor + microVariation;
        
        // Calculate percentage change
        const previousSOL = window.previousSOL || currentSOL;
        const percentChange = ((currentSOL - previousSOL) / previousSOL) * 100;
        window.previousSOL = currentSOL;
        
        // Calculate peak 24h volume (approximately 45% of highest value)
        const peakVolume = Math.max(currentSOL, window.previousSOL) * 0.45;

        // Format values
        const formattedSOL = currentSOL.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        const formattedTrend = (percentChange >= 0 ? '+' : '') + percentChange.toFixed(2) + '%';
        const formattedPeakVolume = peakVolume.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' SOL';
        
        // Update DOM elements directly
        pooledElement.textContent = formattedSOL + ' SOL';
        pooledElement.style.color = percentChange >= 0 ? '#00ff00' : '#ff4444';
        
        trendElement.textContent = formattedTrend;
        trendElement.className = 'stat-trend ' + (percentChange >= 0 ? 'positive' : 'negative');
        
        volumeElement.textContent = 'Peak 24h Volume: ' + formattedPeakVolume;
    } catch (error) {
        console.error('Error updating Total Pooled:', error);
    }
}

// Start updating Total Pooled value
setInterval(updateTotalPooled, 50);

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.alertsManager = new AlertsManager();
    startRealTimeUpdates();
    startPooledUpdates(); // Start the more frequent updates for Total Pooled
});

function generateRandomProfit() {
    // Use exponential distribution to favor lower values
    const rand = Math.random();
    // Base range from 0.2 to 14 SOL
    const minProfit = 0.2;
    const maxProfit = 14;
    
    // Exponential distribution calculation
    // This will make lower values more common
    const lambda = 0.5;
    const profit = minProfit + (-Math.log(1 - rand * 0.95) / lambda);
    
    // Cap at maxProfit
    return Math.min(profit, maxProfit).toFixed(2);
}

function createAlertCard(priority) {
    const card = document.createElement('div');
    card.className = `alert-card ${priority}-priority new`;
    
    const profit = generateRandomProfit();
    const alertTypes = {
        'high-priority': 'High Priority Alert',
        'medium-priority': 'Medium Priority Alert',
        'low-priority': 'Low Priority Alert'
    };
    
    card.innerHTML = `
        <div class="alert-header">
            <div class="alert-type">
                <i class="fas fa-exclamation-circle"></i>
                <span>${alertTypes[priority]}</span>
            </div>
            <div class="alert-time">Just now</div>
        </div>
        <div class="alert-content">
            <h3>MEV Opportunity Detected</h3>
            <p>Potential profit opportunity identified on Solana network.</p>
            <div class="alert-details">
                <div class="detail-item">
                    <i class="fas fa-coins"></i>
                    <span>Profit: ${profit} SOL</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-clock"></i>
                    <span>Execution Time: ${Math.floor(Math.random() * 200 + 100)}ms</span>
                </div>
            </div>
        </div>
        <div class="alert-actions">
            <button class="cyber-button track-btn">
                <i class="fas fa-crosshairs"></i> Track
            </button>
            <button class="cyber-button analyze-btn">
                <i class="fas fa-chart-line"></i> Analyze
            </button>
            <button class="cyber-button dismiss-btn">
                <i class="fas fa-times"></i> Dismiss
            </button>
        </div>
    `;
    
    // Add event listeners for the buttons
    const trackBtn = card.querySelector('.track-btn');
    const analyzeBtn = card.querySelector('.analyze-btn');
    const dismissBtn = card.querySelector('.dismiss-btn');
    
    if (trackBtn) {
        trackBtn.addEventListener('click', () => {
            trackBtn.classList.toggle('active');
            trackBtn.innerHTML = trackBtn.classList.contains('active') ? 
                '<i class="fas fa-stop"></i> Stop' : 
                '<i class="fas fa-crosshairs"></i> Track';
        });
    }
    
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', () => {
            // Toggle analysis panel or trigger analysis action
            analyzeBtn.classList.toggle('active');
        });
    }
    
    if (dismissBtn) {
        dismissBtn.addEventListener('click', () => {
            card.style.opacity = '0';
            setTimeout(() => card.remove(), 300);
        });
    }
    
    return card;
}

// Add this function after the updateStats function
function updateAIStrategies() {
    // Get all elements with class success-rate and avg-return
    const successRates = document.querySelectorAll('.success-rate');
    const avgReturns = document.querySelectorAll('.avg-return');

    // Update each success rate and return value
    successRates.forEach((element, index) => {
        let success, returns;
        
        switch(index) {
            case 0: // Cross-DEX Arbitrage
                success = (99 + Math.random() * 0.4).toFixed(1);
                returns = (0.7 + Math.random() * 0.2).toFixed(1);
                break;
            case 1: // Sandwich Trading
                success = (97.5 + Math.random() * 0.6).toFixed(1);
                returns = (0.4 + Math.random() * 0.2).toFixed(1);
                break;
            case 2: // Flash Loan Arbitrage
                success = (98.2 + Math.random() * 0.6).toFixed(1);
                returns = (1.1 + Math.random() * 0.2).toFixed(1);
                break;
            default:
                return;
        }

        // Update the values
        element.textContent = success + '%';
        if (avgReturns[index]) {
            avgReturns[index].textContent = returns + ' SOL';
        }
    });
}

// Start updating immediately and continue every 50ms for smoother updates
updateAIStrategies();
const aiUpdateInterval = setInterval(updateAIStrategies, 50);

// SOL price fetching (CoinGecko API)
async function getSOLPrice() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
        const data = await response.json();
        return data.solana.usd;
    } catch (error) {
        console.error('Error fetching SOL price:', error);
        return 100; // Fallback price if API fails
    }
}

// MEV Stats Calculator
class MEVStatsCalculator {
    constructor() {
        this.minSOL = 803.3;  // Starting value set to 803.3
        this.maxSOL = 14000;
        this.lastValue = this.minSOL;
        this.lastUpdateTime = new Date();
        this.dailyReset();
    }

    dailyReset() {
        const now = new Date();
        if (this.lastUpdateTime.getDate() !== now.getDate()) {
            this.lastValue = this.minSOL;
            this.lastUpdateTime = now;
        }
    }

    calculateNextValue() {
        this.dailyReset();
        
        // Calculate time-based progression
        const now = new Date();
        const hoursInDay = now.getHours() + (now.getMinutes() / 60);
        const progressionFactor = Math.min(hoursInDay / 24, 1);
        
        // Calculate range for this time of day
        const maxForCurrentTime = this.minSOL + (this.maxSOL - this.minSOL) * progressionFactor;
        
        // Add random variation (±2% from current trajectory)
        const variation = (Math.random() - 0.5) * 0.02 * (maxForCurrentTime - this.lastValue);
        
        // Ensure new value is higher than last value and within bounds
        let newValue = Math.max(this.lastValue + Math.random() * 20 + variation, this.minSOL);
        newValue = Math.min(newValue, maxForCurrentTime);
        
        // Calculate percentage change
        const percentageChange = ((newValue - this.lastValue) / this.lastValue) * 100;
        
        this.lastValue = newValue;
        
        return {
            sol: newValue.toFixed(1),
            percentage: percentageChange.toFixed(1)
        };
    }
}

// Initialize MEV Calculator
const mevCalculator = new MEVStatsCalculator();

// Update MEV stats with immediate display
async function updateMEVStats() {
    try {
        const mevStats = mevCalculator.calculateNextValue();
        const solPrice = await getSOLPrice();
        const usdValue = (parseFloat(mevStats.sol) * solPrice).toLocaleString('en-US', {
            style: 'decimal',
            maximumFractionDigits: 0
        });
        
        // Force immediate DOM update
        const mevCard = document.querySelector('.cyber-card:nth-child(3)');
        if (!mevCard) return;

        const mevValue = mevCard.querySelector('.stat-value');
        const mevTrend = mevCard.querySelector('.stat-trend span');
        const mevUSD = mevCard.querySelector('.stat-details span');
        
        if (mevValue) mevValue.textContent = `${mevStats.sol} SOL`;
        if (mevTrend) {
            const trend = parseFloat(mevStats.percentage);
            mevTrend.textContent = `${trend >= 0 ? '+' : ''}${mevStats.percentage}%`;
            mevTrend.parentElement.className = `stat-trend ${trend >= 0 ? 'positive' : 'negative'}`;
        }
        if (mevUSD) mevUSD.textContent = `≈ $${usdValue} USD`;
    } catch (error) {
        console.error('Error updating MEV stats:', error);
    }
}

// Call updateMEVStats immediately when the script loads
updateMEVStats();

// Update other stats (Total Pooled, Active Searchers, Network Health)
function updateOtherStats() {
    try {
        // Calculate Total Pooled SOL with smooth oscillation
        const basePooledSOL = 3760.5;
        const pooledAmplitude = 200;
        const currentPooledSOL = basePooledSOL + pooledAmplitude * Math.sin(Date.now() / 10000);
        const previousPooledSOL = basePooledSOL + pooledAmplitude * Math.sin((Date.now() - 1000) / 10000);
        const pooledPercentageChange = ((currentPooledSOL - previousPooledSOL) / previousPooledSOL) * 100;

        // Update Total Pooled
        const pooledCard = document.querySelector('.cyber-card.total-pooled');
        if (pooledCard) {
            const valueEl = pooledCard.querySelector('.stat-value');
            const trendEl = pooledCard.querySelector('.stat-trend');
            const volumeEl = pooledCard.querySelector('.stat-details');

            if (valueEl) valueEl.textContent = `${Math.floor(currentPooledSOL)} SOL`;
            if (trendEl) {
                trendEl.textContent = `${pooledPercentageChange >= 0 ? '+' : ''}${pooledPercentageChange.toFixed(1)}%`;
                trendEl.className = `stat-trend ${pooledPercentageChange >= 0 ? 'positive' : 'negative'}`;
            }
            if (volumeEl) volumeEl.textContent = `24h Volume: ${Math.floor(currentPooledSOL * 0.3)} SOL`;
        }

        // Update Active Searchers (5000-6000 range)
        const baseSearchers = 5000;
        const searchersVariation = Math.floor(Math.random() * 1000);
        const currentSearchers = baseSearchers + searchersVariation;
        const searchersPercentageChange = ((Math.random() * 5) + 8).toFixed(1);

        const searchersCard = document.querySelector('.cyber-card:nth-child(2)');
        if (searchersCard) {
            const valueEl = searchersCard.querySelector('.stat-value');
            const trendEl = searchersCard.querySelector('.stat-trend span');
            const peakEl = searchersCard.querySelector('.stat-details span');

            if (valueEl) valueEl.textContent = currentSearchers.toString();
            if (trendEl) trendEl.textContent = `+${searchersPercentageChange}%`;
            if (peakEl) peakEl.textContent = `Peak Today: ${Math.max(currentSearchers, 6102)}`;
        }

        // Update Network Health (95-99.9% range)
        const baseHealth = 98.9;
        const healthVariation = (Math.random() * 0.5) - 0.25;
        const currentHealth = Math.min(99.9, Math.max(95, baseHealth + healthVariation));
        const healthPercentageChange = ((Math.random() * 0.5) + 0.2).toFixed(2);

        const healthCard = document.querySelector('.cyber-card:nth-child(4)');
        if (healthCard) {
            const valueEl = healthCard.querySelector('.stat-value');
            const trendEl = healthCard.querySelector('.stat-trend span');
            const latencyEl = healthCard.querySelector('.stat-details span');

            if (valueEl) valueEl.textContent = `${currentHealth.toFixed(1)}%`;
            if (trendEl) trendEl.textContent = `+${healthPercentageChange}%`;
            if (latencyEl) latencyEl.textContent = `Latency: ${(Math.random() * 0.1 + 0.1).toFixed(2)}s`;
        }

    } catch (error) {
        console.error('Error updating other stats:', error);
    }
}

// Profile Dropdown Toggle
function toggleProfile() {
    const dropdown = document.getElementById('profileDropdown');
    if (dropdown) {
        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
        setTimeout(() => {
            dropdown.classList.toggle('visible');
        }, 10);
    }
}

// Close profile dropdown when clicking outside
document.addEventListener('click', (event) => {
    const dropdown = document.getElementById('profileDropdown');
    const trigger = document.querySelector('.profile-trigger');
    
    if (dropdown && trigger) {
        if (!dropdown.contains(event.target) && !trigger.contains(event.target)) {
            dropdown.classList.remove('visible');
            setTimeout(() => {
                dropdown.style.display = 'none';
            }, 300);
        }
    }
});

// Add to window object for global access
window.toggleProfile = toggleProfile;

// Tab switching
document.querySelectorAll('.cyber-nav button').forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        document.querySelectorAll('.cyber-nav button').forEach(btn => {
            btn.classList.remove('active');
        });

        // Add active class to clicked button
        button.classList.add('active');

        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.style.display = 'none';
        });

        // Show selected section
        const tabName = button.getAttribute('data-tab');
        document.querySelector(`.${tabName}-section`).style.display = 'block';
    });
});

// Sync profile data
function syncProfileData() {
    const loginStatus = document.getElementById('loginStatus').textContent;
    const userName = document.getElementById('userName').textContent;
    const userId = document.getElementById('userId').textContent;
    const userWallet = document.getElementById('userWallet').textContent;

    // Update profile section
    document.getElementById('profileLoginStatus').textContent = loginStatus;
    document.getElementById('profileUserName').textContent = userName;
    document.getElementById('profileUserId').textContent = userId;
    document.getElementById('profileUserWallet').textContent = userWallet;
    
    // Update last login
    const now = new Date();
    document.getElementById('lastLogin').textContent = now.toLocaleString();
}

// Call syncProfileData when user info is updated
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'characterData' || mutation.type === 'childList') {
            syncProfileData();
        }
    });
});

const userInfo = document.getElementById('userInfo');
if (userInfo) {
    observer.observe(userInfo, { 
        childList: true, 
        characterData: true, 
        subtree: true 
    });
}

// Initial sync
syncProfileData();

// Wallet and Feature Access Management
let hasWallet = false;
let hasDeposited = false;

function checkWalletAndDeposit() {
    const wallet = document.getElementById('userWallet').textContent;
    hasWallet = wallet !== 'Not connected';
    // In a real implementation, you would check the deposit status from your backend
    // For now, we'll simulate it
    hasDeposited = localStorage.getItem('hasDeposited') === 'true';
    return { hasWallet, hasDeposited };
}

function promptWalletConnection() {
    const modal = document.createElement('div');
    modal.className = 'cyber-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Premium Features</h2>
            <p>To access premium features, please complete these steps:</p>
            <ol>
                ${!hasWallet ? `
                <li>
                    <div class="step-header">
                        <i class="fas fa-wallet"></i>
                        <span>Connect Wallet</span>
                    </div>
                    <div class="step-content">
                        Use the command <code>/get_wallet</code> in our Telegram bot
                    </div>
                </li>` : ''}
                <li>
                    <div class="step-header">
                        <i class="fas fa-coins"></i>
                        <span>Make Deposit</span>
                    </div>
                    <div class="step-content">
                        Deposit 2 SOL to activate premium features
                        ${hasWallet ? `<div class="wallet-address">Your wallet: ${document.getElementById('userWallet').textContent}</div>` : ''}
                    </div>
                </li>
            </ol>
            <div class="modal-actions">
                <button class="cyber-button secondary" onclick="this.closest('.cyber-modal').remove()">
                    <i class="fas fa-times"></i>
                    Close
                </button>
                <button class="cyber-button primary" onclick="window.open('https://t.me/jitoxai_bot', '_blank')">
                    <i class="fab fa-telegram"></i>
                    Open Telegram Bot
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Add event listener for the Telegram bot response
    window.addEventListener('message', function(event) {
        if (event.origin !== window.origin) return;
        
        const data = event.data;
        if (data && data.type === 'wallet_address') {
            modal.remove();
            updateWalletStatus(data.address);
        }
    });
}

// Add event listeners to alert action buttons
document.addEventListener('click', (event) => {
    if (event.target.matches('.alert-actions .cyber-button')) {
        const { hasWallet, hasDeposited } = checkWalletAndDeposit();
        if (!hasWallet || !hasDeposited) {
            event.preventDefault();
            promptWalletConnection();
        }
    }
});

// Function to update wallet status
function updateWalletStatus(walletAddress) {
    if (!walletAddress) return;
    
    // Clean up the wallet address in case it comes with "Wallet" prefix
    walletAddress = walletAddress.replace('Wallet:', '').trim();
    
    // Validate if it looks like a Solana address (base58, ~32-44 chars)
    if (walletAddress.length < 32 || walletAddress.length > 44) {
        console.error('Invalid wallet address format');
        return;
    }

    const walletElements = ['userWallet', 'profileUserWallet'];
    walletElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = walletAddress;
        }
    });
    
    // Update wallet status in localStorage
    localStorage.setItem('userWallet', walletAddress);
    hasWallet = true;

    // Show a success notification
    const notification = document.createElement('div');
    notification.className = 'cyber-notification success';
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-header">
                <i class="fas fa-check-circle"></i>
                <span>Wallet Connected</span>
            </div>
            <div class="notification-details">
                <div class="wallet-preview">${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}</div>
                <div class="deposit-status">Deposit Required: 2 SOL</div>
            </div>
            <button class="deposit-btn">
                <i class="fas fa-coins"></i>
                Make Deposit
            </button>
        </div>
    `;

    // Add click handler for the deposit button
    const depositBtn = notification.querySelector('.deposit-btn');
    depositBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        promptWalletConnection();
    });

    // Add click handler for the notification itself
    notification.addEventListener('click', () => {
        const profileTab = document.querySelector('.cyber-nav button[data-tab="user"]');
        if (profileTab) {
            profileTab.click();
        }
    });

    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    const removeTimeout = setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 5000);

    // Clear timeout if user interacts with notification
    notification.addEventListener('mouseenter', () => clearTimeout(removeTimeout));
}

// Function to check if we have a stored wallet
function checkStoredWallet() {
    const storedWallet = localStorage.getItem('userWallet');
    if (storedWallet) {
        updateWalletStatus(storedWallet);
    }
}

// Listen for messages from Telegram
window.addEventListener('message', function(event) {
    // Verify the origin
    if (event.origin !== window.origin) return;
    
    const data = event.data;
    if (data && data.type === 'wallet_address') {
        updateWalletStatus(data.address);
    }
});

// Check for stored wallet on page load
document.addEventListener('DOMContentLoaded', checkStoredWallet);

// Add to window object for global access
window.updateWalletStatus = updateWalletStatus;
window.promptWalletConnection = promptWalletConnection;