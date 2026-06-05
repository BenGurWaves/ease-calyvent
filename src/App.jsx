import { useState, useRef, useEffect } from 'react'
import './App.css'

const CANVAS_SIZE = 300

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
  const [copied, setCopied] = useState(null)
  
  const canvasRef = useRef(null)

  const svgPathD = `M 0,${CANVAS_SIZE} C ${p1x * CANVAS_SIZE},${CANVAS_SIZE - (p1y * CANVAS_SIZE)} ${p2x * CANVAS_SIZE},${CANVAS_SIZE - (p2y * CANVAS_SIZE)} ${CANVAS_SIZE},0`

  const cubicBezierString = `cubic-bezier(${p1x.toFixed(2)}, ${p1y.toFixed(2)}, ${p2x.toFixed(2)}, ${p2y.toFixed(2)})`
  const cssTransition = `transition: all 0.4s ${cubicBezierString};`
  const tailwindTransition = `transition-[all_0.4s_${cubicBezierString.replace(/ /g, '_')}]`

  const handleMouseDown = (e) => {
    if (!canvasRef.current) return
    
    const rect = canvasRef.current.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    
    const p1ScreenX = p1x * CANVAS_SIZE
    const p1ScreenY = CANVAS_SIZE - (p1y * CANVAS_SIZE)
    const p2ScreenX = p2x * CANVAS_SIZE
    const p2ScreenY = CANVAS_SIZE - (p2y * CANVAS_SIZE)
    
    const dist1 = Math.sqrt(Math.pow(mouseX - p1ScreenX, 2) + Math.pow(mouseY - p1ScreenY, 2))
    const dist2 = Math.sqrt(Math.pow(mouseX - p2ScreenX, 2) + Math.pow(mouseY - p2ScreenY, 2))
    
    if (dist1 < 30) {
      setDragging('p1')
    } else if (dist2 < 30) {
      setDragging('p2')
    }
  }

  const handleMouseMove = (e) => {
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
  }

  const handleMouseUp = () => {
    setDragging(null)
  }

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [dragging])

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

  const copyToClipboard = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(key)
      setTimeout(() => setCopied(null), 1500)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="atelier">
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
        {/* Hero */}
        <section className="hero">
          <h1 className="title">Cubic-Bezier Generator</h1>
          <p className="subtitle">Design custom easing functions with precision</p>
        </section>

        {/* Main Workspace */}
        <div className="workspace">
          {/* Canvas Section */}
          <section className="canvas-section">
            <div 
              className="canvas-container" 
              ref={canvasRef}
              onMouseDown={handleMouseDown}
            >
              <svg width={CANVAS_SIZE} height={CANVAS_SIZE} viewBox={`0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`} className="bezier-canvas">
                {/* Background Grid */}
                <defs>
                  <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(26, 59, 102, 0.1)" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                
                {/* Diagonal */}
                <line x1="0" y1={CANVAS_SIZE} x2={CANVAS_SIZE} y2="0" stroke="rgba(26, 59, 102, 0.2)" strokeWidth="1" strokeDasharray="4 4" />
                
                {/* Curve */}
                <path d={svgPathD} fill="none" stroke="var(--fluidity-accent)" strokeWidth="4" strokeLinecap="round" />
                
                {/* Control Lines */}
                <line x1="0" y1={CANVAS_SIZE} x2={p1x * CANVAS_SIZE} y2={CANVAS_SIZE - (p1y * CANVAS_SIZE)} stroke="var(--interface-navy)" strokeWidth="2" strokeDasharray="6 4" opacity="0.4" />
                <line x1={CANVAS_SIZE} y1="0" x2={p2x * CANVAS_SIZE} y2={CANVAS_SIZE - (p2y * CANVAS_SIZE)} stroke="var(--interface-navy)" strokeWidth="2" strokeDasharray="6 4" opacity="0.4" />
                
                {/* Control Points */}
                <circle
                  cx={p1x * CANVAS_SIZE}
                  cy={CANVAS_SIZE - (p1y * CANVAS_SIZE)}
                  r="12"
                  fill="var(--fluidity-accent)"
                  className="control-point"
                  style={{ cursor: dragging === 'p1' ? 'grabbing' : 'grab' }}
                />
                <circle
                  cx={p2x * CANVAS_SIZE}
                  cy={CANVAS_SIZE - (p2y * CANVAS_SIZE)}
                  r="12"
                  fill="var(--fluidity-accent)"
                  className="control-point"
                  style={{ cursor: dragging === 'p2' ? 'grabbing' : 'grab' }}
                />
                
                {/* Anchor Points */}
                <circle cx="0" cy={CANVAS_SIZE} r="6" fill="var(--interface-navy)" />
                <circle cx={CANVAS_SIZE} cy="0" r="6" fill="var(--interface-navy)" />
              </svg>
            </div>

            {/* Coordinates */}
            <div className="coordinates">
              <div className="coord-row">
                <span className="coord-label">P1</span>
                <span className="coord-value">{p1x.toFixed(2)}, {p1y.toFixed(2)}</span>
              </div>
              <div className="coord-row">
                <span className="coord-label">P2</span>
                <span className="coord-value">{p2x.toFixed(2)}, {p2y.toFixed(2)}</span>
              </div>
            </div>

            {/* Presets */}
            <div className="presets">
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
          </section>

          {/* Output Section */}
          <section className="output-section">
            {/* Animation Preview */}
            <div className="preview-section">
              <div className="preview-header">
                <h3>Preview</h3>
                <button className="play-btn" onClick={triggerAnimation}>
                  {animating ? 'Reset' : 'Play'}
                </button>
              </div>
              <div className="preview-track">
                <div
                  className="preview-box"
                  style={{
                    transition: `transform 0.6s ${cubicBezierString}`,
                    transform: animating ? 'translateX(200px)' : 'translateX(0)',
                  }}
                />
              </div>
            </div>

            {/* Code Output */}
            <div className="code-section">
              <h3>Export</h3>
              
              <div className="code-row">
                <span className="code-label">CSS</span>
                <code className="code-value">{cssTransition}</code>
                <button 
                  className="copy-icon"
                  onClick={() => copyToClipboard(cssTransition, 'css')}
                >
                  {copied === 'css' ? '✓' : 'Copy'}
                </button>
              </div>

              <div className="code-row">
                <span className="code-label">Tailwind</span>
                <code className="code-value">{tailwindTransition}</code>
                <button 
                  className="copy-icon"
                  onClick={() => copyToClipboard(tailwindTransition, 'tailwind')}
                >
                  {copied === 'tailwind' ? '✓' : 'Copy'}
                </button>
              </div>

              <div className="code-row">
                <span className="code-label">Function</span>
                <code className="code-value">{cubicBezierString}</code>
                <button 
                  className="copy-icon"
                  onClick={() => copyToClipboard(cubicBezierString, 'function')}
                >
                  {copied === 'function' ? '✓' : 'Copy'}
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="footer">
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
