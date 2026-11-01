import React from 'react'
import type { LogoType } from '../../../domain/entities/Trainer'

interface LogoGraphicProps {
  type?: LogoType
  customUrl?: string
  color?: string
  secondaryColor?: string
  size?: number
  name?: string
  className?: string
}

export const LogoGraphic: React.FC<LogoGraphicProps> = ({
  type = 'silhouette',
  customUrl,
  color = '#c026d3',
  secondaryColor = '#ffffff',
  size = 64,
  name,
  className = '',
}) => {
  if (type === 'custom' && customUrl) {
    return (
      <img
        src={customUrl}
        alt={name || 'Logo'}
        style={{ width: size, height: size, objectFit: 'contain' }}
        className={`inline-block ${className}`}
      />
    )
  }

  // Silhouette style inspired by personal trainer branding
  if (type === 'silhouette') {
    return (
      <div className={`relative flex flex-col items-center justify-center ${className}`}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="grad-sil" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} />
              <stop offset="100%" stopColor={secondaryColor} />
            </linearGradient>
          </defs>

          {/* Background circle outline */}
          <circle cx="50" cy="50" r="46" stroke={color} strokeWidth="2" strokeDasharray="6 4" opacity="0.6" />
          <circle cx="50" cy="50" r="42" stroke="url(#grad-sil)" strokeWidth="1" opacity="0.8" />

          {/* Fitness Pose Silhouette vector */}
          <g>
            <circle cx="48" cy="24" r="7" fill={color} />
            <path
              d="M51 22 C 58 18, 64 22, 67 28 C 63 27, 57 26, 52 26"
              fill={color}
            />
            <path
              d="M45 32 C 40 38, 38 48, 42 56 C 44 60, 48 64, 49 70 C 50 76, 49 84, 48 88"
              stroke={color}
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M44 34 C 48 40, 56 42, 60 50 C 63 56, 62 68, 60 76 C 58 82, 59 88, 62 90"
              stroke="url(#grad-sil)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <path
              d="M43 36 C 36 34, 30 30, 26 24 C 29 22, 33 24, 36 28"
              stroke={color}
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M48 35 C 55 33, 64 33, 72 26 C 70 29, 66 33, 62 38"
              stroke="url(#grad-sil)"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </g>

          <path d="M78 20 L80 15 L82 20 L87 22 L82 24 L80 29 L78 24 L73 22 Z" fill={color} opacity="0.9" />
          <path d="M22 68 L23 64 L24 68 L28 69 L24 70 L23 74 L22 70 L18 69 Z" fill={color} opacity="0.7" />
        </svg>
      </div>
    )
  }

  // Dumbbell type
  if (type === 'dumbbell') {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="grad-db" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="45" stroke={color} strokeWidth="2" opacity="0.5" />
          <rect x="35" y="46" width="30" height="8" rx="2" fill="url(#grad-db)" />
          <rect x="25" y="32" width="10" height="36" rx="3" fill={color} />
          <rect x="18" y="36" width="7" height="28" rx="2" fill={color} opacity="0.8" />
          <rect x="65" y="32" width="10" height="36" rx="3" fill={color} />
          <rect x="75" y="36" width="7" height="28" rx="2" fill={color} opacity="0.8" />
          <path d="M50 15 L52 22 L59 22 L53 26 L55 33 L50 28 L45 33 L47 26 L41 22 L48 22 Z" fill={color} />
        </svg>
      </div>
    )
  }

  // Flame type
  if (type === 'flame') {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M50 10 C50 10 65 30 65 50 C65 65 55 85 50 88 C45 85 35 65 35 50 C35 30 50 10 50 10Z"
            fill={color}
            opacity="0.85"
          />
          <path
            d="M50 35 C50 35 58 48 58 60 C58 70 53 78 50 80 C47 78 42 70 42 60 C42 48 50 35 50 35Z"
            fill="#ffffff"
            opacity="0.95"
          />
        </svg>
      </div>
    )
  }

  // Shield crest type
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M50 12 L82 24 V52 C82 72 68 86 50 92 C32 86 18 72 18 52 V24 L50 12Z"
          stroke={color}
          strokeWidth="3"
          fill={color}
          fillOpacity="0.15"
        />
        <path
          d="M50 20 L76 30 V52 C76 68 64 80 50 85 C36 80 24 68 24 52 V30 L50 20Z"
          stroke={secondaryColor}
          strokeWidth="1.5"
        />
        <text
          x="50"
          y="58"
          textAnchor="middle"
          fontSize="22"
          fontWeight="900"
          fill={color}
          fontFamily="system-ui, sans-serif"
        >
          FIT
        </text>
      </svg>
    </div>
  )
}

