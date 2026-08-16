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
        // 못 받아와도 빈 자리만 두고 화면은 살려둡니다.
        console.warn("날씨 정보를 불러오지 못했어요.", error);
      });

    return () => {
      alive = false;
    };
  }, []);

  let weatherIcon = null;

  if (weather) {
    weatherIcon = weatherIcons[weather.condition];

    if (!weatherIcon) {
      // 어떤 값이 안 잡혔는지 남겨두면 나중에 아이콘을 더 그릴 때 참고가 됩니다.
      console.warn("아이콘이 없는 날씨예요.", weather.condition);
      weatherIcon = DEFAULT_WEATHER_ICON;
    }
  }

  return (
    <div className="flex items-center gap-25 pt-4.75 ">
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
