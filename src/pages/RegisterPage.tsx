import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { pageVariants, pageTransition } from "@/utils/routeAnimation";
import { Link, useNavigate } from "react-router-dom";
import Input from "@/components/form/Input";
import { useEffect, useState } from "react";
import { registerUser } from "@/services/api/user.service";
import toast from "react-hot-toast";

type RegisterForm = {
    username: string;
    fullName: string;
    email: string;
    password: string;
    repassword: string;
};

const RegisterPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Đăng ký | HOC CODE";
        setFocus("username");
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setFocus,
    } = useForm<RegisterForm>({
        mode: "onSubmit",
    });

    const [formError, setFormError] = useState<string | null>(null);

    const onSubmit = async (data: RegisterForm) => {
        setFormError(null);

        try {
            if (data.password !== data.repassword) {
                throw new Error("Mật khẩu không khớp");
            }

            await registerUser({
                username: data.username,
                password: data.password,
                repassword: data.repassword,
                display_name: data.fullName,
                email: data.email,
            });
            toast.success(
                "Đăng ký thành công! Đang chuyển tới trang đăng nhập..."
            );
            setTimeout(() => {
                navigate("/login");
            }, 2000);

        } catch (err: unknown) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Đã xảy ra lỗi, vui lòng thử lại";
            toast.error(message);
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
                    Đăng ký
                </h2>

                <form
                    noValidate
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <Input
                        label="Tên đăng nhập"
                        placeholder="Tên đăng nhập"
                        required
                        {...register("username", {
                            required: "Tên đăng nhập không được để trống",
                        })}
                        error={errors.username?.message}
                    />

                    <Input
                        label="Họ và tên"
                        placeholder="Họ và tên"
                        required
                        {...register("fullName", {
                            required: "Họ và tên không được để trống",
                        })}
                        error={errors.fullName?.message}
                    />

                    <Input
                        label="Email"
                        placeholder="Email"
                        type="email"
                        required
                        {...register("email", {
                            required: "Email không được để trống",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Email không hợp lệ",
                            },
                        })}
                        error={errors.email?.message}
                    />

                    <Input
                        label="Mật khẩu"
                        placeholder="••••••••"
                        type="password"
                        required
                        {...register("password", {
                            required: "Mật khẩu không được để trống",
                            minLength: {
                                value: 6,
                                message: "Mật khẩu tối thiểu 6 ký tự",
                            },
                        })}
                        error={errors.password?.message}
                    />

                    <Input
                        label="Nhập lại mật khẩu"
                        placeholder="••••••••"
                        type="password"
                        required
                        {...register("repassword", {
                            required: "Mật khẩu không được để trống",
                            minLength: {
                                value: 6,
                                message: "Mật khẩu tối thiểu 6 ký tự",
                            },
                        })}
                        error={errors.repassword?.message}
                    />

                    {formError && (
                        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                            {formError}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition cursor-pointer"
                    >
                        Đăng ký
                    </button>
                </form>

                <p className="text-sm text-center mt-6">
                    Đã có tài khoản?{" "}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Đăng nhập
                    </Link>
                </p>
            </div>
        </motion.div>
    );
};

export default RegisterPage;