import { Link } from "react-router-dom";

const AboutPage = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100">
            <h1 className="text-2xl font-bold mb-4">About Page</h1>

            <Link
                to="/"
                className="text-blue-600 underline hover:text-blue-800"
            >
                Back to Home
            </Link>
        </div>
    );
};

export default AboutPage;