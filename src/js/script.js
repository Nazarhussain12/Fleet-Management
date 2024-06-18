document.addEventListener("DOMContentLoaded", () => {
    // Leaflet map initialization
    const map = L.map('map').setView([37.5665, 126.9780], 6); // Centered at Seoul,
    // Centered at the United States

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    }).addTo(map);

    // Define icons for different vehicle statuses
    const drivingIcon = L.icon({
        iconUrl: "../../assets/car.png", // Path to the driving vehicle icon
        iconSize: [42, 40],
        iconAnchor: [21, 20] // Center the icon
    });

    const parkedIcon = L.icon({
        iconUrl: "../../assets/parked.png", // Path to the parked vehicle icon
        iconSize: [42, 40],
        iconAnchor: [21, 20] // Center the icon
    });

    let allMarkers = [];
    let vehicleData = [];

    // Dummy data sets for vehicles within the United States
    const dummyDataAll = [
       
        { name: 'CRS 2567', lat: 29.7604, lng: -95.3698, status: 'parked', dateTime: '2024-06-16T12:00:00', events: [{ type: 'error', label: 'Error' }, { type: 'warning', label: 'Warning' }] },
        { name: 'KRX 1001', lat: 37.5665, lng: 126.9780, status: 'driving', dateTime: '2024-06-17T14:30:00', events: [{ type: 'info', label: 'Info' }] },
        { name: 'KRX 1002', lat: 35.1796, lng: 129.0756, status: 'parked', dateTime: '2024-06-17T16:00:00', events: [{ type: 'error', label: 'Maintenance' }] },
        { name: 'KRX 1003', lat: 37.4563, lng: 126.7052, status: 'driving', dateTime: '2024-06-17T18:45:00', events: [{ type: 'warning', label: 'Low Fuel' }] },
        { name: 'KRX 1004', lat: 35.8714, lng: 128.6014, status: 'parked', dateTime: '2024-06-17T20:00:00', events: [{ type: 'error', label: 'Error' }] },
        { name: 'KRX 1005', lat: 33.4996, lng: 126.5312, status: 'driving', dateTime: '2024-06-17T13:30:00', events: [{ type: 'info', label: 'All Clear' }] },
         { name: 'KRX 1003', lat: 37.4563, lng: 126.7052, status: 'driving', dateTime: '2024-06-17T18:45:00', events: [{ type: 'warning', label: 'Low Fuel' }] },
        { name: 'KRX 1004', lat: 35.8714, lng: 128.6014, status: 'parked', dateTime: '2024-06-17T20:00:00', events: [{ type: 'error', label: 'Error' }] },
        { name: 'KRX 1005', lat: 33.4996, lng: 126.5312, status: 'driving', dateTime: '2024-06-17T13:30:00', events: [{ type: 'info', label: 'All Clear' }] }
    ];
    

    // Filter data based on status
    const dummyDataDriving = dummyDataAll.filter(vehicle => vehicle.status === 'driving');
    const dummyDataParked = dummyDataAll.filter(vehicle => vehicle.status === 'parked');

    // Function to add vehicle markers to the map
    function addVehicleMarkers(vehicles) {
        // Clear all existing markers
        allMarkers.forEach(marker => map.removeLayer(marker));
        allMarkers = [];

        // Add new markers
        vehicles.forEach(vehicle => {
            const icon = vehicle.status === 'driving' ? drivingIcon : parkedIcon;
            const marker = L.marker([vehicle.lat, vehicle.lng], { icon: icon })
                .addTo(map)
                .bindPopup(`${vehicle.name} - ${vehicle.status}`);
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
    vehicleList.innerHTML = '';  // Clears existing list content

    vehicles.forEach(vehicle => {
        // Determine the appropriate icon based on vehicle status
        const iconPath = vehicle.status === 'driving' ? '../../assets/car1.png' : '../../assets/parked1.png';
        const altText = vehicle.status === 'driving' ? 'Driving Icon' : 'Parked Icon';

        const vehicleItem = document.createElement('li');
        vehicleItem.className = 'vehicle-item';
        vehicleItem.innerHTML = `
            <div class="vehicle-details">
                <div class="icon-container">
                    <img src="${iconPath}" alt="${altText}" class="truck-icon">
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




document.addEventListener("DOMContentLoaded", function() {
    var modal = document.getElementById("vehicleListModal"); // Ensure you have this ID in your modal
    var btn = document.querySelector('.vehicle-overview-link'); // This selects the link
    var span = document.getElementsByClassName("close-button")[0]; // This selects the close button of the modal

    // Open the modal when the Vehicle Overview link is clicked
    btn.addEventListener('click', function(event) {
        event.preventDefault(); // Prevents the default link behavior
        modal.style.display = "block"; // Displays the modal
    });

    // Close the modal when the 'x' is clicked
    span.onclick = function() {
        modal.style.display = "none";
    }

    // Close the modal when clicking outside of it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
});