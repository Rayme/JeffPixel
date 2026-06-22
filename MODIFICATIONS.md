# Modifications from Squoosh

VeryPixel is derived from GoogleChromeLabs/Squoosh under Apache License 2.0.
VeryPixel original code and copyrightable modifications are licensed under
AGPL-3.0-only; see the repository root LICENSE for the precise scope.
The project was materially modified in 2026, including:

- replacement of Squoosh branding, landing content, icons, metadata, and UI;
- addition of multi-file queues and shared batch compression settings;
- proportional bounding-box resize without cropping, stretching, or upscaling;
- output filename suffix `_VeryPixel`;
- browser-local ZIP packaging for multi-image downloads;
- restriction of output formats to MozJPEG, WebP, Browser JPEG, and Browser PNG;
- removal of the original analytics integration, demos, Browser GIF, unused encoders/decoders, GPL imagequant, and HQX from the source repository and production build;
- addition of self-hosted Umami for basic page-visit analytics; uploaded images remain browser-local;
- addition of privacy, terms, open-source, and deployment-compliance materials;
- build compatibility fixes for workspace paths and current local tooling.

VeryPixel is an independent project. Google and Squoosh maintainers do not
sponsor, endorse, or provide warranties for these modifications.
