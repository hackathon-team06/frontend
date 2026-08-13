import { Outlet, useLocation } from "react-router-dom";
import Footer from "../components/footer/Footer";
import useLayoutStore from "../store/useLayoutStore";

// 푸터 숨길 경로
const HIDE_FOOTER_PATHS = ["/", "/onboarding"];

export default function RootLayout() {
  const { pathname } = useLocation();

  const hideFooterFromStore = useLayoutStore((state) => state.hideFooter);
  // 경로가 같거나 경로 뒤에 / 오는 경로는 전부 숨김
  const hideFooterByPath = HIDE_FOOTER_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path + "/"),
  );

  const hideFooter = hideFooterFromStore || hideFooterByPath;

  return (
    <div className="w-full h-screen overflow-hidden bg-gray-100 flex justify-center">
      <div className="relative w-[390px] h-screen bg-white shadow-lg overflow-hidden">
        <main className="h-full overflow-y-auto no-scrollbar">
          <Outlet />
        </main>
        {!hideFooter && <Footer />}
      </div>
    </div>
  );
}
