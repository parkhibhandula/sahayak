/**
 * Payment Module
 * Handles fare calculation and payment processing
 */

class PaymentManager {
    constructor() {
        this.baseFares = {
            economy: 50,
            premium: 80,
            wheelchair: 70
        };
        
        this.perKmRates = {
            economy: 12,
            premium: 18,
            wheelchair: 15
        };
        
        this.perMinRates = {
            economy: 1.5,
            premium: 2,
            wheelchair: 1.5
        };
        
        this.taxRate = 0.05; // 5% GST
        this.surgePricing = 1; // Normal pricing (1x)
        
        this.currentFare = null;
    }
    
    calculateFare(distance, duration, rideType) {
        const baseFare = this.baseFares[rideType] || this.baseFares.economy;
        const perKm = this.perKmRates[rideType] || this.perKmRates.economy;
        const perMin = this.perMinRates[rideType] || this.perMinRates.economy;
        
        const distanceFare = distance * perKm;
        const timeFare = duration * perMin;
        const subtotal = (baseFare + distanceFare + timeFare) * this.surgePricing;
        const taxes = subtotal * this.taxRate;
        const total = Math.round(subtotal + taxes);
        
        this.currentFare = {
            baseFare: Math.round(baseFare),
            distanceFare: Math.round(distanceFare),
            timeFare: Math.round(timeFare),
            subtotal: Math.round(subtotal),
            taxes: Math.round(taxes),
            total: total,
            rideType: rideType,
            distance: distance,
            duration: duration
        };
        
        return this.currentFare;
    }
    
    getEstimatedFares(distance, duration) {
        return {
            economy: this.calculateFare(distance, duration, 'economy').total,
            premium: this.calculateFare(distance, duration, 'premium').total,
            wheelchair: this.calculateFare(distance, duration, 'wheelchair').total
        };
    }
    
    updateFareDisplay(fare) {
        // Update main fare estimate
        document.getElementById('totalFare').textContent = `₹${fare.total}`;
        document.getElementById('estimatedDistance').textContent = `${fare.distance.toFixed(1)} km`;
        document.getElementById('estimatedDuration').textContent = `${Math.round(fare.duration)} mins`;
        
        // Update individual ride prices
        const fares = this.getEstimatedFares(fare.distance, fare.duration);
        document.getElementById('economyPrice').textContent = `₹${fares.economy}`;
        document.getElementById('premiumPrice').textContent = `₹${fares.premium}`;
        document.getElementById('wheelchairPrice').textContent = `₹${fares.wheelchair}`;
    }
    
    updatePaymentSummary(fare) {
        document.getElementById('paymentRideFare').textContent = `₹${fare.subtotal}`;
        document.getElementById('paymentTaxes').textContent = `₹${fare.taxes}`;
        document.getElementById('paymentTotal').textContent = `₹${fare.total}`;
    }
    
    async processPayment(method, amount) {
        // Simulate payment processing
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate 95% success rate
                if (Math.random() < 0.95) {
                    resolve({
                        success: true,
                        transactionId: this.generateTransactionId(),
                        method: method,
                        amount: amount,
                        timestamp: new Date().toISOString()
                    });
                } else {
                    reject(new Error('Payment failed. Please try again.'));
                }
            }, 1500);
        });
    }
    
    generateTransactionId() {
        return 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
    }
    
    generateReceipt(tripData) {
        const receipt = {
            receiptId: 'RCP' + Date.now(),
            ...tripData,
            generatedAt: new Date().toISOString()
        };
        
        return receipt;
    }
    
    downloadReceipt(receipt) {
        const content = `
TRAVEL SAHAYAK - RIDE RECEIPT
================================
Receipt ID: ${receipt.receiptId}
Date: ${new Date(receipt.generatedAt).toLocaleDateString('en-IN')}
Time: ${new Date(receipt.generatedAt).toLocaleTimeString('en-IN')}

TRIP DETAILS
------------
From: ${receipt.pickup}
To: ${receipt.destination}
Distance: ${receipt.distance} km
Duration: ${receipt.duration} mins

FARE BREAKDOWN
--------------
Base Fare: ₹${receipt.fare.baseFare}
Distance Charge: ₹${receipt.fare.distanceFare}
Time Charge: ₹${receipt.fare.timeFare}
Taxes (GST 5%): ₹${receipt.fare.taxes}
--------------
TOTAL: ₹${receipt.fare.total}

Payment Method: ${receipt.paymentMethod}
Transaction ID: ${receipt.transactionId}

DRIVER DETAILS
--------------
Name: ${receipt.driver.name}
Vehicle: ${receipt.driver.vehicle}
Number: ${receipt.driver.vehicleNumber}

Thank you for riding with Travel Sahayak!
For support: 1800-XXX-XXXX
================================
        `;
        
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `TravelSahayak_Receipt_${receipt.receiptId}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Initialize and export
const paymentManager = new PaymentManager();
window.paymentManager = paymentManager;
