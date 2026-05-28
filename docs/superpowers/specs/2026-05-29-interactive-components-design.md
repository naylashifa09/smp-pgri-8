# Interactive Components Enhancement - SMP PGRI 8 Website

**Date:** 2026-05-29  
**Status:** Approved  
**Author:** Design Session with User

## Overview

Enhance the SMP PGRI 8 school website with interactive components and micro-interactions to improve user engagement and experience. Primary focus on interactive components (accordion, lightbox, filters, animated counters) and secondary focus on animations & micro-interactions (hover effects, scroll animations, smooth transitions).

## Goals

1. Add interactive components to all sections appropriate to their context
2. Implement smooth animations and micro-interactions throughout the site
3. Replace basic OpenStreetMap embed with interactive react-leaflet map showing exact school location
4. Improve user engagement through visual feedback and interactive elements
5. Maintain performance and accessibility standards

## School Location Data

**Correct Address:**  
Jl. Raya Semplak Jl. Cemplang Utara No.276, RT.02/RW.13, Cilendek Bar., Kec. Bogor Bar., Kota Bogor, Jawa Barat 16114

**GPS Coordinates:**
- Latitude: -6.549
- Longitude: 106.762

## Technical Architecture

### New Dependencies

```json
{
  "react-leaflet": "^4.2.1",
  "leaflet": "^1.9.4",
  "framer-motion": "^11.0.0"
}
```

**Rationale:**
- `react-leaflet` - Most popular React map library, lightweight, no API key required, extensive documentation
- `leaflet` - Core dependency for react-leaflet
- `framer-motion` - Industry-standard animation library for React, declarative API, excellent performance

### Component Structure

```
src/components/site/
├── Hero.tsx (enhanced with animations)
├── About.tsx (add Accordion component)
├── Stats.tsx (add animated counter)
├── Facilities.tsx (add Carousel + Lightbox)
├── News.tsx (enhanced hover & transitions)
├── Gallery.tsx (add Lightbox + Filter)
├── Contact.tsx (replace with react-leaflet map)
└── Footer.tsx (add scroll-to-top button)

src/components/ui/ (new reusable components)
├── lightbox.tsx (image zoom modal)
├── animated-counter.tsx (counting animation)
├── scroll-reveal.tsx (scroll-triggered animations wrapper)
└── interactive-map.tsx (react-leaflet wrapper)

src/hooks/ (new custom hooks)
├── useCountUp.ts (number counting animation)
├── useScrollTrigger.ts (detect element in viewport)
└── useKeyPress.ts (keyboard event handling)
```

### State Management Strategy

- **Local component state** with `useState` for UI interactions (lightbox open/close, accordion expand, filter selection)
- **No global state needed** - all interactions are scoped to individual components
- **URL state** for gallery filters (optional enhancement for shareable filtered views)

### Performance Considerations

1. **Lazy Loading:**
   - Images use `loading="lazy"` attribute
   - Lightbox component loaded via dynamic import
   - Map component loaded only when Contact section is near viewport

2. **Animation Performance:**
   - Use CSS transforms (translateX, translateY, scale) instead of position properties
   - Intersection Observer for scroll-triggered animations (trigger once when visible)
   - Debounce scroll events (300ms)
   - RequestAnimationFrame for smooth counting animations

3. **Bundle Size:**
   - Framer Motion tree-shakeable (~30KB gzipped for features we use)
   - Leaflet ~40KB gzipped
   - Total addition: ~70KB gzipped

4. **Accessibility:**
   - Focus trap in modals
   - Keyboard navigation (ESC, arrows)
   - ARIA labels for interactive elements
   - Reduced motion support via `prefers-reduced-motion` media query

## Detailed Component Designs

### 1. Hero Section - Animated Entry

**Current State:**
- Static hero with title, description, and CTA button
- Background image with overlay

**Enhanced Features:**
1. **Text Reveal Animation**
   - Title words fade in + slide up with stagger effect (50ms delay between words)
   - Description fades in after title completes
   - CTA button scales in with bounce effect
   - Total animation duration: ~1.5 seconds

2. **Parallax Background**
   - Background image moves slower than scroll (0.5x speed)
   - Creates depth perception
   - Only active on desktop (disabled on mobile for performance)

