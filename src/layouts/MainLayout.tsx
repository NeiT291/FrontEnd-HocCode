import { Outlet } from "react-router-dom";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/footer";

const MainLayout = () => {
    return (
        <div className="min-h-[100dvh] flex flex-col bg-gray-50">
            <Navbar />

            {/* CONTENT */}
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;