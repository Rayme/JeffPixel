# Codecs used by VeryPixel

This directory contains only the codec and image-processing modules required by
the current VeryPixel production build:

- `mozjpeg` — MozJPEG encoding;
- `oxipng` — OxiPNG encoding;
- `webp` — WebP encoding, including the SIMD build;
- `resize` — proportional image resizing;
- `rotate` — EXIF-orientation correction.

Each bundled module retains its upstream license and build files. Unused
Squoosh codecs are intentionally excluded to keep the repository, production
bundle, and license surface focused on the features VeryPixel actually ships.
