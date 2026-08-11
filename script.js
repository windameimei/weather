// ═══════════════════════════════════════
//  MOCK DATA & STATE MANAGEMENT
// ═══════════════════════════════════════
const weatherDB = {
    "Tokyo": {
        location: "Tokyo, Japan",
        timeCondition: "Dusk · Clear Sky",
        temp: 18,
        desc: "Cerah Berawan",
        icon: "☀️",
        humidity: 72,
        wind: "14 km/h",
        uv: 5,
        condition: "clear", // clear, rain, cloudy
        forecast: [
            { day: "Sen", temp: "19° / 14°", icon: "⛅" },
            { day: "Sel", temp: "20° / 15°", icon: "☀️" },
            { day: "Rab", temp: "18° / 13°", icon: "🌧️" },
            { day: "Kam", temp: "17° / 12°", icon: "🌧️" },
            { day: "Jum", temp: "16° / 11°", icon: "☁️" },
            { day: "Sab", temp: "18° / 13°", icon: "⛅" },
            { day: "Min", temp: "19° / 14°", icon: "☀️" }
        ]
    },
    "Jakarta": {
        location: "Jakarta, Indonesia",
        timeCondition: "Siang · Hujan Ringan",
        temp: 29,
        desc: "Hujan Ringan",
        icon: "🌦️",
        humidity: 85,
        wind: "9 km/h",
        uv: 3,
        condition: "rain",
        forecast: [
            { day: "Sen", temp: "30° / 25°", icon: "🌧️" },
            { day: "Sel", temp: "31° / 26°", icon: "⛅" },
            { day: "Rab", temp: "29° / 25°", icon: "🌧️" },
            { day: "Kam", temp: "30° / 24°", icon: "🌦️" },
            { day: "Jum", temp: "31° / 25°", icon: "☀️" },
            { day: "Sab", temp: "32° / 26°", icon: "☀️" },
            { day: "Min", temp: "30° / 25°", icon: "⛅" }
        ]
    },
    "London": {
        location: "London, UK",
        timeCondition: "Pagi · Mendung",
        temp: 12,
        desc: "Mendung",
        icon: "☁️",
        humidity: 68,
        wind: "18 km/h",
        uv: 2,
        condition: "cloudy",
        forecast: [
            { day: "Sen", temp: "13° / 9°", icon: "☁️" },
            { day: "Sel", temp: "12° / 8°", icon: "🌧️" },
            { day: "Rab", temp: "11° / 7°", icon: "☁️" },
            { day: "Kam", temp: "14° / 9°", icon: "⛅" },
            { day: "Jum", temp: "15° / 10°", icon: "☀️" },
            { day: "Sab", temp: "13° / 8°", icon: "☁️" },
            { day: "Min", temp: "12° / 7°", icon: "🌧️" }
        ]
    }
};

let currentCity = "Tokyo";
let currentActiveDay = 0; // index hari yang aktif di forecast

// DOM Elements
const locationDisplay = document.getElementById('locationDisplay');
const timeCondition = document.getElementById('timeCondition');
const tempValue = document.getElementById('tempValue');
const weatherDesc = document.getElementById('weatherDesc');
const weatherIcon = document.getElementById('weatherIcon');
const humidityValue = document.getElementById('humidityValue');
const windValue = document.getElementById('windValue');
const uvValue = document.getElementById('uvValue');
const ambientVisual = document.getElementById('ambientVisual');
const forecastList = document.getElementById('forecastList');
const citySearch = document.getElementById('citySearch');
const searchBtn = document.getElementById('searchBtn');

// ═══════════════════════════════════════
//  UPDATE UI DENGAN TRANSISI HALUS
// ═══════════════════════════════════════
function fadeTransition(element, callback) {
    element.style.opacity = '0';
    element.style.transition = 'opacity 0.25s ease';
    setTimeout(() => {
        callback();
        element.style.opacity = '1';
    }, 250);
}

