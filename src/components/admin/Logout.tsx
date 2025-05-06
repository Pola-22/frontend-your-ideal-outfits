import { logoutUser } from "../../services/auth";

const Logout: React.FC = () => {

    const onSubmit = async () => {
        await logoutUser()
        const urlParams = new URLSearchParams(window.location.search);
        const redirectTo = urlParams.get('redirectTo');
        window.location.href = redirectTo || '/login';
    }

    return (
        <div className="p-4 border-t border-gray-700">
            <button
                id="logout-button"
                className="w-full text-left px-4 py-2 hover:bg-red-700 bg-red-600 rounded transition duration-200"
                onClick={() => onSubmit()}
            >
                Cerrar Sesión
            </button>
        </div>
    )
}

export default Logout;