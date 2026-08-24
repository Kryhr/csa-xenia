# Build plan

Treat this as a real, paid job. No half-assing, no filler pages, no fabricated content. Every decision here is either confirmed by the client (you) or flagged as still open. See [CONTENT-INVENTORY.md](CONTENT-INVENTORY.md) for every real fact this has to stay faithful to.

## Confirmed decisions

**Color palette** - keep the current site's real palette, executed properly instead of like a template: white, light gray, and the school's real teal. Concrete tokens to build from:

```
--white:      #ffffff
--gray-light: #f4f6f5
--gray-mid:   #6b7570   (body text on light backgrounds)
--ink:        #1c231f   (headings, high-contrast text)
--teal:       #2f8f83   (primary brand color, sampled from the real site)
--teal-dark:  #256f66   (hover/active states)
```

**School name is one of the first things seen, centered.** Not buried under a tagline; the name itself is the first visual anchor, middle-aligned, not a left-aligned logo lockup.

**Clean menu.** Simple, uncluttered nav, not a wall of 18 links dumped flat (that's what makes the current site's menu feel messy). Group into the same folders the real site already uses (About contains Info/Details/Testimonials/Staff/Board/Projects/Locations/Contact, etc.) rather than flattening everything.

**Heavy use of real micro-interactions** (per the `frontend-polish-microinteractions` skill), not just a static page. Concretely, for the first 10 pages:
- Smooth scroll + a scroll-triggered reveal on sections as they enter the viewport
- Hover-lift on every card (news cards, staff cards, event cards)
- A sticky header that stays clean/compact on scroll
- An accordion for the FAQ (already how the real site's FAQ works, just needs to look and feel better)
- A working site search (the real site has one; ours needs one too, even if it's a simple client-side search over page titles/news headlines to start)
- Toast/inline confirmation on form submission (contact, admissions interest, career, partners, donate forms), not a silent page reload
- A copy-link or share affordance on individual news articles
- A lightbox with real captions for any image gallery (the admissions page's real photo set, for instance)
- Respect `prefers-reduced-motion` everywhere motion is used

**Below the hero: real content structure kept, execution fixed.** The current site's "current news on one side, a feature callout on the other" idea is kept, restructured to not look cramped/ugly:
- **Left column: News.** A short list of the most recent real articles (date + headline, maybe a one-line excerpt). Each links to a real full article page with a "previous/next story" nav, matching what the current site already does structurally, just designed properly.
- **Right column, given more visual weight:** a feature callout reusing real copy in the spirit of "Discover a different kind of learning experience," paired with a real photo, linking to /info or /details.

**Every phone number, email, and social link is a real, working, clickable link.** This is a genuine gap on the current site (they're plain text right now). Confirmed real social links to wire up in the footer:
- LinkedIn: `https://www.linkedin.com/company/csaxenia/about/`
- Facebook: `https://www.facebook.com/CSAxenia`
- Instagram: `https://www.instagram.com/csaxenia/`
- Pinterest: `https://www.pinterest.com/csaxenia`
- Phone: `tel:+19378002720`
- Email: `mailto:info@communitysteam.com`

**Real photos and captions throughout**, pulled from `assets/images/` (already downloaded, see CONTENT-INVENTORY.md for the manifest), with real captions written from what's actually known about each photo, not generic alt text.

**Real calendar and documents linked directly**, not referenced vaguely - the actual PDFs already downloaded to `assets/documents/`.

## Open decision: hero treatment

You want the hero to be a full-width band with the school name front and center, and you're weighing a rotating photo carousel against a single static image. Both are legitimate; here are three concrete ways to build it, genuinely different from each other and from a generic template:

**A. Full-bleed rotating carousel with centered overlay text.** One full-width band, auto-rotating through a real photo set (events, campus, admissions gallery shots), a school name + short line centered on top in white/teal text over a subtle dark scrim for contrast, pause-on-hover and reduced-motion-safe. Closest to "cinematic loop through many photos," highest visual ambition, needs genuinely good photos to not look busy.

**B. Static hero photo + a filmstrip of real photos underneath.** One strong, single real photo (the Church St. building, or a great admissions-gallery shot) with the centered name/tagline overlay, then immediately below it, a slim horizontal strip of smaller real photos a visitor can scroll or tap through sideways. Lighter, faster-loading, still surfaces a lot of real photos, less risk of looking cluttered.

**C. Two stacked full-width bands instead of overlaid text.** A solid light-gray/white band with the centered school name and tagline (no photo behind the text at all, guaranteeing perfect contrast with zero risk), immediately followed by a separate full-width photo carousel band right below it. Text and photos never compete for the same space; the carousel becomes its own first-class element instead of a backdrop.

Pick one (or tell me to combine pieces of them) and I'll build the actual hero to match, then move through the rest of page 1.

## First 10 pages, in priority order

Scoped deliberately to the highest-traffic, highest-value pages first, not all 18+ nav destinations:

1. **Home** - hero + news/feature split + facts band + CTA
2. **About / Info** - mission, vision, what STEAM means at CSA, the real "85% of jobs don't exist yet" framing
3. **Admissions** - real key dates (Sept. 14 first day, Sept. 10 orientation), real admission requirements, real photo gallery
4. **News (list + article template)** - real 42-post archive, previous/next nav, comments where the real site has them
5. **Student & Parent Info** - attendance, Digital Academy LMS, after-school clubs, PIVOT, tech fee, real linked PDFs
6. **Contact** - correct current address only (135 Church St.; 855 Lower Bellbrook is the old campus, not current), real clickable phone/email, real map
7. **Staff** - real names/roles/photos/emails, organized by Leadership/Teaching/Office
8. **Board of Trustees** - real names/bios/meeting schedule
9. **Events** - real upcoming events with real dates/locations/ticket info
10. **The STE[A]M Difference** - the real Sorenson family story, framed honestly as the first entry in an ongoing series, not padded out

Career, Military Family Resources, Donate, Partners, FAQ, Store, Details, Testimonials, Projects, and Locations come after these 10.

## Still open / needs your input before it's built

- The two real inconsistencies in the school's own materials (core values list, supply-list "TBD" vs. real linked PDFs) - flag on the actual page or just go with the most current version? Your call once we get there.
- Whether to add Lorraine Kendall to the staff directory (named in a 2026 article, not on the current live staff page).
- The hero decision above.
