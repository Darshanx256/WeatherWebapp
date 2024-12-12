document.addEventListener('DOMContentLoaded', async() =>{


    let apiKey = null;
    let geoapiKey = null
    try {
         const module = await import('./modules/main/config.mjs');
         apiKey = module.OPENWEATHERMAP_KEY;
         geoapiKey = module.GEOAPIFY_KEY;
    }
    catch(error)
    {
         console.log('Error importing API key: ', error)
    }


    const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric";

    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchButton');
    const distCal = document.getElementById('distancecalculator');
    const gps = document.getElementById('gps');
    var distScreen = document.getElementById('distance-popup');
    const map = document.getElementById('minimap');
    var popup = document.getElementById("no-network-popup");
    var pageload = document.getElementById("loading-popup");
    let timeData;
    let bgchanged = false;
    searchBtn.addEventListener('click', function() {
        const cityname = searchInput.value.trim();
        if (cityname) {
            checkWeather(cityname);
        }
    });

    gps.addEventListener('click', function(){
        gpsLocation(apiKey);
    })

    distCal.addEventListener('click', function() {
        distScreen.innerHTML = '';
        populateDynamicContent(); 
        var scriptTag = document.createElement('script');
        scriptTag.src = 'modules/distance/dist.js'; 
        document.body.appendChild(scriptTag); 
        distScreen.style.display = "block";
        window.scrollBy(0, 500);
    });

    function addToSearchHistory(query, temperature) {
        let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    
        // Check if the query already exists in the search history
        const index = searchHistory.findIndex(item => item.query === query);
        if (index !== -1) {
            // Remove the existing entry
            searchHistory.splice(index, 1);
        }
    
        // Limit the search history to a maximum of 30 entries
        const MAX_HISTORY_LENGTH = 30;
        if (searchHistory.length >= MAX_HISTORY_LENGTH) {
            // Remove the oldest entry
            searchHistory.shift();
        }
    
        // Add the new query to the search history
        searchHistory.push({ query, temperature });
    
        // Save the updated search history to local storage
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }


    // Function to display search history table
    function showSearchHistory() {
        console.log("showSearchHistory function called");
    
        // Retrieve search history from local storage
        const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    
        // Get the table body element
        const historyTableBody = document.getElementById('historyTableBody');
    
        // Clear existing rows
        historyTableBody.innerHTML = '';
    
        // Check if search history is empty
        if (searchHistory.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td >NO HISTORY</td>';
            historyTableBody.appendChild(row);
        } else {
            // Populate the table with search history data in reverse order
            for (let i = searchHistory.length - 1; i >= 0; i--) {
                const entry = searchHistory[i];
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${entry.query}</td>
                    <td>${entry.temperature}°C</td>
                    <td>
                        <button class="delete-btn" data-index="${i}">x</button>
                        <button class="hist-load" data-index="${i}">LOAD NOW</button>
                    </td>
                `;
                historyTableBody.appendChild(row);
            }
        }
    
        // Display the search history overlay
        const searchHistoryDiv = document.getElementById('history');
        searchHistoryDiv.classList.add('show'); // Ensure the overlay is shown
        console.log("Search history visibility toggled:", searchHistoryDiv.classList.contains('show'));
    }
    
    
    

// Function to delete a row from search history
function deleteRow(index) {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    searchHistory.splice(index, 1); // Remove the entry at the specified index
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    showSearchHistory(); // Update the displayed search history
}

function loadFromHistory(index){
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    console.log(searchHistory[index]['query']);
    hideSearchHistory();
    searchInput.value = searchHistory[index]['query'];
    searchBtn.click();
}

// Event listener for show history button
document.getElementById('history-btn').addEventListener('click', function() {
    console.log("History button clicked");
    showSearchHistory();
});

// Event listener for delete buttons (delegation to handle dynamic buttons)
document.getElementById('historyTableBody').addEventListener('click', function(event) {
    if (event.target.classList.contains('delete-btn')) {
        const index = event.target.dataset.index;
        deleteRow(index);
    }

    if (event.target.classList.contains('hist-load')) {
        const index = event.target.dataset.index;
        loadFromHistory(index);
    }
});

   
function hideSearchHistory() {
    const searchHistoryDiv = document.getElementById('history');
    searchHistoryDiv.classList.remove('show');
}

const closeHistoryBtn = document.getElementById('closeHistoryBtn');
    closeHistoryBtn.addEventListener('click', function() {
        hideSearchHistory();
    });


    function gpsLocation(apikey) {
        // Show loading popup initially
        console.log("Attempting to get GPS location...");
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async function(position) {
                console.log("GPS location acquired successfully.");
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
    
                try {
                    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
    
                    const response = await fetch(apiUrl);
                    if (response.ok) {
                        const data = await response.json();
                        const cityName = data.name;
                        console.log('City Name:', cityName);
                        checkWeather(cityName);
                        pageload.style.display = 'none'; // Hide loading popup after successful fetch
                    } else {
                        console.error('Error fetching weather data:', response.statusText);
                        popup.style.display = "block";
                        pageload.style.display = 'none'; // Hide loading popup on error
                    }
                } catch (error) {
                    console.error('Error fetching weather data:', error);
                    popup.style.display = "block";
                    pageload.style.display = 'none'; // Hide loading popup on error
                }
            }, function(error) {
                console.error('Error getting current position:', error);
                popup.style.display = "block";
                pageload.style.display = "none"; // Hide loading popup on error
            });
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    }
    
    pageload.style.display = 'block';
    gpsLocation(apiKey);

        function updateBackground(weatherDescription, isDayTime) {
            var backgroundUrl = 'backgrounds/';
            
            // Check for weather conditions and time of day
            if (weatherDescription.includes('clear') && isDayTime) {
              backgroundUrl += 'clearsky.jpg';
            } else if (weatherDescription.includes('clear') && !isDayTime) {
              backgroundUrl += 'clearskynight.jpg';
            } else if (weatherDescription.includes('cloud')) {
              backgroundUrl += 'cloudy.jpg';
            } else if (weatherDescription.includes('smoke')) {
              backgroundUrl += 'smoke.jpg';
            } else if (weatherDescription.includes('haze') || weatherDescription.includes('fog')) {
              backgroundUrl += 'fog.jpg';
            } else if (weatherDescription.includes('rain')) {
              backgroundUrl += 'rain.jpg';
            } else if (weatherDescription.includes('snow')) {
              backgroundUrl += isDayTime ? 'snow.jpg' : 'snownight.jpg';
            } else {
              backgroundUrl += 'clearsky.jpg';
            }
            
            // Update body background image
            document.body.style.backgroundImage = 'url("' + backgroundUrl + '")';
            console.log('url("' + backgroundUrl + '")');
          }



        function mapLink(lat, lon) {
            const baseUrl = 'https://maps.geoapify.com/v1/staticmap';
            //const apiKey = import.meta.env.VITE_GEOAPIFY;
        
            const queryParams = new URLSearchParams({
                style: 'osm-bright',
                width: 420,
                height: 230,
                center: `lonlat:${lon},${lat}`,
                zoom: 8,
                apiKey: geoapiKey,
                marker: `lonlat:${lon},${lat};color:red;size:medium`
            });
        
            const formattedLink = `${baseUrl}?${queryParams}`;
            console.log(formattedLink);
            return formattedLink;
        }

        

        async function checkWeather(cityname) {
            try {
                const response = await fetch(`${apiUrl}&appid=${apiKey}&q=${cityname}`);
                if (!response.ok) {
                    popup.style.display = "block";
                }
                const data = await response.json();
                console.log(data);
                updateWeatherInfo(data);
                addToSearchHistory(capitalizeFirstLetter(data.name), data.main.temp);
            } catch (error) {
                console.log(error);
            }
        }
    
        function updateWeatherInfo(data) {
            if (timeData) {
                clearInterval(timeData, data.weather[0].main);
                bgchanged = false;
            }
            map.src = "";
            //map.style.display = "none";
            loadPrediction(data.name);
            mapAddr = mapLink(data.coord.lat, data.coord.lon);
            map.src = mapAddr;
            //map.style.display = "block";
            console.log(data.timezone);

            const weatherIconElement = document.querySelector(".weather-icon");
            weatherIconElement.src = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
            weatherIconElement.alt = data.weather[0].main;

            timeData = setInterval(function () { updateTime(data.timezone, data.weather[0].main) }, 1000);
            document.querySelector(".city").textContent = capitalizeFirstLetter(data.name);
            document.querySelector(".temp").textContent = data.main.temp + " °C";
            document.querySelector(".humidity").textContent = data.main.humidity + "%";
            document.querySelector(".wind").textContent = data.wind.speed + " km/h";
            document.querySelector(".max").textContent = data.main.temp_max + " °C";
            document.querySelector(".min").textContent = data.main.temp_min + " °C";
            document.querySelector(".weather-icon").textContent = data.weather[0].main;
        
            // Update additional details
            document.querySelector(".pressure").textContent = data.main.pressure + " hPa";
            document.querySelector(".visibility").textContent = data.visibility + " km";
        
            // Update sea level if available
            if (data.main.sea_level !== undefined) {
                document.querySelector(".sea-level").textContent = data.main.sea_level + " m";
            }
        
            // Update new weather and country information
            document.querySelector(".new-weather").textContent = capitalizeFirstLetter(data.weather[0].description);
            document.querySelector(".country").textContent = capitalizeFirstLetter(data.sys.country);
        }
        
        // Function to capitalize the first letter of a string
        function capitalizeFirstLetter(str) {
            return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
        }
        
        
        
        

        function updateTime(timezone, weatherCondition) {
            const currentDateUTC = new Date();
            const timezoneOffsetMilliseconds = timezone * 1000;
            const currentTimeInTimezone = new Date(currentDateUTC.getTime() + timezoneOffsetMilliseconds);
        
            const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            const dayOfWeek = daysOfWeek[currentTimeInTimezone.getUTCDay()];
        
            let hours = currentTimeInTimezone.getUTCHours();
            let minutes = currentTimeInTimezone.getUTCMinutes();
            let timeOfDay = '';
        
            if (hours >= 5 && hours < 12) {
                timeOfDay = 'Morning';
            } else if (hours >= 12 && hours < 17) {
                timeOfDay = 'Afternoon';
            } else if (hours >= 17 && hours < 21) {
                timeOfDay = 'Evening';
            } else {
                timeOfDay = 'Night';
            }
        
            let range = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
            minutes = minutes < 10 ? '0' + minutes : minutes;
        
            const timeVal = document.getElementById('time');
            const dateVal = document.getElementById('date');
            timeVal.textContent = `${hours}:${minutes} ${range}`;
            dateVal.textContent = `${dayOfWeek} - ${currentTimeInTimezone.toLocaleDateString()}`;
            document.getElementById('timeOfDay').textContent = `${timeOfDay}`;
        
             //Check if background image has been changed, and if not, change it
            //if (!bgchanged) {
            //    const daytime = hours <= 20 && hours >= 6;
            //    const weatherDescription = weatherCondition.toLowerCase(); // Assuming weatherCondition is a string
            //    updateBackground(weatherDescription, daytime);
            //    bgchanged = true; // Set bgchanged to true to indicate that the background image has been changed
            //}
        }
        
        






        //-- prediction starts here
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
    weatherForecast.innerHTML = '';
    // Show loading spinner when fetching data
    loadingIndicator.style.display = 'block';
    var predictionLink = `https://api.openweathermap.org/data/2.5/forecast?appid=${apiKey}&units=metric&q=` + cityname
    fetch(predictionLink)
        .then(response => response.json())
        .then(parsedData => {
            console.log(parsedData); // Log the fetched data to check
            data = parsedData;
            renderWeatherEntries();
        })
        .catch(error => console.error('Error fetching weather data:', error));
    }


    function getDateLabel(date, index) {
    if (index === 0) {
        return 'Today - ' + date;
    } else if (index === 1) {
        return 'Tomorrow - ' + date;
    } else if (index === 2) {
        return 'Day after Tomorrow - ' + date;
    } else {
        // For remaining days, format as weekday name followed by date
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        var weekdayDate = new Date(date);
        return weekdayDate.toLocaleDateString('en-US', options);
    }
}



//==prediction ends here

    });
    

    
