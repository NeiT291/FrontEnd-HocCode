import { Link } from "react-router-dom";
import UserMenu from "@/components/navbar/UserMenu";

const Navbar = () => {
    const isAuthenticated = false;

    const user = {
        name: "Nguyễn Văn A",
        avatar: "https://i.pravatar.cc/100?img=12",
    };
    return (
        <header className="w-full bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center">

                {/* LEFT: LOGO + MENU */}
                <div className="flex items-center gap-10">
                    {/* LOGO */}
                    <Link to="/" className="flex items-center gap-2">
                        <img
                            src="/logo.png"
                            alt="HOCCODE"
                            className="h-8"
                        />
                        <span className="font-bold text-lg text-blue-600">
                            HOCCODE
                        </span>
                    </Link>

                    {/* MENU */}
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
                        <Link to="/" className="hover:text-blue-600 transition">
                            Trang chủ
                        </Link>
                        <Link to="/classes" className="hover:text-blue-600 transition">
                            Lớp học
                        </Link>
                        <Link to="/courses" className="hover:text-blue-600 transition">
                            Khoá học
                        </Link>
                        <Link to="/practice" className="hover:text-blue-600 transition">
                            Luyện tập
                        </Link>
                        <Link to="/run-code" className="hover:text-blue-600 transition">
                            Run code
                        </Link>
                    </nav>
                </div>

                {/* RIGHT: AVATAR + NAME */}
                <UserMenu
                    isAuthenticated={isAuthenticated}
                    user={user}
                />
            </div>
        </header>
    );
};

export default Navbar;




