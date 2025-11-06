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

### Vercel (Recommended)

This project is optimized for [Vercel](https://vercel.com) deployment:

**Option 1: Deploy via Vercel Dashboard**
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "New Project" and import your `Music-by-Code` repository
4. Vercel will auto-detect Astro and configure the build settings
5. Click "Deploy" and your site will be live!

**Option 2: Deploy via CLI**
```bash
# Install Vercel CLI globally
npm i -g vercel

# Deploy from your project directory
vercel

# Follow the prompts to link your project
```

**Auto-Deployments:** Once connected, every push to your main branch will automatically trigger a new deployment on Vercel.

**Live URL:** Your site will be available at `https://music-by-code.vercel.app` (or your custom domain)

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
