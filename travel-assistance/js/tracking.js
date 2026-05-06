/**
 * Tracking Module
 * Handles real-time ride tracking with map integration
 */

class TrackingManager {
    constructor() {
        this.map = null;
        this.driverMarker = null;
        this.userMarker = null;
        this.destinationMarker = null;
        this.routeLine = null;
        this.trackingInterval = null;
        this.currentStatus = 'booked';
        
        // Mapbox access token (replace with your own)
        this.mapboxToken = 'YOUR_MAPBOX_TOKEN';
    }
    
    async initMap(containerId) {
        // Check if Mapbox is available
        if (typeof mapboxgl === 'undefined') {
            console.warn('Mapbox not loaded. Using fallback map display.');
            this.showFallbackMap(containerId);
            return;
        }
        
        mapboxgl.accessToken = this.mapboxToken;
        
        this.map = new mapboxgl.Map({
            container: containerId,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [77.5946, 12.9716], // Default: Bangalore
            zoom: 13
        });
        
        // Add navigation controls
        this.map.addControl(new mapboxgl.NavigationControl(), 'top-right');
        
        // Wait for map to load
        return new Promise((resolve) => {
            this.map.on('load', () => {
                resolve(this.map);
            });
        });
    }
    
    showFallbackMap(containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = `
            <div style="
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #e0f2fe, #bae6fd);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: #0369a1;
            ">
                <i class="fas fa-map-marked-alt" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <p style="font-weight: 600;">Live tracking active</p>
                <p style="font-size: 0.9rem; opacity: 0.8;">Driver location updating...</p>
            </div>
        `;
    }
    
    addMarker(lngLat, type) {
        if (!this.map) return null;
        
        const el = document.createElement('div');
        el.className = `marker marker-${type}`;
        
        // Set marker styles based on type
        const styles = {
            driver: { bg: '#2563eb', icon: 'fa-car' },
            user: { bg: '#22c55e', icon: 'fa-user' },
            destination: { bg: '#ef4444', icon: 'fa-flag-checkered' }
        };
        
        const style = styles[type] || styles.driver;
        
        el.innerHTML = `
            <div style="
                width: 40px;
                height: 40px;
                background: ${style.bg};
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                border: 3px solid white;
            ">
                <i class="fas ${style.icon}"></i>
            </div>
        `;
        
        return new mapboxgl.Marker(el)
            .setLngLat(lngLat)
            .addTo(this.map);
    }
    
    updateDriverLocation(lngLat) {
        if (this.driverMarker) {
            this.driverMarker.setLngLat(lngLat);
        }
        
        // Update ETA based on new location
        this.calculateETA();
    }
    
    calculateETA() {
        // Simulated ETA calculation
        const randomETA = Math.floor(Math.random() * 5) + 3;
        const randomDistance = (Math.random() * 2 + 0.5).toFixed(1);
        
        document.getElementById('liveETA').textContent = `${randomETA} mins`;
        document.getElementById('liveDistance').textContent = `${randomDistance} km`;
        
        return { eta: randomETA, distance: randomDistance };
    }
    
    setRoute(pickup, destination) {
        // In a real app, this would call a routing API
        // For demo, we'll create a simple line
        if (!this.map) return;
        
        const route = {
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'LineString',
                coordinates: [pickup, destination]
            }
        };
        
