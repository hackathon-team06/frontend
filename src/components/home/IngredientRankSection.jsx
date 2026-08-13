import MissionEditBtn from "./MissionEditBtn";
import RankItem from "./RankItem";
import { rankData } from "../../constants/home/rankData";

export default function IngredientRankSection() {
  const { title, highlight, date, items } = rankData;
  return (
    <div className="pl-5.5 mt-3.25">
      <div className="flex items-center gap-12.5">
        <h2 className="text-sm font-semibold text-zinc-900 whitespace-pre-line leading-snug'">
          {title}{" "}
          <span className="text-sm font-semibold text-emerald-300">
            {highlight}
          </span>
        </h2>
        <MissionEditBtn />
      </div>
      <div className="text-xs font-medium pt-1.5">{date}</div>
      <div className="flex flex-col gap-4 pl-2 mt-5.25">
        {items.map((item) => (
          <RankItem key={item.rank} rank={item.rank} name={item.name} />
        ))}
      </div>
    </div>
  );
}
