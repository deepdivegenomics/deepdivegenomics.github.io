# DeepDiveGenomics — workshop website

A hand-built static site for the DeepDiveGenomics variant-calling workshop.
No framework, no build step — just HTML, CSS and a little vanilla JS.

```
index.html     all the markup + copy
styles.css     all styling (design tokens at the top under :root)
script.js      mobile nav, accordions, scroll reveal
favicon.svg    the DNA/terminal logo mark
```

## Run it locally

It's a plain static site, so anything that serves a folder works:

```bash
# option A — Python (already on macOS)
python3 -m http.server 8755
# then open http://localhost:8755

# option B — just open the file
open index.html
```

## Deploy it

Drop the folder onto any static host — **Netlify, Cloudflare Pages, GitHub
Pages, Vercel** all work with zero config. No server, no database.

---

## ⚠️ Replace the placeholder content before going live

The structure and copy are real and ready, but I filled the specifics with
realistic placeholders. Swap these for your real details so it's genuinely
*yours*:

| What | Where | Currently set to |
|------|-------|------------------|
| **Batch dates** | `index.html` — search `11–13 Sep 2026` / `Batch 05` | Fri–Sun, 11–13 Sep 2026 |
| **Fee** | `#pricing` + logistics card + hero — search `₹500` | ₹500 (single plan) |
| **Session times** | `#format` — `10:00 AM – 1:30 PM IST` | placeholder IST slot |
| **Bikram's profile link** | `#instructors` — the `GitHub` link on the Bikram Panda card | dead `#` link |
| **Contact email** | search `hello@deepdivegenomics.com` everywhere | placeholder address |
| **Enrol / signup flow** | the `mailto:` links + footer form | mailto + non-functional form |

### Making "Enrol" actually work
Right now the enrol buttons open an email (`mailto:`). For real signups,
point them at whatever you use — a **Razorpay / Instamojo payment page**, a
**UPI collect link**, a Google Form, or an LMS checkout. Just change the `href`
on the `.btn` links in `#pricing` and the final CTA. (The copy already mentions
paying by UPI or card — keep that in sync with whatever you wire up.)

### The newsletter form
The footer email form is inert (`onsubmit="return false"`). Wire it to your
provider (Buttondown, Mailchimp, ConvertKit, Substack) by setting the form
`action`/`method`, or swap it for that provider's embed.

---

## Customising the look

All colours, fonts and spacing live in the `:root` block at the top of
`styles.css`. The accent is one teal (`--teal`); the **viridis** colour ramp
(`--v0`…`--v4`) survives as a nod most bioinformaticians will recognise in the
terminal's top border. The pipeline is a compact monochrome **snake** flowchart
(`.snake` / `.snode` rules) — black/white/grey only. Change `--teal` and the
whole site re-tints.

Fonts are IBM Plex Sans / IBM Plex Mono via Google Fonts (with system
fallbacks if offline).

## Accessibility / quality notes

- Semantic landmarks, skip link, `aria-expanded` on all toggles, focus-visible rings.
- Respects `prefers-reduced-motion` (disables the scroll-reveal + cursor blink).
- Fully responsive; the nav collapses to a menu under 760px.
- No tracking, no cookies, no external JS — just the font stylesheet.
