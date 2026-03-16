export default function Spinner() {
    return (
        <div className="flex items-center justify-center">
            <div className="w-12 h-12 border-[5px] border-zinc-200 dark:border-zinc-700 border-t-blue-600 dark:border-t-blue-500 rounded-full animate-spin transition-all duration-500"></div>
        </div>
    );
}