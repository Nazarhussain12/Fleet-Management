


function getBounds(heatmapData) {
    let latMin = Infinity, latMax = -Infinity, lngMin = Infinity, lngMax = -Infinity;
    heatmapData.forEach(point => {
        latMin = Math.min(latMin, point.lat);
        latMax = Math.max(latMax, point.lat);
        lngMin = Math.min(lngMin, point.lng);
        lngMax = Math.max(lngMax, point.lng);
    });
    return [[latMin, lngMin], [latMax, lngMax]];
}
function getColor(value) {
    if (value < 25) return 'rgba(255, 99, 132, 1)'; // Light red
    if (value < 50) return 'rgba(255, 159, 64, 1)';  // Orange
    if (value < 75) return 'rgba(255, 205, 86, 1)';  // Yellow
    return 'rgba(75, 192, 192, 0.6)';                 // Green
}

// Helper function to get color based on intensity
function getColor1(d) {
    return d > 0.75 ? 'red' :
           d > 0.5  ? 'yellow' :
           d > 0.25 ? 'orange' :
                      'orange';  // Default
}

document.addEventListener("DOMContentLoaded", function() {
    // Initialize the map
    var map = L.map('map').setView([37.7749, -122.4194], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data © OpenStreetMap contributors'
    }).addTo(map);

   
    var heatmapData = [
        [37.7749, -122.4194, 0.8], // Central point with high intensity
        [37.785, -122.405, 0.5],   // Nearby medium intensity
        [37.776, -122.434, 0.6],   // Western area, medium-high intensity
        [37.769, -122.446, 0.4],   // Far west, lower intensity
        [37.768, -122.429, 0.3],   // South-west, low intensity
        [37.771, -122.391, 0.7],   // East, high intensity
        [37.783, -122.418, 0.2],   // Central north, very low intensity
        [37.794, -122.407, 0.5],   // North-east, medium intensity
        [37.790, -122.423, 0.8],   // North-central, high intensity
        [37.792, -122.435, 0.4],   // North-west, lower intensity
        [37.780, -122.410, 0.9],   // Near central, very high intensity
        [37.776, -122.402, 0.7],   // Eastern central, high intensity
        [37.777, -122.410, 0.6],   // Near center, medium-high intensity
        [37.779, -122.423, 0.5],   // Central south, medium intensity
        [37.765, -122.420, 0.3],   // South, low intensity
        [37.765, -122.435, 0.2],   // South-west, very low intensity
        [37.800, -122.430, 0.4],   // Far north, lower intensity
        [37.800, -122.400, 0.6],   // North-east corner, medium-high intensity
        [37.790, -122.390, 0.7],   // Far east, high intensity
        [37.785, -122.445, 0.3]    // Far west, low intensity
    ];
    

    var heat = L.heatLayer(heatmapData.map(item => [item[0], item[1], item[2]]), {
        radius: 250,
       
        gradient: {
            0.0: 'orange',
            0.5: 'yellow',
            1.0: 'red'
        }
    }).addTo(map);
// Add a legend to the map
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 0.5, 1], // These could represent different intensity levels in your heatmap
        labels = ['<strong>Intensity Scale</strong>'],
        from, to;

    // Loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        labels.push(
            '<i style="background:' + getColor1(from + 0.25) + '"></i> ' +
            from + (to ? '&ndash;' + to : '+'));
    }

    div.innerHTML = labels.join('<br>');
    return div;
};


legend.addTo(map);
    // Drawing the bounding box
    var bounds = getBounds(heatmapData.map(item => ({lat: item[0], lng: item[1]})));
    L.rectangle(bounds, {color: "#ff7800", weight: 1}).addTo(map);


    let eventChart; // Declare eventChart variable to hold the chart instance
    
    // Define a function to update the bar chart based on selected events
    function updateChart() {
        // Get all checked checkboxes
        const checkboxes = document.querySelectorAll('.event-checkbox:checked');
        
        // Extract labels (event names) and counts
        const labels = [];
        const counts = [];
        
        checkboxes.forEach(function(checkbox) {
            const label = checkbox.nextElementSibling.textContent.trim();
            const count = parseInt(checkbox.nextElementSibling.querySelector('.event-count').textContent);
            
            labels.push(label);
            counts.push(count);
        });
        
        // Define colors for the bars based on the specified scheme
        const colors = generateColors(labels.length); // Generate colors dynamically
        
        // Get the canvas element
        const ctx = document.getElementById('eventChart').getContext('2d');
        
        // Ensure eventChart is initialized or destroy it if needed
        if (eventChart) {
            eventChart.destroy(); // Destroy the existing chart instance
        }
        
        // Create new chart instance
        eventChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Event Counts',
                    data: counts,
                    backgroundColor: colors,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                maintainAspectRatio: false,
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true
                    },
                    y: {
                        beginAtZero: true,
                        minBarLength: 10,
                        maxBarThickness: 20
                    }
                }
            }
        });
        
        // Set fixed height for the chart canvas
        ctx.canvas.parentNode.style.height = '250px';
    }
    
    // Function to generate an array of colors based on the number of labels/events
    function generateColors(numColors) {
        const colorScheme = [
            'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(75, 192, 192, 1)',
            'rgba(255, 206, 86, 1)', 'rgba(255, 0, 255, 1)', 'rgba(255, 159, 64, 1)'
        ];

        // Slice the array to match the number of labels
        return colorScheme.slice(0, numColors);
    }

    // Call updateChart initially to set up the chart
    updateChart();

    // Attach event listener to checkboxes to update chart on change
    document.querySelectorAll('.event-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', updateChart);
    });
});

// Color function for the legend
function getColor(d) {
    return d > 0.8 ? 'red' :
           d > 0.6 ? 'orange' :
           d > 0.4 ? 'yellow' :
           d > 0.2 ? 'lime' :
                     'blue';
}
