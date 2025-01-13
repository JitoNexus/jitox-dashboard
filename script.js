(() => {
    // Global variables for charts
    let solChart = null, networkChart = null, volumeChart = null;
    let isInitialized = false;

    // Chart configuration defaults
    const chartDefaults = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 1000,
            easing: 'easeInOutQuart'
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                enabled: true,
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(16, 20, 24, 0.95)',
                titleColor: '#fff',
                bodyColor: 'rgba(255, 255, 255, 0.8)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                padding: 12,
                boxPadding: 6,
                usePointStyle: true
            }
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)',
                    drawBorder: false
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.6)'
                }
            },
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)',
                    drawBorder: false
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.6)',
                    callback: function(value) {
                        return value.toLocaleString();
                    }
                }
            }
        }
    };

    // Utility functions
    function getRandomData(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function createGradient(ctx, colorStart, colorEnd) {
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, colorStart);
        gradient.addColorStop(1, colorEnd);
        return gradient;
    }

    // Loading screen initialization
    function initializeLoadingScreen() {
        console.log('Initializing loading screen');
        const loadingContainer = document.getElementById('loadingContainer');
        const mainContent = document.getElementById('mainContent');
        const progressBar = document.getElementById('loadingProgress');
        const statusItems = document.querySelectorAll('.status-item');
        let progress = 0;

        if (!loadingContainer || !mainContent || !progressBar) {
            console.error('Required elements not found');
            return;
        }

        // Show loading screen, hide main content
        loadingContainer.style.display = 'flex';
        mainContent.style.display = 'none';

        // Update progress and status items
        const interval = setInterval(() => {
            progress += 1;
            if (progressBar) progressBar.style.width = `${progress}%`;

            // Update status items based on progress
            if (progress >= 30) statusItems[0]?.classList.add('completed');
            if (progress >= 60) statusItems[1]?.classList.add('completed');
            if (progress >= 90) statusItems[2]?.classList.add('completed');

            if (progress >= 100) {
                clearInterval(interval);
                // Initialize main content after loading
                setTimeout(() => {
                    try {
                        initializeMainContent();
                        loadingContainer.style.display = 'none';
                        mainContent.style.display = 'block';
                    } catch (error) {
                        console.error('Error initializing main content:', error);
                    }
                }, 500);
            }
        }, 30);
    }

    // Chart initialization functions
    function initializeCharts() {
        try {
            const networkCtx = document.getElementById('networkChart')?.getContext('2d');
            const volumeCtx = document.getElementById('volumeChart')?.getContext('2d');
            const solCtx = document.getElementById('solChart')?.getContext('2d');

            if (!networkCtx || !volumeCtx || !solCtx) {
                throw new Error('Required chart canvases not found');
            }

            // Destroy existing charts if they exist
            if (networkChart) networkChart.destroy();
            if (volumeChart) volumeChart.destroy();
            if (solChart) solChart.destroy();

            // Network Activity Chart
            networkChart = new Chart(networkCtx, {
                type: 'line',
                data: {
                    labels: Array(24).fill('').map((_, i) => `${23-i}h`),
                    datasets: [{
                        label: 'TPS',
                        data: Array(24).fill(0).map(() => getRandomData(500, 2000)),
                        borderColor: createGradient(networkCtx, '#00ffff', '#0066ff'),
                        backgroundColor: 'transparent',
                        tension: 0.4,
                        borderWidth: 2
                    }]
                },
                options: chartDefaults
            });

            // Volume Distribution Chart
            volumeChart = new Chart(volumeCtx, {
                type: 'bar',
                data: {
                    labels: Array(12).fill('').map((_, i) => `${i*2}:00`),
                    datasets: [{
                        label: 'Volume',
                        data: Array(12).fill(0).map(() => getRandomData(5, 50)),
                        backgroundColor: createGradient(volumeCtx, '#00ff88', '#00aa44'),
                        borderRadius: 4
                    }]
                },
                options: chartDefaults
            });

            // SOL Gained Chart
            solChart = new Chart(solCtx, {
                type: 'line',
                data: {
                    labels: Array(24).fill('').map((_, i) => `${23-i}h`),
                    datasets: [{
                        label: 'SOL',
                        data: Array(24).fill(0).map(() => getRandomData(100, 1000)),
                        borderColor: createGradient(solCtx, '#ff00ff', '#aa00aa'),
                        backgroundColor: 'transparent',
                        tension: 0.4,
                        borderWidth: 2
                    }]
                },
                options: chartDefaults
            });

        } catch (error) {
            console.error('Error initializing charts:', error);
            throw error;
        }
    }

    // Time selector initialization
    function initializeTimeSelector() {
        const timeButtons = document.querySelectorAll('.time-selector button');
        timeButtons.forEach(button => {
            button.addEventListener('click', () => {
                timeButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                updateChartData(button.textContent);
            });
        });
    }

    // Chart data update function
    function updateChartData(timeRange) {
        try {
            switch(timeRange) {
                case '24H':
                    if (solChart) {
                        solChart.data.labels = Array(24).fill('').map((_, i) => `${23-i}h`);
                        solChart.data.datasets[0].data = Array(24).fill(0).map(() => getRandomData(100, 1000));
                        solChart.update();
                    }
                    break;
                case '7D':
                    if (solChart) {
                        solChart.data.labels = Array(7).fill('').map((_, i) => `Day ${7-i}`);
                        solChart.data.datasets[0].data = Array(7).fill(0).map(() => getRandomData(500, 2000));
                        solChart.update();
                    }
                    break;
                case '30D':
                    if (solChart) {
                        solChart.data.labels = Array(30).fill('').map((_, i) => `Day ${30-i}`);
                        solChart.data.datasets[0].data = Array(30).fill(0).map(() => getRandomData(800, 3000));
                        solChart.update();
                    }
                    break;
            }
        } catch (error) {
            console.error('Error updating chart data:', error);
        }
    }

    // Main content initialization
    function initializeMainContent() {
        try {
            // Initialize charts
            initializeCharts();
            // Initialize other components
            initializeTimeSelector();
            startUpdates();
        } catch (error) {
            console.error('Error initializing main content:', error);
            throw error;
        }
    }

    // Start continuous updates
    function startUpdates() {
        setInterval(() => {
            try {
                // Update network chart
                if (networkChart) {
                    const newData = networkChart.data.datasets[0].data.slice(1);
                    newData.push(getRandomData(500, 2000));
                    networkChart.data.datasets[0].data = newData;
                    networkChart.update('none');
                }

                // Update volume chart
                if (volumeChart) {
                    volumeChart.data.datasets[0].data = volumeChart.data.datasets[0].data.map(() => 
                        getRandomData(5, 50)
                    );
                    volumeChart.update('none');
                }

                // Update SOL chart
                if (solChart) {
                    const newData = solChart.data.datasets[0].data.slice(1);
                    newData.push(getRandomData(100, 1000));
                    solChart.data.datasets[0].data = newData;
                    solChart.update('none');
                }
            } catch (error) {
                console.error('Error updating charts:', error);
            }
        }, 2000);
    }

    // Initialize everything when DOM is ready - MOVED TO BOTTOM
    document.addEventListener('DOMContentLoaded', () => {
        initializeLoadingScreen();
    });
})();