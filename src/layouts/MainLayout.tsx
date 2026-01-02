import { Outlet } from "react-router-dom";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/footer";
import SearchSection from "@/components/search/SearchSection";

const MainLayout = () => {
    return (
        <div className="min-h-[100dvh] flex flex-col bg-gray-50">
            <Navbar />

            {/* CONTENT */}
            <main className="flex-1">
                <section className="max-w-7xl mx-auto px-6 py-16 pb-0 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
                        Học lập trình cùng <span className="text-blue-600">HOCCODE</span>
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Nền tảng học lập trình từ cơ bản đến nâng cao, có bài tập thực hành và
                        thi online.
                    </p>
                    <SearchSection />
                </section>

                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;