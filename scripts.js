const apiKey = 'f140c741947fc420dc645078da626e77';

document.getElementById('check_btn').addEventListener('click', function() {
  const city = document.getElementById('enter_bar').value;
  if (!city) return;

  const xhr = new XMLHttpRequest();
  xhr.open('GET', `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pl`, true);
  xhr.onload = function() {
    if (xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
      console.log('Aktualna pogoda:', data);
      displayCurrentWeather(data);
      changeBackground(data.weather[0].main);
    } else {
      console.error('Błąd pobierania aktualnej pogody');
      alert("Nie znaleziono miasta!");
    }
  };
  xhr.send();

  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=pl`)
    .then(response => response.json())
    .then(data => {
      console.log('Prognoza:', data);
      displayForecast(data, city);
    })
    .catch(error => console.error('Błąd pobierania prognozy:', error));
});

function displayCurrentWeather(data) {
  const weatherInfo = document.getElementById('weather_info');
  weatherInfo.classList.remove('hidden');

  document.getElementById('city_name').textContent = `Pogoda w ${data.name}`;
  document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°C`;
  document.getElementById('description').textContent = data.weather[0].description;

  const iconCode = data.weather[0].icon;
  document.getElementById('current_icon').src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
  document.getElementById('wind_speed').textContent = `💨 Wiatr: ${data.wind.speed} km/h`;
  document.getElementById('humidity').textContent = `💧 Wilgotność: ${data.main.humidity}%`;
}

function displayForecast(data, city) {
  const forecastDiv = document.getElementById('forecast');
  const forecastCardsContainer = document.getElementById('forecast_cards');

  forecastDiv.classList.remove('hidden');
  document.getElementById('forecast_title').textContent = `Prognoza 5-dniowa dla ${city}`;

  forecastCardsContainer.innerHTML = '';

  data.list.forEach(item => {
    const dateObj = new Date(item.dt * 1000);
    const date = dateObj.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit' });
    const time = dateObj.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
    const iconCode = item.weather[0].icon;

    const card = document.createElement('div');
    card.className = 'forecast-card';
    card.innerHTML = `
            <span class="date">${date}</span>
            <span class="time">${time}</span>
            <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="Ikona">
            <span class="temp">${Math.round(item.main.temp)}°C</span>
            <span class="desc">${item.weather[0].description}</span>
        `;
    forecastCardsContainer.appendChild(card);
  });
}

function changeBackground(weatherMain) {
  const body = document.body;
  body.className = '';

  switch (weatherMain.toLowerCase()) {
    case 'clear':
      body.classList.add('bg-clear');
      break;
    case 'clouds':
      body.classList.add('bg-clouds');
      break;
    case 'rain':
    case 'drizzle':
      body.classList.add('bg-rain');
      break;
    case 'snow':
      body.classList.add('bg-snow');
      break;
    case 'thunderstorm':
      body.classList.add('bg-thunderstorm');
      break;
    default:
      body.classList.add('bg-default');
      break;
  }
}

