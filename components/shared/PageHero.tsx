import Image from 'next/image'

interface PageHeroProps {
  title: string
  subtitle?: string
  badge?: string
  bgImage?: string
  size?: 'sm' | 'md' | 'lg'
}

const DEFAULT_BG = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=85'

export default function PageHero({
  title,
  subtitle,
  badge,
  bgImage,
  size = 'md',
}: PageHeroProps) {
  const sizeClasses = {
    sm: 'py-20 md:py-28',
    md: 'py-28 md:py-36',
    lg: 'py-36 md:py-48',
  }

  return (
    <section
      className={`relative ${sizeClasses[size]} flex items-center justify-center overflow-hidden`}
    >
      {/* Background */}
      <Image
        src={bgImage || DEFAULT_BG}
        alt=""
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
        quality={80}
      />
      <div className="absolute inset-0 bg-hero" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6">
        {badge && (
          <span className="inline-block bg-orange-500/90 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            {badge}
          </span>
        )}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 text-balance">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">{subtitle}</p>
        )}
      </div>
    </section>
  )
}
