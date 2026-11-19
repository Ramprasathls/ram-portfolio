'use client';

import * as React from 'react';
import Image from 'next/image';
import Autoplay from 'embla-carousel-autoplay';
import { ImageIcon } from 'lucide-react';
import { cn } from 'cn';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from '@/components/ui/carousel';

type Photo = { src: string; alt: string };

const navButton =
  'size-9 border-white/40 bg-black/35 text-white backdrop-blur-sm hover:bg-black/55 hover:text-white dark:border-white/20 dark:bg-black/45 dark:hover:bg-black/65 disabled:opacity-0';

function Slide({ photo, index }: { photo: Photo; index: number }) {
  const [missing, setMissing] = React.useState(false);

  return (
    <figure className="group relative aspect-[4/5] overflow-hidden rounded-xl bg-gray-100 dark:bg-zinc-900">
      {missing ? (
        <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center text-sm text-gray-500 dark:text-zinc-500">
          <ImageIcon className="size-6" aria-hidden />
          {process.env.NODE_ENV === 'development' ? (
            <span>
              Add <code>public{photo.src}</code>
            </span>
          ) : (
            <span>Photo coming soon</span>
          )}
        </div>
      ) : (
        <>
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(min-width: 384px) 320px, 90vw"
            className="object-cover"
            priority={index === 0}
            onError={() => setMissing(true)}
          />
          {/* Caption: the alt text, revealed on hover */}
          <figcaption
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-black/75 via-black/40 to-transparent px-4 pt-10 pb-4 text-sm leading-snug text-white opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100"
          >
            {photo.alt}
          </figcaption>
        </>
      )}
    </figure>
  );
}

export function PhotoCarousel({
  images,
  delay = 5000
}: {
  images: Photo[];
  delay?: number;
}) {
  const autoplay = React.useRef(
    Autoplay({ delay, stopOnInteraction: false, stopOnMouseEnter: true })
  );
  const [api, setApi] = React.useState<CarouselApi>();
  const [selected, setSelected] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      autoplay.current.stop();
    }

    const onSelect = () => setSelected(api.selectedScrollSnap());
    onSelect();
    api.on('select', onSelect);
    api.on('reInit', onSelect);
    return () => {
      api.off('select', onSelect);
      api.off('reInit', onSelect);
    };
  }, [api]);

  return (
    <div className="mx-auto my-8 w-full max-w-xs">
      <Carousel
        opts={{ align: 'start', loop: true }}
        plugins={[autoplay.current]}
        setApi={setApi}
        aria-label="Photos"
      >
        <CarouselContent>
          {images.map((photo, i) => (
            <CarouselItem key={photo.src}>
              <Slide photo={photo} index={i} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className={cn(navButton, 'left-3')} />
        <CarouselNext className={cn(navButton, 'right-3')} />
      </Carousel>

      <div className="mt-4 flex justify-center gap-2">
        {images.map((photo, i) => (
          <button
            key={photo.src}
            type="button"
            aria-label={`Go to photo ${i + 1}`}
            aria-current={selected === i}
            onClick={() => api?.scrollTo(i)}
            className={cn(
              'h-1.5 rounded-full transition-all',
              selected === i
                ? 'w-6 bg-gray-800 dark:bg-zinc-200'
                : 'w-1.5 bg-gray-300 hover:bg-gray-400 dark:bg-zinc-700 dark:hover:bg-zinc-600'
            )}
          />
        ))}
      </div>
    </div>
  );
}
