import React from "react"

type GreenDotProps = {
  title?: string
}

const GreenDot: React.FC<GreenDotProps> = ({ title = "You are here!" }) => (
  <span className="relative px-2 py-2">
    <div
      className="w-1.5 h-1.5 bg-green-400 rounded-full pulsating-dot"
      title={title}
    ></div>
    <style>
      {`
        .pulsating-dot {
          animation: pulse-pulsating-dot 3s infinite ease-in-out;
        }
        @keyframes pulse-pulsating-dot {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 6px 1px rgba(34, 197, 94, 0.5);
            opacity: 1;
          }
          50% {
            transform: scale(1.25);
            box-shadow: 0 0 8px 3px rgba(34, 197, 94, 0.7);
            opacity: 0.8;
          }
        }
      `}
    </style>
  </span>
)

export default GreenDot
