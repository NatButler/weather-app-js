import { useEffect, useRef, useState } from 'react';
import agent from './api/agent';
import './App.css'

function App() {
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState('');
  const [previousSearches, setPreviousSearches] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const searchInput = useRef(null);

  useEffect(() => {
    if (location) {
      try {
        const fetchForecast = async () => await agent.requests.get(
          `http://api.weatherapi.com/v1/forecast.json?key=97dbd1e23dd747608f4124045231512&days=1&aqi=no&alerts=no&q=${location}`
        );

        const forecast = fetchForecast();
        forecast
          .then(json => {
            setErrorMessage(null);
            if (!previousSearches.includes(json.location.name)) {
              setPreviousSearches([...previousSearches, json.location.name])
            }
            setWeather(json);
          })
          .catch(err => 
            setErrorMessage(err.response.data.error.message)
          );
      } catch (error){
        console.error(error);
      }
    }
  }, [location]);

  const handleSubmit = (ev) => {
    ev.preventDefault();

    const data = new FormData(ev.target);
    setLocation(data.get('location'));
  }

  const handlePrevSearch = (searchTerm) => {
    searchInput.current.value = searchTerm;
    setLocation(searchTerm);
  }

  return (
    <>
    <form onSubmit={ev => handleSubmit(ev)}>
      <label htmlFor='location'>Location</label>
      <input 
        type='text' 
        name='location' 
        id='location' 
        placeholder='Enter a location' 
        ref={searchInput} 
      />
      <button type='submit'>Submit</button>
    </form>
    {errorMessage && (
      <p className='error'>{errorMessage}</p>
    )}
    {previousSearches.length > 0 && (
      <h6>Previous searches:</h6>
    )}
    <ul className='previous-searches'>
      {previousSearches.map(searchTerm => 
        <li key={searchTerm} className='search-term-list-item'>
          <button onClick={() => handlePrevSearch(searchTerm)}>{searchTerm}</button>
        </li>
      )}
    </ul>
    <div>
      {(!errorMessage && weather) && (
        <>
        <h4>{`${weather?.location?.name}, ${weather?.location?.country}`}</h4>
        <ul>
          <li>Current temp. <span>{weather?.current?.temp_c} &deg;C</span></li>
          <li>Min. temp. <span>{weather?.forecast?.forecastday[0]?.day?.mintemp_c} &deg;C</span></li>
          <li>Max. temp. <span>{weather?.forecast?.forecastday[0]?.day?.maxtemp_c} &deg;C</span></li>
          <li>Humidity <span>{weather?.current?.humidity} %</span></li>
          <li>Sunrise <span>{weather?.forecast?.forecastday[0]?.astro?.sunrise}</span></li>
          <li>Sunset <span>{weather?.forecast?.forecastday[0]?.astro?.sunset}</span></li>
        </ul>
        </>
      )}
    </div>
    </>
  )
}

export default App;