3. **Interactive CTA Buttons**
   - Hover: scale(1.05) + glow effect
   - Active: scale(0.98)
   - Smooth scroll to target section on click

**Implementation Details:**
```typescript
// Framer Motion variants
const titleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.6 }
  })
}

// Parallax effect
const { scrollY } = useScroll()
const y = useTransform(scrollY, [0, 500], [0, 150])
```

**Accessibility:**
- Respect `prefers-reduced-motion` - disable animations if user prefers
- Ensure text is readable during animation (no extreme opacity changes)

---

### 2. About Section - Expandable Content

**Current State:**
- Static text with 4 selling points (Beasiswa, Guru, Perpustakaan, Biaya)
- All content visible at once

**Enhanced Features:**
1. **Accordion Component**
   - 4 items: Visi, Misi, Sejarah, Keunggulan (combine 4 selling points)
   - Exclusive mode: only 1 item open at a time
   - Smooth height transition (300ms ease-in-out)
   - Icon rotation: chevron-down → chevron-up when expanded

2. **Auto-scroll Behavior**
   - When item expands, check if fully visible in viewport
   - If not, smooth scroll to bring expanded content into view
   - Prevents user from losing context

3. **Visual Feedback**
   - Hover: background color change
   - Active item: border accent color
   - Smooth transitions for all state changes

**Implementation Details:**
```typescript
// Use existing Radix UI Accordion
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// Custom styling
<Accordion type="single" collapsible className="space-y-4">
  <AccordionItem value="visi">
    <AccordionTrigger>Visi Sekolah</AccordionTrigger>
    <AccordionContent>...</AccordionContent>
  </AccordionItem>
</Accordion>
```

**Content Structure:**
- **Visi:** Mission statement
- **Misi:** 3-5 bullet points
- **Sejarah:** Brief history (2-3 paragraphs)
- **Keunggulan:** 4 selling points (Beasiswa, Guru Berpengalaman, Perpustakaan Lengkap, Biaya Terjangkau)

---

### 3. Stats Section - Animated Numbers

**Current State:**
- Editorial horizontal layout with large numbers
- Static display

**Enhanced Features:**
1. **Counting Animation**
   - Numbers count from 0 to target value
   - Duration: 2 seconds
   - Easing: ease-out (fast start, slow end)
   - Trigger: when section enters viewport (50% visible)
   - Animate only once (not on every scroll)

2. **Stagger Effect**
   - Each stat starts counting with 100ms delay from previous
   - Creates wave effect across the section

3. **Visual Enhancement**
   - Pulse effect on numbers during counting
   - Subtle scale animation (1.0 → 1.05 → 1.0)

**Implementation Details:**
```typescript
// Custom hook for counting animation
function useCountUp(end: number, duration: number, shouldStart: boolean) {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    if (!shouldStart) return
    
    let startTime: number
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = (timestamp - startTime) / duration
      
      if (progress < 1) {
        setCount(Math.floor(end * easeOut(progress)))
        requestAnimationFrame(animate)
      } else {
        setCount(end)
      }
    }
    
    requestAnimationFrame(animate)
  }, [end, duration, shouldStart])
  
  return count
}

// Intersection Observer for trigger
const { ref, inView } = useInView({ threshold: 0.5, triggerOnce: true })
```

**Stats to Animate:**
- Siswa Aktif: 450+
- Guru Berpengalaman: 35+
- Tahun Berdiri: 1985 (or actual year)
- Prestasi: 50+ (or actual number)

---

### 4. Facilities Section - Image Showcase

**Current State:**
- Asymmetric layout with 3 featured images + 2-column list
- Static images

**Enhanced Features:**
1. **Image Carousel**
   - Replace 3 static images with carousel
   - Auto-play (5 seconds per slide) with pause on hover
   - Navigation: prev/next arrows + dot indicators
   - Swipe gesture support on mobile
   - Smooth slide transitions (500ms)

2. **Lightbox Modal**
   - Click any image → open full-screen lightbox
   - Features:
     - Image zoom (fit → fill)
     - Navigation arrows (prev/next)
     - Image counter (e.g., "3 / 8")
     - Close button + ESC key
     - Click outside to close
     - Keyboard navigation (arrow keys)
   - Smooth fade + scale animation on open/close
   - Focus trap (accessibility)

