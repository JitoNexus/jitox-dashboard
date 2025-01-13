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
    let lastAlertUpdate = 0;

    const CHART_UPDATE_INTERVAL = 2000; // 2 seconds
    const STATS_UPDATE_INTERVAL = 1000; // 1 second
    const ALERT_UPDATE_INTERVAL = 3000; // 3 seconds

    function animate(timestamp) {
        // Update charts
        if (timestamp - lastChartUpdate >= CHART_UPDATE_INTERVAL) {
            if (document.visibilityState === 'visible') {
                updateCharts();
                lastChartUpdate = timestamp;
            }
        }

        // Update stats
        if (timestamp - lastStatsUpdate >= STATS_UPDATE_INTERVAL) {
            if (document.visibilityState === 'visible') {
                updateStats();
                
                // Update additional real-time elements
                updateNetworkStatus();
                updateLastUpdateTime();
                lastStatsUpdate = timestamp;
            }
        }

        // Update alerts and feed
        if (timestamp - lastAlertUpdate >= ALERT_UPDATE_INTERVAL) {
            if (document.visibilityState === 'visible' && window.alertsManager) {
                if (Math.random() < 0.4) { // 40% chance to add new alert
                    window.alertsManager.addNewAlert(window.alertsManager.generateRandomAlert());
                }
                if (Math.random() < 0.3) { // 30% chance to add feed item
                    window.alertsManager.addFeedItem(window.alertsManager.generateRandomFeedItem());
                }
                lastAlertUpdate = timestamp;
            }
        }

        // Continue animation loop
        requestAnimationFrame(animate);
    }

    // Start animation loop
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
        // Calculate Total Pooled SOL with smooth oscillation
        const baseSOL = 3760.5; // Midpoint between 100 and 7421
        const amplitude = 3660.5; // Half the range (7421 - 100) / 2
        const frequency = 10000; // Slower oscillation
        const currentSOL = baseSOL + amplitude * Math.sin(Date.now() / frequency);
        
        // Calculate percentage change based on previous value
        const previousSOL = baseSOL + amplitude * Math.sin((Date.now() - 1000) / frequency);
        const percentageChange = ((currentSOL - previousSOL) / previousSOL) * 100;
        
        // Calculate 24h volume based on Total Pooled SOL (approximately 30% daily volume)
        const dailyVolume = currentSOL * 0.3 * 100; // Multiply by current SOL price (assumed $100)

        // Update overview stats with smooth transitions
        const stats = {
            pooled: {
                value: `${Math.floor(currentSOL)} SOL`,
                trend: `${percentageChange >= 0 ? '+' : ''}${percentageChange.toFixed(1)}%`,
                volume: `$${(dailyVolume / 1000000).toFixed(1)}M`
            },
            searchers: {
                value: (5000 + Math.floor(Math.sin(Date.now() / 8000) * 200)).toString(),
                trend: `+${(8 + Math.sin(Date.now() / 6000) * 4).toFixed(1)}%`
            },
            mev: {
                value: `${(850 + Math.sin(Date.now() / 7000) * 50).toFixed(1)} SOL`,
                trend: `+${(5 + Math.sin(Date.now() / 4000) * 3).toFixed(1)}%`
            },
            health: {
                value: `${(98 + Math.sin(Date.now() / 9000)).toFixed(1)}%`,
                trend: `+${(0.5 + Math.sin(Date.now() / 3000) * 0.3).toFixed(2)}%`
            }
        };

        // Update DOM elements with smooth transitions
        document.querySelectorAll('.cyber-card').forEach(card => {
            const title = card.querySelector('h2')?.textContent.toLowerCase();
            if (!title) return;

            let stat;
            if (title.includes('total pooled')) stat = stats.pooled;
            else if (title.includes('searchers')) stat = stats.searchers;
            else if (title.includes('mev')) stat = stats.mev;
            else if (title.includes('health')) stat = stats.health;

            if (stat) {
                const valueEl = card.querySelector('.stat-value');
                const trendEl = card.querySelector('.stat-trend span');
                const volumeEl = card.querySelector('.stat-details span');
                
                if (valueEl) {
                    valueEl.style.transition = 'color 0.3s ease';
                    valueEl.textContent = stat.value;
                }
                if (trendEl) {
                    const trendValue = parseFloat(stat.trend);
                    trendEl.textContent = stat.trend;
                    trendEl.parentElement.className = `stat-trend ${trendValue >= 0 ? 'positive' : 'negative'}`;
                }
                if (volumeEl && stat.volume) {
                    volumeEl.textContent = `24h Volume: ${stat.volume}`;
                }
            }
        });

        // Update MEV Activity with smooth animations
        const activities = {
            arbitrage: {
                value: Math.floor(300 + Math.sin(Date.now() / 6000) * 30),
                progress: Math.floor(70 + Math.sin(Date.now() / 5000) * 5)
            },
            sandwich: {
                value: Math.floor(140 + Math.sin(Date.now() / 7000) * 20),
                progress: Math.floor(40 + Math.sin(Date.now() / 4000) * 5)
            },
            liquidations: {
                value: Math.floor(80 + Math.sin(Date.now() / 8000) * 15),
                progress: Math.floor(30 + Math.sin(Date.now() / 3000) * 5)
            }
        };

        // Update activity breakdown with animations
        document.querySelectorAll('.breakdown-grid .cyber-card').forEach(card => {
            const title = card.querySelector('h2')?.textContent.toLowerCase();
            if (!title) return;

            let activity;
            if (title.includes('arbitrage')) activity = activities.arbitrage;
            else if (title.includes('sandwich')) activity = activities.sandwich;
            else if (title.includes('liquidations')) activity = activities.liquidations;

            if (activity) {
                const valueEl = card.querySelector('.stat-value');
                const progressEl = card.querySelector('.progress');
                if (valueEl) {
                    valueEl.style.transition = 'color 0.3s ease';
                    valueEl.textContent = activity.value;
                }
                if (progressEl) {
                    progressEl.style.transition = 'width 0.5s ease';
                    progressEl.style.width = `${activity.progress}%`;
                }
            }
        });

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