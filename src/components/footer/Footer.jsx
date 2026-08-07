import { useNavigate, useLocation } from "react-router-dom";

{/* 이미지 */}
import homeActive from "../../assets/icons/home_active.svg";
import homeInactive from "../../assets/icons/home_inactive.svg";
import missionActive from "../../assets/icons/mission_active.svg";
import missionInactive from "../../assets/icons/mission_inactive.svg";
import productActive from "../../assets/icons/product_active.svg";
import productInactive from "../../assets/icons/product_inactive.svg";
import myActive from "../../assets/icons/my_active.svg";
import myInactive from "../../assets/icons/my_inactive.svg";

export default function Footer() {

    const navigate = useNavigate();
    const { pathname } = useLocation();

    return (
        <div className="fixed bottom-0 w-[390px] h-20 bg-white rounded-tl-[30px] rounded-tr-[30px] shadow-[0px_-1px_30px_0px_rgba(101,219,190,0.10)]">
            <div className="flex justify-center items-center mt-[19px] gap-[60px]">
                {/* 홈 버튼 */}
                <div className="flex flex-col gap-[7.7px] items-center cursor-pointer" onClick={() => navigate("/home")}>
                    <img src={pathname === "/home" ? homeActive : homeInactive} />
                    <p className={`text-sm font-normal font-['Pretendard_Variable']"
                        ${pathname === "/home" ? "text-[#65DBBE]" : "text-[#A8A8A8]"}`}>홈</p>
                </div>
                {/* 미션 버튼 */}
                <div className="flex flex-col gap-[7.7px] items-center cursor-pointer" onClick={() => navigate("/mission")}>
                    <img src={pathname === "/mission" ? missionActive : missionInactive}  />
                    <p className={`text-sm font-normal font-['Pretendard_Variable'] -mt-[5px] 
                        ${pathname === "/mission" ? "text-[#65DBBE]" : "text-[#A8A8A8]"}`}>미션</p>
                </div>
                {/* 제품 버튼 */}
                <div className="flex flex-col gap-[7.7px] items-center cursor-pointer" onClick={() => navigate("/product")}>
                    <img src={pathname === "/product" ? productActive : productInactive} />
                    <p className={`text-sm font-normal font-['Pretendard_Variable']
                        ${pathname === "/product" ? "text-[#65DBBE]" : "text-[#A8A8A8]"}`}>제품</p>
                </div>
                {/* 마이페이지 버튼 */}
                <div className="flex flex-col gap-[7.7px] items-center cursor-pointer" onClick={() => navigate("/mypage")}>
                    <img src={pathname === "/mypage" || pathname === "/mypage/stamp" ? myActive : myInactive} />
                    <p className={`text-sm font-normal font-['Pretendard_Variable']
                        ${pathname === "/mypage" || pathname === "/mypage/stamp" ? "text-[#65DBBE]" : "text-[#A8A8A8]"}`}>마이</p>
                </div>
            </div>
        </div>
    );
}