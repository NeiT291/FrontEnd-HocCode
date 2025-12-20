import { Outlet, Link } from "react-router-dom";

const MainLayout = () => {
    return (
        <div>
            <header className="bg-blue-600 text-white px-6 py-4 flex gap-4">
                <Link to="/" className="font-bold">Home</Link>
                <Link to="/about">About</Link>
            </header>

            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;