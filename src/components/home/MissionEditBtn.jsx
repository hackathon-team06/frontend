import { useNavigate } from "react-router-dom";

export default function MissionEditBtn() {

  const navigate = useNavigate();

  return (
    <button onClick={() => navigate("/edit")} className="w-20 h-7.5 bg-neutral-50 rounded-3xl outline-2 outline-emerald-300 text-sm text-emerald-300 font-bold cursor-pointer">
      미션 수정
    </button>
  );
}
