import { useEffect, useState } from "react";

import MissionEditBtn from "./MissionEditBtn";
import RankItem from "./RankItem";
import { rankData } from "../../constants/home/rankData";
import { getRandomProducts } from "../../api/shop";
import { formatCurrentDateTime } from "../../utils/getDate";

export default function IngredientRankSection() {
  const { title, highlight } = rankData;

  const [products, setProducts] = useState([]);
  const [currentDateTime, setCurrentDateTime] = useState(
    formatCurrentDateTime(),
  );

  useEffect(() => {
    const fetchRandomProducts = async () => {
      try {
        const data = await getRandomProducts();
        setProducts(data);
      } catch (error) {
        console.error("랜덤 추천 상품 조회 실패:", error);
      }
    };

    fetchRandomProducts();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(formatCurrentDateTime());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="pl-5.5 mt-3.25">
      <div className="flex items-center gap-12.5">
        <h2 className="text-sm font-semibold text-zinc-900 whitespace-pre-line leading-snug">
          {title}{" "}
          <span className="text-sm font-semibold text-emerald-300">
            {highlight}
          </span>
        </h2>

        <MissionEditBtn />
      </div>

      <div className="text-xs font-medium pt-1.5">
        {currentDateTime}
      </div>

      <div className="flex flex-col gap-4 pl-2 mt-5.25">
        {products.map((product, index) => (
          <RankItem
            key={product.productId}
            rank={index + 1}
            name={product.name}
          />
        ))}
      </div>
    </div>
  );
}