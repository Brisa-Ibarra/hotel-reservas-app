export function TopoLines({ opacity = 0.15 }: { opacity?: number }) {
    return (
        <svg
            className="topo-lines"
            style={{ opacity }}
            viewBox="0 0 800 400"
            xmlns="http://www.w3.org/2000/svg"
        >
            {[0, 1, 2, 3].map((i) => (
                <path
                    key={i}
                    d={`M -50 ${60 + i * 90} Q 200 ${10 + i * 90} 400 ${80 + i * 90} T 850 ${40 + i * 90}`}
                    fill="none"
                    stroke="#C4A35A"
                    strokeWidth="1.2"
                />
            ))}
        </svg>
    );
}