import './App.css';

function App() {
  return (
    <div className="app">
      <div className="scene">
        <header className="top-left">
          <div className="logo">IGLOO</div>
          <div className="copyright">&#47;&#47; Copyright © 2024</div>
          <div className="rights">
            Igloo, Inc.
            <br />
            All Rights Reserved.
          </div>
        </header>

        <aside className="top-right">
          <div className="manifesto-label">
            <span className="slashes">//////</span>
            Manifesto
          </div>
          <p>
            Our mission is to
            <br />
            create the largest
            <br />
            onchain community,
            <br />
            driving the
            <br />
            consumer crypto
            <br />
            revolution.
          </p>
        </aside>

        <div className="igloo">
          <svg viewBox="0 0 420 320" role="img" aria-label="Igloo illustration">
            <defs>
              <linearGradient id="iglooGlow" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#f7fbff" />
                <stop offset="100%" stopColor="#b9c2d3" />
              </linearGradient>
              <linearGradient id="iglooStone" x1="0" y1="0" x2="0.8" y2="1">
                <stop offset="0%" stopColor="#d8dde6" />
                <stop offset="100%" stopColor="#8a94a6" />
              </linearGradient>
            </defs>
            <ellipse cx="210" cy="255" rx="170" ry="36" fill="rgba(89,95,110,0.25)" />
            <path
              d="M90 240c0-78 60-142 136-142s136 64 136 142v20H90v-20z"
              fill="url(#iglooStone)"
            />
            <path d="M130 250c0-52 40-94 90-94s90 42 90 94v10H130v-10z" fill="#aeb6c6" />
            <path
              d="M280 246c0-30 24-54 54-54s54 24 54 54v28h-108v-28z"
              fill="#9aa4b7"
            />
            <rect x="304" y="246" width="68" height="54" rx="12" fill="#818a9c" />
            <path
              d="M116 216h188M108 190h204M100 166h220"
              stroke="url(#iglooGlow)"
              strokeWidth="8"
              strokeLinecap="round"
              opacity="0.8"
            />
            <path
              d="M128 240h170M140 220h150M150 200h130"
              stroke="url(#iglooGlow)"
              strokeWidth="6"
              strokeLinecap="round"
              opacity="0.6"
            />
            <path
              d="M252 242h84M260 222h70"
              stroke="url(#iglooGlow)"
              strokeWidth="6"
              strokeLinecap="round"
              opacity="0.7"
            />
          </svg>
        </div>

        <div className="sound">
          <span className="sound-icon" aria-hidden="true">
            🔊
          </span>
          Sound: On
        </div>
      </div>
    </div>
  );
}

export default App;
