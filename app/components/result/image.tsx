import { useState } from "react";

export function Image({
    src,
    alt,
    className = "",
    loadingComponent,
}: {
    src: string;
    alt: string;
    className?: string;
    loadingComponent?: React.ReactNode;
}) {
    const [loaded, setLoaded] = useState(false);

    return (
        <div className={`relative w-full h-full`}>
            {!loaded && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    {loadingComponent || (
                        <div className="w-6 h-6 border-2 border-t-transparent border-gray-400 rounded-full animate-spin" />
                    )}
                </div>
            )}


            <img
                src={src}
                alt={alt}
                onLoad={() => setLoaded(true)}
                className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"
                    } ${className}`}
            />
        </div>
    );
}
