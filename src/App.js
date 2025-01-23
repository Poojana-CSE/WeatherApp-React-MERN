import React, { useState, useEffect } from 'react';
import axios from "axios";
import './App.css';

const App = () => {
  const [location, setLocation] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");
  const [isCelsius, setIsCelsius] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [favoriteLocations, setFavoriteLocations] = useState([]);

  useEffect(() => {
    if (location) {
      search();
    }
  }, [location]);

  const search = () => {
    if (!location) {
      alert("Please Enter The Location!");
      setWeatherData(null);
      return;
    }
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=895284fb2d2c50a520ea537456963d9c`)
      .then((response) => {
        setWeatherData(response.data);
        setError("");
        if (!searchHistory.includes(location)) {
          setSearchHistory([...searchHistory, location]);
        }
      })
      .catch(() => {
        setError("Location Not Found");
        setWeatherData(null);
      });
  };

  const toggleTemperature = () => {
    setIsCelsius(!isCelsius);
  };

  const convertTemperature = (temp) => {
    return isCelsius ? ((temp - 32) * 5 / 9).toFixed(2) : temp.toFixed(2);
  };

  const getClothingSuggestions = () => {
    if (!weatherData || !weatherData.weather) return "";

    const condition = weatherData.weather[0].main.toLowerCase();
    const temp = isCelsius 
      ? (weatherData.main.temp - 32) * (5 / 9) 
      : weatherData.main.temp;

    if (condition.includes("rain")) {
      return "Carry an umbrella or wear a raincoat.";
    } else if (condition.includes("snow")) {
      return "Wear warm clothes, gloves, and boots.";
    } else if (condition.includes("clear") || condition.includes("sunny")) {
      return "Wear sunglasses and light clothes.";
    } else if (condition.includes("cloud")) {
      return "Wear light clothes, but keep a jacket handy.";
    } else {
      return temp <= 32 
        ? "It's freezing! Wear heavy winter clothing." 
        : "Dress comfortably for the current weather.";
    }
  };

  const searchFromHistory = (locationFromHistory) => {
    setLocation(locationFromHistory);
    search();
  };

  const saveFavoriteLocation = () => {
    if (!location) {
      alert("Enter a location to save as favorite!");
      return;
    }
    if (!favoriteLocations.includes(location)) {
      setFavoriteLocations([...favoriteLocations, location]);
      alert(`${location} has been added to your favorite locations.`);
    } else {
      alert(`${location} is already in your favorite locations.`);
    }
  };

  const removeFavoriteLocation = (locationToRemove) => {
    setFavoriteLocations(favoriteLocations.filter(loc => loc !== locationToRemove));
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    alert("Search history has been cleared.");
  };

  return (
    <div className="app-container">
      <div className="header-container">
        <h2 className="app-title">Weather App</h2>
      </div>
      
      <div className="input-container">
        <input 
          className="location-input" 
          value={location} 
          type='text' 
          placeholder='Enter Location' 
          onChange={(e) => { setLocation(e.target.value); }} 
        />
        <div className="button-group">
          <button className="search-button" type='submit' onClick={search}>Search</button>
          <button className="save-favorite-button" onClick={saveFavoriteLocation}>Save as Favorite</button>
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}

      {weatherData && weatherData.main && weatherData.weather && (
        <div className="weatherDetails">
          <h2>Weather in {weatherData.name}, {weatherData.sys.country}</h2>
          <p><strong>Rainfall:</strong> {weatherData.rain?.['1h'] || 'N/A'} mm</p>
          <p><strong>Humidity:</strong> {weatherData.main.humidity}%</p>
          <p><strong>Forecast:</strong> {weatherData.weather[0].description}</p>
          <p>
            <strong>Temperature:</strong> {convertTemperature(weatherData.main.temp)}° {isCelsius ? 'C' : 'F'}
          </p>
          <p><strong>Clothing Suggestions:</strong> {getClothingSuggestions()}</p>
          <button className="temperature-toggle-button" onClick={toggleTemperature}>
            Show in {isCelsius ? 'Fahrenheit' : 'Celsius'}
          </button>
        </div>
      )}

      <div className="history-and-favorites">
        <div className="searchHistory">
          <h3>Search History</h3>
          {searchHistory.map((historyItem, index) => (
            <button 
              key={index} 
              className="history-item-button"
              onClick={() => searchFromHistory(historyItem)}
            >
              {historyItem}
            </button>
          ))}
          {searchHistory.length > 0 && (
            <button className="clear-history-button" onClick={clearSearchHistory}>
              Clear History
            </button>
          )}
        </div>

        <div className="favoriteLocations">
          <h3>Favorite Locations</h3>
          {favoriteLocations.map((favorite, index) => (
            <div key={index} className="favorite-location-item">
              <button className="favorite-location-button" onClick={() => searchFromHistory(favorite)}>
                {favorite}
              </button>
              <button 
                className="remove-favorite-button"
                onClick={() => removeFavoriteLocation(favorite)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
