export default function FormButton({ type, label, onClick }) {
    return (
        <button
            type={type}
            onClick={onClick}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
            {label}
        </button>
    );
}
