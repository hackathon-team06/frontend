import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";

import Footer from "../components/footer/Footer";

export default function RootLayout() {

    const { pathname } = useLocation();

    return (
        <div className="w-full h-screen overflow-hidden bg-gray-100 flex justify-center">
            <div className="relative w-[390px] h-screen bg-white shadow-lg overflow-hidden">
                <main className="h-full overflow-y-auto pb-20">
                    <Outlet />
                </main>
                {pathname !== "/register" && <Footer />}
            </div>
        </div>
    );
}