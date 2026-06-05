# Ease — Cubic-Bezier Transition Generator

A local-first, interactive cubic-bezier transition generator and micro-animation visualizer for UI designers and frontend developers.

## Features

- **Interactive Vector Stage**: Drag control points to create custom cubic-bezier easing functions
- **Real-time Visualization**: See your easing curve update instantly as you adjust coordinates
- **Motion Sandbox**: Preview animations with your custom easing alongside linear comparison
- **Code Export**: Copy CSS and Tailwind configurations directly to your clipboard
- **Quick Presets**: Choose from standard easing functions (Linear, Ease In, Ease Out, Ease In Out, Ease Out Quart)
- **100% Client-Side**: All calculations happen in your browser—no server uploads, complete privacy

## Tech Stack

- **Framework**: Vite + React 19
- **Styling**: Tailwind CSS 4
- **Deployment**: Cloudflare Pages
- **Processing**: Native JavaScript (FileReader API not needed—pure math)

## Color Palette

- **Tan Neutral Background** (#DDC9A3): Primary application canvas
- **Interface Navy** (#1A3B66): Logo, labels, buttons, text
- **Interactive White** (#FFFFFF): Vector stage and container panels
- **Fluidity Accent** (#00C8FF): Control points and Bezier curve marker

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Deployment

1. Build the project: `npm run build`
2. Deploy the `dist` folder to Cloudflare Pages
3. Configure custom domain: `ease.calyvent.com`
4. Add security headers via `_headers` file

## Security

- Content Security Policy (CSP) configured
- HTTP Strict Transport Security (HSTS) enabled
- No server-side processing—all math is client-side
- No data collection or tracking

## License

Proprietary — Velocity Digital Architecture House

## Credits

Compiled & crafted by [Velocity Digital Architecture House](https://velocity.calyvent.com)
