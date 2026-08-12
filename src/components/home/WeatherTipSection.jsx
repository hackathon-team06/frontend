import { weatherIcons } from "../../constants/home/weatherIcons";

// 목데이터는 Home.jsx로부터
export default function WeatherTipSection({ weather }) {
  //아이콘 매핑
  const weatherIcon = weatherIcons[weather.condition];

  return (
    <div className="flex items-center gap-25 pt-4.75 ">
      <div className="flex-col pl-8.25 ">
        <div className="text-cyan-900 text-xs font-semibold">
          {weather.messageTitle}
        </div>
        <div className="text-cyan-900 text-sm font-bold">
          {weather.messageBody}
        </div>
      </div>
      <img src={weatherIcon} className="size-14" />
    </div>
  );
}
