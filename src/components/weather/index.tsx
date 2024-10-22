import { useEffect, useState } from "react";
import Search from "../search-bar";
interface WeatherData {
  id: number;
  main: string;
  description: string;
  icon: string;
}
interface CityWeatherData {
  name: string;
  sys: {
    country: string;
  };
  main: {
    temp: string;
    humidity: string;
  };
  weather: WeatherData[];
  wind: {
    speed: string;
  };
}

export default function Weather() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [weatherData, setWeatherData] = useState<CityWeatherData | null>(null);
  const apiKey = "53800e02e8054d4fa3df1a5755e7b874";

  async function fetchWeatherData(prop: string) {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${prop}&units=metric&appid=${apiKey}`
      );

      const data = await response.json();

      console.log(data);
      if (data) {
        setWeatherData(data);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`);
      } else {
        console.log("Error");
      }
    } finally {
      setLoading(false);
    }
  }

  function handleSearch() {
    fetchWeatherData(search);
  }

  function getCurrentDate() {
    return new Date().toLocaleDateString("en-us", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  useEffect(() => {
    fetchWeatherData("florianopolis");
  }, []);
  return (
    <div>
      <Search
        search={search}
        setSearch={setSearch}
        handleSearch={handleSearch}
      />
      {loading ? (
        <div className="loading">Loading</div>
      ) : (
        <div>
          <div className="city-name">
            <h2>
              {weatherData?.name}, <span>{weatherData?.sys.country}</span>
            </h2>
          </div>
          <div className="date">
            <span>{getCurrentDate()}</span>
          </div>
          <div className="temp">{weatherData?.main.temp}º Celsius</div>
          <p className="description">
            {weatherData?.weather.map((item) => item.description)}
          </p>
          <div className="weather-info">
            <div className="column">
              <div>
                <p className="wind">{weatherData?.wind.speed} m/s</p>
                <p>Wind Speed</p>
              </div>
            </div>
            <div className="column">
              <div>
                <p className="humidity">{weatherData?.main.humidity}%</p>
                <p>Humidity</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
