/**
 * Accessibility Module
 * Handles all accessibility features for senior citizens and specially abled users
 */

class AccessibilityManager {
    constructor() {
        this.panel = document.getElementById('accessibilityPanel');
        this.toggleBtn = document.getElementById('accessibilityBtn');
        this.closeBtn = document.getElementById('closePanelBtn');
        this.fontSizeRange = document.getElementById('fontSizeRange');
        this.highContrastCheck = document.getElementById('highContrast');
        this.reduceMotionCheck = document.getElementById('reduceMotion');
        this.voiceAssistCheck = document.getElementById('voiceAssist');
        
        this.speechSynthesis = window.speechSynthesis;
        this.settings = this.loadSettings();
        
        this.init();
    }
    
    init() {
        this.applySettings();
        this.bindEvents();
        this.setupKeyboardNavigation();
    }
    
    loadSettings() {
        const saved = localStorage.getItem('accessibilitySettings');
        return saved ? JSON.parse(saved) : {
            fontSize: 16,
            highContrast: false,
            reduceMotion: false,
            voiceAssist: false
        };
    }
    
    saveSettings() {
        localStorage.setItem('accessibilitySettings', JSON.stringify(this.settings));
    }
    
    applySettings() {
        // Apply font size
        document.documentElement.style.setProperty('--font-size-base', `${this.settings.fontSize}px`);
        this.fontSizeRange.value = this.settings.fontSize;
        
        // Apply high contrast
        document.body.classList.toggle('high-contrast', this.settings.highContrast);
        this.highContrastCheck.checked = this.settings.highContrast;
        
        // Apply reduce motion
        document.body.classList.toggle('reduce-motion', this.settings.reduceMotion);
        this.reduceMotionCheck.checked = this.settings.reduceMotion;
        
        // Apply voice assist
        this.voiceAssistCheck.checked = this.settings.voiceAssist;
    }
    
    bindEvents() {
        // Toggle panel
        this.toggleBtn.addEventListener('click', () => this.togglePanel());
        this.closeBtn.addEventListener('click', () => this.closePanel());
        
        // Font size change
        this.fontSizeRange.addEventListener('input', (e) => {
            this.settings.fontSize = parseInt(e.target.value);
            document.documentElement.style.setProperty('--font-size-base', `${this.settings.fontSize}px`);
            this.saveSettings();
        });
        
        // High contrast
        this.highContrastCheck.addEventListener('change', (e) => {
            this.settings.highContrast = e.target.checked;
            document.body.classList.toggle('high-contrast', e.target.checked);
            this.saveSettings();
            if (this.settings.voiceAssist) {
                this.speak(e.target.checked ? 'High contrast mode enabled' : 'High contrast mode disabled');
            }
        });
        
        // Reduce motion
        this.reduceMotionCheck.addEventListener('change', (e) => {
            this.settings.reduceMotion = e.target.checked;
            document.body.classList.toggle('reduce-motion', e.target.checked);
            this.saveSettings();
        });
        
        // Voice assist
        this.voiceAssistCheck.addEventListener('change', (e) => {
            this.settings.voiceAssist = e.target.checked;
            this.saveSettings();
            if (e.target.checked) {
                this.speak('Voice assistance enabled. I will read important information for you.');
            }
        });
        
        // Close panel on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.panel.classList.contains('open')) {
                this.closePanel();
            }
        });
        
        // Close panel on outside click
        document.addEventListener('click', (e) => {
            if (this.panel.classList.contains('open') && 
                !this.panel.contains(e.target) && 
                !this.toggleBtn.contains(e.target)) {
                this.closePanel();
            }
        });
    }
    
    togglePanel() {
        this.panel.classList.toggle('open');
        if (this.panel.classList.contains('open')) {
            this.panel.querySelector('h2').focus();
            if (this.settings.voiceAssist) {
                this.speak('Accessibility settings panel opened');
            }
        }
    }
    
    closePanel() {
        this.panel.classList.remove('open');
        this.toggleBtn.focus();
    }
    
    setupKeyboardNavigation() {
        // Enhanced focus indicators
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
        
        // Add keyboard support for ride options
        document.querySelectorAll('.ride-option').forEach(option => {
            option.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    option.querySelector('input').checked = true;
                    option.querySelector('input').dispatchEvent(new Event('change'));
                    
                    // Update selected class
                    document.querySelectorAll('.ride-option').forEach(opt => {
                        opt.classList.remove('selected');
                    });
                    option.classList.add('selected');
                }
            });
        });
    }
    
    speak(text) {
        if (!this.settings.voiceAssist || !this.speechSynthesis) return;
        
        // Cancel any ongoing speech
        this.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-IN'; // Indian English
        utterance.rate = 0.9; // Slightly slower for clarity
        utterance.pitch = 1;
        
        this.speechSynthesis.speak(utterance);
    }
    
    announceToScreenReader(message, priority = 'polite') {
        const announcer = document.createElement('div');
        announcer.setAttribute('role', 'status');
        announcer.setAttribute('aria-live', priority);
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only';
        announcer.textContent = message;
        
        document.body.appendChild(announcer);
        
        setTimeout(() => announcer.remove(), 1000);
        
        // Also speak if voice assist is enabled
        if (this.settings.voiceAssist) {
            this.speak(message);
        }
    }
}

// Initialize accessibility manager
const accessibilityManager = new AccessibilityManager();

// Export for use in other modules
window.accessibilityManager = accessibilityManager;
