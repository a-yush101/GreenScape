const aqiH = document.getElementById("AQI");
const CO = document.getElementById("CO");
const NO2 = document.getElementById("NO2");
const SO2 = document.getElementById("SO2");
const PM = document.getElementById("PM");
const AQR = document.getElementById("AQR");
const hr = document.getElementById("hR");
const dataBox = document.getElementById("dataBox");
const cNAme = document.getElementById("cityName");

const apiKey = "59cd8255ccf01b94c1d9b10cbf07e0ea";
const limit = 1;
document.getElementById("fetchData").addEventListener("click", () => {
// Get the city name from the input field
    const cityName = document.getElementById("cityN").value;
    console.log("City Name:", cityName);
    cNAme.innerText = cityName;
    const apiurl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=${limit}&appid=${apiKey}`;
//realtime data
    fetch(apiurl)
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
            console.log("Latitude:", lat, "Longitude:", lon);
            const aurl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm10,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide&hourly=pm10,pm2_5,us_aqi&forecast_days=7`;

            fetch(aurl).then(response => {
                if (!response.ok) {
                throw new Error("Network response was not ok " + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                const aqi = data.current.us_aqi; 
                console.log(aqi)
                aqiH.innerText =aqi
                

                let AQRN;
                let healthRecommendation;

                if (aqi >= 0 && aqi <= 50) {
                    AQRN = "Very Good";
                    healthRecommendation = "Air quality is very good. Enjoy outdoor activities!";
                    dataBox.style.backgroundColor = "#306B34";
                } else if (aqi >= 51 && aqi <= 100) {
                    AQRN = "Good";
                    healthRecommendation = "Air quality is good. You can continue outdoor activities without concern.";
                    dataBox.style.backgroundColor = "#6b9803";
                } else if (aqi >= 101 && aqi <= 150) {
                    AQRN = "Moderate";
                    healthRecommendation = "Air quality is moderate. Children, elderly, and individuals with respiratory issues should limit outdoor activities.";
                    dataBox.style.backgroundColor = "#F4E04D";
                } else if (aqi >= 151 && aqi <= 200) {
                    AQRN = "Unhealthy";
                    healthRecommendation = "Air quality is unhealthy. Avoid prolonged outdoor activities. Sensitive groups should stay indoors if possible.";
                    dataBox.style.backgroundColor = "#FF8552";
                } else if (aqi >= 201 && aqi <= 300) {
                    AQRN = "Very Unhealthy";
                    healthRecommendation = "Air quality is very unhealthy. Avoid outdoor activities. Everyone, especially vulnerable individuals, should stay indoors and keep windows closed.";
                    dataBox.style.backgroundColor = "#DF2935";
                } else {
                    AQRN = "Unknown";
                    healthRecommendation = "AQI data is unavailable. Check local air quality updates.";
                    dataBox.style.backgroundColor = "#CCCCCC"; // Neutral color for unknown values
                }

                hr.innerText = healthRecommendation;
                AQR.innerText = AQRN;
                components = data.current
                console.log("Components:", components);
                CO.innerText = components.carbon_monoxide;
                NO2.innerText = components.nitrogen_dioxide;
                SO2.innerText = components.sulphur_dioxide;
                PM.innerText = components.pm10;
                nextD = data.hourly.us_aqi[99];
                console.log(`next${nextD}`)
                document.getElementById("FAQI").innerText=nextD
                document.getElementById("FcityName").innerText=cityName
                const aqiValues = data.hourly.us_aqi; 
                const dailyAqi = [];
            
                for (let i = 0; i < 8; i++) {
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
                    borderColor: '#121420',
                    backgroundColor: '#121420',
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
            
            
            // Fetch the AQI data
            
            
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            })
            }
        })
        .catch(error => {
            console.error("Error fetching data:", error);
    })
})
