# Klook & Viator Image Usage Policy Research

**Date:** 2026-04-28
**Prepared for:** japan-pop-now.com image source policy review
**Question:** May the site republish or transcode public-page images from Klook product pages and Viator product pages on its own articles?

---

## 1. Klook

### Sources reviewed

- [Klook General Terms of Use](https://www.klook.com/conditions/)
- [Klook Affiliate Program homepage](https://affiliate.klook.com/home)
- [Klook Merchant Portal Terms of Use (PDF)](https://res.klook.com/image/upload/v1627442472/merchant/contract/Merchant_Portal_Terms_of_Use_v.1.2_JJC_26_Jun_2021.pdf)
- [Klook Affiliate Program guide — Ecomobi](https://ecomobi.com/klook-affiliate-program-review/) (third-party affiliate-network restatement)
- [Klook Affiliate Program guide — Affiliates.One](https://blog.affiliates.one/en-US/blog/post/klook-affiliate-program-en) (third-party)

### Verbatim quotes

From the **Klook General Terms of Use** ([klook.com/conditions/](https://www.klook.com/conditions/)) — the IP section, recovered via search-engine indexing of the JS-rendered SPA:

> "All materials displayed or performed on the Klook Platform including but not limited to text, data, graphics, articles, photographs, images, illustrations, video, audio and other materials … are protected by copyright and/or other intellectual property rights."

> "[Users] shall not modify, publish, transmit, participate in the transfer or sale of, reproduce, create derivative works based on, distribute, perform, display, or in any way exploit, any part of the Klook Platform and the Content, software, materials, or the Services in whole or in part."

> "[Users] shall only download or copy the Content for personal and non-commercial use only, provided that they maintain all copyright and other notices contained in such Content, and shall not store any significant portion of any Content in any form."

From the **Klook Affiliate Program** material (as restated by [Ecomobi's Klook program guide](https://ecomobi.com/klook-affiliate-program-review/) and [Involve Asia's Klook directory entry](https://app.involve.asia/directory/klook-affiliate-program), which mirror the dashboard-issued partner terms):

> "You can use creative material uploaded in the [affiliate network] dashboard for this offer, or any self-produced material approved in advance by The Advertiser. Any self-produced material not approved by The Advertiser is prohibited."

> "You may not use Klook's name, logo, or brand assets in offline materials, SMS campaigns, or email marketing campaigns (beyond plain-text link placement)."

### Verdict for Klook: **PUBLIC_PAGE_TRANSCODE_BANNED** (with PARTNER_ASSET_OK carveout)

### Reasoning

The general ToS expressly forbids reproduction, derivative works, distribution, and display of any photographs/images from the Klook Platform, and limits permitted downloads to "personal and non-commercial use" only. A commercial affiliate site like japan-pop-now.com fails the personal/non-commercial test. Separately, the affiliate program contractually restricts creatives to either (a) materials provided in the affiliate-network dashboard or (b) self-produced material with prior advertiser approval. Public product-page images fall in neither category, so transcoding them is a double violation: copyright/ToS *and* the affiliate agreement. Klook does, however, supply banners/widgets/approved images via the dashboard, which are pre-licensed for affiliate display.

---

## 2. Viator (Tripadvisor-owned)

### Sources reviewed

- [Viator Partner Resource Center — Terms and Conditions](https://partnerresources.viator.com/terms-and-conditions/)
- [Viator Partner Program Terms PDF](https://partners.vtrcdn.com/static/docs/Viator-Partner-Program-Terms-en_EN.pdf)
- [Viator Partner Resource Center — Affiliate Links 101](https://partnerresources.viator.com/blog/affiliatelinks101/)
- [Viator Partner Resource Center — Travel Content Solutions](https://partnerresources.viator.com/travel-content/)
- [Awin merchant profile — Viator US](https://ui.awin.com/merchant-profile-terms/11018)

### Verbatim quotes

From **Viator's Affiliate Links 101 guidance** ([partnerresources.viator.com/blog/affiliatelinks101/](https://partnerresources.viator.com/blog/affiliatelinks101/)) — the most explicit, direct statement from Viator:

> "Unfortunately, you can't download and reuse pictures of experiences from Viator.com, but you can find and use related images on some of our favorite photo sites, such as Unsplash, Pexels, and Pixabay."

From **Viator's Awin program terms** ([ui.awin.com/merchant-profile-terms/11018](https://ui.awin.com/merchant-profile-terms/11018)):

> "Affiliates may not alter any of the creative made available through the AWIN.com interface."

> "Affiliates are also requested not to hardcode banners into their sites, so updates made to those available through AWIN.com may take immediate effect."

> "If you are creating product links, please be sure to take these from the product feed. Links taken from other sources may result in commissions being declined… You CANNOT take content directly from Viator, which is not present on the product feed."

From **Viator's Content Policy** (mirrored in the Partner Program Terms, Section 7):

> "Contributor shall not modify any third party images or other media in any way that would change its nature or context, unless Contributor is certain that it has the right from the copyright owner to create a derivative work."

> "Credit or attribution to the source of the image (e.g., Getty Images) is always necessary for a full size photograph. Credit should be used for thumbnail images where space allows."

### Verdict for Viator: **PUBLIC_PAGE_TRANSCODE_BANNED** (with explicit "use Unsplash/Pexels/Pixabay instead" guidance)

### Reasoning

This is the cleanest verdict in the entire research. Viator's own partner education page tells affiliates in plain English that they cannot download and reuse Viator.com pictures. The Awin program terms add two reinforcing rules: only product-feed content may be used, and creatives may not be modified. There is no "transcode it and add attribution" workaround — Viator has no public press kit/image library that licenses product imagery for affiliate republishing; Viator's images come from suppliers (operators), each with their own rights stack, which is exactly why Viator routes affiliates to royalty-free stock instead.

---

## 3. Comparison baseline: Google Image search results

Google Image results are simply other people's copyrighted content surfaced through a search index. There is no license. Republishing them on a commercial site is plain copyright infringement absent a separate license from each rights-holder. Klook and Viator product-page images are **functionally identical** to Google Image results in legal posture — they are third-party content displayed by an aggregator under that aggregator's own license, not under any license that flows through to the aggregator's website visitors. Being a registered affiliate does not upgrade your license; it adds *contractual* restrictions on top of the existing copyright restrictions. So the answer for Klook/Viator public-page images is the same as for Google Images: **do not republish**.

The one meaningful difference: both Klook and Viator offer a **partner-supplied creative library** (Klook's affiliate dashboard banners/widgets, Viator's Awin creative library and product-feed images). Those assets *are* pre-licensed for affiliate display — that is what makes them different from Google Images. But that license attaches only to assets pulled from those specific dashboards, not to anything reachable from the public product page.

---

## 4. Recommendation for japan-pop-now.com

### Should Klook be added to the image source priority list?

**N — with a Conditional carveout.**

- **N for public product-page images.** Transcoding `klook.com/activity/...` page images violates Klook's general ToS (commercial reproduction forbidden) and the affiliate agreement (only dashboard or pre-approved creatives allowed).
- **Conditional Y for partner-dashboard creatives only.** Banners, widgets, and any image explicitly distributed through the Klook affiliate dashboard at [affiliate.klook.com](https://affiliate.klook.com/home) (or via the affiliate network, e.g. Involve Asia / Ecomobi) are pre-licensed for affiliate display. These should be treated as a separate source category — *Klook partner banner/widget* — not as an article hero-image source. They are acceptable when used in affiliate-link cards/CTA blocks, not as substitutes for editorial photography.

### Should Viator be added?

**N — full stop, no carveout for public-page images.**

- Viator's own partner education page ("Affiliate Links 101") explicitly says affiliates cannot download and reuse pictures from Viator.com.
- The Awin program terms additionally forbid taking content from Viator outside the product feed and forbid altering creatives.
- The only Viator-blessed alternative is the embedded widget (which renders Viator's image inside an iframe/JS widget Viator controls — that is *display* via Viator's own infrastructure, not transcoding). For editorial article hero images, Viator points affiliates to Unsplash / Pexels / Pixabay instead.

### Required attribution string (when using legitimately-sourced partner assets)

For the conditional Klook dashboard-asset carveout:

- Display near or below the image: **"Image: Klook"** (or "© Klook" / "Provided by Klook").
- Affiliate disclosure must remain present per the existing `affiliate.md` rule.
- Original copyright/attribution metadata supplied with the asset must be preserved (Klook's ToS: "maintain all copyright and other notices").

For Viator: there is no attribution string that legitimizes scraping a public product page. If a Viator image is desired in an article, use the **Viator widget embed** (which Viator authorizes) or substitute a royalty-free stock photo of the same activity from Unsplash/Pexels/Pixabay (which Viator itself recommends).

### Forbidden transformations (for the legitimate Klook-dashboard carveout only)

- No cropping that removes embedded Klook watermarks/logos.
- No filters/recolors that misrepresent the activity (Viator's "would change its nature or context" standard is the right benchmark to adopt project-wide).
- No combining with non-Klook imagery in a way that suggests Klook endorsement of the composite.
- No use in offline media, SMS, or email campaigns (Klook program rule).
- No re-hosting or hotlinking *outside* the affiliate context (e.g. don't push Klook banners into a non-affiliate gallery page).

### Alternative when an editorial image is needed

Stick with the existing source priority — **Wikimedia Commons → 公式 X → 公式 web press kit → Google Maps owner photos** — none of which are affected by this research. For activity/tour categories where those four come up empty, the project should add a fifth tier: **operator-direct outreach** (email the activity operator's PR/marketing contact and request a press-use license) rather than scraping Klook/Viator. This is the path Viator itself implies when it routes affiliates to stock libraries.

### Net effect on existing config

- `.claude/rules/affiliate.md`: no change to source priority list. Klook and Viator stay **off** the article-image source list.
- Add a new short rule: *"Klook/Viator public product-page images are NEVER an article image source. Klook affiliate-dashboard banners/widgets MAY be used inside affiliate CTA blocks only, with 'Image: Klook' attribution. Viator imagery is permitted only via Viator's official widget embed."*
- Existing image-strict 4-axis universal rule (count/resolution/topic/real-photo) continues to apply to whatever the article image *is*, sourced from the existing four-tier priority.

---

**Bottom line:** Both Klook and Viator forbid republishing/transcoding their public product-page images, and Viator says so in plain English on its own partner blog. Affiliate registration does not unlock these images — it adds restrictions on top. Keep both off the image source priority list; the only legitimate use is via partner-dashboard assets (Klook) or official widget embeds (Viator) within affiliate-link contexts, never as substitutes for editorial photography.
