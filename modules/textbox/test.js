document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.getElementById('searchInput');
    const suggestionContainer = document.getElementById('suggestionContainer');
    const searchButton = document.getElementById('searchButton');
    let selectedIndex = 0; 

    // Event listener for input changes
    searchInput.addEventListener('input', function() {
        const searchText = this.value.trim().toLowerCase();
        suggestionContainer.innerHTML = '';

        if (searchText.length === 0) {
            suggestionContainer.style.display = 'none'; // Hide suggestion container if input is empty
            selectedIndex = 0; // Reset selectedIndex when input is empty
            return;
        }

        const uniqueSuggestions = new Set(); // Set to store unique suggestions

        // Filter and add unique suggestions that start with the typed letters
        cityData.values.forEach(item => {
            if (item.toLowerCase().startsWith(searchText)) {
                uniqueSuggestions.add(item);
            }
        });

        // Convert set to array and take only the top 10 values
        const topSuggestions = Array.from(uniqueSuggestions).slice(0, 4);

	if (topSuggestions.length === 0) {
            suggestionContainer.style.display = 'none'; // Hide suggestion container if no matching results
            selectedIndex = -1; // Reset selectedIndex when no matching results
            document.body.classList.remove('suggestion-open'); // Remove class to hide scrollbar
            return;
        }

        // Populate suggestion container with suggestions
        topSuggestions.forEach((item, index) => {
            const suggestion = document.createElement('div');
            suggestion.textContent = item;
            suggestion.classList.add('suggestion');
            suggestion.addEventListener('click', function() {
                searchInput.value = item;
                suggestionContainer.innerHTML = '';
                suggestionContainer.style.display = 'none'; // Hide suggestion container after selection
                selectedIndex = -1; // Reset selectedIndex when suggestion is selected
            });
            if (index === selectedIndex) {
                suggestion.classList.add('selected');
            }
            suggestionContainer.appendChild(suggestion);
        });

        // Calculate and set suggestion container position
        const rect = searchInput.getBoundingClientRect();
        suggestionContainer.style.top = (rect.bottom + window.scrollY) + 'px'; // Account for page scroll
        suggestionContainer.style.left = rect.left + 'px';
        suggestionContainer.style.width = searchInput.offsetWidth + 'px';

        // Show suggestion container
        suggestionContainer.style.display = 'block';
    });

    // Event listener for keyboard navigation
    searchInput.addEventListener('keydown', function(event) {
        const suggestions = document.querySelectorAll('.suggestion');

        if (event.key === 'ArrowDown') {
            selectedIndex = Math.min(selectedIndex + 1, suggestions.length - 1);
            updateSelectedSuggestion(suggestions);
        } else if (event.key === 'ArrowUp') {
            selectedIndex = Math.max(selectedIndex - 1, -1);
            updateSelectedSuggestion(suggestions);
        } else if (event.key === 'Enter' && selectedIndex !== -1) {
            searchInput.value = suggestions[selectedIndex].textContent;
            suggestionContainer.innerHTML = '';
            suggestionContainer.style.display = 'none'; 
            selectedIndex = -1; 
            searchButton.click();
        } else if (event.key == 'Enter'){
            searchButton.click();
        }
    });

    // Function to update selected suggestion
    function updateSelectedSuggestion(suggestions) {
        suggestions.forEach((suggestion, index) => {
            if (index === selectedIndex) {
                suggestion.classList.add('selected');
            } else {
                suggestion.classList.remove('selected');
            }
        });
    }

    // Hide suggestion container on clicking outside
    document.addEventListener('click', function(event) {
        if (!suggestionContainer.contains(event.target) && event.target !== searchInput) {
            suggestionContainer.style.display = 'none';
            selectedIndex = -1; // Reset selectedIndex when container is closed
        }
    });
});
