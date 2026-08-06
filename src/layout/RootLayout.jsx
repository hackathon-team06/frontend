import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";

import Footer from "../components/footer/Footer";

// 하단 탭바를 숨길 경로 목록
const HIDE_FOOTER = ["/", "/register", "/onboarding"];

export default function RootLayout() {

    const { pathname } = useLocation();
    const hideFooter = HIDE_FOOTER.includes(pathname);

    return (
        <div className="w-full h-screen overflow-hidden bg-gray-100 flex justify-center">
            <div className="relative w-[390px] h-screen bg-white shadow-lg overflow-hidden">
                <main className={`h-full overflow-y-auto ${hideFooter ? "" : "pb-20"}`}>
                    <Outlet />
                </main>
                {!hideFooter && <Footer />}
            </div>
        </div>
    );
}
