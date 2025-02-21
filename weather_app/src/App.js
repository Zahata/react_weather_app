import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const defaultLocation = 'Pernik';
  const apiKey = 'd6849123ed89f71cde8cf59dc707c017';

  let latitude, longitude;
  let initialUrl;

  const successfulLookup = (position) => {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    initialUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
  }

  const error = () => {
    console.warn('Unable to retrieve user geolocation');
  }

  const getSuggestions = async (query) => {
    if (query) {
      try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/find?q=${query}&type=like&sort=population&cnt=5&appid=${apiKey}`);
        if(response.data.list){
          setSuggestions(response.data.list);
        }
      } catch (error) {
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  }

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setLocation(newValue);

    setTimeout(() => {
      getSuggestions(newValue);
    }, 1500) // 1500ms delay
  }

  const searchLocation = (event) => {
    if (event.key === 'Enter') {
      fetchWeatherData();
      setLocation('');
      setSuggestions([]); // Clear suggestions after selecting a location
    }
  }

  const fetchWeatherData = async (loc = location) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${loc ? loc : defaultLocation}&units=metric&appid=${apiKey}`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
    setIsLoading(false);
  }

  const initialOnLoadLocation = () => {
    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(successfulLookup, error);
    } else {
      console.error('Your browser doesn`t support geolocation');
    }

    setTimeout(() => {
      if (initialUrl) {
        axios.get(initialUrl).then((response) => {
          setData(response.data);
        }).catch((error) => {
          console.error('Error fetching initial weather data:', error);
        });
        setLocation('');
      }
    }, 200);
  }

  useEffect(() => {
    initialOnLoadLocation();
  }, []);

  return (
    <div className="App">
      <div className='search'>
        <input
          value={location}
          onChange={handleInputChange}
          onKeyPress={searchLocation}
          placeholder='Enter location'
          type='text'
        />
        <div className="suggestions-box">
          {suggestions.map((suggestion) => (
            <div key={suggestion.id} onClick={() => {
              fetchWeatherData(suggestion.name);
              setSuggestions([]);
            }}>
              {suggestion.name}
            </div>
          ))}
        </div>
      </div>
      {isLoading ? (
        <div className="loading">
          <h3>Loading...</h3>
        </div>
      ) : (
        <div className='container'>
          <div className='top'>
            <div className='location'>
              <p>{data.name}</p>
            </div>
            <div className='temp'>
              {data.main ? <h1>{data.main.temp.toFixed()}°C</h1> : null}
            </div>
            <div className='description'>
              {data.weather ? <p>{data.weather[0].main}</p> : null}
            </div>
          </div>
          {data.name !== undefined &&
            <div className='bottom'>
              <div className='feels'>
                {data.main ? <p className='bold'>{data.main.feels_like.toFixed()}°C</p> : null}
                <p>Feels Like</p>
              </div>
              <div className='humidity'>
                {data.main ? <p className='bold'>{data.main.humidity}%</p> : null}
                <p>Humidity</p>
              </div>
              <div className='wind'>
                {data.wind ? <p className='bold'>{data.wind.speed} km/h</p> : null}
                <p>Wind Speed</p>
              </div>
            </div>}
        </div>
      )}
    </div>
  );
}

export default App;
