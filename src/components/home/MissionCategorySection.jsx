import { missionCategoryData } from "../../constants/home/missionCategoryData";

export default function MissionCategorySection({selectedCategories, setSelectedCategories}) {
  const handleCategoryClick = (key) => {
    setSelectedCategories((prev) => {
      if (prev.includes(key)) {
        return prev.filter((categoryKey) => categoryKey !== key);
      }

      // 최대 2개까지 선택 가능 
      if (prev.length >= 2) {
        return prev;
      }

      return [...prev, key];
    });
  };

  return (
    <section className="mx-4 mt-7 mb-[50px]">
      <p className="ml-[3px] text-zinc-900 text-sm font-semibold">
        미션 카테고리 (2개까지 선택 가능)
      </p>

      <div className="grid grid-cols-3 gap-x-2 gap-y-3 mt-[14px]">
        {missionCategoryData.map((category) => {
          const isSelected = selectedCategories.includes(category.key);

          return (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.key)}
              className={`flex h-10 items-center justify-center gap-1 whitespace-nowrap rounded-2xl outline-[1.50px] outline-offset-[-1.50px] text-sm font-semibold cursor-pointer ${
                isSelected
                  ? "bg-[#78E2B4] text-white outline-[#78E2B4]"
                  : "bg-white text-zinc-900 outline-zinc-300"
              }`}
            >
              <span>{category.emoji}</span>
              <span>{category.name}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}