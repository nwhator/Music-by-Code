# 🎵 Music by Code

## Made by Promise

A beautiful, interactive Astro website that showcases music created entirely with code using Tone.js.

## ✨ Features

- 🎨 **Modern UI**: Beautiful dark mode with glassmorphism and gradient effects
- 🎵 **Interactive Library**: Play coded songs with real-time waveform visualizations
- 🎹 **Live Studio**: Experiment with Tone.js code in the browser
- 📱 **Responsive Design**: Perfect on desktop, tablet, and mobile
- 🚀 **Fast & Modern**: Built with Astro and Tailwind CSS

## 🛠️ Tech Stack

- **[Astro](https://astro.build/)** - Static Site Generator
- **[Tailwind CSS](https://tailwindcss.com/)** - Styling
- **[Tone.js](https://tonejs.github.io/)** - Web Audio Framework
- **TypeScript** - Type Safety

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎼 Project Structure

```md
music-by-code/
├── src/
│   ├── pages/
│   │   ├── index.astro       # Home page
│   │   ├── library.astro     # Song library
│   │   └── studio.astro      # Live code editor
│   ├── layouts/
│   │   └── BaseLayout.astro  # Base layout
│   ├── components/
│   │   └── Footer.astro      # Footer component
│   └── songs/
│       ├── lofi-beats.js     # Example song
│       ├── ambient-dream.js  # Example song
│       └── digital-pulse.js  # Example song
├── public/                   # Static assets
├── astro.config.mjs         # Astro configuration
├── tailwind.config.mjs      # Tailwind configuration
└── package.json
```

## 🎵 Creating New Songs

Add new songs to `src/songs/` as JavaScript modules:

```javascript
import * as Tone from "tone";

export const metadata = {
  title: "Your Song Title",
  description: "Song description"
};

export const playSong = async () => {
  await Tone.start();
  
  const synth = new Tone.Synth().toDestination();
  synth.triggerAttackRelease("C4", "8n");
  
  return () => {
    // Cleanup function
    Tone.Transport.stop();
  };
};
```

Then add the song to the library page in `src/pages/library.astro`.

## 🚀 Deployment

### GitHub Pages

1. Update `astro.config.mjs` with your repository name:

```javascript
export default defineConfig({
  site: 'https://nwhator.github.io',
  base: '/Music-by-Code',
});
```

2. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install dependencies
        run: npm install
      - name: Build
        run: npm run build
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

3. Enable GitHub Pages in repository settings (Settings → Pages → Source: GitHub Actions)

### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Deploy: `vercel`
3. Follow the prompts

Or connect your GitHub repository to [Vercel](https://vercel.com) for automatic deployments.

## 📝 License

© 2025 Promise. All rights reserved.

## 🔗 Links

- [GitHub](https://github.com/promise)
- [LinkedIn](https://linkedin.com/in/promise)

## 🎉 Acknowledgments

- Built with ❤️ using [Astro](https://astro.build/)
- Audio powered by [Tone.js](https://tonejs.github.io/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

---

**Made by Promise** | Exploring the harmony between code and sound.
