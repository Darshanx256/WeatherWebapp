document.addEventListener('DOMContentLoaded', function () {
    var weatherForecast = document.getElementById('weatherForecast');
    var weatherForecastWrapper = document.getElementById('weatherForecastWrapper');
    var loadingIndicator = document.getElementById('loadingIndicator');
    var data = null;
    var startIndex = 0;
    var recordsToShow = 40;

    function renderWeatherEntries() {
        if (!data || !data.list) return; // Check if data is available
        var groupedEntries = groupEntriesByDate(data.list.slice(startIndex, startIndex + recordsToShow));

        groupedEntries.forEach(function (entries, date, index) {
            var table = createWeatherTable(date, entries, index);
            weatherForecast.appendChild(table);
        });

        loadingIndicator.style.display = 'none';
    }

    function groupEntriesByDate(entries) {
        var groupedEntries = new Map();
        entries.forEach(function (entry, index) {
            var date = new Date(entry.dt * 1000).toLocaleDateString();
            if (!groupedEntries.has(date)) {
                groupedEntries.set(date, []);
            }
            groupedEntries.get(date).push(entry);
        });
        return groupedEntries;
    }

    function createWeatherTable(date, entries, index) {
        var table = document.createElement('table');
        table.classList.add('weather-table');

        var caption = document.createElement('caption');
        caption.textContent = getDateLabel(date, index);
        table.appendChild(caption);

        entries.forEach(function (entry) {
            var row = table.insertRow();
            var timeCell = row.insertCell();
            var tempCell = row.insertCell(); // Moved temperature cell here
            var iconCell = row.insertCell();

            var time = new Date(entry.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            timeCell.textContent = time;

            var temp = entry.main.temp + '°C';
            tempCell.textContent = temp;

            var icon = document.createElement('img');
            if (entry.weather && entry.weather.length > 0 && entry.weather[0].icon) {
                icon.src = 'https://openweathermap.org/img/wn/' + entry.weather[0].icon + '.png';
                icon.alt = 'Weather Icon';
                icon.title = entry.weather[0].description;
            } else {
                icon.src = 'placeholder.png';
                icon.alt = 'Placeholder Icon';
            }
            icon.classList.add('weather-icon');
            iconCell.appendChild(icon);

            var description = document.createElement('span');
            description.textContent = entry.weather[0].description;
            iconCell.appendChild(description);

            row.addEventListener('click', function() {
                if (row.nextElementSibling && row.nextElementSibling.classList.contains('weather-details')) {
                    row.nextElementSibling.classList.toggle('show');
                    row.nextElementSibling.classList.toggle('active');
                } else {
                    var detailsRow = table.insertRow(row.rowIndex + 1);
                    detailsRow.classList.add('weather-details', 'show', 'active');
                    var detailsCell = detailsRow.insertCell();
                    detailsCell.colSpan = 3; // Span across all columns
                    var details = document.createElement('div');
                    details.classList.add('weather-details-content');
                    details.innerHTML = `
                        <div style="display: flex; justify-content: space-between;">
                            <div style="flex: 1;">
                                <p><i class="fas fa-tint"></i> Humidity: ${entry.main.humidity}%</p>
                                <p><i class="fas fa-wind"></i> Wind Speed: ${entry.wind.speed} m/s</p>
                                <p><i class="fas fa-tachometer-alt"></i> Pressure: ${entry.main.pressure} hPa</p>
                            </div>
                            <div style="flex: 1;">
                                <p><i class="fas fa-thermometer-half"></i> Feels Like: ${entry.main.feels_like}°C</p>
                                <p><i class="fas fa-thermometer-full"></i> Max Temp: ${entry.main.temp_max}°C</p>
                                <p><i class="fas fa-thermometer-empty"></i> Min Temp: ${entry.main.temp_min}°C</p>
                            </div>
                        </div>
                    `;
                    detailsCell.appendChild(details);
                }
            });
        });

        return table;
    }

    function loadMoreData() {
        startIndex += recordsToShow;
        renderWeatherEntries();
    }

    function handleScroll() {
        if (weatherForecastWrapper.scrollHeight - weatherForecastWrapper.scrollTop === weatherForecastWrapper.clientHeight) {
            loadingIndicator.style.display = 'block'; // Show loading spinner when loading more data
            loadMoreData();
        }
    }

    weatherForecastWrapper.addEventListener('scroll', handleScroll);

    function loadPrediction(cityname)
    {
    // Show loading spinner when fetching data
    loadingIndicator.style.display = 'block';
    fetch('https://api.openweathermap.org/data/2.5/forecast?appid=5a088485f78a08fadae18627eec5a98f&units=metric&q=' + cityname)
        .then(response => response.json())
        .then(parsedData => {
            console.log(parsedData); // Log the fetched data to check
            data = parsedData;
            renderWeatherEntries();
        })
        .catch(error => console.error('Error fetching weather data:', error));
    }

    loadPrediction("new york")

    function getDateLabel(date, index) {
        // For remaining days, format as weekday name followed by date
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        var weekdayDate = new Date(date);
        return weekdayDate.toLocaleDateString('en-US', options);
}
});