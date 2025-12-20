import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="min-h-[100dvh] flex items-center justify-center bg-gray-100 px-4 ">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="bg-white rounded-2xl shadow-xl p-10 max-w-xl w-full text-center"
            >
                {/* 404 */}
                <h1 className="text-7xl font-extrabold text-blue-600 mb-4">
                    404
                </h1>

                <h2 className="text-2xl font-semibold mb-2">
                    Trang không tồn tại
                </h2>

                <p className="text-gray-500 mb-8 ">
                    Xin lỗi, trang bạn đang tìm không tồn tại hoặc đã bị xoá.
                </p>

                <div className="flex gap-4 justify-center">
                    <Link
                        to="/"
                        className="
              px-6 py-2.5
              rounded-xl
              border border-gray-300
              text-gray-700
              hover:bg-gray-100
              transition
            "
                    >
                        Trang chủ
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default NotFound;
