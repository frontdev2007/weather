


const citySelect = document.querySelector(".city-select");
const locationButton = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");

const API_KEY = "d4e643b1db64040ac9933c111ba59e52"; 

const getSelectedCity = () => {
    const selectElement = document.getElementById("city-select");
    const selectedCity = selectElement.options[selectElement.selectedIndex].value;
    return selectedCity;
};

const createWeatherCard = (cityName, weatherItem, index) => {
    
    if(index === 0) { 
        return `<div class="details" >
                    <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                    <h6>Harorat: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
                    <h6>Shamol: ${weatherItem.wind.speed} M/S</h6>
                    <h6>Namlik: ${weatherItem.main.humidity}%</h6>
                </div>
                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                    <h6>${weatherItem.weather[0].description}</h6>
                </div>`;
    } else { 
        return `<li class="card" >
                    <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                    <h6>Harorat: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
                    <h6>Shamol: ${weatherItem.wind.speed} M/S</h6>
                    <h6>Namlik: ${weatherItem.main.humidity}%</h6>
                </li>`;
    }
}

const getWeatherDetails = (cityName, latitude, longitude) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL)
    .then(response => response.json())
    .then(data => {
        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if (!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
            }
        });

        citySelect.value = "";
        currentWeatherDiv.innerHTML = "";
        weatherCardsDiv.innerHTML = "";

        fiveDaysForecast.forEach((weatherItem, index) => {
            const html = createWeatherCard(cityName, weatherItem, index);
            if (index === 0) {
                currentWeatherDiv.insertAdjacentHTML("beforeend", html);
            } else {
                weatherCardsDiv.insertAdjacentHTML("beforeend", html);
            }
        });        
    })
    .catch(() => {
        alert("Ob-havo malumotlarini olishda xatolik yuz berdi!");
    });
}

const getCityCoordinates = () => {
    const selectElement = document.getElementById("city-select");
    const selectedCity = selectElement.options[selectElement.selectedIndex];
    getWeatherDetails(selectedCity.text, selectedCity.value.split(",")[0], selectedCity.value.split(",")[1]);
}

const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords;
            const API_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
            fetch(API_URL)
            .then(response => response.json())
            .then(data => {
                const { name } = data[0];
                getWeatherDetails(name, latitude, longitude);
            })
            .catch(() => {
                alert("Shahar nomini olishda xatolik yuz berdi!");
            });
        },
        error => { 
            if (error.code === error.PERMISSION_DENIED) {
                alert("Geolokatsiya sorovi rad etildi. Qayta ruxsat berish uchun joylashuv ruxsatini qayta ornating.");
            } else {
                alert("Geolokatsiya soʻrovi xatosi. Joylashuv ruxsatini qayta tiklang.");
            }
        }
    );
}

locationButton.addEventListener("click", getUserCoordinates);
citySelect.addEventListener("change", getCityCoordinates);
