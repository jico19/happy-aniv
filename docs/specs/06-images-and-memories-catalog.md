# 06 - Images & Memories Catalog Specification (`public/images/1.jpg` – `42.jpg`)

## 1. Overview & Asset Path Convention

All relationship memory photographs reside in the `public/images/` directory:
- Served URL path in the web app: `/images/{id}.jpg` (e.g., `/images/1.jpg`, `/images/42.jpg`).
- Format: Standard JPEG (`.jpg`).
- Display Container: Responsive museum frame modal with `object-contain`, auto fallback to placeholder on missing asset.

---

## 2. Featured Gallery Exhibits (Images 1 – 8)

These 8 images are configured directly in `src/data/exhibits.js` and mounted to the walls of the main museum hall in `GalleryScene.js`:

| Image ID | Exhibit Title | Theme / Location | Short Description |
| :--- | :--- | :--- | :--- |
| **`1.jpg`** | Where It All Began | Campus Days • Dalubhasaan ng Lungsod ng Lucena | Walking the campus halls in school uniforms and lanyards; the quiet spark that started our entire story. |
| **`2.jpg`** | Building Our Little World | Creative Date • Our Special Spot | Patiently piecing together a miniature nanoblock princess block by block; proof that love grows with care. |
| **`3.jpg`** | Under the Glowing Lights | Night Date • Luminous Park | Strolling through an illuminated wonderland at night, making heart poses and smiling under the glowing lights. |
| **`4.jpg`** | Our Playful Everyday | After Class • Campus Canopy | Playful candid selfies and goofy faces after lectures; making every simple break feel special. |
| **`5.jpg`** | Your Radiant Smile | Sweet Moments • Right Beside You | A close-up selfie capturing her glowing smile and dimples that brighten any ordinary day. |
| **`6.jpg`** | Playful Challenges | Cafe Hangout • Favorite Cafe | Teasing, arm wrestling, and laughing over cafe tables; true partners and best friends. |
| **`7.jpg`** | Sunflowers & Sweet Milestones | Milestone Day • Home Sweet Home | Celebrating with a sweet miniature chocolate cake and a handmade yellow crochet sunflower bouquet. |
| **`39.jpg`** | Your Graduation Day | June 18, 2026 • Graduation Ceremony | Wearing her black academic gown, graduation medal, and holding vibrant flower bouquets, celebrating her major graduation milestone. |

---

## 3. Comprehensive Timeline Catalog (Images 9 – 42)

The remaining 34 images comprise the anniversary archive, chronicling the couple's first year:

### Chapter I: Studio Shoots & Photobooths
- **`9.jpg`** — *3-Strip Film Photobooth (3/9/2025)*: Classic vintage 3-frame photobooth strip with peace signs, sweet cheek kisses, and close hugs.
- **`25.jpg`** — *Red Heart Sunglasses*: Studio back-to-back photo session wearing retro pixelated red heart shades.
- **`26.jpg`** — *Studio Giggles*: Playful, candid studio portrait showing natural smiles and relaxed comfort with one another.
- **`27.jpg`** — *Anniversary Portrait*: Crisp studio shot capturing genuine joy and connection.

### Chapter II: Campus Life & Study Breaks
- **`10.jpg`** — *Cheek-to-Cheek Uniform Selfie*: Leaning in close between classes with sweet and gentle smiles.
- **`11.jpg`** — *Hallway Hangout*: Candid moments waiting outside the classroom, sharing inside jokes.
- **`12.jpg`** — *Study Session Companions*: Quiet hours spent preparing for exams side by side.
- **`13.jpg`** — *Campus Stroll*: Walking through the school quad hand-in-hand after a long day of lectures.
- **`14.jpg`** — *Library Whispers*: Sharing a secret laugh while keeping quiet during study hours.

### Chapter III: Casual Dates & Food Trips
- **`15.jpg`** — *Late Night Chats*: Cozy evening selfie enjoying downtime and heartfelt conversations.
- **`16.jpg`** — *Milk Tea Run*: Quenching afternoon thirst with favorite drinks and sweet conversations.
- **`17.jpg`** — *Dinner Date*: Sitting across from each other enjoying good food and warm stories.
- **`18.jpg`** — *Street Food Adventure*: Grabbing quick bites and favorite local street treats on the go.
- **`19.jpg`** — *Weekend Escape*: Taking a break from university life to explore a quiet new spot.
- **`20.jpg`** — *Fresh Air Stroll*: Walking outdoors under open skies, enjoying uninterrupted quality time.
- **`21.jpg`** — *Coffee & Comfort*: Sitting side by side at a cozy cafe booth with warm beverages.
- **`22.jpg`** — *Window Seat*: Watching the afternoon fade while sitting together by the cafe window.
- **`23.jpg`** — *Spontaneous Detours*: Taking unexpected turns during dates and discovering hidden gems together.
- **`24.jpg`** — *Evening Glow*: Walking under street lamps as the city winds down.

### Chapter IV: Milestones, Mot Mots & Celebrations
- **`28.jpg`** — *Special Delivery*: Surprising each other with sweet treats and small heartfelt gifts.
- **`29.jpg`** — *Candlelit Wishes*: Sharing a quiet wish together over an anniversary treat.
- **`30.jpg`** — *Polaroid Mot Mot (Jan 16, 2026)*: Digital polaroid frame marked "Happy mot mot love 💖💖💖" at an outdoor food stop.
- **`31.jpg`** — *Close-Up Glow*: Late-night cozy snapshot sharing affectionate smiles.
- **`32.jpg`** — *Weekend Market Date*: Outdoor food court date with heart-eye emojis, sharing meals in casual clothes.
- **`33.jpg`** — *Sweet Treats*: Indulging in favorite desserts and cooling off with milk tea.
- **`34.jpg`** — *Laughter Caught on Camera*: Unfiltered, unposed laughter that captures their real relationship bond.
- **`35.jpg`** — *Golden Hour Warmth*: Soft afternoon sunset lighting illuminating their faces on a walk.
- **`36.jpg`** — *Hand in Hand*: A simple stroll where holding hands speaks louder than words.
- **`37.jpg`** — *Milestone Dinner*: Dressed up for a special celebratory dinner marking another month together.
- **`38.jpg`** — *Festival Lights*: Exploring festive night markets and holiday light displays.
- **`39.jpg`** — *Her Graduation Day (June 18, 2026)*: Wearing her black academic graduation gown, graduation medal ribbon, and holding vibrant bouquets of crochet and purple flowers under the clouds, celebrating her proud graduation milestone with him by her side.
- **`40.jpg`** — *Looking Ahead*: Gazing at the view together, dreaming of future goals and adventures.
- **`41.jpg`** — *Quiet Contentment*: Peaceful smiles shared at the end of a long, fulfilling day.
- **`42.jpg`** — *Happy Mot Mot Po 🥳*: Cheerful celebration selfie with celebration emoji celebrating their ongoing love story.

---

## 4. How to Swap or Expand Featured Exhibits

To replace any featured painting in the museum gallery with any archive photo from `9.jpg` through `42.jpg`, simply update the `image`, `title`, and `caption` fields inside `src/data/exhibits.js`:

```javascript
// Example: Swapping in image 30 as an exhibit
{
  id: 'january-mot-mot',
  title: 'January Monthsary',
  image: '/images/30.jpg',
  date: 'January 16, 2026',
  location: 'Night Food Park',
  caption: 'Happy mot mot! Cherishing every single month that brings us closer.',
  subtext: 'Another milestone with my favorite person.',
  wallPosition: 'top-1'
}
```
