# csa-xenia

A rebuild of [communitysteam.com](https://communitysteam.com), the public website for Community STE(A)M Academy - Xenia, a tuition-free, independent public STEAM school in Xenia, Ohio. Built with the skills in [45-anti-slop-skills](https://github.com/Kryhr/45-anti-slop-skills).

This is a real project with a real chance of becoming the actual live site, not a demo. Every fact, name, photo, and document in here is pulled directly from the current live site; nothing is fabricated. See [CONTENT-INVENTORY.md](CONTENT-INVENTORY.md) for the full source-of-truth content audit before touching any design or code.

## Goal

The current site looks like a generic website-builder template and doesn't do justice to a school with a genuinely strong real story: a Purple Star military-family designation, students who worked with the Wright Brothers Institute and the Air Force Research Lab on a NASA Artemis-program project, a state cooking championship, and 42 real news posts going back to the school's 2022 founding. The goal is a site that's genuinely clean and well-built, not a recolored template, that actually shows that story off, and that works as well on a phone as it does on a laptop, since most parents will hit this on mobile first.

## Ground rules

- **No fabricated content.** Every name, quote, date, and fact comes from [CONTENT-INVENTORY.md](CONTENT-INVENTORY.md), which was pulled directly from the live site across two full passes. If something isn't in there, it doesn't go on the site without checking first.
- **No stock or AI-generated photos of "students."** Every real photo the current site has (staff, board, buildings, events) has been downloaded into `assets/images/`. If a page needs a photo that doesn't exist yet, that's a placeholder to fill with a real photo later, not license to generate one.
- **Real inconsistencies on the live site get flagged, not silently fixed by guessing.** Two are already known (see CONTENT-INVENTORY.md): the core-values list differs between two articles, and the FAQ says supply lists are "TBD" while three real supply-list PDFs are already linked elsewhere.
- **Mobile has to actually work,** not just resize without breaking. Test every page at a narrow width before calling it done.
- **Structure has to be genuinely different from a template with the colors swapped.** The header pattern, hero composition, card layout, and section rhythm need to be deliberately chosen, not defaulted to whatever was built last time (see the `visual-style-directions` skill).

## Status

- [x] Full content audit (two passes) - every real page, every real news article, every real document, every real photo found on the live site
- [x] Repo set up and named
- [ ] Visual/structural direction - not decided yet, waiting on discussion before any layout gets built
- [ ] Page-by-page build
- [ ] Mobile testing pass
- [ ] Pre-launch technical audit (broken links, dead buttons, contrast, etc.)

## Repo layout

- `CONTENT-INVENTORY.md` - the complete real-content audit; read this before writing any page copy
- `assets/images/` - real photos downloaded from the live site (staff, board, buildings, news, events, and a general `pages/` folder)
- `assets/documents/` - real PDFs downloaded from the live site (calendar, supply lists, policy manual, and more)
- Site code goes at the repo root once the visual direction is settled

## Hosting

Plain frontend (no build step), hosted for free on GitHub Pages under this repo.
