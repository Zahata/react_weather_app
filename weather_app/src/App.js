import React, {useState, useEffect} from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState('');
  const defaultLocation = 'Pernik';
  let latitude, longitude;
  let initialUrl;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location ? location : defaultLocation}&units=metric&appid=${'d6849123ed89f71cde8cf59dc707c017'}`;

  const successfulLookup = (position) => {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    initialUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${'d6849123ed89f71cde8cf59dc707c017'}`;
  }

  const error = () => {
    console.warn('Unable to retrieve user geolocation');
  }
  
  const searchLocation = (event) => {
    if(event.key === 'Enter') {
      axios.get(url).then((response) => {
        setData(response.data);
      })
      setLocation('');
    }
  }

  const initialOnLoadLocation = () => {
    if(window.navigator.geolocation){
      window.navigator.geolocation.getCurrentPosition(successfulLookup, error);
    } else {
      console.error('Your browser doesn`t support geolocation');
    }
    
    setTimeout(() => {
      console.log(initialUrl);
      if(initialUrl){
        axios.get(initialUrl).then((response) => {
          setData(response.data);
        })
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
          onChange={event => setLocation(event.target.value)}
          onKeyPress={searchLocation}
          placeholder='Enter location'
          type='text'/>
      </div>
      <div className='container'>
        <div className='top'>
          <div className='location'>
            <p> {data.name} </p>
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
              <p> Feels Like</p>
            </div>
            <div className='humidity'>
            {data.main ? <p className='bold'>{data.main.humidity}%</p> : null}
              <p> Humidity </p>
            </div>
            <div className='wind'>
            {data.wind ? <p className='bold'>{data.wind.speed} km/h</p> : null}
              <p> Wind Speed </p>
            </div>
        </div>}
        
      </div>
    </div>
  );
}

export default App;
