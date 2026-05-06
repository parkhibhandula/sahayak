/**
 * Booking Module
 * Handles location search, ride booking, and driver assignment
 */

class BookingManager {
    constructor() {
        this.pickupLocation = null;
        this.destination = null;
        this.selectedRideType = 'economy';
        this.specialRequirements = [];
        this.emergencyContact = '';
        this.currentBooking = null;
    }
    
    init() {
        this.bindEvents();
        this.setupLocationAutocomplete();
    }
    
    bindEvents() {
        // Use current location button
        document.getElementById('useCurrentLocation').addEventListener('click', () => {
            this.getCurrentLocation();
        });
        
        // Ride type selection
        document.querySelectorAll('.ride-option input').forEach(input => {
            input.addEventListener('change', (e) => {
                this.selectedRideType = e.target.value;
                
                // Update UI
                document.querySelectorAll('.ride-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                e.target.closest('.ride-option').classList.add('selected');
                
                // Recalculate fare
                if (this.pickupLocation && this.destination) {
                    this.updateFareEstimate();
                }
            });
        });
        
        // Special requirements
        document.querySelectorAll('input[name="requirements"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.specialRequirements = Array.from(
                    document.querySelectorAll('input[name="requirements"]:checked')
                ).map(cb => cb.value);
            });
        });
        
        // Emergency contact
        document.getElementById('emergencyContact').addEventListener('input', (e) => {
            this.emergencyContact = e.target.value;
        });
        
        // Form submission
        document.getElementById('bookingForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.bookRide();
        });
        
        // Location input changes
        ['pickupLocation', 'destination'].forEach(id => {
            document.getElementById(id).addEventListener('input', (e) => {
                this.handleLocationInput(e.target);
            });
            
            document.getElementById(id).addEventListener('blur', () => {
                setTimeout(() => {
                    document.getElementById(id === 'pickupLocation' ? 'pickupSuggestions' : 'destSuggestions')
                        .classList.remove('active');
                }, 200);
            });
        });
    }
    
    setupLocationAutocomplete() {
        // In a real app, this would connect to a geocoding API
        // For demo, we'll use simulated suggestions
    }
    
    handleLocationInput(input) {
        const value = input.value.trim();
        const suggestionsId = input.id === 'pickupLocation' ? 'pickupSuggestions' : 'destSuggestions';
        const suggestionsEl = document.getElementById(suggestionsId);
        
        if (value.length < 3) {
            suggestionsEl.classList.remove('active');
            return;
        }
        
        // Simulated suggestions
        const suggestions = this.getSimulatedSuggestions(value);
        
        if (suggestions.length > 0) {
            suggestionsEl.innerHTML = suggestions.map(s => `
                <div class="suggestion-item" data-lat="${s.lat}" data-lng="${s.lng}" data-address="${s.address}">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${s.address}</span>
                </div>
            `).join('');
            
            suggestionsEl.classList.add('active');
            
            // Handle suggestion clicks
            suggestionsEl.querySelectorAll('.suggestion-item').forEach(item => {
                item.addEventListener('click', () => {
                    input.value = item.dataset.address;
                    
                    const location = {
                        lat: parseFloat(item.dataset.lat),
                        lng: parseFloat(item.dataset.lng),
                        address: item.dataset.address
                    };
                    
                    if (input.id === 'pickupLocation') {
                        this.pickupLocation = location;
                    } else {
                        this.destination = location;
                    }
                    
                    suggestionsEl.classList.remove('active');
                    
                    // Calculate fare if both locations are set
                    if (this.pickupLocation && this.destination) {
                        this.updateFareEstimate();
                    }
                });
            });
        }
    }
    
    getSimulatedSuggestions(query) {
        // Simulated location suggestions
        const allLocations = [
            { address: 'MG Road Metro Station, Bangalore', lat: 12.9756, lng: 77.6063 },
            { address: 'Indiranagar 100 Feet Road, Bangalore', lat: 12.9784, lng: 77.6408 },
            { address: 'Koramangala 5th Block, Bangalore', lat: 12.9352, lng: 77.6245 },
            { address: 'Whitefield Main Road, Bangalore', lat: 12.9698, lng: 77.7500 },
            { address: 'Electronic City Phase 1, Bangalore', lat: 12.8399, lng: 77.6770 },
            { address: 'Jayanagar 4th Block, Bangalore', lat: 12.9259, lng: 77.5837 },
            { address: 'HSR Layout Sector 2, Bangalore', lat: 12.9116, lng: 77.6389 },
            { address: 'Marathahalli Bridge, Bangalore', lat: 12.9591, lng: 77.6974 },
            { address: 'Hebbal Flyover, Bangalore', lat: 13.0358, lng: 77.5970 },
            { address: 'Bannerghatta Road, Bangalore', lat: 12.8915, lng: 77.5965 }
        ];
        
        return allLocations.filter(loc => 
            loc.address.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);
    }
    
    // getCurrentLocation() {
    //     if (!navigator.geolocation) {
    //         window.app.showToast('Geolocation not supported by your browser', 'error');
    //         return;
    //     }
        
    //     window.app.showLoading('Getting your location...');
        
    //     navigator.geolocation.getCurrentPosition(
    //         (position) => {
    //             const { latitude, longitude } = position.coords;
                
    //             // Reverse geocode to get address (simulated)
    //             this.pickupLocation = {
    //                 lat: latitude,
    //                 lng: longitude,
    //                 address: 'Current Location (Detected)'
    //             };
                
    //             document.getElementById('pickupLocation').value = 'Current Location';
    //             window.app.hideLoading();
    //             window.app.showToast('Location detected successfully!', 'success');
                
    //             if (window.accessibilityManager) {
    //                 window.accessibilityManager.announceToScreenReader('Your current location has been detected');
    //             }
    //         },
    //         (error) => {
    //             window.app.hideLoading();
    //             window.app.showToast('Unable to get your location. Please enter manually.', 'error');
    //         },
    //         {
    //             enableHighAccuracy: true,
    //             timeout: 10000,
    //             maximumAge: 0
    //         }
    //     );
    // }

    getCurrentLocation() {
    if (!navigator.geolocation) {
        window.app.hideLoading();   // ✅ ADD THIS
        window.app.showToast('Geolocation not supported by your browser', 'error');
        return;
    }

    window.app.showLoading('Getting your location...');

    // ✅ SAFETY TIMEOUT (MOST IMPORTANT)
    const fallback = setTimeout(() => {
        window.app.hideLoading();
        window.app.showToast('Location timeout. Please enter manually.', 'error');
    }, 5000);

    navigator.geolocation.getCurrentPosition(
        (position) => {
            clearTimeout(fallback);  // ✅ stop timeout

            const { latitude, longitude } = position.coords;

            this.pickupLocation = {
                lat: latitude,
                lng: longitude,
                address: 'Current Location (Detected)'
            };

            document.getElementById('pickupLocation').value = 'Current Location';
            window.app.hideLoading();
            window.app.showToast('Location detected successfully!', 'success');
        },
        (error) => {
            clearTimeout(fallback);  // ✅ stop timeout
            window.app.hideLoading();  // ✅ MUST
            window.app.showToast('Unable to get your location. Please enter manually.', 'error');
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}
    
    updateFareEstimate() {
        if (!this.pickupLocation || !this.destination) return;
        
        // Calculate distance (simulated - in real app, use routing API)
        const distance = this.calculateDistance(
            this.pickupLocation.lat, this.pickupLocation.lng,
            this.destination.lat, this.destination.lng
        );
        
        // Estimate duration (assuming 25 km/h average speed in city)
        const duration = (distance / 25) * 60;
        
        const fare = window.paymentManager.calculateFare(distance, duration, this.selectedRideType);
        window.paymentManager.updateFareDisplay(fare);
    }
    
    calculateDistance(lat1, lon1, lat2, lon2) {
        // Haversine formula for distance calculation
        const R = 6371; // Earth's radius in km
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * 
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }
    
    toRad(deg) {
        return deg * Math.PI / 180;
    }
    
    // async bookRide() {
    //     // Validate inputs
    //     if (!this.pickupLocation) {
    //         window.app.showToast('Please enter pickup location', 'error');
    //         document.getElementById('pickupLocation').focus();
    //         return;
    //     }
        
    //     if (!this.destination) {
    //         window.app.showToast('Please enter destination', 'error');
    //         document.getElementById('destination').focus();
    //         return;
    //     }
        
    //     // Create booking
    //     this.currentBooking = {
    //         id: 'BK' + Date.now(),
    //         pickup: this.pickupLocation,
    //         destination: this.destination,
    //         rideType: this.selectedRideType,
    //         requirements: this.specialRequirements,
    //         emergencyContact: this.emergencyContact,
    //         fare: window.paymentManager.currentFare,
    //         timestamp: new Date().toISOString(),
    //         status: 'searching'
    //     };
        
    //     // Switch to confirmation screen
    //     window.app.switchScreen('confirmationScreen');
        
    //     // Find driver
    //     await this.findDriver();
    // }

    async bookRide() {
    // Validate pickup
    if (!this.pickupLocation) {
        const pickupValue = document.getElementById('pickupLocation').value.trim();

        if (pickupValue.length > 0) {
            this.pickupLocation = {
                lat: 0,
                lng: 0,
                address: pickupValue
            };
        } else {
            window.app.showToast('Please enter pickup location', 'error');
            document.getElementById('pickupLocation').focus();
            return;
        }
    }

    // ✅ FIXED DESTINATION LOGIC
    if (!this.destination) {
        const destValue = document.getElementById('destination').value.trim();

        if (destValue.length > 0) {
            this.destination = {
                lat: 0,
                lng: 0,
                address: destValue
            };
        } else {
            window.app.showToast('Please enter destination', 'error');
            document.getElementById('destination').focus();
            return;
        }
    }

    // Create booking
    this.currentBooking = {
        id: 'BK' + Date.now(),
        pickup: this.pickupLocation,
        destination: this.destination,
        rideType: this.selectedRideType,
        requirements: this.specialRequirements,
        emergencyContact: this.emergencyContact,
        fare: window.paymentManager.currentFare,
        timestamp: new Date().toISOString(),
        status: 'searching'
    };

    // Switch screen
    window.app.switchScreen('confirmationScreen');

    // Find driver
    await this.findDriver();
}
    
    async findDriver() {
        // Simulate driver search (2-5 seconds)
        const searchTime = Math.random() * 3000 + 2000;
        
        return new Promise((resolve) => {
            setTimeout(() => {
                const driver = this.generateDriver();
                this.currentBooking.driver = driver;
                this.currentBooking.status = 'confirmed';
                
                this.showDriverAssigned(driver);
                resolve(driver);
            }, searchTime);
        });
    }
    
    generateDriver() {
        const drivers = [
            { name: 'Ramesh Kumar', rating: 4.8, rides: 1250, photo: '[i.pravatar.cc](https://i.pravatar.cc/150?img=11)' },
            { name: 'Suresh Singh', rating: 4.9, rides: 2100, photo: '[i.pravatar.cc](https://i.pravatar.cc/150?img=12)' },
            { name: 'Mahesh Sharma', rating: 4.7, rides: 890, photo: '[i.pravatar.cc](https://i.pravatar.cc/150?img=13)' },
            { name: 'Ganesh Rao', rating: 4.6, rides: 650, photo: '[i.pravatar.cc](https://i.pravatar.cc/150?img=14)' }
        ];
        
        const vehicles = {
            economy: [
                { model: 'Maruti Swift', color: 'White' },
                { model: 'Hyundai i20', color: 'Silver' },
                { model: 'Honda Amaze', color: 'Red' }
            ],
            premium: [
                { model: 'Honda City', color: 'Black' },
                { model: 'Hyundai Verna', color: 'White' },
                { model: 'Toyota Corolla', color: 'Silver' }
            ],
            wheelchair: [
                { model: 'Maruti Ertiga (Accessible)', color: 'White' },
                { model: 'Toyota Innova (Accessible)', color: 'Grey' }
            ]
        };
        
        const driver = drivers[Math.floor(Math.random() * drivers.length)];
        const vehicleList = vehicles[this.selectedRideType] || vehicles.economy;
        const vehicle = vehicleList[Math.floor(Math.random() * vehicleList.length)];
        
        return {
            ...driver,
            vehicle: vehicle.model,
            vehicleColor: vehicle.color,
            vehicleNumber: this.generateVehicleNumber(),
            arrivalTime: Math.floor(Math.random() * 5) + 3,
            phone: '+91 98765 43210',
            location: [
                this.pickupLocation.lng + (Math.random() - 0.5) * 0.02,
                this.pickupLocation.lat + (Math.random() - 0.5) * 0.02
            ]
        };
    }
    
    generateVehicleNumber() {
        const states = ['KA', 'MH', 'TN', 'DL'];
        const state = states[Math.floor(Math.random() * states.length)];
        const district = Math.floor(Math.random() * 50) + 1;
        const series = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + 
                       String.fromCharCode(65 + Math.floor(Math.random() * 26));
        const number = Math.floor(Math.random() * 9000) + 1000;
        
        return `${state} ${district.toString().padStart(2, '0')} ${series} ${number}`;
    }
    
    showDriverAssigned(driver) {
        // Update confirmation screen
        const statusIcon = document.querySelector('.status-icon');
        statusIcon.classList.remove('searching');
        statusIcon.classList.add('found');
        statusIcon.innerHTML = '<i class="fas fa-check"></i>';
        
        document.getElementById('confirmationTitle').textContent = 'Driver Found!';
        document.getElementById('confirmationSubtitle').textContent = 'Your ride is confirmed';
        
        // Show driver card
        const driverCard = document.getElementById('driverCard');
        document.getElementById('driverPhoto').src = driver.photo;
        document.getElementById('driverName').textContent = driver.name;
        document.getElementById('driverRating').textContent = driver.rating;
        document.getElementById('driverRides').textContent = driver.rides;
        document.getElementById('vehicleModel').textContent = driver.vehicle;
        document.getElementById('vehicleNumber').textContent = driver.vehicleNumber;
        document.getElementById('vehicleColor').textContent = driver.vehicleColor;
        document.getElementById('vehicleColorIndicator').style.backgroundColor = 
            this.getColorCode(driver.vehicleColor);
        document.getElementById('arrivalTime').textContent = driver.arrivalTime;
        
        driverCard.hidden = false;
        
        // Show payment summary
        const paymentSummary = document.getElementById('paymentSummary');
        window.paymentManager.updatePaymentSummary(this.currentBooking.fare);
        paymentSummary.hidden = false;
        
        // Announce to screen reader
        if (window.accessibilityManager) {
            window.accessibilityManager.announceToScreenReader(
                `Driver ${driver.name} has been assigned. ${driver.vehicle}, ${driver.vehicleColor} color, number ${driver.vehicleNumber}. Arriving in ${driver.arrivalTime} minutes.`,
                'assertive'
            );
        }
        
        // Bind driver action buttons
        this.bindDriverActions(driver);
    }
    
    getColorCode(colorName) {
        const colors = {
            'White': '#ffffff',
            'Black': '#1a1a1a',
            'Silver': '#c0c0c0',
            'Grey': '#808080',
            'Red': '#dc2626',
            'Blue': '#2563eb'
        };
        return colors[colorName] || '#808080';
    }
    
    // bindDriverActions(driver) {
    //     // Call driver
    //     document.getElementById('callDriverBtn').addEventListener('click', () => {
    //         window.location.href = `tel:${driver.phone}`;
    //     });
        
    //     // Share ride
    //     document.getElementById('shareRideBtn').addEventListener('click', () => {
    //         window.trackingManager.shareLocation();
    //     });
        
    //     // Cancel ride
    //     document.getElementById('cancelRideBtn').addEventListener('click', () => {
    //         this.cancelRide();
    //     });
        
    //     // Mini call button
    //     document.getElementById('miniCallBtn').addEventListener('click', () => {
    //         window.location.href = `tel:${driver.phone}`;
    //     });
        
    //     // Simulate ride progression after a delay
    //     setTimeout(() => {
    //         this.startRide();
    //     }, 5000);
    // }
    
    bindDriverActions(driver) {
    // Remove old listeners (safe reset)
    document.removeEventListener('click', this._driverHandler);

    // Create handler
    this._driverHandler = (e) => {

        // 📞 Call Driver
        if (e.target.closest('#callDriverBtn')) {
            window.location.href = `tel:${driver.phone}`;
        }

        // 🔗 Share Trip
        if (e.target.closest('#shareRideBtn')) {
            const text = `🚗 Travel Sahayak Ride
Driver: ${driver.name}
Vehicle: ${driver.vehicle}
Number: ${driver.vehicleNumber}
Arriving in ${driver.arrivalTime} mins`;

            if (navigator.share) {
                navigator.share({
                    title: 'My Ride Details',
                    text: text
                });
            } else {
                navigator.clipboard.writeText(text);
                alert('Ride details copied!');
            }
        }

        // ❌ Cancel Ride
        if (e.target.closest('#cancelRideBtn')) {
            this.cancelRide();
        }

        // 📞 Mini Call
        if (e.target.closest('#miniCallBtn')) {
            window.location.href = `tel:${driver.phone}`;
        }
    }// ⏳ AUTO START RIDE (IMPORTANT FIX)
setTimeout(() => {
    this.startRide();
}, 3000);;

    // Attach globally (BEST FIX)
    document.addEventListener('click', this._driverHandler);
}

    startRide() {
        // Switch to tracking screen
        window.app.switchScreen('trackingScreen');
        
        // Initialize map and tracking
        window.trackingManager.initMap('map').then(() => {
            window.trackingManager.startTracking(
                this.currentBooking.driver,
                [this.pickupLocation.lng, this.pickupLocation.lat],
                [this.destination.lng, this.destination.lat]
            );
        });
        
        // Bind emergency button
        document.getElementById('emergencyBtn').addEventListener('click', () => {
            if (confirm('This will alert emergency services and your emergency contact. Continue?')) {
                window.trackingManager.triggerEmergency();
            }
        });
        
        // Simulate ride progression
        this.simulateRideProgress();
    }
    
    simulateRideProgress() {
        const statuses = ['arriving', 'pickup', 'enroute', 'arrived'];
        let index = 0;
        
        const progressInterval = setInterval(() => {
            if (index < statuses.length) {
                window.trackingManager.updateStatus(statuses[index]);
                
                if (statuses[index] === 'arrived') {
                    clearInterval(progressInterval);
                    setTimeout(() => this.completeRide(), 2000);
                }
                
                index++;
            }
        }, 5000);
    }
    
    completeRide() {
        // Stop tracking
        window.trackingManager.stopTracking();
        
        // Switch to completion screen
        window.app.switchScreen('completeScreen');
        
        // Update summary
        document.getElementById('summaryPickup').textContent = this.pickupLocation.address;
        document.getElementById('summaryDestination').textContent = this.destination.address;
        document.getElementById('summaryDistance').textContent = `${this.currentBooking.fare.distance.toFixed(1)} km`;
        document.getElementById('summaryDuration').textContent = `${Math.round(this.currentBooking.fare.duration)} mins`;
        document.getElementById('summaryAmount').textContent = `₹${this.currentBooking.fare.total}`;
        
        // Announce completion
        if (window.accessibilityManager) {
            window.accessibilityManager.announceToScreenReader(
                `You have arrived at your destination. Total fare is ${this.currentBooking.fare.total} rupees. Please rate your ride.`,
                'assertive'
            );
        }
        
        // Bind completion actions
        this.bindCompletionActions();
    }
    
    bindCompletionActions() {
        // Star rating
        let selectedRating = 0;
        document.querySelectorAll('.star').forEach(star => {
            star.addEventListener('click', () => {
                selectedRating = parseInt(star.dataset.rating);
                
                document.querySelectorAll('.star').forEach((s, index) => {
                    const icon = s.querySelector('i');
                    if (index < selectedRating) {
                        s.classList.add('active');
                        icon.className = 'fas fa-star';
                    } else {
                        s.classList.remove('active');
                        icon.className = 'far fa-star';
                    }
                });
            });
        });
        
        // Submit rating
        document.getElementById('submitRatingBtn').addEventListener('click', () => {
            const feedback = document.getElementById('feedbackText').value;
            
            window.app.showToast('Thank you for your feedback!', 'success');
            
            // Reset and go back to booking
            this.resetBooking();
            window.app.switchScreen('bookingScreen');
        });
        
        // Download receipt
        document.getElementById('downloadReceiptBtn').addEventListener('click', () => {
            const receipt = window.paymentManager.generateReceipt({
                pickup: this.pickupLocation.address,
                destination: this.destination.address,
                distance: this.currentBooking.fare.distance.toFixed(1),
                duration: Math.round(this.currentBooking.fare.duration),
                fare: this.currentBooking.fare,
                paymentMethod: 'Cash',
                transactionId: window.paymentManager.generateTransactionId(),
                driver: {
                    name: this.currentBooking.driver.name,
                    vehicle: this.currentBooking.driver.vehicle,
                    vehicleNumber: this.currentBooking.driver.vehicleNumber
                }
            });
            
            window.paymentManager.downloadReceipt(receipt);
            window.app.showToast('Receipt downloaded!', 'success');
        });
    }
    
    cancelRide() {
        if (confirm('Are you sure you want to cancel this ride?')) {
            window.app.showToast('Ride cancelled', 'warning');
            this.resetBooking();
            window.app.switchScreen('bookingScreen');
        }
    }
    
    resetBooking() {
        this.pickupLocation = null;
        this.destination = null;
        this.selectedRideType = 'economy';
        this.specialRequirements = [];
        this.currentBooking = null;
        
        // Reset form
        document.getElementById('bookingForm').reset();
        document.getElementById('totalFare').textContent = '₹--';
        document.getElementById('estimatedDistance').textContent = '-- km';
        document.getElementById('estimatedDuration').textContent = '-- mins';
        
        // Reset ride option selection
        document.querySelectorAll('.ride-option').forEach((opt, index) => {
            opt.classList.toggle('selected', index === 0);
        });
    }
}

// Initialize and export
const bookingManager = new BookingManager();
window.bookingManager = bookingManager;
