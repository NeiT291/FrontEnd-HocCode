const HomePage = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-lg w-[420px] text-center">
                <h1 className="text-3xl font-bold text-blue-600 mb-4">
                    Home Page 🚀
                </h1>

                <p className="text-gray-600 mb-6">
                    React + TypeScript + TailwindCSS + Vite
                </p>

                <div className="space-y-3">
                    <button className="w-full py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition">
                        Primary Button
                    </button>

                    <button className="w-full py-2 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition">
                        Secondary Button
                    </button>
                </div>

                <div className="mt-6 text-sm text-gray-400">
                    Tailwind is working ✔
                </div>
            </div>
        </div>
    );
};

export default HomePage;