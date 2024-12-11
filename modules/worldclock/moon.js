async function fetchMoonPhase() {
    const url = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/kundapura/today?unitGroup=metric&elements=moonphase&include=current&key=VVM776YWTQ5FJNRX9YRBXLF78&contentType=json';

    try {
        const response = await fetch(url);
        const data = await response.json();
        const moonPhase = data.currentConditions.moonphase;

        // Convert moon phase to appropriate symbols
        const moonIcons = [
            "🌑", // New Moon
            "🌒", // Waxing Crescent Moon
            "🌓", // First Quarter Moon
            "🌔", // Waxing Gibbous Moon
            "🌕", // Full Moon
            "🌖", // Waning Gibbous Moon
            "🌗", // Last Quarter Moon
            "🌘"  // Waning Crescent Moon
        ];

        const moonPhases = [
            "New Moon",
            "Waxing Crescent Moon",
            "First Quarter Moon",
            "Waxing Gibbous Moon",
            "Full Moon",
            "Waning Gibbous Moon",
            "Last Quarter Moon",
            "Waning Crescent Moon"
        ];

        // Calculate moon phase index (0 to 7)
        let phaseIndex;
        if (moonPhase === 0) {
            phaseIndex = 0; // New Moon
        } else if (moonPhase > 0 && moonPhase < 0.25) {
            phaseIndex = 1; // Waxing Crescent Moon
        } else if (moonPhase === 0.25) {
            phaseIndex = 2; // First Quarter Moon
        } else if (moonPhase > 0.25 && moonPhase < 0.5) {
            phaseIndex = 3; // Waxing Gibbous Moon
        } else if (moonPhase === 0.5) {
            phaseIndex = 4; // Full Moon
        } else if (moonPhase > 0.5 && moonPhase < 0.75) {
            phaseIndex = 5; // Waning Gibbous Moon
        } else if (moonPhase === 0.75) {
            phaseIndex = 6; // Last Quarter Moon
        } else {
            phaseIndex = 7; // Waning Crescent Moon
        }

        const phaseSymbol = moonIcons[phaseIndex];
        const phaseText = moonPhases[phaseIndex];

        return {
            symbol: phaseSymbol,
            text: phaseText
        };
    } catch (error) {
        console.error(error);
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    try {
        const moonPhaseData = await fetchMoonPhase();
        console.log("Current moon phase symbol:", moonPhaseData.symbol);
        console.log("Current moon phase text:", moonPhaseData.text);

        // Update moon image
        var moonImage = document.querySelector('.moon-image');
        moonImage.textContent = moonPhaseData.symbol;

        // Update moon status text
        var moonStatus = document.querySelector('.moon-status');
        moonStatus.textContent = moonPhaseData.text;

    } catch (error) {
        console.error(error);
    }
});