function updateMainWeather(cityData) {
    const heroCard = document.querySelector('.hero-card');
    fadeTransition(heroCard, () => {
        locationDisplay.textContent = cityData.location;
        timeCondition.textContent = cityData.timeCondition;
        tempValue.textContent = cityData.temp + '°';
        weatherDesc.textContent = cityData.desc;
        weatherIcon.textContent = cityData.icon;
        humidityValue.textContent = cityData.humidity + '%';
        windValue.textContent = cityData.wind;
        uvValue.textContent = cityData.uv;
    });
    updateAmbientEffect(cityData.condition);
}

function updateAmbientEffect(condition) {
    // Bersihkan efek sebelumnya
    ambientVisual.querySelectorAll('.rain-container').forEach(el => el.remove());
    weatherIcon.classList.remove('float', 'sun-glow');

    if (condition === 'rain') {
        // Tambahkan container hujan
        const rainContainer = document.createElement('div');
        rainContainer.className = 'rain-container';
        for (let i = 0; i < 30; i++) {
            const drop = document.createElement('div');
            drop.className = 'raindrop';
            drop.style.left = Math.random() * 100 + '%';
            drop.style.animationDuration = (Math.random() * 0.6 + 0.8) + 's';
            drop.style.animationDelay = Math.random() * 2 + 's';
            rainContainer.appendChild(drop);
        }
        ambientVisual.appendChild(rainContainer);
        weatherIcon.classList.add('float');
    } else if (condition === 'clear') {
        weatherIcon.classList.add('sun-glow');
    } else if (condition === 'cloudy') {
        weatherIcon.classList.add('float');
    }
}

function renderForecast(forecastArr, activeIndex) {
    forecastList.innerHTML = '';
    forecastArr.forEach((day, index) => {
        const li = document.createElement('li');
        li.className = `forecast-item ${index === activeIndex ? 'active' : ''}`;
        li.innerHTML = `
            <span class="forecast-day">${day.day}</span>
            <span class="forecast-icon">${day.icon}</span>
            <span class="forecast-temp">${day.temp}</span>
        `;
        li.addEventListener('click', () => {
            // Update active state
            document.querySelectorAll('.forecast-item').forEach(item => item.classList.remove('active'));
            li.classList.add('active');
            currentActiveDay = index;
            // Update main data berdasarkan hari yang dipilih
            const city = weatherDB[currentCity];
            const selectedDay = city.forecast[index];
            // Simulasikan perubahan suhu utama (ambil suhu tinggi dari string)
            const highTemp = selectedDay.temp.split('°')[0];
            fadeTransition(document.querySelector('.hero-card'), () => {
                tempValue.textContent = highTemp + '°';
                weatherDesc.textContent = selectedDay.icon.includes('🌧') ? 'Hujan' : selectedDay.icon.includes('⛅') ? 'Berawan' : 'Cerah';
                weatherIcon.textContent = selectedDay.icon;
                // Ubah kondisi ambient sesuai ikon
                if (selectedDay.icon.includes('🌧')) updateAmbientEffect('rain');
                else if (selectedDay.icon.includes('⛅') || selectedDay.icon.includes('☁️')) updateAmbientEffect('cloudy');
                else updateAmbientEffect('clear');
            });
        });
        forecastList.appendChild(li);
    });
}

function loadCity(cityName) {
    if (!weatherDB[cityName]) return;
    currentCity = cityName;
    const cityData = weatherDB[cityName];
    updateMainWeather(cityData);
    renderForecast(cityData.forecast, 0);
    currentActiveDay = 0;
}

// ═══════════════════════════════════════
//  EVENT LISTENERS
// ═══════════════════════════════════════
searchBtn.addEventListener('click', () => {
    const query = citySearch.value.trim();
    if (query && weatherDB[query]) {
        loadCity(query);
    } else {
        alert('Kota tidak ditemukan. Coba: Tokyo, Jakarta, London');
    }
    citySearch.value = '';
});

citySearch.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});

// ═══════════════════════════════════════
//  INITIAL LOAD
// ═══════════════════════════════════════
loadCity('Tokyo');