3. **Thumbnail Navigation**
   - Small thumbnails below main carousel
   - Click thumbnail → jump to that slide
   - Active thumbnail highlighted

**Implementation Details:**
```typescript
// Embla Carousel (already in dependencies)
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'

const [emblaRef, emblaApi] = useEmblaCarousel(
  { loop: true },
  [Autoplay({ delay: 5000, stopOnInteraction: true })]
)

// Lightbox component
<Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
  <DialogContent className="max-w-screen-xl">
    <img src={currentImage} alt="" className="w-full h-auto" />
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
      {currentIndex + 1} / {images.length}
    </div>
  </DialogContent>
</Dialog>
```

**Image List:**
- Ruang Kelas
- Laboratorium Komputer
- Laboratorium IPA
- Perpustakaan
- Lapangan Olahraga
- Masjid
- Kantin
- Ruang Multimedia

---

### 5. News Section - Enhanced Cards

**Current State:**
- Magazine layout: 1 featured + 2 smaller articles
- Basic hover effects

**Enhanced Features:**
1. **Card Hover Effects**
   - Lift: translateY(-8px) + shadow elevation
   - Image zoom: scale(1.05) inside container (overflow hidden)
   - Border glow: accent color
   - Smooth transitions (300ms ease-out)

2. **Image Overlay**
   - Gradient overlay darkens slightly on hover
   - "Baca Selengkapnya" text fades in on hover
   - Icon animation (arrow slides in from left)

3. **Ripple Effect on Click**
   - Material Design ripple when clicking card
   - Expands from click point
   - Subtle and quick (400ms)

**Implementation Details:**
```typescript
// CSS for hover effects
.news-card {
  transition: transform 300ms ease-out, box-shadow 300ms ease-out;
}

.news-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
}

.news-card img {
  transition: transform 300ms ease-out;
}

.news-card:hover img {
  transform: scale(1.05);
}

// Framer Motion for ripple
<motion.div
  whileTap={{ scale: 0.98 }}
  onClick={handleClick}
>
```

**Interaction Flow:**
1. User hovers → card lifts, image zooms, overlay appears
2. User clicks → ripple effect, navigate to article detail
3. Smooth transitions throughout

---

### 6. Gallery Section - Filterable Lightbox

**Current State:**
- Masonry grid with hover effects
- No filtering or lightbox

**Enhanced Features:**
1. **Category Filter Tabs**
   - Categories: Semua, Kegiatan, Fasilitas, Prestasi
   - Active tab highlighted with accent color + underline
   - Smooth tab indicator animation (slides to active tab)
   - Click tab → filter images

2. **Animated Grid Layout**
   - Framer Motion layout animations
   - Images smoothly rearrange when filter changes
   - Fade out filtered items, fade in new items
   - Maintain masonry layout during transitions

3. **Advanced Lightbox**
   - Click image → full-screen modal
   - Features:
     - Prev/Next navigation (arrows + keyboard)
     - Image counter (e.g., "5 / 24")
     - Zoom controls (fit/fill toggle)
     - Download button
     - Share button (copy link)
     - Close button + ESC key + click outside
   - Image preloading (next/prev images)
   - Smooth transitions between images
   - Touch gestures: swipe left/right, pinch zoom

4. **Loading States**
   - Skeleton loaders while images load
   - Progressive image loading (blur-up effect)

**Implementation Details:**
```typescript
// Filter state
const [activeFilter, setActiveFilter] = useState('semua')
const filteredImages = images.filter(img => 
  activeFilter === 'semua' || img.category === activeFilter
)

// Framer Motion layout animations
<motion.div layout key={image.id}>
  <motion.img
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  />
</motion.div>

// Lightbox with keyboard navigation
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') goToPrev()
    if (e.key === 'ArrowRight') goToNext()
    if (e.key === 'Escape') closeLightbox()
  }
  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [currentIndex])
```

**Gallery Categories:**
- **Kegiatan:** Upacara, ekstrakurikuler, field trip, acara sekolah
- **Fasilitas:** Ruang kelas, lab, perpustakaan, lapangan
- **Prestasi:** Piala, sertifikat, kompetisi, penghargaan

