document.addEventListener("DOMContentLoaded", () => {
    // Leaflet map initialization
    const map = L.map('map').setView([39.8283, -98.5795], 4); // Centered at United States

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    }).addTo(map);

    const vehicleIcon = L.icon({
        iconUrl: "../../assets/truck-icon-31.png", // Replace with the path to your vehicle icon
        iconSize: [32, 20], // Size of the icon
        iconAnchor: [16, 32], // Point of the icon which will correspond to marker's location
    });

    let allMarkers = [];
    let vehicleData = [];

    // Dummy data sets for vehicles within the United States
    const dummyDataAll = [
        { name: 'CRS 2567', lat: 38.9072, lng: -77.0369, status: 'driving', dateTime: '2024-06-16T10:30:00', events: [{ type: 'error', label: 'Error' }] },
        { name: 'CRS 2567', lat: 34.0522, lng: -118.2437, status: 'parked', dateTime: '2024-06-16T11:45:00', events: [{ type: 'warning', label: 'Warning' }] },
        { name: 'CRS 2567', lat: 40.7128, lng: -74.006, status: 'driving', dateTime: '2024-06-16T09:15:00', events: [{ type: 'info', label: 'Info' }] },
        { name: 'CRS 2567', lat: 29.7604, lng: -95.3698, status: 'parked', dateTime: '2024-06-16T12:00:00', events: [{ type: 'error', label: 'Error' }, { type: 'warning', label: 'Warning' }] }
    ];

    const dummyDataDriving = dummyDataAll.filter(vehicle => vehicle.status === 'driving');
    const dummyDataParked = dummyDataAll.filter(vehicle => vehicle.status === 'parked');

    // Function to add vehicle markers to the map
    function addVehicleMarkers(vehicles) {
        // Clear all existing markers
        allMarkers.forEach(marker => map.removeLayer(marker));
        allMarkers = [];

        // Add new markers
        vehicles.forEach(vehicle => {
            const marker = L.marker([vehicle.lat, vehicle.lng], { icon: vehicleIcon }).addTo(map).bindPopup(vehicle.name);
            allMarkers.push(marker);
        });
    }

    // Function to format date and time
    function formatDateTime(dateTime) {
        const date = new Date(dateTime);
        const formattedDate = `${date.getDate()} ${getMonthName(date.getMonth())}, ${date.getFullYear()}`;
        const formattedTime = `${date.getHours()}h ${date.getMinutes()}min`;
        return `${formattedDate} - ${formattedTime}`;
    }

    // Function to get month name
    function getMonthName(monthIndex) {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return months[monthIndex];
    }

    // Function to render vehicle list
    function renderVehicleList(vehicles) {
        const vehicleList = document.querySelector('.vehicles');
        vehicleList.innerHTML = '';
        vehicles.forEach(vehicle => {
            const vehicleItem = document.createElement('li');
            vehicleItem.className = 'vehicle-item';
            vehicleItem.innerHTML = `
                <div class="vehicle-details">
                    <div class="icon-container">
                        <img src="../../assets/truck-icon-31.png" alt="Truck Icon" class="truck-icon">
                    </div>
                    <div class="text-container">
                        <h4>${vehicle.name}</h4>
                        <p>${formatDateTime(vehicle.dateTime)}</p>
                    </div>
                </div>
                <div class="vehicle-status">
                    <img src="../../assets/warning-icon.png" alt="Warning Icon" class="warning-icon">
                    <button class="trip-button">Trip ></button>
                </div>
            `;
            vehicleList.appendChild(vehicleItem);
        });
    }
    
    

    // Initial data load - showing all vehicles
    vehicleData = dummyDataAll;
    renderVehicleList(vehicleData);
    addVehicleMarkers(vehicleData);

    // Filter functionality
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Filter data based on the tab selected
            const filter = tab.id;
            let filteredVehicles = [];

            if (filter === 'all') {
                filteredVehicles = dummyDataAll;
            } else if (filter === 'driving') {
                filteredVehicles = dummyDataDriving;
            } else if (filter === 'parked') {
                filteredVehicles = dummyDataParked;
            }

            // Update vehicle list with filtered data
            renderVehicleList(filteredVehicles);

            // Update markers on the map based on filtered data
            addVehicleMarkers(filteredVehicles);
        });
    });

    // Status item click functionality
    const statusItems = document.querySelectorAll('.status-item');
    statusItems.forEach(item => {
        item.addEventListener('click', () => {
            const status = item.id.split('-')[1];
            console.log('Show vehicles for status:', status);

            // Filter vehicles based on the selected status
            const filteredVehicles = vehicleData.filter(vehicle => vehicle.status === status);
            addVehicleMarkers(filteredVehicles);
        });
    });

    // Handle dropdown menu
    const dropdownBtn = document.querySelector(".dropdown-btn");
    const dropdownContainer = document.querySelector(".dropdown-container");

    dropdownBtn.addEventListener("click", () => {
        dropdownContainer.style.display = dropdownContainer.style.display === "block" ? "none" : "block";
    });

    // Example user profile name
    const userProfile = document.getElementById("user-profile");
    userProfile.textContent = "Jane Citizen";  // This should be set dynamically

    const links = document.querySelectorAll('.sidebar nav ul li a');
    const dropdownLinks = document.querySelectorAll('.dropdown-container a');

    function removeActiveClasses() {
        links.forEach(link => link.classList.remove('active-link'));
        dropdownLinks.forEach(link => link.classList.remove('active-link'));
    }

    links.forEach(link => {
        link.addEventListener('click', function(event) {
            removeActiveClasses();
            if (this.classList.contains('dropdown-btn')) {
                // Prevents the main dropdown button from staying highlighted
                return;
            }
            this.classList.add('active-link');
        });
    });

    dropdownLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            removeActiveClasses();
            // This targets the dropdown button related to the clicked link
            const parentDropdownButton = this.closest('.dropdown-container').previousElementSibling;
            parentDropdownButton.classList.add('active-link');
            this.classList.add('active-link');
        });
    });

});
