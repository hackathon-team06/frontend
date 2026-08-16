import { skinConditionIcons } from "../../constants/home/skinConditionIcons";

function SkinConditionItem({ data, isSelected, onClick }) {
  return (
    <div
      className={`rounded-2xl border-2 ${isSelected ? "border-[#65DBBE]" : "border-[#EBEBEB]"}`}
    >
      <button
        onClick={onClick}
        className="flex items-center px-3 py-2 gap-1 cursor-pointer "
      >
        {data.icon && (
          <img src={skinConditionIcons[data.icon]} className="w-4 h-4" />
        )}
        <span className="text-base font-semibold">{data.label}</span>
      </button>
    </div>
  );
}

export default SkinConditionItem;
