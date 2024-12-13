document.addEventListener('DOMContentLoaded', function() {
    const locationsContainer = document.querySelector('.locations-container');
    const locationInput = document.querySelector('.location-input');
    const addButton = document.querySelector('.add-button');
    const searchButton = document.querySelector('.search-button');
    const closeButton = document.querySelector('.close-button');
    const deleteAllButton = document.querySelector('.delete-all-button');

    let c_timeZone_offset = 0; 
    updateDetails("kundapura");
    setInterval(cUpdate, 5000)

    let locations = loadLocationsFromLocalStorage();
    console.log(locations);
    if (locations.length == 0){
        document.querySelector('.no-cards').style.display = "block";
        document.querySelector('.delete-all').style.display = "none";
    }
    else
    {
        document.querySelector('.no-cards').style.display = "none";
        document.querySelector('.delete-all').style.display = "block";
    }

    // Function to save locations to local storage
    function saveLocationsToLocalStorage(locations) {
        localStorage.setItem('locations', JSON.stringify(locations));
    }

    async function getTimezoneOffset(location) {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${import.meta.env.VITE_OPENWEATHERMAP}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching timezone:', error);
            return null;
        }
    }

    function getLocalTimezoneOffset(location) {
        let tz = null;
        locations.forEach(loc => {
            if(loc.city == location){
                tz = loc.timezone;
            }
        });
        return tz;
    }

    function updateTime(timezone) {
        const currentDateUTC = new Date();
        const timezoneOffsetMilliseconds = timezone * 1000;
        const currentTimeInTimezone = new Date(currentDateUTC.getTime() + timezoneOffsetMilliseconds);

        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const dayOfWeek = daysOfWeek[currentTimeInTimezone.getUTCDay()];
        const Months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const Month = Months[currentTimeInTimezone.getUTCMonth()];
        const DateUTC = currentTimeInTimezone.getUTCDate();

        let hours = currentTimeInTimezone.getUTCHours();
        let minutes = currentTimeInTimezone.getUTCMinutes();
        let range = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
        minutes = minutes < 10 ? '0' + minutes : minutes;

        return `${hours}:${minutes} ${range}, ${DateUTC} ${Month}, ${dayOfWeek}`;
    }


    // Function to load locations from local storage
    function loadLocationsFromLocalStorage() {
        const locations = JSON.parse(localStorage.getItem('locations')) || [];
        return locations;
    }

    // Function to create a new location card
function createLocationCard(location, currentTime) {
    const card = document.createElement('div');
    card.classList.add('card');

    // Determine if it's day or night based on currentTime
    const hoursMinutes = currentTime.split(':')[0]; // Extract hours from the current time
    const isPM = currentTime.includes('PM'); // Check if it's PM
    let currentTimeHours = parseInt(hoursMinutes, 10); // Parse hours as integer

    // Adjust hours for PM time
    if (isPM && currentTimeHours !== 12) {
        currentTimeHours += 12;
    } else if (!isPM && currentTimeHours === 12) {
        currentTimeHours = 0;
    }

    const isDayTime = currentTimeHours >= 6 && currentTimeHours < 18; // Daytime is from 7:00 to 17:59

    const sunOrMoonIcon = isDayTime ? '☀️' : '🌙'; // Use sun or moon icon based on the time

    card.innerHTML = `
        <div class="place-name">${location}</div>
        <div class="current-time">${currentTime}</div>
        <div class="sun-icon">${sunOrMoonIcon}</div>
        <button class="remove-button">-</button>
    `;

    locationsContainer.insertBefore(card, locationsContainer.firstChild);
}


    // Function to remove a location card
    function removeLocationCard(card, locationName) {
        // Remove the card from the DOM
        card.parentNode.removeChild(card);
        
        // Remove the location from local storage
        const storedLocations = JSON.parse(localStorage.getItem('locations')) || [];
        const updatedLocations = storedLocations.filter(loc => loc.city !== locationName);
        localStorage.setItem('locations', JSON.stringify(updatedLocations));
    
        // Update the locations array
        locations = updatedLocations;
    }

    // Function to add a location
    async function addLocation(location) {
        try {
            // Check if a card for this location already exists
            const data = await getTimezoneOffset(location);
            locations.forEach(location => {
                if(location.city == data.name)
                {
                    throw new Error('Location already exists');
                }
            });
             if (data.name == null) {
                throw new Error('Please enter a valid city name.');
            }
    
            const existingCard = locationsContainer.querySelector(`.place-name[data-location="${data.name}"]`);
            if (existingCard) {
                console.log('Card for this location already exists.');
                return;
            }

            if (locations.length >= 12) {
                throw new Error('Maximum limit of 12 locations reached.');
            }

            if (data === null) {
                throw new Error('Unable to fetch timezone for the specified location. Please try again later.');
            }
    
            let city = data.name;
            let timezone = data.timezone;
            const currentTime = updateTime(timezone);
            document.querySelector('.no-cards').style.display = "none";
            document.querySelector('.delete-all').style.display = "block";
            createLocationCard(city, currentTime);
            locations.push({ city, timezone });
            saveLocationsToLocalStorage(locations);
        } catch (error) {
            alert(error.message);
        }
    }

    // Event listener for adding a new location
    addButton.addEventListener('click', function() {
        const location = locationInput.value.trim();
        if (location === '') return;
        addLocation(location);
        locationInput.value = '';
    });

    // Event listener for searching a location
    searchButton.addEventListener('click', function() {
        const location = locationInput.value.trim();
        if (location === '') return;
        updateDetails(location);
    });

    // Function to update details in container 1
    async function updateDetails(location) {
        try {
            console.log(`Updating details for location: ${location}`);
            let data = await getTimezoneOffset(location);
    
            if (data.name == null) {
                throw new Error('Please enter a valid city name.');
            }
    
            if (data === null) {
                throw new Error('Unable to fetch timezone for the specified location. Please try again later.');
            }
    
            var time_t = updateTime(data.timezone);
            c_timeZone_offset = data.timezone;
    
            if (data.name != null) {
                console.log(data.sys.sunrise);
                let sunsettime = convertTo12HourFormat(data.sys.sunrise);
                let sunrisetime = convertTo12HourFormat(data.sys.sunset);
                document.querySelector('.c-place-name').textContent = data.name + "";
                document.querySelector('.c-current-time').textContent = time_t + "";
    
                // Determine if it's day or night based on currentTime
                const hoursMinutes = time_t.split(':')[0]; // Extract hours from the current time
                const isPM = time_t.includes('PM'); // Check if it's PM
                let currentTimeHours = parseInt(hoursMinutes, 10); // Parse hours as integer
    
                // Adjust hours for PM time
                if (isPM && currentTimeHours !== 12) {
                    currentTimeHours += 12;
                } else if (!isPM && currentTimeHours === 12) {
                    currentTimeHours = 0;
                }
    
                const isDayTime = currentTimeHours >= 7 && currentTimeHours < 18; // Daytime is from 7:00 to 17:59
    
                const sunOrMoonIcon = isDayTime ? '☀️' : '🌙'; // Use sun or moon icon based on the time
    
                document.querySelector('.c-sun-icon').textContent = sunOrMoonIcon;
    
                document.querySelector('.country-name').textContent = data.sys.country + "";
                document.querySelector('.sunset-time').textContent = "Sunset: " + sunsettime + "";
                document.querySelector('.sunrise-time').textContent = "Sunrise: " + sunrisetime + "";
            }
        } catch (error) {
            alert(error.message);
        }
    }
    

    function cUpdate(){
        var time_t = updateTime(c_timeZone_offset);
        document.querySelector('.c-current-time').textContent = time_t + "";
    }

    function convertTo12HourFormat(timestamp) {
        // Create a new Date object using the timestamp (in milliseconds)
        const date = new Date(timestamp * 1000);
    
        // Get hours and minutes
        const hours = date.getHours();
        const minutes = date.getMinutes();
    
        // Convert hours to 12-hour format
        const amPm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;
    
        // Format minutes (with leading zero if necessary)
        const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    
        // Construct the time string
        const timeString = `${formattedHours}:${formattedMinutes} ${amPm}`;
    
        return timeString;
    }
    

    // Event listener for removing a location
    locationsContainer.addEventListener('click', function(event) {
        if (event.target.classList.contains('remove-button')) {
            const card = event.target.closest('.card');
            const locationName = card.querySelector('.place-name').textContent;
            console.log(locationName);
            removeLocationCard(card, locationName);
            const cards = document.querySelectorAll('.card');
            if(cards.length == 0)
            {
                document.querySelector('.no-cards').style.display = "block";
                document.querySelector('.delete-all').style.display = "none";
            }
        }
    });

    // Load and display saved locations on page load
    locations.forEach(location => {
        let city = location.city;
        let timezoneOffset = location.timezone;
        let currentTime = updateTime(timezoneOffset);
        createLocationCard(city, currentTime);
    });

    // Function to update time every minute
    setInterval(updateTimeForAllCards, 5000);

    // Function to update time for all location cards
    function updateTimeForAllCards() {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            const locationName = card.querySelector('.place-name').textContent;
            let timezoneOffset = getLocalTimezoneOffset(locationName); // Assume this function retrieves the timezone offset
            const currentTime = updateTime(timezoneOffset);
            card.querySelector('.current-time').textContent = currentTime;
        });
    }

    // Function to close the World Clock app
    closeButton.addEventListener('click', function() {
        window.history.back();
    });

    // Event listener for deleting all cards
    deleteAllButton.addEventListener('click', function() {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            removeLocationCard(card);
        });

        // Clear all locations from local storage
        localStorage.removeItem('locations');
        locations = [];
        document.querySelector('.no-cards').style.display = "block";
        document.querySelector('.delete-all').style.display = "none";
    });
});
