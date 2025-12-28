import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-200 mt-12">
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* TOP */}
                <div className="grid gap-8 md:grid-cols-3">
                    {/* LOGO + DESC */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <img
                                src="/logo.png"
                                alt="HOCCODE"
                                className="h-8"
                            />
                            <span className="font-bold text-lg text-blue-600">
                                HOCCODE
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 max-w-sm">
                            Nền tảng học lập trình từ cơ bản đến nâng cao, cung cấp khóa học,
                            bài tập và luyện thi online.
                        </p>
                    </div>

                    {/* LINKS */}
                    <div>
                        <h4 className="font-semibold mb-4">Liên kết</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>
                                <Link to="/" className="hover:text-blue-600">
                                    Trang chủ
                                </Link>
                            </li>
                            <li>
                                <Link to="/courses" className="hover:text-blue-600">
                                    Khóa học
                                </Link>
                            </li>
                            <li>
                                <Link to="/practice" className="hover:text-blue-600">
                                    Luyện tập
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="hover:text-blue-600">
                                    Giới thiệu
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* CONTACT */}
                    <div>
                        <h4 className="font-semibold mb-4">Liên hệ</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>Email: support@hoccode.vn</li>
                            <li>Hotline: 0123 456 789</li>
                        </ul>
                    </div>
                </div>

                {/* BOTTOM */}
                <div className="border-t border-gray-200 mt-10 pt-6 text-center text-sm text-gray-500">
                    © {new Date().getFullYear()} HOCCODE. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
