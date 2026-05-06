/**
 * Main Application Controller
 * Coordinates all modules and handles global functionality
 */

class TravelSahayakApp {
    constructor() {
        this.currentScreen = 'bookingScreen';
        this.screens = ['bookingScreen', 'confirmationScreen', 'trackingScreen', 'completeScreen'];
    }
    
    init() {
        // Initialize booking manager
        window.bookingManager.init();
        
        // Setup payment method selection
        this.setupPaymentMethods();
        
        // Welcome message
        if (window.accessibilityManager && window.accessibilityManager.settings.voiceAssist) {
            setTimeout(() => {
                window.accessibilityManager.speak(
                    'Welcome to Travel Sahayak. Book your safe and comfortable ride easily.'
                );
            }, 1000);
        }
        
        console.log('Travel Sahayak App initialized successfully');
    }
    
    setupPaymentMethods() {
        document.querySelectorAll('.payment-option').forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('.payment-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                option.classList.add('selected');
                option.querySelector('input').checked = true;
            });
        });
    }
    
    switchScreen(screenId) {
        // Hide all screens
        this.screens.forEach(id => {
            const screen = document.getElementById(id);
            if (screen) {
                screen.classList.remove('active');
            }
        });
        
        // Show target screen
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenId;
            
            // Scroll to top
            window.scrollTo(0, 0);
            
            // Focus management for accessibility
            const focusTarget = targetScreen.querySelector('h2, h3, .form-input');
            if (focusTarget) {
                setTimeout(() => focusTarget.focus(), 100);
            }
        }
    }
    
    // showLoading(message = 'Loading...') {
    //     const overlay = document.getElementById('loadingOverlay');
    //     document.getElementById('loadingText').textContent = message;
    //     overlay.hidden = false;
    // }
    
    showLoading(message = 'Loading...') {
    const overlay = document.getElementById('loadingOverlay');
    document.getElementById('loadingText').textContent = message;
    overlay.hidden = false;

    // ✅ Auto-hide safety (fixes infinite loading)
    this.loadingTimeout = setTimeout(() => {
        this.hideLoading();
        this.showToast('Something went wrong, please try again', 'error');
    }, 5000);
}

    hideLoading() {
        document.getElementById('loadingOverlay').hidden = true;
    }
    
    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        
        toast.innerHTML = `
            <i class="fas ${icons[type] || icons.info}"></i>
            <span>${message}</span>
        `;
        
        container.appendChild(toast);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
        
        // Announce to screen reader
        if (window.accessibilityManager) {
            window.accessibilityManager.announceToScreenReader(message, type === 'error' ? 'assertive' : 'polite');
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new TravelSahayakApp();
    window.app.init();
});
