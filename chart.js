const apiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=52.52&longitude=13.41&hourly=us_aqi&forecast_days=7`;
const apiKey = "59cd8255ccf01b94c1d9b10cbf07e0ea";
const limit = 1;

document.getElementById("fetchData").addEventListener("click", () => {
    // Get the city name from the input field
        const cityName = document.getElementById("cityN").value;
        const url = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=${limit}&appid=${apiKey}`;
//realtime data
    fetch(url)
        .then(response => {
            if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data.length > 0) {
            const lat = data[0].lat;
            const lon = data[0].lon;
            console.log("Latitude:", lat, "Longitude:", lon);}})
            fetch(apiUrl)
.then(response => response.json())
.then(data => {
    console.log(data)
    const aqiValues = data.hourly.us_aqi; 
    const dailyAqi = [];

    for (let i = 0; i < 7; i++) {
    const dailyValues = aqiValues.slice(i * 24, (i + 1) * 24); // Get 24-hour chunks
    const dailyAvg = dailyValues.reduce((sum, value) => sum + value, 0) / dailyValues.length;
    dailyAqi.push(dailyAvg);
    }

    const labels = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"];

    const ctx = document.getElementById("aqiChart").getContext("2d");
    new Chart(ctx, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
        label: 'Average AQI (US)',
        data: dailyAqi,
        fill: false,
        borderColor: '#4CAF50',
        backgroundColor: '#4CAF50',
        tension: 0.1
        }]
    },
    options: {
        responsive: true,
        scales: {
        y: {
            beginAtZero: true,
            title: {
            display: true,
            text: 'AQI Level'
            }
        }
        },
        plugins: {
        legend: {
            display: true,
            position: 'top'
        },
        tooltip: {
            callbacks: {
            label: function(context) {
                const aqi = context.raw;
                let category;
                if (aqi <= 50) {
                category = "Very Good";
                } else if (aqi <= 100) {
                category = "Good";
                } else if (aqi <= 150) {
                category = "Moderate";
                } else if (aqi <= 200) {
                category = "Unhealthy";
                } else {
                category = "Very Unhealthy";
                }
                return `AQI: ${aqi.toFixed(1)} - ${category}`;
            }
            }
        }
        }
    }
    });
})
.catch(error => console.error("Error fetching AQI data:", error));

        })
// Fetch the AQI data
