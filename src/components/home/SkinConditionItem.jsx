import { skinConditionIcons } from "../../constants/home/skinConditionIcons";

function SkinConditionItem({ data, isSelected, onClick }) {
  return (
    <div
      className={`rounded-2xl border-2 ${
        isSelected ? "border-[#65DBBE]" : "border-[#EBEBEB]"
      }`}
    >
      <button
        onClick={onClick}
        className="flex cursor-pointer items-center gap-1 px-3 py-2"
      >
        {data.icon && (
          <img
            src={skinConditionIcons[data.icon]}
            className="h-4 w-4"
          />
        )}

        <span className="text-base font-semibold">
          {data.label}
        </span>
      </button>
    </div>
  );
}

export default SkinConditionItem;