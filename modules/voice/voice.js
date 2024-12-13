// JavaScript Logic
const searchInput = document.getElementById('searchInput');
const voiceSearchBtn = document.getElementById('voiceSearchButton');
const micButton = document.getElementById('micButton');
const searchButton = document.getElementById('searchButton');

function handleVoiceSearch() {
  const recognition = new webkitSpeechRecognition() || new SpeechRecognition();
  recognition.lang = 'en-US';

  recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript.toLowerCase();
    const wordsList = cityData.values;

    // First, try exact match with city names
    const exactMatch = wordsList.find(city => city.toLowerCase() === transcript);

    if (exactMatch) {
      searchInput.value = exactMatch;
      searchButton.click();
      performSearch(exactMatch);
    } else {
      // If no exact match found, try matching similar pronunciation
      const similarPronunciation = wordsList.find(city => {
        return isSimilarPronunciation(city.toLowerCase(), transcript);
      });

      if (similarPronunciation) {
        searchInput.value = similarPronunciation;
        searchButton.click();
        performSearch(similarPronunciation);
      } else {
        alert('No matching city found in the spoken words.');
      }
    }
  }

  recognition.start();
  recognition.onspeechstart = function(){
    micButton.src = "icons/mic-on.svg";
  }
  recognition.onspeechend = function(){
    micButton.src = "icons/mic-mute.svg";
  }
}

function performSearch(query) {
  console.log('Performing search for: ', query);
  // Instead of redirecting, you can perform any other action here
  // For example, you could send the query to a server for further processing
}

function isSimilarPronunciation(city, transcript) {
  // Implement your pronunciation matching logic here
  // For simplicity, let's assume any city with a similar length is a match
  return Math.abs(city.length - transcript.length) <= 3;
}

voiceSearchBtn.addEventListener('click', handleVoiceSearch);
