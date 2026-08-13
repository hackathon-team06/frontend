import { rankColors } from "../../constants/home/rankData";
import Crown from "../../assets/icons/crown_icon.svg";

export default function RankItem({ rank, name }) {
  return (
    <div>
      <div className="flex items-center gap-5">
        <div className="relative w-6 flex flex-col justify-center items-center">
          {rank === 1 && (
            <img
              src={Crown}
              alt="왕관"
              style={{ width: "20px", height: "20px" }}
              className="shrink-0 absolute -top-2 left-1/2 -translate-x-1/2"
            />
          )}
          <div className={`text-base font-semibold ${rankColors[rank]}`}>
            {rank}
          </div>
        </div>
        <div className="text-sm font-semibold">{name}</div>
      </div>
    </div>
  );
}
