document.querySelector(".btn").addEventListener("click", async (event) => {
  event.preventDefault();

  let value = document.querySelector(".input").value;
  let url = `https://api.weatherapi.com/v1/current.json?key=4fb0b80f38ce4907897182024250109&q=${value}&aqi=yes`;

  try {
    let response = await fetch(url);
    let data = await response.json();

    let city = data.location.name;
    let temperature = data.current.temp_c;
    let time = data.location.localtime;
    let atmosphere = data.current.condition.text;
    let feels = data.current.feelslike_c;
    let humidity = data.current.humidity;
    let wind = data.current.wind_kph;
    let icon = "https:" + data.current.condition.icon;
    let aqi = data.current.air_quality["us-epa-index"];

    // Update UI
    document.querySelector(".city").textContent = city;
    document.querySelector(".temperature").textContent = `${temperature} °C`;
    document.querySelector(".date").textContent = time;
    document.querySelector(".atmosphere").textContent = atmosphere;
    document.querySelector(".feels").textContent = `Feels like: ${feels} °C`;
    document.querySelector(".humidity").textContent = `Humidity: ${humidity}%`;
    document.querySelector(".wind").textContent = `Wind: ${wind} km/h`;
    document.querySelector(".weather-icon").src = icon;
    document.querySelector(".weather").style.display = "block";


    // AQI Badge
    updateAQI(aqi);

    // Background
    updateBackground(atmosphere);

  } catch (error) {
    console.error("Error:", error);
  }
});

function updateBackground(condition) {
  const video = document.getElementById("bg-video");
  const source = video.querySelector("source");

  let videoFile = "sunny.mp4"; // default
  condition = condition.toLowerCase();

  if (condition.includes("cloud")) {
    videoFile = "cloudy.mp4";
  } else if (condition.includes("rain") || condition.includes("shower")) {
    videoFile = "rainy.mp4";
  } else if (condition.includes("thunder")) {
    videoFile = "thunder.mp4";
  } else if (condition.includes("snow") || condition.includes("sleet")) {
    videoFile = "snow.mp4";
  } else if (condition.includes("mist") || condition.includes("fog") || condition.includes("haze")) {
    videoFile = "mist.mp4";
  }

  video.style.opacity = 0;
  setTimeout(() => {
    source.src = videoFile;
    video.load();
    video.style.opacity = 1;
  }, 1000);
}

function updateAQI(index) {
  const aqiEl = document.querySelector(".aqi");
  let text = "";
  let cls = "";

  switch (index) {
    case 1: text = "Good"; cls = "good"; break;
    case 2: text = "Moderate"; cls = "moderate"; break;
    case 3: text = "Unhealthy (Sensitive)"; cls = "unhealthy"; break;
    case 4: text = "Unhealthy"; cls = "unhealthy"; break;
    case 5: text = "Very Unhealthy"; cls = "very-unhealthy"; break;
    case 6: text = "Hazardous"; cls = "hazardous"; break;
    default: text = "Unknown"; cls = "";
  }

  aqiEl.textContent = `AQI: ${text}`;
  aqiEl.className = `aqi ${cls}`;
}