---

### 7. Contact Section - Interactive Map

**Current State:**
- Basic OpenStreetMap iframe embed
- Static, no interactions
- Approximate location (Bogor area)

**Enhanced Features:**
1. **React-Leaflet Interactive Map**
   - OpenStreetMap tiles (free, no API key)
   - Custom marker at exact school location
   - Zoom controls (+ / -)
   - Pan/drag to explore
   - Responsive: full width on mobile, 2/3 width on desktop

2. **Custom Marker**
   - School logo or custom pin icon
   - Bounce animation on page load (draws attention)
   - Click marker → open popup

3. **Info Popup**
   - School name: "SMP PGRI 8 Kota Bogor"
   - Address: Jl. Raya Semplak Jl. Cemplang Utara No.276
   - Operating hours: Senin-Jumat 07.00-15.00
   - "Get Directions" button → opens Google Maps with directions
   - Phone number (click to call on mobile)

4. **Map Configuration**
   - Center: [-6.549, 106.762]
   - Initial zoom: 16 (street level)
   - Max zoom: 18
   - Min zoom: 12
   - Disable scroll zoom (prevent accidental zoom while scrolling page)
   - Enable on click (user must click map to enable scroll zoom)

**Implementation Details:**
```typescript
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Custom marker icon
const customIcon = new L.Icon({
  iconUrl: '/marker-icon.png', // custom school icon
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
})

// Map component
<MapContainer
  center={[-6.549, 106.762]}
  zoom={16}
  scrollWheelZoom={false}
  className="h-full w-full"
>
  <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  />
  <Marker position={[-6.549, 106.762]} icon={customIcon}>
    <Popup>
      <div className="text-center">
        <h3 className="font-bold">SMP PGRI 8 Kota Bogor</h3>
        <p className="text-sm mt-1">Jl. Raya Semplak Jl. Cemplang Utara No.276</p>
        <a
          href="https://www.google.com/maps/dir/?api=1&destination=-6.549,106.762"
          target="_blank"
          className="btn-primary mt-2"
        >
          Get Directions
        </a>
      </div>
    </Popup>
  </Marker>
</MapContainer>
```

**Marker Bounce Animation:**
```typescript
// Add bounce animation on mount
useEffect(() => {
  if (markerRef.current) {
    markerRef.current.openPopup() // Auto-open popup on load
    // Bounce animation via CSS
    markerRef.current._icon.classList.add('marker-bounce')
  }
}, [])
```

**Directions Link:**
- Google Maps: `https://www.google.com/maps/dir/?api=1&destination=-6.549,106.762`
- Opens in new tab
- Works on desktop and mobile
- Mobile: opens Google Maps app if installed

---

### 8. Footer - Scroll to Top

**Current State:**
- Static footer with links and copyright
- No scroll-to-top functionality

**Enhanced Features:**
1. **Floating Scroll-to-Top Button**
   - Appears after scrolling 300px down
   - Fixed position: bottom-right corner
   - Fade in/out animation (opacity + translateY)
   - Circular button with up arrow icon
   - Pulse animation every 3 seconds (subtle attention grabber)

2. **Smooth Scroll Behavior**
   - Click button → smooth scroll to top
   - Duration: ~800ms
   - Easing: ease-in-out

3. **Visual Design**
   - Primary color background
   - White icon
   - Shadow for depth
   - Hover: scale(1.1) + shadow elevation
   - Active: scale(0.95)

**Implementation Details:**
```typescript
// Scroll detection
const [showButton, setShowButton] = useState(false)

useEffect(() => {
  const handleScroll = () => {
    setShowButton(window.scrollY > 300)
  }
  
  window.addEventListener('scroll', handleScroll)
  return () => window.removeEventListener('scroll', handleScroll)
}, [])

// Scroll to top
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Component
<AnimatePresence>
  {showButton && (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-50 p-4 rounded-full bg-primary text-white shadow-lg"
    >
      <ArrowUp className="h-6 w-6" />
    </motion.button>
  )}
</AnimatePresence>
```

