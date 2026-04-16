function Banner({ content }) {
    return (
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-600 border border-indigo-500 shadow-lg shadow-indigo-200/50">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-white">
                {content}
            </span>
        </div>
    );
}

export default Banner;