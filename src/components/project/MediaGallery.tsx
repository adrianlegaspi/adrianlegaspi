import { useState } from 'react'
import { MasonryPhotoAlbum } from 'react-photo-album'
import Lightbox from 'yet-another-react-lightbox'
import 'react-photo-album/masonry.css'
import 'yet-another-react-lightbox/styles.css'
import { usePortfolio } from '@/app/providers/portfolio'

export interface MediaItem {
  src: string
  alt: string
  width: number
  height: number
}

/** Case-study screenshots: a mosaic grid that opens a lightbox on click. */
export function MediaGallery({ items }: { items: MediaItem[] }) {
  const { t } = usePortfolio()
  const [index, setIndex] = useState(-1)

  if (items.length === 0) return null

  return (
    <section className="mt-3">
      <MasonryPhotoAlbum
        photos={items}
        columns={(width) => (width < 400 ? 2 : 3)}
        spacing={8}
        onClick={({ index: clicked }) => setIndex(clicked)}
        componentsProps={{ image: { className: 'rounded-lg border border-line' } }}
      />
      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        index={index}
        slides={items}
        labels={{ Previous: t.gallery.previous, Next: t.gallery.next, Close: t.gallery.close }}
      />
    </section>
  )
}
