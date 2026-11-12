# Nearly social preview

`nearly-social-en-v7.png` is the composed artwork for the public sharing card.
Run `npm run social:preview` to export it at 1200 × 630. The build also exports it.

Created with the built-in image generation tool using the previous social card,
the current English home screen (`public/media/store/home-screen-en.webp`) and
the app icon (`public/media/nearly-app-icon-liquid-glass-v2.png`) as references.

Art direction: preserve the original three-quarter phone perspective and visible
metallic side, warm ivory textured paper, frosted-glass coral and violet discs
with saturated colored light and stronger opacity,
translucent glass sculpture, and large dark-plum editorial serif type. Use the
current light English interface on the phone and the app icon at upper left.
Headline: “Close, even far apart.” Footer: “hellonearly.com”. No badges or pills.

Version 5 uses the built-in image generation tool to lower the bottom navigation,
contain the header bubbles and their text, and give the two discs a frosted-glass
finish. The clear glass loop behind the phone is preserved. Exact prompts:
`edit-prompt-v5.txt`.

Version 6 increases the opacity and saturation of the two frosted discs using
the built-in image generation tool, preserving the clear glass loop and the
corrected phone interface. Exact prompt: `edit-prompt-v6.txt`.

Version 7 composites the original English screenshot and the original app icon
and wordmark over the version 6 scenery. Portraits and branding are no longer
generated. `scripts/compose-social-preview.mjs` applies a perspective projection
to the actual screenshot and removes the wordmark's background matte. The small
`brand-paper.png` patch is an inpainted clean area used below the real logo;
everything else in the approved scenery is retained from version 6.

Every export recomposes these original assets, so updated screenshots are used
automatically without regenerating faces or branding. Run `npm run social:preview`.
