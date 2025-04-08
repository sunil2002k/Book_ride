import React from 'react';

const LocationSearchPanel = ({ suggestions, setPickup, setDestination, activeField }) => {
    const handleSuggestionClick = (suggestion) => {
        if (!suggestion || !suggestion.coordinates) {
            console.error("Invalid suggestion object:", suggestion);
            return;
        }
    
        const { ltd, lng } = suggestion.coordinates;
        const address = suggestion.name; // Assuming `name` contains the address
        if (activeField === 'pickup') {
            setPickup(address); // Use address instead of { ltd, lng }
        } else if (activeField === 'destination') {
            setDestination(address); // Use address instead of { ltd, lng }
        }
    };

    return (
        <div>
            {suggestions.map((suggestion, idx) => (
                <div
                    key={idx}
                    onClick={() => {
                        if (suggestion.coordinates) {
                            handleSuggestionClick(suggestion);
                        } else {
                            console.error("Suggestion missing coordinates:", suggestion);
                        }
                    }}
                    className="p-2 border-b cursor-pointer"
                >
                    {suggestion.name || "Unknown Location"}
                </div>
            ))}
        </div>
    );
};

export default LocationSearchPanel;