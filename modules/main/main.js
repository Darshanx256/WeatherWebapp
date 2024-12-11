document.addEventListener('DOMContentLoaded', function() {
        const apiKey = "5a088485f78a08fadae18627eec5a98f";
        const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric";

        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchButton');
        const map = document.getElementById('minimap');
        searchBtn.addEventListener('click', function() {
            const cityname = searchInput.value.trim();
            if (cityname) {
                checkWeather(cityname);
            }
        });
    
        function mapLink(lat, lon) {
            const baseUrl = 'https://maps.geoapify.com/v1/staticmap';
            const apiKey = '2cdf21140e974ba8af8fae8dab9bbbb1';
        
            const queryParams = new URLSearchParams({
                style: 'osm-bright',
                width: 200,
                height: 350,
                center: `lonlat:${lon},${lat}`,
                zoom: 6,
                apiKey: apiKey,
                marker: `lonlat:${lon},${lat};color:red;size:medium`
            });
        
            const formattedLink = `${baseUrl}?${queryParams}`;
            return formattedLink;
        }

        

        async function checkWeather(cityname) {
            try {
                const response = await fetch(`${apiUrl}&appid=${apiKey}&q=${cityname}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log(data);
                updateWeatherInfo(data);
            } catch (error) {
                console.error('Error fetching weather data:', error);
            }
        }
    
        function updateWeatherInfo(data) {
            mapAddr = mapLink(data.coord.lat, data.coord.lon);
            map.src = mapAddr;
            console.log(data.timezone);
            setInterval(function(){updateTime(data.timezone)}, 1000);
            document.querySelector(".city").textContent = data.name;
            document.querySelector(".temp").textContent = data.main.temp;
            document.querySelector(".humidity").textContent = data.main.humidity;
            document.querySelector(".wind").textContent = data.wind.speed;
            document.querySelector(".max").textContent = data.main.temp_max;
            document.querySelector(".min").textContent = data.main.temp_min;
            document.querySelector(".weather-icon").textContent = data.weather[0].main;
           
        }

        function updateTime(timezone) {
        
            const currentDateUTC = new Date();
        
            const timezoneOffsetMilliseconds = timezone * 1000;
        
            const currentTimeInTimezone = new Date(currentDateUTC.getTime() + timezoneOffsetMilliseconds);
        
            let hours = currentTimeInTimezone.getUTCHours();
            let minutes = currentTimeInTimezone.getUTCMinutes();
        
            // Convert hours to 12-hour format and determine AM/PM
            let range = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
        
            // Ensure minutes are properly formatted with leading zero
            minutes = minutes < 10 ? '0' + minutes : minutes;
        
            // Get the timeVal and dateVal elements
            const timeVal = document.getElementById('time');
            const dateVal = document.getElementById('date');
        
            // Update the text content of timeVal and dateVal
            timeVal.textContent = `${hours}:${minutes} ${range}`;
            dateVal.textContent = `${currentTimeInTimezone.toLocaleDateString()}`;
        }
        

    });
    