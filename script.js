// Wait for all resources to load
window.addEventListener('load', () => {
    console.log('Window loaded, starting initialization...');
    
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
        // Update active alerts
        const activeAlertsEl = document.querySelector('.alerts-stats .cyber-card:nth-child(1) .stat-value');
        if (activeAlertsEl) {
            activeAlertsEl.textContent = this.stats.active;
        }

        // Update high priority alerts
        const highPriorityEl = document.querySelector('.alerts-stats .cyber-card:nth-child(2) .stat-value');
        if (highPriorityEl) {
            highPriorityEl.textContent = this.stats.highPriority;
        }

        // Update response time
        const responseTimeEl = document.querySelector('.alerts-stats .cyber-card:nth-child(3) .stat-value');
        if (responseTimeEl) {
            responseTimeEl.textContent = this.stats.responseTime + 's';
        }
    }

    addNewAlert(alert) {
        const alertsGrid = document.querySelector('.alerts-grid');
        if (!alertsGrid) return;

        const alertCard = document.createElement('div');
        alertCard.className = `alert-card ${alert.priority}-priority new`;
        
        alertCard.innerHTML = `
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

        // Add to the beginning of the grid
        alertsGrid.insertBefore(alertCard, alertsGrid.firstChild);

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
        feedItem.innerHTML = `
            <div class="feed-time">Just now</div>
            <div class="feed-content">
                <i class="fas ${item.icon}"></i>
                <span>${item.message}</span>
            </div>
        `;

        // Add to the beginning of the feed
        feedContainer.insertBefore(feedItem, feedContainer.firstChild);

        // Remove oldest item if more than 5
        if (feedContainer.children.length > 5) {
            feedContainer.removeChild(feedContainer.lastChild);
        }
    }

    startRealTimeUpdates() {
        // Simulate real-time updates
        setInterval(() => {
            // Random chance to add new alert
            if (Math.random() < 0.3) {
                this.addNewAlert(this.generateRandomAlert());
            }

            // Random chance to add feed item
            if (Math.random() < 0.4) {
                this.addFeedItem(this.generateRandomFeedItem());
            }

            // Update response time randomly
            this.stats.responseTime = (Math.random() * 0.4 + 1).toFixed(1);
            this.updateStats();
        }, 5000);
    }

    generateRandomAlert() {
        const priorities = ['high', 'medium', 'low'];
        const priority = priorities[Math.floor(Math.random() * priorities.length)];
        
        const alerts = [
            {
                priority: 'high',
                title: 'Large Transaction Detected',
                description: 'Unusual transaction volume detected on Jupiter. 50,000 SOL movement in progress.',
                details: [
                    { icon: 'fa-wallet', text: 'Wallet: 7xKX...9aB2' },
                    { icon: 'fa-exchange-alt', text: 'DEX: Jupiter' }
                ],
                primaryAction: 'View Details',
                secondaryAction: 'Track'
            },
            {
                priority: 'medium',
                title: 'New Pattern Identified',
                description: 'Recurring arbitrage pattern detected between Orca and Raydium.',
                details: [
                    { icon: 'fa-chart-line', text: 'Profit: 2.5 SOL' },
                    { icon: 'fa-clock', text: 'Interval: 15min' }
                ],
                primaryAction: 'Analyze',
                secondaryAction: 'Monitor'
            },
            {
                priority: 'low',
                title: 'Network Activity Update',
                description: 'Increased network activity detected. Transaction fees rising slightly.',
                details: [
                    { icon: 'fa-tachometer-alt', text: 'TPS: 2,500' },
                    { icon: 'fa-coins', text: 'Avg Fee: 0.000005 SOL' }
                ],
                primaryAction: 'View Stats',
                secondaryAction: 'Dismiss'
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

// Initialize Alerts Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.alertsManager = new AlertsManager();
});