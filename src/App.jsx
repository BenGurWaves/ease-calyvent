import { useState, useRef, useCallback } from 'react'
import './App.css'

const CANVAS_SIZE = 200

const PRESETS = [
  { name: 'Linear', p1x: 0, p1y: 0, p2x: 1, p2y: 1 },
  { name: 'Ease In', p1x: 0.42, p1y: 0, p2x: 1, p2y: 1 },
  { name: 'Ease Out', p1x: 0, p1y: 0, p2x: 0.58, p2y: 1 },
  { name: 'Ease In Out', p1x: 0.42, p1y: 0, p2x: 0.58, p2y: 1 },
  { name: 'Ease Out Quart', p1x: 0.16, p1y: 1, p2x: 0.3, p2y: 1 },
]

function App() {
  const [p1x, setP1x] = useState(0.25)
  const [p1y, setP1y] = useState(1.0)
  const [p2x, setP2x] = useState(0.5)
  const [p2y, setP2y] = useState(1.0)
  const [dragging, setDragging] = useState(null)
  const [animating, setAnimating] = useState(false)
  
  const canvasRef = useRef(null)

  const svgPathD = `M 0,${CANVAS_SIZE} C ${p1x * CANVAS_SIZE},${CANVAS_SIZE - (p1y * CANVAS_SIZE)} ${p2x * CANVAS_SIZE},${CANVAS_SIZE - (p2y * CANVAS_SIZE)} ${CANVAS_SIZE},0`

  const cubicBezierString = `cubic-bezier(${p1x.toFixed(2)}, ${p1y.toFixed(2)}, ${p2x.toFixed(2)}, ${p2y.toFixed(2)})`
  const cssTransition = `transition: all 0.4s ${cubicBezierString};`
  const tailwindTransition = `transition-[all_0.4s_${cubicBezierString.replace(/ /g, '_')}]`

  const handleMouseDown = (point, e) => {
    e.preventDefault()
    setDragging(point)
  }

  const handleMouseMove = useCallback((e) => {
    if (!dragging || !canvasRef.current) return
    
    const rect = canvasRef.current.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    
    const rawX = mouseX / CANVAS_SIZE
    const rawY = (CANVAS_SIZE - mouseY) / CANVAS_SIZE
    
    const clampedX = Math.max(0, Math.min(1, rawX))
    
    if (dragging === 'p1') {
      setP1x(clampedX)
      setP1y(rawY)
    } else if (dragging === 'p2') {
      setP2x(clampedX)
      setP2y(rawY)
    }
  }, [dragging])

  const handleMouseUp = () => {
    setDragging(null)
  }

  const handlePreset = (preset) => {
    setP1x(preset.p1x)
    setP1y(preset.p1y)
    setP2x(preset.p2x)
    setP2y(preset.p2y)
  }

  const triggerAnimation = () => {
    setAnimating(true)
    setTimeout(() => setAnimating(false), 800)
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      alert('Copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="atelier" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      {/* Top Bar */}
      <header className="bar">
        <a className="logo" href="/" aria-label="Ease home">
          <span className="logo__word">Ease</span>
        </a>
        <nav className="bar__nav">
          <a href="https://velocity.calyvent.com" target="_blank" rel="noopener">Velocity</a>
        </nav>
      </header>

      <div className="frame">
        {/* Masthead */}
        <section className="hero">
          <p className="kicker">Cubic-Bezier Transition Generator · Free · 100% in-browser</p>
          <h1 className="title">Craft motion<br /><em>with precision.</em></h1>
          <p className="lede">
            Design custom easing functions by dragging control points. Visualize motion paths in real-time and export CSS or Tailwind configurations for your project.
          </p>
        </section>

        {/* Workspace */}
        <div className="desk">
          {/* Left: Vector Canvas */}
          <section className="canvas-zone">
            <p className="label">Vector Stage</p>
            <div className="canvas-wrapper" ref={canvasRef}>
              <svg width={CANVAS_SIZE} height={CANVAS_SIZE} viewBox={`0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`} className="bezier-canvas">
                {/* Grid */}
                <line x1="0" y1={CANVAS_SIZE / 2} x2={CANVAS_SIZE} y2={CANVAS_SIZE / 2} stroke="#E5E7EB" strokeWidth="0.5" />
                <line x1={CANVAS_SIZE / 2} y1="0" x2={CANVAS_SIZE / 2} y2={CANVAS_SIZE} stroke="#E5E7EB" strokeWidth="0.5" />
                
                {/* Curve */}
                <path d={svgPathD} fill="none" stroke="var(--fluidity-accent)" strokeWidth="3" strokeLinecap="round" />
                
                {/* Control Lines */}
                <line x1="0" y1={CANVAS_SIZE} x2={p1x * CANVAS_SIZE} y2={CANVAS_SIZE - (p1y * CANVAS_SIZE)} stroke="#9CA3AF" strokeWidth="1" strokeDasharray="4 2" />
                <line x1={CANVAS_SIZE} y1="0" x2={p2x * CANVAS_SIZE} y2={CANVAS_SIZE - (p2y * CANVAS_SIZE)} stroke="#9CA3AF" strokeWidth="1" strokeDasharray="4 2" />
                
                {/* Control Points */}
                <circle
                  cx={p1x * CANVAS_SIZE}
                  cy={CANVAS_SIZE - (p1y * CANVAS_SIZE)}
                  r="8"
                  fill="var(--fluidity-accent)"
                  className="control-point"
                  onMouseDown={(e) => handleMouseDown('p1', e)}
                  style={{ cursor: dragging === 'p1' ? 'grabbing' : 'grab' }}
                />
                <circle
                  cx={p2x * CANVAS_SIZE}
                  cy={CANVAS_SIZE - (p2y * CANVAS_SIZE)}
                  r="8"
                  fill="var(--fluidity-accent)"
                  className="control-point"
                  onMouseDown={(e) => handleMouseDown('p2', e)}
                  style={{ cursor: dragging === 'p2' ? 'grabbing' : 'grab' }}
                />
                
                {/* Anchor Points */}
                <circle cx="0" cy={CANVAS_SIZE} r="4" fill="var(--interface-navy)" />
                <circle cx={CANVAS_SIZE} cy="0" r="4" fill="var(--interface-navy)" />
              </svg>
            </div>
            
            {/* Coordinates Display */}
            <div className="coords">
              <div className="coord-item">
                <span className="coord-label">P1</span>
                <span className="coord-value">({p1x.toFixed(2)}, {p1y.toFixed(2)})</span>
              </div>
              <div className="coord-item">
                <span className="coord-label">P2</span>
                <span className="coord-value">({p2x.toFixed(2)}, {p2y.toFixed(2)})</span>
              </div>
            </div>

            {/* Presets */}
            <div className="presets">
              <p className="presets__label">Quick Presets</p>
              <div className="presets__grid">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    className="preset-btn"
                    onClick={() => handlePreset(preset)}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Right: Output & Preview */}
          <section className="output-zone">
            {/* Motion Sandbox */}
            <div className="sandbox">
              <p className="label">Motion Sandbox</p>
              <button className="sandbox-trigger" onClick={triggerAnimation}>
                Play Animation
              </button>
              <div className="sandbox-blocks">
                <div className="sandbox-block">
                  <p className="sandbox-label">Custom</p>
                  <div
                    className="sandbox-box"
                    style={{
                      transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
                      transform: animating ? 'translateX(120px)' : 'translateX(0)',
                    }}
                  />
                </div>
                <div className="sandbox-block">
                  <p className="sandbox-label">Linear</p>
                  <div
                    className="sandbox-box"
                    style={{
                      transition: 'all 0.4s linear',
                      transform: animating ? 'translateX(120px)' : 'translateX(0)',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Code Output */}
            <div className="code-zone">
              <p className="label">Code Output</p>
              
              <div className="code-block">
                <p className="code-label">CSS</p>
                <pre className="code">{cssTransition}</pre>
                <button className="copy-btn" onClick={() => copyToClipboard(cssTransition)}>
                  Copy
                </button>
              </div>

              <div className="code-block">
                <p className="code-label">Tailwind</p>
                <pre className="code">{tailwindTransition}</pre>
                <button className="copy-btn" onClick={() => copyToClipboard(tailwindTransition)}>
                  Copy
                </button>
              </div>

              <div className="code-block">
                <p className="code-label">Raw Function</p>
                <pre className="code">{cubicBezierString}</pre>
                <button className="copy-btn" onClick={() => copyToClipboard(cubicBezierString)}>
                  Copy
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Field Notes */}
        <section className="notes">
          <h2 className="notes__title">Field Notes</h2>
          <div className="notes__grid">
            <div className="note"><h3>Is Ease free?</h3><p>Completely. No signup, no limits, no premium tier.</p></div>
            <div className="note"><h3>Are calculations uploaded?</h3><p>Never. All bezier math runs locally in your browser. Nothing leaves your device.</p></div>
            <div className="note"><h3>What can I export?</h3><p>Standard CSS cubic-bezier() functions and Tailwind CSS arbitrary transition properties.</p></div>
            <div className="note"><h3>Why custom easing?</h3><p>Custom cubic-bezier functions create unique, polished motion that sets your UI apart from generic linear transitions.</p></div>
          </div>
        </section>

        {/* Velocity Signature */}
        <a className="signature" href="https://velocity.calyvent.com" target="_blank" rel="noopener">
          <span className="signature__l">
            <span className="signature__kicker">Compiled &amp; crafted by</span>
            <span className="signature__name">Velocity</span>
            <span className="signature__sub">Digital Architecture House</span>
          </span>
          <span className="signature__cta">Visit the studio <span className="signature__arrow">→</span></span>
        </a>

        <footer className="colophon">
          <span>Ease — A Calyvent instrument</span>
          <span>
            <a href="https://velocity.calyvent.com" target="_blank" rel="noopener">Velocity</a>
            {' · '}<a href="/privacy.html">Privacy</a>
            {' · '}<a href="/terms.html">Terms</a>
          </span>
        </footer>
      </div>
    </div>
  )
}

export default App
