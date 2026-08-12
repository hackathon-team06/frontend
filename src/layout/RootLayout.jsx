import { Outlet } from "react-router-dom";

export default function RootLayout() {

    return (
        <div className="w-full h-screen overflow-hidden bg-gray-100 flex justify-center">
            <div className="relative w-[390px] h-screen bg-white shadow-lg overflow-hidden">
                <main className="h-full overflow-y-auto no-scrollbar">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