**Accessibility:**
- ARIA label: "Scroll to top"
- Keyboard accessible (Tab + Enter)
- Focus visible state

---

## Reusable Components

### Lightbox Component

**Purpose:** Full-screen image viewer with navigation

**Props:**
```typescript
interface LightboxProps {
  images: string[]
  initialIndex: number
  isOpen: boolean
  onClose: () => void
}
```

**Features:**
- Prev/Next navigation
- Image counter
- Zoom toggle
- Keyboard support (arrows, ESC)
- Click outside to close
- Focus trap
- Image preloading

**Usage:**
```typescript
<Lightbox
  images={facilityImages}
  initialIndex={selectedIndex}
  isOpen={lightboxOpen}
  onClose={() => setLightboxOpen(false)}
/>
```

---

### AnimatedCounter Component

**Purpose:** Number counting animation

**Props:**
```typescript
interface AnimatedCounterProps {
  end: number
  duration?: number
  suffix?: string
  className?: string
}
```

**Features:**
- Counts from 0 to target
- Customizable duration
- Optional suffix (e.g., "+", "%")
- Triggers on viewport entry

**Usage:**
```typescript
<AnimatedCounter end={450} suffix="+" duration={2000} />
```

---

### ScrollReveal Component

**Purpose:** Wrapper for scroll-triggered animations

**Props:**
```typescript
interface ScrollRevealProps {
  children: React.ReactNode
  animation?: 'fade' | 'slide-up' | 'slide-left' | 'scale'
  delay?: number
  threshold?: number
}
```

**Features:**
- Multiple animation presets
- Intersection Observer based
- Respects prefers-reduced-motion
- Triggers once by default

**Usage:**
```typescript
<ScrollReveal animation="slide-up" delay={200}>
  <div>Content to animate</div>
</ScrollReveal>
```

---

## Custom Hooks

### useCountUp

**Purpose:** Number counting animation logic

```typescript
function useCountUp(
  end: number,
  duration: number = 2000,
  shouldStart: boolean = true
): number
```

**Returns:** Current count value

---

### useScrollTrigger

**Purpose:** Detect when element enters viewport

```typescript
function useScrollTrigger(
  threshold: number = 0.5,
  triggerOnce: boolean = true
): { ref: RefObject, inView: boolean }
```

**Returns:** Ref to attach to element + inView boolean

---

### useKeyPress

**Purpose:** Listen for specific keyboard events

```typescript
function useKeyPress(
  targetKey: string,
  callback: () => void
): void
```

**Usage:**
```typescript
useKeyPress('Escape', closeLightbox)
```

---

## Animation Specifications

### Timing Functions

- **Ease-out:** Default for most animations (fast start, slow end)
- **Ease-in-out:** For reversible animations (hover states)
- **Spring:** For playful interactions (button clicks)

### Durations

- **Fast:** 150-200ms (micro-interactions, hover states)
- **Medium:** 300-400ms (transitions, state changes)
- **Slow:** 600-800ms (page load animations, scroll effects)
- **Very slow:** 2000ms (counting animations)

### Reduced Motion

All animations must respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Testing Strategy

### Unit Tests

1. **Custom Hooks:**
   - useCountUp: verify counting logic, duration, easing
   - useScrollTrigger: mock Intersection Observer
   - useKeyPress: simulate keyboard events

2. **Reusable Components:**
   - Lightbox: navigation, keyboard controls, close behavior
   - AnimatedCounter: rendering, animation trigger
   - ScrollReveal: animation variants, threshold

### Integration Tests

1. **Gallery Filter:**
   - Click filter tab → correct images shown
   - Layout animation completes
   - URL updates (if implemented)

2. **Map Interaction:**
   - Marker renders at correct position
   - Popup opens on click
   - Directions link has correct URL

3. **Accordion:**
   - Only one item open at a time
   - Smooth height transitions
   - Icon rotation

### Manual Testing Checklist

- [ ] All animations smooth on 60fps
- [ ] No layout shift during animations
- [ ] Keyboard navigation works in all modals
- [ ] Focus trap works in lightbox
- [ ] Reduced motion preference respected
- [ ] Touch gestures work on mobile
- [ ] Map loads correctly and is interactive
- [ ] Scroll-to-top appears/disappears correctly
- [ ] All hover states have smooth transitions
- [ ] Images lazy load properly
- [ ] No console errors or warnings

