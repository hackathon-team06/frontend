import { useEffect, useState } from "react";

import {
  weatherIcons,
  DEFAULT_WEATHER_ICON,
} from "../../constants/home/weatherIcons";
import { getWeatherMessage } from "../../api/weather";

export default function WeatherTipSection() {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    let alive = true;

    getWeatherMessage()
      .then((data) => {
        if (alive) {
          setWeather(data);
        }
      })
      .catch((error) => {
        console.error("날씨 조회 실패:", error);
      });

    return () => {
      alive = false;
    };
  }, []);

  let weatherIcon = null;

  if (weather) {
    weatherIcon = weatherIcons[weather.condition];

    if (!weatherIcon) {
      console.warn("매핑되지 않은 날씨:", weather.condition);
      weatherIcon = DEFAULT_WEATHER_ICON;
    }
  }

  return (
    <div className="flex items-center gap-25 pt-4.75 pr-7">
      <div className="flex-col pl-8.25 ">
        <div className="text-cyan-900 text-xs font-semibold">
          {weather?.messageTitle}
        </div>
        <div className="text-cyan-900 text-sm font-bold">
          {weather?.messageBody}
        </div>
      </div>
      {weatherIcon ? (
        <img src={weatherIcon} className="size-14" />
      ) : (
        <div className="size-14" />
      )}
    </div>
  );
}
