import React from "react";

export default function DogSprite({ width, height }) {
    return (
        <svg
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
        >
            <g fill="none" stroke="black" stroke-width="2">
                <path
                    d="M12 32 C10 24, 18 18, 24 20 C26 12, 38 12, 40 20 C46 18, 54 24, 52 32 C58 34, 58 42, 52 44 C54 50, 50 56, 44 56 H20 C14 56, 10 50, 12 44 C6 42, 6 34, 12 32 Z"
                    fill="#c48f65"
                />
                <circle cx="24" cy="30" r="2" fill="black" />
                <circle cx="40" cy="30" r="2" fill="black" />
                <path d="M30 38 Q32 40, 34 38" stroke="black" />
                <path d="M20 20 L16 10" stroke="black" />
                <path d="M44 20 L48 10" stroke="black" />
            </g>
        </svg>

    );
}
