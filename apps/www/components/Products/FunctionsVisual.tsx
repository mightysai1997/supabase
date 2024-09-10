import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Typed from 'typed.js'
import type { TypedOptions } from 'typed.js'
import { useBreakpoint } from 'common'

const FunctionsVisual = () => {
  const typerRef = useRef<HTMLSpanElement>(null)
  const [typed, setTyped] = useState<Typed | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const firstString = 'deploy'
  const strings = [firstString, 'serve']
  const isMobile = useBreakpoint('md')

  const onComplete = () => {
    setIsPlaying(false)
  }
  const onBegin = () => {
    setIsPlaying(true)
  }

  const options: TypedOptions = {
    strings,
    typeSpeed: 40,
    backSpeed: 30,
    backDelay: 100,
    showCursor: false,
    loop: false,
    fadeOutDelay: 100,
    onBegin,
    onComplete,
  }

  useEffect(() => {
    return () => {
      typed?.destroy()
    }
  }, [])

  const handleMouseEnter = () => {
    if (!isPlaying && !isMobile) {
      typed?.destroy()
      setTyped(new Typed(typerRef.current, options))
      typed?.reset()
      typed?.start()
    }
  }

  return (
    <figure
      className="absolute inset-0 z-20"
      role="img"
      aria-label="Supabase Edge Functions visual composition"
      onMouseOver={handleMouseEnter}
    >
      <Image
        src="/images/index/products/edge-functions-dark.svg"
        alt="Supabase Edge Functions globe"
        fill
        sizes="100%"
        quality={100}
        priority
        className="hidden dark:block absolute inset-0 object-cover object-center"
      />
      <Image
        src="/images/index/products/edge-functions-light.svg"
        alt="Supabase Edge Functions globe"
        fill
        sizes="100%"
        quality={100}
        priority
        className="dark:hidden absolute inset-0 object-cover object-center"
      />
      <div
        className="
          absolute
          inset-0
          top-[48%] xl:top-[45%]
          w-full max-w-[200px] h-fit
          mx-auto px-2.5 py-1.5
          flex items-center justify-start
          rounded-full bg-surface-100 border border-strong
          text-xs text-foreground-lighter text-left
        "
      >
        <span className="mr-2">$</span>
        supabase
        <span className="ml-1 text-brand inline-block">
          functions <span ref={typerRef}>{firstString}</span>
        </span>
      </div>
    </figure>
  )
}

export default FunctionsVisual
