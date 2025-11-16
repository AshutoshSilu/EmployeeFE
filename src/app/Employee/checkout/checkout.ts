import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header';
import { FooterComponent } from '../../shared/footer/footer';
import { PaymentGatewayComponent } from '../payment-gateway/payment-gateway';

declare var google: any;

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, HeaderComponent, FooterComponent, PaymentGatewayComponent],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class CheckoutComponent implements OnInit, AfterViewInit {
  @ViewChild('locationInput') locationInput!: ElementRef;
  orderItems: OrderItem[] = [];
  orderTotal: number = 0;
  currentLat: number = 20.2961;
  currentLng: number = 85.8245;
  watchId: number | null = null;
  locationAccuracy: number = 0;
  map: any;
  marker: any;
  mapLibraryLoaded: boolean = false;
  locationSuggestions: any[] = [];
  showSuggestions: boolean = false;
  locationSelected: boolean = false;
  showPayment: boolean = false;
  currentOrderData: any = {};

  constructor(private router: Router) {}

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.orderItems = navigation.extras.state['cartItems'] || [];
      this.orderTotal = navigation.extras.state['total'] || 0;
      if (this.orderTotal === 0) {
        this.calculateTotal();
      }
    }
    this.loadGoogleMaps();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initializeMap();
      this.setupLocationSearch();
    }, 1000);
  }

  setupLocationSearch() {
    if (this.locationInput?.nativeElement) {
      this.locationInput.nativeElement.addEventListener('input', (e: any) => {
        const query = e.target.value;
        
        // Reset location selected flag when user starts typing new text
        if (!query.startsWith('Selected:') && !query.startsWith('GPS:')) {
          this.locationSelected = false;
        }
        
        if (query.length > 2 && !query.startsWith('Selected:') && !query.startsWith('GPS:') && !this.locationSelected) {
          this.searchLocation(query);
        } else {
          this.showSuggestions = false;
          this.updateSuggestionsDisplay();
        }
      });
      
      // Add click outside listener
      document.addEventListener('click', this.handleClickOutside.bind(this));
    }
  }

  searchLocation(query: string) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`;
    
    fetch(url)
      .then(response => response.json())
      .then(data => {
        this.locationSuggestions = data.map((item: any) => ({
          display_name: item.display_name,
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon)
        }));
        this.showSuggestions = this.locationSuggestions.length > 0;
        this.updateSuggestionsDisplay();
      })
      .catch(error => {
        console.error('Search error:', error);
        this.showSuggestions = false;
      });
  }

  updateSuggestionsDisplay() {
    let suggestionsContainer = document.getElementById('location-suggestions');
    
    if (!suggestionsContainer) {
      suggestionsContainer = document.createElement('div');
      suggestionsContainer.id = 'location-suggestions';
      suggestionsContainer.style.cssText = `
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border: 2px solid rgba(139, 195, 74, 0.3);
        border-top: none;
        border-radius: 0 0 8px 8px;
        max-height: 200px;
        overflow-y: auto;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(76, 175, 80, 0.1);
      `;
      this.locationInput.nativeElement.parentElement.style.position = 'relative';
      this.locationInput.nativeElement.parentElement.appendChild(suggestionsContainer);
    }

    if (this.showSuggestions) {
      suggestionsContainer.innerHTML = this.locationSuggestions.map((suggestion, index) => `
        <div class="suggestion-item" data-index="${index}" style="
          padding: 0.8rem;
          cursor: pointer;
          border-bottom: 1px solid rgba(139, 195, 74, 0.1);
          transition: background-color 0.2s ease;
        " onmouseover="this.style.backgroundColor='#f1f8e9'" onmouseout="this.style.backgroundColor='white'">
          <div style="font-weight: 600; color: #4caf50; margin-bottom: 0.2rem;">
            📍 ${suggestion.display_name.split(',')[0]}
          </div>
          <div style="font-size: 0.85rem; color: #666;">
            ${suggestion.display_name}
          </div>
        </div>
      `).join('');

      // Add click listeners to suggestions
      suggestionsContainer.querySelectorAll('.suggestion-item').forEach((item, index) => {
        item.addEventListener('click', () => this.selectLocation(index));
      });
      
      suggestionsContainer.style.display = 'block';
    } else {
      suggestionsContainer.style.display = 'none';
    }
  }

  selectLocation(index: number) {
    const selected = this.locationSuggestions[index];
    if (selected) {
      this.currentLat = selected.lat;
      this.currentLng = selected.lon;
      
      this.locationInput.nativeElement.value = selected.display_name;
      this.locationSelected = true;
      this.showSuggestions = false;
      this.updateSuggestionsDisplay();
      
      // Update map
      if (this.map && this.marker) {
        this.map.setView([this.currentLat, this.currentLng], 15);
        this.marker.setLatLng([this.currentLat, this.currentLng]);
      }
    }
  }

  loadGoogleMaps() {
    // Load Leaflet CSS and JS for interactive map
    if (!document.querySelector('link[href*="leaflet"]')) {
      const leafletCSS = document.createElement('link');
      leafletCSS.rel = 'stylesheet';
      leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(leafletCSS);
      
      const leafletJS = document.createElement('script');
      leafletJS.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      leafletJS.onload = () => this.mapLibraryLoaded = true;
      document.head.appendChild(leafletJS);
    }
  }

  initializeMap() {
    setTimeout(() => {
      if (typeof (window as any).L !== 'undefined') {
        this.createInteractiveMap();
      } else {
        this.showMapPlaceholder();
      }
    }, 500);
  }

  createInteractiveMap() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    // Clear any existing content
    mapContainer.innerHTML = '';

    // Create Leaflet map
    this.map = (window as any).L.map('map').setView([this.currentLat, this.currentLng], 13);

    // Add OpenStreetMap tiles
    (window as any).L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Add draggable marker
    this.marker = (window as any).L.marker([this.currentLat, this.currentLng], {
      draggable: true
    }).addTo(this.map);

    // Update location when marker is dragged
    this.marker.on('dragend', (e: any) => {
      const position = e.target.getLatLng();
      this.currentLat = position.lat;
      this.currentLng = position.lng;
      this.updateLocationInput();
    });

    // Update location when map is clicked
    this.map.on('click', (e: any) => {
      this.currentLat = e.latlng.lat;
      this.currentLng = e.latlng.lng;
      this.marker.setLatLng([this.currentLat, this.currentLng]);
      this.updateLocationInput();
    });
  }

  showMapPlaceholder() {
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
      mapContainer.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #f1f8e9; color: #4caf50; font-weight: 600;">
          <div style="text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">🗺️</div>
            <p>Click "Use Current Location" to set your position</p>
          </div>
        </div>
      `;
    }
  }

  updateLocationInput() {
    if (this.locationInput?.nativeElement) {
      this.locationInput.nativeElement.value = `Selected: ${this.currentLat.toFixed(6)}, ${this.currentLng.toFixed(6)}`;
      this.locationSelected = true;
    }
  }

  calculateTotal() {
    this.orderTotal = this.orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getCurrentLocation() {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    // Show loading state
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
      mapContainer.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #fff3cd; color: #856404; font-weight: 600;">
          <div style="text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">🛰️</div>
            <p>Getting your GPS location...</p>
          </div>
        </div>
      `;
    }
    
    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.currentLat = position.coords.latitude;
        this.currentLng = position.coords.longitude;
        this.locationAccuracy = position.coords.accuracy;
        
        this.updateLocationInput();
        
        // Update map with current location
        if (this.map && this.marker) {
          this.map.setView([this.currentLat, this.currentLng], 15);
          this.marker.setLatLng([this.currentLat, this.currentLng]);
        } else {
          this.createInteractiveMap();
        }
        
        this.startLocationTracking();
      },
      (error) => {
        console.error('GPS Error:', error);
        let message = 'GPS Error: ';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message += 'Location access denied.';
            break;
          case error.POSITION_UNAVAILABLE:
            message += 'Location unavailable.';
            break;
          case error.TIMEOUT:
            message += 'Request timed out.';
            break;
        }
        alert(message + ' Please enter location manually.');
        
        if (mapContainer) {
          mapContainer.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #f8d7da; color: #721c24; font-weight: 600;">
              <div style="text-align: center;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">❌</div>
                <p>GPS Error</p>
                <small>Enter location manually</small>
              </div>
            </div>
          `;
        }
      },
      options
    );
  }

  startLocationTracking() {
    if (this.watchId) {
      navigator.geolocation.clearWatch(this.watchId);
    }

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.currentLat = position.coords.latitude;
        this.currentLng = position.coords.longitude;
        this.locationAccuracy = position.coords.accuracy;
        
        this.updateLocationInput();
        
        // Update marker position on map
        if (this.map && this.marker) {
          this.marker.setLatLng([this.currentLat, this.currentLng]);
        }
      },
      (error) => console.error('Tracking error:', error),
      { enableHighAccuracy: true, maximumAge: 30000 }
    );
  }

  reverseGeocode(lat: number, lng: number) {
    // Simple implementation without API
    this.locationInput.nativeElement.value = `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
  }

  ngOnDestroy() {
    if (this.watchId) {
      navigator.geolocation.clearWatch(this.watchId);
    }
    // Remove event listeners
    document.removeEventListener('click', this.handleClickOutside.bind(this));
  }

  handleClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    const suggestionsContainer = document.getElementById('location-suggestions');
    const locationInput = this.locationInput?.nativeElement;
    
    if (suggestionsContainer && locationInput && 
        !suggestionsContainer.contains(target) && 
        !locationInput.contains(target)) {
      this.showSuggestions = false;
      this.updateSuggestionsDisplay();
    }
  }

  placeOrder() {
    const name = (document.getElementById('name') as HTMLInputElement)?.value;
    const address = (document.getElementById('address') as HTMLTextAreaElement)?.value;
    const pincode = (document.getElementById('pincode') as HTMLInputElement)?.value;
    const location = (document.getElementById('location') as HTMLInputElement)?.value;

    if (!name || !address || !pincode || !location) {
      alert('Please fill all required fields');
      return;
    }

    this.currentOrderData = {
      items: this.orderItems,
      total: this.orderTotal,
      deliveryAddress: {
        name,
        address,
        pincode,
        location,
        coordinates: {
          lat: this.currentLat,
          lng: this.currentLng,
          accuracy: this.locationAccuracy
        }
      }
    };

    this.showPayment = true;
  }

  onPaymentComplete(paymentData: any) {
    console.log('Payment completed:', paymentData);
    this.showPayment = false;
    this.router.navigate(['/']);
  }

  onPaymentCancelled() {
    this.showPayment = false;
  }
}