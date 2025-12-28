import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { pageVariants, pageTransition } from "@/utils/routeAnimation";
import { Link } from "react-router-dom";
import Input from "@/components/form/Input";

type LoginForm = {
    username: string;
    password: string;
};
const LoginPage = () => {
    useEffect(() => {
        document.title = "Đăng nhập | HOC CODE";
        setFocus("username");
    }, []);
    const {
        register,
        handleSubmit,
        formState: { errors },
        setFocus,
    } = useForm<LoginForm>();

    const [formError, setFormError] = useState<string | null>(null);

    const onSubmit = async (data: LoginForm) => {
        setFormError(null); // reset lỗi cũ

        try {
            console.log("LOGIN DATA:", data);
            // ❗ GIẢ LẬP LỖI TỪ BACKEND
            if (data.username === "admin") {
                throw new Error("Username đã tồn tại");
            }

            // call API thật ở đây
        } catch (err: unknown) {
            if (err instanceof Error) {
                setFormError(err.message);
            } else {
                setFormError("Đã xảy ra lỗi, vui lòng thử lại");
            }
        }
    };



    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
        >
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
                <h2 className="text-2xl font-bold text-center mb-2">
                    Đăng nhập
                </h2>


                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Username */}
                    <Input
                        label="Tên đăng nhập"
                        placeholder="Tên đăng nhập"
                        required
                        {...register("username", {
                            required: "Tên đăng nhập không được để trống",
                        })}
                        error={errors.username?.message}
                    />

                    {/* Password */}
                    <Input
                        label="Mật khẩu"
                        type="password"
                        placeholder="••••••••"
                        required
                        {...register("password", {
                            required: "Mật khẩu không được để trống",
                        })}
                        error={errors.password?.message}
                    />
                    {formError && (
                        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                            {formError}
                        </div>
                    )}
                    <button
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition cursor-pointer"
                    >
                        Đăng nhập
                    </button>
                </form>
                <p className="text-sm text-center mt-6">
                    Chưa có tài khoản?{" "}
                    <Link to="/register" className="text-blue-600 hover:underline">
                        Đăng ký
                    </Link>
                </p>
            </div>
        </motion.div>
    );
};

export default LoginPage;