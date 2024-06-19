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
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    var heatmapData = [
        [37.7749, -122.4194, 0.8],
        [37.785, -122.405, 0.5],
        // Add other points...
    ];

    var heat = L.heatLayer(heatmapData.map(item => [item[0], item[1], item[2]]), {
        radius: 250,
        blur: 5,
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

    var ctx = document.getElementById('eventChart').getContext('2d');

    // Fetch your data here - for demonstration, let's assume it's loaded somehow
    var eventData = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];  // Sample data

    // Create color array for the bars
    var backgroundColors = eventData.map(getColor);

    if (window.eventChart instanceof Chart) {
        window.eventChart.destroy();
    }

    window.eventChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: eventData.map((_, i) => `${i}:00`),
            datasets: [{
                label: 'Event Count per Hour',
                data: eventData,
                backgroundColor: backgroundColors,  // Use the dynamic colors
                borderColor: 'rgba(54, 162, 235, 0.8)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    gridLines: {
                        color: 'rgba(200, 200, 200, 0.2)',
                        lineWidth: 1
                    },
                    ticks: {
                        beginAtZero: true,
                        fontColor: '#9e9e9e'
                    }
                }],
                xAxes: [{
                    gridLines: {
                        display: false
                    },
                    ticks: {
                        fontColor: '#9e9e9e'
                    }
                }]
            },
            tooltips: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(0,0,0,0.7)'
            },
            legend: {
                display: true,
                position: 'top',
                labels: {
                    fontColor: '#333'
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeOutBounce'
            }
        }
    });
   
    document.querySelectorAll('.toggle-event').forEach(item => {
        item.addEventListener('change', function() {
            if (this.checked) {
                // Add more specific handling or data filtering based on checked items
                console.log(this.id + ' is checked');
            } else {
                console.log(this.id + ' is unchecked');
            }
        });
    });

    document.querySelector('.sidebar-toggle').addEventListener('click', function() {
        document.querySelector('.content-wrapper').classList.toggle('collapsed');
    });
    
    // Fetch data and update the heatmap and chart
    fetch('../../Pages/data.json')
    .then(response => response.json())
    .then(data => {
        console.log("Heatmap data:", data.heatmapData); // Check the structure and content
        if (heat && data.heatmapData) {
            heat.setLatLngs(data.heatmapData.map(item => [item.lat, item.lng, item.intensity]));
        }
        if (window.eventChart) {
            window.eventChart.data.datasets[0].data = data.eventData;
            window.eventChart.update();
        }
    })
    .catch(error => {
        console.error('Error loading data:', error);
    });
    
});
