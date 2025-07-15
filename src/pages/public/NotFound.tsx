import { useNavigate } from 'react-router-dom'

export default function NotFound() {
    const navigate = useNavigate()

    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-100 px-4">
            <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
            <p className="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</p>
            <p className="text-gray-600 mb-6">Sorry, the page you are looking for does not exist.</p>
            <button
                onClick={() => navigate('/')}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
                Go to Home
            </button>
        </div>
    )
}
