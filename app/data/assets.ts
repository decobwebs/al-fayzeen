/**
 * Image and video slots. Render every image through <AppImage slot="..." />.
 * status 'ready'   → file exists in /public/images/<file>
 * status 'pending' → render the designed skeleton (see CLAUDE.md §7)
 * To add a real photo later: drop the file into /public/images with the same name and set status to 'ready'.
 */

export type Ratio = '16:9' | '9:16' | '3:4' | '4:3' | '1:1' | '4:5'

export interface AssetSlot {
  id: string
  file: string
  kind: 'image' | 'video'
  status: 'ready' | 'pending'
  ratio: Ratio
  alt: string
  keyword: string          // search phrase for sourcing
  source: string           // where to look
  icon: string             // Phosphor icon for the skeleton
  tone?: 'light' | 'dark'  // skeleton background
  usedIn: string[]
}

export const assets: Record<string, AssetSlot> = {
  // ---------- READY (provided) ----------
  'hero': { id: 'hero', file: 'hero.mp4', kind: 'video', status: 'ready', ratio: '16:9', alt: 'Pilgrims performing Tawaf around the Kaaba, seen through an arch of Masjid al-Haram', keyword: 'mecca kaaba tawaf', source: 'Pexels Videos', icon: 'ph:play-light', tone: 'dark', usedIn: ['home/hero'] },
  'hero-mobile': { id: 'hero-mobile', file: 'hero-mobile.mp4', kind: 'video', status: 'ready', ratio: '9:16', alt: 'Masjid al-Haram at night, vertical view', keyword: 'mecca vertical', source: 'Pexels Videos', icon: 'ph:play-light', tone: 'dark', usedIn: ['home/hero (mobile)'] },
  'hero-still': { id: 'hero-still', file: 'hero-still.jpg', kind: 'image', status: 'ready', ratio: '16:9', alt: 'The Kaaba and pilgrims in Tawaf, seen through an arch of Masjid al-Haram', keyword: 'kaaba mecca night', source: 'Unsplash, Pexels', icon: 'ph:image-light', tone: 'dark', usedIn: ['home/hero poster', 'packages/ramadan card'] },
  'pkg-sakinah': { id: 'pkg-sakinah', file: 'pkg-sakinah.jpg', kind: 'image', status: 'ready', ratio: '3:4', alt: 'The Makkah clock tower above Masjid al-Haram', keyword: 'mecca clock tower', source: 'Unsplash', icon: 'ph:image-light', usedIn: ['packages/sakinah'] },
  'pkg-rahmah': { id: 'pkg-rahmah', file: 'pkg-rahmah.jpg', kind: 'image', status: 'ready', ratio: '3:4', alt: 'Pilgrims in white Ihram performing Tawaf around the Kaaba, seen from above', keyword: 'kaaba pilgrims white', source: 'Unsplash, Pexels', icon: 'ph:image-light', usedIn: ['packages/rahmah', 'home/services packages tile'] },
  'pkg-diyafah': { id: 'pkg-diyafah', file: 'pkg-diyafah.jpg', kind: 'image', status: 'ready', ratio: '3:4', alt: 'Masjid an-Nabawi in Madinah at night', keyword: 'medina mosque night', source: 'Unsplash', icon: 'ph:image-light', usedIn: ['packages/diyafah'] },
  'why-welcome': { id: 'why-welcome', file: 'why-welcome.jpg', kind: 'image', status: 'ready', ratio: '3:4', alt: 'The arrivals sign in an airport hall', keyword: 'airport arrival welcome', source: 'Pexels', icon: 'ph:image-light', usedIn: ['home/why-direct'] },
  'why-hotel-view': { id: 'why-hotel-view', file: 'why-hotel-view.jpg', kind: 'image', status: 'ready', ratio: '3:4', alt: 'The Makkah clock tower above the city at night', keyword: 'hotel window view city night', source: 'Unsplash / AI', icon: 'ph:image-light', usedIn: ['home/why-direct'] },
  'why-guide': { id: 'why-guide', file: 'why-guide.jpg', kind: 'image', status: 'ready', ratio: '3:4', alt: 'A man in a white thobe and red shemagh working at a laptop', keyword: 'arab man white thobe', source: 'Pexels', icon: 'ph:image-light', usedIn: ['home/why-direct'] },
  'why-walk': { id: 'why-walk', file: 'why-walk.jpg', kind: 'image', status: 'ready', ratio: '3:4', alt: 'Pilgrims walking along a street in Makkah', keyword: 'mecca street pilgrims', source: 'Unsplash', icon: 'ph:image-light', usedIn: ['home/why-direct'] },
  'journey-arrive': { id: 'journey-arrive', file: 'journey-arrive.jpg', kind: 'image', status: 'ready', ratio: '3:4', alt: 'View from an aeroplane window over the desert', keyword: 'airplane window wing desert', source: 'Unsplash', icon: 'ph:airplane-tilt-light', usedIn: ['home/journey'] },

  // ---------- PENDING (skeletons until the project is approved) ----------
  'journey-umrah': { id: 'journey-umrah', file: 'journey-umrah.jpg', kind: 'image', status: 'pending', ratio: '3:4', alt: 'Pilgrims performing Tawaf', keyword: 'tawaf kaaba crowd', source: 'Unsplash, Pexels', icon: 'ph:circle-notch-light', usedIn: ['home/journey'] },
  'journey-makkah': { id: 'journey-makkah', file: 'journey-makkah.jpg', kind: 'image', status: 'pending', ratio: '3:4', alt: 'Prayer at Masjid al-Haram', keyword: 'masjid al haram prayer', source: 'Pexels', icon: 'ph:mosque-light', usedIn: ['home/journey'] },
  'journey-train': { id: 'journey-train', file: 'journey-train.jpg', kind: 'image', status: 'pending', ratio: '3:4', alt: 'The Haramain high-speed train', keyword: 'haramain high speed train', source: 'Pexels, Wikimedia (credit required)', icon: 'ph:train-light', usedIn: ['home/journey'] },
  'journey-madinah': { id: 'journey-madinah', file: 'journey-madinah.jpg', kind: 'image', status: 'pending', ratio: '3:4', alt: 'The umbrellas of Masjid an-Nabawi', keyword: 'medina umbrellas mosque', source: 'Unsplash', icon: 'ph:mosque-light', usedIn: ['home/journey'] },
  'journey-ziyarat': { id: 'journey-ziyarat', file: 'journey-ziyarat.jpg', kind: 'image', status: 'pending', ratio: '3:4', alt: 'Quba Mosque in Madinah', keyword: 'quba mosque / uhud mountain', source: 'Unsplash, Wikimedia', icon: 'ph:mountains-light', usedIn: ['home/journey'] },
  'hotel-room': { id: 'hotel-room', file: 'hotel-room.jpg', kind: 'image', status: 'pending', ratio: '4:3', alt: 'A bright, minimal hotel room', keyword: 'white minimal luxury hotel room', source: 'Unsplash / AI', icon: 'ph:bed-light', usedIn: ['hotels', 'home/hotels'] },
  'hotel-lobby': { id: 'hotel-lobby', file: 'hotel-lobby.jpg', kind: 'image', status: 'pending', ratio: '4:3', alt: 'A marble hotel lobby', keyword: 'marble hotel lobby arabic', source: 'Unsplash / AI', icon: 'ph:buildings-light', usedIn: ['hotels'] },
  'hotel-makkah': { id: 'hotel-makkah', file: 'hotel-makkah.jpg', kind: 'image', status: 'pending', ratio: '4:3', alt: 'Hotels around Masjid al-Haram in Makkah', keyword: 'mecca hotels clock tower', source: 'Unsplash', icon: 'ph:buildings-light', usedIn: ['hotels', 'home/hotels'] },
  'hotel-madinah': { id: 'hotel-madinah', file: 'hotel-madinah.jpg', kind: 'image', status: 'pending', ratio: '4:3', alt: 'The Madinah skyline', keyword: 'medina city skyline', source: 'Unsplash', icon: 'ph:buildings-light', usedIn: ['hotels', 'home/hotels'] },
  'flight': { id: 'flight', file: 'flight.jpg', kind: 'image', status: 'pending', ratio: '16:9', alt: 'An aeroplane wing above the clouds at sunset', keyword: 'airplane wing sunset clouds', source: 'Unsplash', icon: 'ph:airplane-tilt-light', usedIn: ['flights header'] },
  'transport-sedan': { id: 'transport-sedan', file: 'transport-sedan.jpg', kind: 'image', status: 'pending', ratio: '4:3', alt: 'A black sedan', keyword: 'black sedan car side view white background', source: 'Unsplash / AI', icon: 'ph:car-simple-light', usedIn: ['transport'] },
  'transport-suv': { id: 'transport-suv', file: 'transport-suv.jpg', kind: 'image', status: 'pending', ratio: '4:3', alt: 'A black SUV on a desert road', keyword: 'black suv desert road', source: 'Unsplash / AI', icon: 'ph:car-light', usedIn: ['transport'] },
  'transport-van': { id: 'transport-van', file: 'transport-van.jpg', kind: 'image', status: 'pending', ratio: '4:3', alt: 'The interior of a passenger van', keyword: 'luxury van interior', source: 'Unsplash / AI', icon: 'ph:van-light', usedIn: ['transport'] },
  'transport-bus': { id: 'transport-bus', file: 'transport-bus.jpg', kind: 'image', status: 'pending', ratio: '4:3', alt: 'A white coach bus', keyword: 'white coach bus', source: 'Pexels / AI', icon: 'ph:bus-light', usedIn: ['transport'] },
  'visa': { id: 'visa', file: 'visa.jpg', kind: 'image', status: 'pending', ratio: '4:3', alt: 'A passport on a white surface', keyword: 'passport white background', source: 'Pexels / AI', icon: 'ph:identification-card-light', usedIn: ['visa'] },
  'guide-ihram': { id: 'guide-ihram', file: 'guide-ihram.jpg', kind: 'image', status: 'pending', ratio: '1:1', alt: 'White Ihram cloths folded', keyword: 'white towels flat lay', source: 'AI', icon: 'ph:t-shirt-light', usedIn: ['guide'] },
  'guide-tasbih': { id: 'guide-tasbih', file: 'guide-tasbih.jpg', kind: 'image', status: 'pending', ratio: '1:1', alt: 'Prayer beads on a white surface', keyword: 'prayer beads white background', source: 'Unsplash', icon: 'ph:dots-nine-light', usedIn: ['guide'] },
  'guide-quran': { id: 'guide-quran', file: 'guide-quran.jpg', kind: 'image', status: 'pending', ratio: '1:1', alt: 'An open Qur\'an in soft light', keyword: 'quran soft light', source: 'Unsplash', icon: 'ph:book-open-text-light', usedIn: ['guide'] },
  'stories-video': { id: 'stories-video', file: 'stories.mp4', kind: 'video', status: 'pending', ratio: '16:9', alt: 'A pilgrim describing their Umrah', keyword: 'client testimonial video (real, with consent)', source: 'Client', icon: 'ph:play-circle-light', tone: 'dark', usedIn: ['home/stories'] },
  'stories-group': { id: 'stories-group', file: 'stories-group.jpg', kind: 'image', status: 'pending', ratio: '4:5', alt: 'A group of pilgrims', keyword: 'african muslim men smiling (client photos preferred)', source: 'Client / Pexels', icon: 'ph:users-three-light', usedIn: ['home/stories'] },
  'stories-family': { id: 'stories-family', file: 'stories-family.jpg', kind: 'image', status: 'pending', ratio: '4:5', alt: 'A family of pilgrims', keyword: 'african muslim family (client photos preferred)', source: 'Client / Pexels', icon: 'ph:users-four-light', usedIn: ['home/stories'] },
  'about-team': { id: 'about-team', file: 'about-team.jpg', kind: 'image', status: 'pending', ratio: '4:5', alt: 'The Al Fayzeen team in Makkah', keyword: 'client team portraits', source: 'Client', icon: 'ph:user-circle-light', usedIn: ['about'] },
  'about-office': { id: 'about-office', file: 'about-office.jpg', kind: 'image', status: 'pending', ratio: '4:3', alt: 'The Al Fayzeen office in Makkah', keyword: 'client office photo', source: 'Client', icon: 'ph:buildings-light', usedIn: ['about'] },
  'texture-marble': { id: 'texture-marble', file: 'texture-marble.jpg', kind: 'image', status: 'pending', ratio: '16:9', alt: '', keyword: 'white marble texture', source: 'Unsplash', icon: 'ph:square-light', usedIn: ['backgrounds (optional)'] },
}

export const getAsset = (id: string): AssetSlot => {
  const a = assets[id]
  if (!a) throw new Error(`Unknown asset slot: ${id}`)
  return a
}
