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
                        data: [85, 95, 75, 80, 90, 70],
                        borderColor: '#00ff88',
                        backgroundColor: 'rgba(0, 255, 136, 0.2)',
                        pointBackgroundColor: '#00ff88',
                        pointBorderColor: '#fff'
                    }]
                },
                options: {
                    scales: {
                        r: {
                            angleLines: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            pointLabels: {
                                color: '#ffffff'
                            },
                            ticks: {
                                color: '#ffffff',
                                backdropColor: 'transparent'
                            }
                        }
                    },
                    animation: {
                        duration: 1000
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