### Performance Testing

- [ ] Lighthouse score > 90 (Performance)
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3.5s
- [ ] No animation jank (check Chrome DevTools Performance)
- [ ] Bundle size increase < 100KB gzipped

---

## Accessibility Requirements

### Keyboard Navigation

- All interactive elements accessible via Tab
- Modals have focus trap
- ESC closes all modals
- Arrow keys navigate in lightbox and carousel
- Enter/Space activates buttons

### Screen Readers

- ARIA labels on all icon-only buttons
- ARIA live regions for dynamic content (filter results count)
- Alt text on all images
- Semantic HTML (button, nav, main, etc.)

### Visual

- Focus visible states on all interactive elements
- Sufficient color contrast (WCAG AA)
- No information conveyed by color alone
- Text remains readable during animations

### Motion

- Respect prefers-reduced-motion
- Provide pause button for auto-playing carousel
- No flashing or strobing effects

---

## Success Criteria

### User Experience

1. **Engagement Metrics:**
   - Time on page increases by 20%
   - Scroll depth increases (more users reach footer)
   - Gallery interaction rate > 30%
   - Map interaction rate > 15%

2. **Usability:**
   - Users can easily find school location on map
   - Gallery images viewable in full size
   - Content expandable/collapsible as needed
   - Smooth, non-jarring animations

### Technical

1. **Performance:**
   - Lighthouse Performance score > 90
   - No animation jank (60fps maintained)
   - Bundle size increase < 100KB gzipped
   - Images lazy load properly

2. **Accessibility:**
   - WCAG 2.1 AA compliant
   - Keyboard navigation fully functional
   - Screen reader compatible
   - Reduced motion support

3. **Browser Support:**
   - Chrome/Edge (last 2 versions)
   - Firefox (last 2 versions)
   - Safari (last 2 versions)
   - Mobile browsers (iOS Safari, Chrome Android)

### Code Quality

1. **Maintainability:**
   - Reusable components for common patterns
   - Custom hooks for shared logic
   - Clear prop interfaces with TypeScript
   - Consistent naming conventions

2. **Testing:**
   - Unit tests for all custom hooks
   - Integration tests for key interactions
   - Manual testing checklist completed
   - No console errors or warnings

---

## Implementation Phases

### Phase 1: Foundation (Priority: High)
- Install dependencies (react-leaflet, leaflet, framer-motion)
- Create reusable components (Lightbox, AnimatedCounter, ScrollReveal)
- Create custom hooks (useCountUp, useScrollTrigger, useKeyPress)
- Set up animation utilities and constants

### Phase 2: Core Interactions (Priority: High)
- Contact: Interactive map with react-leaflet
- Gallery: Lightbox + filter tabs
- Stats: Animated counters
- About: Accordion component

### Phase 3: Enhanced Interactions (Priority: Medium)
- Facilities: Carousel + lightbox
- News: Enhanced hover effects
- Hero: Animated entry + parallax
- Footer: Scroll-to-top button

### Phase 4: Polish & Testing (Priority: High)
- Accessibility audit and fixes
- Performance optimization
- Cross-browser testing
- Reduced motion support
- Documentation

---

## Migration Notes

### Breaking Changes
- None - all changes are additive enhancements

### Data Requirements
- Gallery images need category metadata (kegiatan/fasilitas/prestasi)
- Facilities images need to be in array format for carousel
- About content needs to be restructured for accordion (visi/misi/sejarah/keunggulan)

### Configuration
- Leaflet CSS must be imported in main entry file
- Custom marker icon file needed (can use default Leaflet icon as fallback)

---

## Future Enhancements (Out of Scope)

- Virtual tour (360° photos)
- Live chat widget
- Video gallery with player
- Interactive campus map (clickable buildings)
- Student testimonials carousel
- News search and pagination
- Gallery infinite scroll
- Social media feed integration

---

## References

- [React Leaflet Documentation](https://react-leaflet.js.org/)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Embla Carousel Documentation](https://www.embla-carousel.com/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Web Animation Best Practices](https://web.dev/animations/)