        if (this.map.getSource('route')) {
            this.map.getSource('route').setData(route);
        } else {
            this.map.addSource('route', {
                type: 'geojson',
                data: route
            });
            
            this.map.addLayer({
                id: 'route',
                type: 'line',
                source: 'route',
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                paint: {
                    'line-color': '#2563eb',
                    'line-width': 5,
                    'line-opacity': 0.8
                }
            });
        }
    }
    
    startTracking(driverData, pickup, destination) {
        // Set initial markers
        if (this.map) {
            this.userMarker = this.addMarker(pickup, 'user');
            this.destinationMarker = this.addMarker(destination, 'destination');
            this.driverMarker = this.addMarker(driverData.location, 'driver');
            
            // Fit map to show all markers
            const bounds = new mapboxgl.LngLatBounds();
            bounds.extend(pickup);
            bounds.extend(destination);
            bounds.extend(driverData.location);
            this.map.fitBounds(bounds, { padding: 50 });
        }
        
        // Update mini driver card
        document.getElementById('miniDriverPhoto').src = driverData.photo;
        document.getElementById('miniDriverName').textContent = driverData.name;
        document.getElementById('miniVehicle').textContent = `${driverData.vehicle} • ${driverData.vehicleNumber}`;
        
        // Start simulated tracking updates
        this.trackingInterval = setInterval(() => {
            this.simulateDriverMovement();
        }, 3000);
    }
    
    simulateDriverMovement() {
        // Simulate driver movement
        if (this.driverMarker) {
            const currentPos = this.driverMarker.getLngLat();
            const newPos = {
                lng: currentPos.lng + (Math.random() - 0.5) * 0.002,
                lat: currentPos.lat + (Math.random() - 0.5) * 0.002
            };
            this.updateDriverLocation([newPos.lng, newPos.lat]);
        }
        
        // Update ETA
        this.calculateETA();
    }
    
    updateStatus(status) {
        this.currentStatus = status;
        
        const statusElements = {
            'booked': 'status-booked',
            'arriving': 'status-arriving',
            'pickup': 'status-pickup',
            'enroute': 'status-enroute',
            'arrived': 'status-arrived'
        };
        
        const statusOrder = ['booked', 'arriving', 'pickup', 'enroute', 'arrived'];
        const currentIndex = statusOrder.indexOf(status);
        
        statusOrder.forEach((s, index) => {
            const element = document.getElementById(statusElements[s]);
            if (element) {
                element.classList.remove('completed', 'active');
                if (index < currentIndex) {
                    element.classList.add('completed');
                } else if (index === currentIndex) {
                    element.classList.add('active');
                }
            }
        });
        
        // Announce status change
        if (window.accessibilityManager) {
            const statusMessages = {
                'arriving': 'Driver is on the way to pick you up',
                'pickup': 'Driver has arrived at your location',
                'enroute': 'Your ride has started. You are on the way to your destination',
                'arrived': 'You have arrived at your destination'
            };
            
            if (statusMessages[status]) {
                window.accessibilityManager.announceToScreenReader(statusMessages[status], 'assertive');
            }
        }
    }
    
    stopTracking() {
        if (this.trackingInterval) {
            clearInterval(this.trackingInterval);
            this.trackingInterval = null;
        }
    }
    
    shareLocation() {
        const shareData = {
            title: 'My Live Location - Travel Sahayak',
            text: `I'm on a ride with Travel Sahayak. Track my journey here.`,
            url: window.location.href + '?tracking=live'
        };
        
        if (navigator.share) {
            navigator.share(shareData).catch(console.error);
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(shareData.url + '\n' + shareData.text);
            window.app.showToast('Link copied to clipboard!', 'success');
        }
    }
    
    triggerEmergency() {
        // In a real app, this would:
        // 1. Send location to emergency contacts
        // 2. Notify support team
        // 3. Optionally call emergency services
        
        const emergencyData = {
            timestamp: new Date().toISOString(),
            location: this.driverMarker ? this.driverMarker.getLngLat() : null,
            status: this.currentStatus
        };
        
        console.log('Emergency triggered:', emergencyData);
        
        // Show confirmation
        window.app.showToast('Emergency services notified. Help is on the way.', 'warning');
        
        // Announce to screen reader
        if (window.accessibilityManager) {
            window.accessibilityManager.announceToScreenReader(
                'Emergency alert sent. Your location has been shared with emergency contacts and support team.',
                'assertive'
            );
        }
        
        return emergencyData;
    }
}

// Initialize and export
const trackingManager = new TrackingManager();
window.trackingManager = trackingManager;
