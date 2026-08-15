import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "../components/footer/Footer";
import useLayoutStore from "../store/useLayoutStore";

// 푸터 숨길 경로
const HIDE_FOOTER_PATHS = ["/", "/onboarding", "/home/google-calendar-sync"];

export default function RootLayout() {
  const { pathname } = useLocation();
  const mainRef = useRef(null);

  // 화면을 옮기면 항상 맨 위에서 시작합니다.
  // (react-router 는 기본적으로 이전 화면의 스크롤 위치를 유지합니다)
  useEffect(() => {
    mainRef.current?.scrollTo(0, 0);
  }, [pathname]);

  const hideFooterFromStore = useLayoutStore((state) => state.hideFooter);
  // 경로가 같거나 경로 뒤에 / 오는 경로는 전부 숨김
  const hideFooterByPath = HIDE_FOOTER_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path + "/"),
  );

  const hideFooter = hideFooterFromStore || hideFooterByPath;

  return (
    <div className="w-full h-screen overflow-hidden bg-gray-100 flex justify-center">
      <div className="relative flex flex-col w-97.5 h-screen bg-white shadow-lg overflow-hidden">
        <main ref={mainRef} className="flex-1 overflow-y-auto no-scrollbar">
          <Outlet />
        </main>
        {!hideFooter && <Footer />}
      </div>
    </div>
  );
}
