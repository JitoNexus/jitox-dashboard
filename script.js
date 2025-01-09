// Initialize variables for charts
let solChart = null;
let mevChart = null;
let sandwichChart = null;
let aiPerformanceChart = null;
let chartUpdateInterval = null;
let activityUpdateInterval = null;

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