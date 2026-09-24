import { useState } from 'react';

const MUSIC_ID = 'aKFfLCHChkQ';

// Animated, anime-style scene: a designer at a desk, working through a day and into the night.
// Pure SVG + CSS (see .scene in styles.css). No people are depicted from life: the character is stylised and seen from behind.

const CODE_LINES = [
  [0, 90, '#e0b673'], [14, 150, '#7c93ad'], [14, 120, '#eceef1'], [28, 170, '#8fa876'], [28, 100, '#eceef1'],
  [28, 140, '#e0b673'], [42, 110, '#7c93ad'], [42, 160, '#eceef1'], [28, 70, '#6fa39d'], [14, 60, '#eceef1'],
];

const CAPTIONS = ['Writing C# add-ins', 'Coordinating the model', 'Reviewing dashboards', 'Team coordination call'];

function Floor({ y, w = 74, h = 16, fill }) {
  // isometric slab centred on x = 540
  const x = 540;
  return (
    <g>
      <polygon points={`${x},${y} ${x + w},${y + h / 2} ${x},${y + h} ${x - w},${y + h / 2}`} fill={fill} stroke="#9fb4c9" strokeWidth="1" />
      <polygon points={`${x - w},${y + h / 2} ${x},${y + h} ${x},${y + h + 12} ${x - w},${y + h / 2 + 12}`} fill="#1d2b3d" stroke="#9fb4c9" strokeWidth="1" />
      <polygon points={`${x + w},${y + h / 2} ${x},${y + h} ${x},${y + h + 12} ${x + w},${y + h / 2 + 12}`} fill="#243650" stroke="#9fb4c9" strokeWidth="1" />
    </g>
  );
}

export default function WorkScene() {
  const [music, setMusic] = useState(false);
  return (
    <div className="scene-wrap">
    <div className="scene" role="img" aria-label="Animated illustration of a BIM designer working at a desk from day into night: writing code, coordinating a 3D model, reviewing dashboards and joining a team call.">
      <svg viewBox="0 0 960 540" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="ws-wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2b3a55" />
            <stop offset="1" stopColor="#1c2638" />
          </linearGradient>
          <linearGradient id="ws-day" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#6fb6ee" />
            <stop offset="1" stopColor="#cfe9fb" />
          </linearGradient>
          <linearGradient id="ws-night" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0a1030" />
            <stop offset="1" stopColor="#25315f" />
          </linearGradient>
          <linearGradient id="ws-dusk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#5b3f7a" />
            <stop offset="1" stopColor="#f2a65a" />
          </linearGradient>
          <radialGradient id="ws-glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#ffd98a" stopOpacity="0.85" />
            <stop offset="1" stopColor="#ffd98a" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="ws-screen" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#7cc7ff" stopOpacity="0.35" />
            <stop offset="1" stopColor="#7cc7ff" stopOpacity="0" />
          </radialGradient>
          <clipPath id="ws-win">
            <rect x="650" y="60" width="250" height="230" rx="6" />
          </clipPath>
          <clipPath id="ws-scr">
            <rect x="392" y="227" width="296" height="136" rx="3" />
          </clipPath>
        </defs>

        {/* wall */}
        <rect width="960" height="540" fill="url(#ws-wall)" />
        <g opacity="0.5" stroke="#3a4a68" strokeWidth="1">
          {Array.from({ length: 12 }, (_, i) => (
            <line key={i} x1={i * 88} y1="0" x2={i * 88} y2="400" />
          ))}
        </g>

        {/* window with sky, sun, moon, stars, skyline */}
        <g>
          <rect x="644" y="54" width="262" height="242" rx="10" fill="#0e1524" />
          <g clipPath="url(#ws-win)">
            <rect x="650" y="60" width="250" height="230" fill="url(#ws-day)" />
            <rect className="ws-sky ws-sky--dusk" x="650" y="60" width="250" height="230" fill="url(#ws-dusk)" />
            <rect className="ws-sky ws-sky--night" x="650" y="60" width="250" height="230" fill="url(#ws-night)" />
            <g className="ws-stars" fill="#fff">
              {[[680, 90], [720, 120], [760, 80], [800, 110], [840, 90], [870, 130], [700, 160], [820, 160], [740, 190], [860, 190]].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 2 : 1.4} style={{ animationDelay: `${i * 0.35}s` }} />
              ))}
            </g>
            <g className="ws-orbit">
              <circle cx="775" cy="150" r="20" fill="#ffd45a" />
              <circle cx="775" cy="150" r="30" fill="url(#ws-glow)" />
              <circle cx="775" cy="450" r="17" fill="#e8ecf6" />
              <circle cx="783" cy="444" r="15" fill="#25315f" />
            </g>
            {/* skyline */}
            <g fill="#141c30">
              <rect x="650" y="215" width="34" height="80" />
              <rect x="690" y="190" width="26" height="105" />
              <rect x="722" y="225" width="40" height="70" />
              <rect x="768" y="170" width="30" height="125" />
              <rect x="804" y="205" width="36" height="90" />
              <rect x="846" y="230" width="54" height="65" />
            </g>
            <g className="ws-lights" fill="#ffd98a">
              {[[698, 200], [698, 220], [780, 185], [780, 210], [780, 235], [815, 215], [815, 240], [700, 250], [735, 240], [860, 245]].map(([x, y], i) => (
                <rect key={i} x={x} y={y} width="5" height="6" style={{ animationDelay: `${i * 0.5}s` }} />
              ))}
            </g>
          </g>
          <rect x="650" y="60" width="250" height="230" rx="6" fill="none" stroke="#4a5a7a" strokeWidth="6" />
          <line x1="775" y1="60" x2="775" y2="290" stroke="#4a5a7a" strokeWidth="4" />
          <line x1="650" y1="175" x2="900" y2="175" stroke="#4a5a7a" strokeWidth="4" />
        </g>

        {/* shelf + clock */}
        <rect x="70" y="150" width="250" height="8" rx="3" fill="#5a4030" />
        {[['#c99a4e', 84, 30], ['#1f5fa8', 106, 42], ['#8fa876', 124, 36], ['#b8594a', 146, 44], ['#7c93ad', 166, 34]].map(([c, x, h], i) => (
          <rect key={i} x={x} y={150 - h} width="16" height={h} rx="2" fill={c} />
        ))}
        <rect x="200" y="112" width="44" height="38" rx="3" fill="#243650" stroke="#c99a4e" />
        <path d="M208 140 L218 126 L226 134 L234 120" stroke="#8fd6cc" strokeWidth="2.5" fill="none" />
        <circle cx="400" cy="112" r="30" fill="#eceef1" stroke="#c99a4e" strokeWidth="4" />
        {Array.from({ length: 12 }, (_, i) => {
          const r = (i * Math.PI) / 6;
          return <line key={i} x1={400 + Math.sin(r) * 24} y1={112 - Math.cos(r) * 24} x2={400 + Math.sin(r) * 27} y2={112 - Math.cos(r) * 27} stroke="#55697d" strokeWidth="2" />;
        })}
        <line className="ws-hand ws-hand--h" x1="400" y1="112" x2="400" y2="98" stroke="#15171c" strokeWidth="4" strokeLinecap="round" />
        <line className="ws-hand ws-hand--m" x1="400" y1="112" x2="400" y2="90" stroke="#15171c" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="400" cy="112" r="3" fill="#c99a4e" />

        {/* desk */}
        <rect x="0" y="398" width="960" height="26" fill="#5a4030" />
        <rect x="0" y="424" width="960" height="116" fill="#3a2a20" />
        <rect x="0" y="398" width="960" height="3" fill="#7a5a42" />

        {/* lamp */}
        <g>
          <ellipse cx="118" cy="396" rx="34" ry="6" fill="#1a1a22" />
          <line x1="118" y1="392" x2="150" y2="322" stroke="#c99a4e" strokeWidth="5" strokeLinecap="round" />
          <line x1="150" y1="322" x2="122" y2="286" stroke="#c99a4e" strokeWidth="5" strokeLinecap="round" />
          <path d="M100 280 L146 272 L140 292 L108 300 Z" fill="#e0b673" />
        </g>
        {/* plant */}
        <g>
          <rect x="40" y="368" width="34" height="30" rx="5" fill="#b8594a" />
          <path className="ws-leaf" d="M57 368 C40 340 36 330 44 318 C54 332 58 350 57 368Z" fill="#6fa39d" />
          <path className="ws-leaf ws-leaf--b" d="M57 368 C70 338 78 330 74 312 C62 328 56 346 57 368Z" fill="#8fa876" />
        </g>

        {/* keyboard and mouse */}
        <rect x="336" y="398" width="200" height="12" rx="4" fill="#12141a" />
        <g fill="#2a2d36">
          {Array.from({ length: 14 }, (_, i) => (
            <rect key={i} x={344 + i * 13.5} y="400" width="10" height="3" rx="1" />
          ))}
        </g>
        <ellipse cx="572" cy="404" rx="12" ry="5" fill="#12141a" />

        {/* chair + character (seen from behind) */}
        <g>
          <rect x="222" y="470" width="56" height="10" rx="4" fill="#1a1a22" />
          <line x1="250" y1="478" x2="250" y2="512" stroke="#2a2a35" strokeWidth="8" />
          <path d="M210 520 L290 520" stroke="#2a2a35" strokeWidth="8" strokeLinecap="round" />
          <rect x="196" y="322" width="108" height="150" rx="34" fill="#22232c" />
          <g className="ws-body">
            {/* torso (hoodie) */}
            <path d="M186 470 C180 400 190 352 222 334 L278 334 C310 352 320 400 314 470 Z" fill="#1f8a98" />
            <path d="M222 334 C236 346 264 346 278 334 C274 322 262 316 250 316 C238 316 226 322 222 334Z" fill="#176f7b" />
            <path d="M250 346 L250 440" stroke="#176f7b" strokeWidth="3" />
            {/* head */}
            <g className="ws-head">
              <rect x="238" y="306" width="24" height="22" rx="8" fill="#e8b98f" />
              <circle cx="250" cy="266" r="46" fill="#15151f" />
              {/* anime hair locks */}
              <path d="M206 262 L196 292 L216 278 Z" fill="#15151f" />
              <path d="M294 262 L304 292 L284 278 Z" fill="#15151f" />
              <path d="M226 300 L220 322 L240 306 Z" fill="#15151f" />
              <path d="M274 300 L280 322 L260 306 Z" fill="#15151f" />
              <path d="M232 232 C242 222 262 222 272 232" stroke="#2c2c3d" strokeWidth="3" fill="none" />
              <path d="M240 240 C246 234 256 234 262 240" stroke="#2c2c3d" strokeWidth="2" fill="none" />
              {/* headphones */}
              <path d="M202 268 C200 214 300 214 298 268" stroke="#c99a4e" strokeWidth="7" fill="none" strokeLinecap="round" />
              <rect x="190" y="252" width="20" height="38" rx="9" fill="#e0b673" />
              <rect x="290" y="252" width="20" height="38" rx="9" fill="#e0b673" />
              <rect x="194" y="258" width="8" height="26" rx="4" fill="#8a6c33" />
              <rect x="298" y="258" width="8" height="26" rx="4" fill="#8a6c33" />
            </g>
          </g>
          {/* arms reaching for the keyboard */}
          <g className="ws-arm ws-arm--l">
            <path d="M192 350 C176 392 240 412 340 408" stroke="#1f8a98" strokeWidth="24" fill="none" strokeLinecap="round" />
            <circle cx="346" cy="408" r="11" fill="#e8b98f" />
          </g>
          <g className="ws-arm ws-arm--r">
            <path d="M308 350 C326 384 380 400 402 410" stroke="#1f8a98" strokeWidth="24" fill="none" strokeLinecap="round" />
            <circle cx="410" cy="410" r="11" fill="#e8b98f" />
          </g>
        </g>

        {/* main monitor */}
        <g>
          <rect x="530" y="384" width="20" height="16" fill="#1a1a22" />
          <rect x="500" y="396" width="80" height="6" rx="3" fill="#1a1a22" />
          <rect x="380" y="214" width="320" height="170" rx="8" fill="#0d0f14" stroke="#2f3340" strokeWidth="3" />
          <rect x="392" y="227" width="296" height="136" rx="3" fill="#12151b" />
          <g clipPath="url(#ws-scr)">
            {/* 1: code */}
            <g className="ws-panel" style={{ animationDelay: '0s' }}>
              <rect x="392" y="227" width="296" height="18" fill="#1c1e25" />
              <text x="402" y="240" fontSize="9" fill="#c99a4e" fontFamily="Consolas, monospace">WorksetAssigner.cs</text>
              {CODE_LINES.map(([ind, w, c], i) => (
                <rect key={i} className="ws-line" x={404 + ind} y={254 + i * 10.5} width={w} height="5" rx="2" fill={c} style={{ animationDelay: `${i * 0.38}s` }} />
              ))}
              <rect className="ws-caret" x="470" y="358" width="5" height="8" fill="#c99a4e" />
            </g>
            {/* 2: 3D model with clashes */}
            <g className="ws-panel" style={{ animationDelay: '6s' }}>
              <rect x="392" y="227" width="296" height="136" fill="#0f1a2a" />
              <g className="ws-model">
                <Floor y={312} w={92} h={20} fill="#2a3f5f" />
                <Floor y={296} fill="#33507a" />
                <Floor y={282} fill="#33507a" />
                <Floor y={268} fill="#33507a" />
                <Floor y={254} fill="#3b5d8f" />
                <line x1="466" y1="290" x2="614" y2="262" stroke="#f2711c" strokeWidth="3" />
                <line x1="470" y1="318" x2="612" y2="290" stroke="#2cc7d3" strokeWidth="3" />
                <circle className="ws-clash" cx="540" cy="276" r="7" fill="#d9634f" />
                <circle className="ws-clash ws-clash--b" cx="500" cy="300" r="6" fill="#d9634f" />
                <circle className="ws-clash ws-clash--c" cx="586" cy="288" r="6" fill="#d9634f" />
              </g>
              <rect x="400" y="234" width="86" height="16" rx="8" fill="#1c2a40" />
              <text x="410" y="245" fontSize="8" fill="#8fd6cc" fontFamily="Inter, sans-serif">Clashes: 3 open</text>
            </g>
            {/* 3: dashboard */}
            <g className="ws-panel" style={{ animationDelay: '12s' }}>
              <rect x="392" y="227" width="296" height="136" fill="#15171c" />
              {[['#7c93ad', 'Models'], ['#8fa876', 'Passed'], ['#c99a4e', 'Attention'], ['#b8594a', 'Failed']].map(([c, l], i) => (
                <g key={l}>
                  <rect x={402 + i * 72} y="236" width="64" height="34" rx="5" fill="#1c1e25" />
                  <rect x={402 + i * 72} y="236" width="64" height="4" rx="2" fill={c} />
                  <text x={410 + i * 72} y="260" fontSize="9" fill="#eceef1" fontFamily="Inter, sans-serif">{l}</text>
                </g>
              ))}
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <rect key={i} className="ws-bar" x={410 + i * 26} y={350 - (20 + ((i * 37) % 50))} width="16" height={20 + ((i * 37) % 50)} rx="2" fill={i % 3 === 0 ? '#c99a4e' : '#6fa39d'} style={{ animationDelay: `${12 + i * 0.25}s` }} />
              ))}
              <path className="ws-spark" d="M580 340 L600 322 L618 330 L640 300 L664 306 L680 284" stroke="#e0b673" strokeWidth="2.5" fill="none" />
            </g>
            {/* 4: call */}
            <g className="ws-panel" style={{ animationDelay: '18s' }}>
              <rect x="392" y="227" width="296" height="136" fill="#101820" />
              {[['#6fa39d', 0, 0], ['#c99a4e', 1, 0], ['#7c93ad', 0, 1], ['#b8594a', 1, 1]].map(([c, cx, cy], i) => (
                <g key={i}>
                  <rect x={402 + cx * 146} y={236 + cy * 64} width="138" height="58" rx="6" fill="#1c2733" stroke={i === 1 ? '#c99a4e' : 'none'} strokeWidth="2" className={i === 1 ? 'ws-speaker' : ''} />
                  <circle cx={471 + cx * 146} cy={258 + cy * 64} r="12" fill={c} />
                  <rect x={456 + cx * 146} y={274 + cy * 64} width="30" height="12" rx="6" fill={c} opacity="0.7" />
                </g>
              ))}
            </g>
            <rect x="392" y="227" width="296" height="136" fill="url(#ws-screen)" opacity="0.4" />
          </g>
        </g>

        {/* mug */}
        <g>
          <ellipse cx="621" cy="418" rx="20" ry="5" fill="#2a1d15" opacity="0.6" />
          <rect x="606" y="390" width="30" height="28" rx="6" fill="#eceef1" />
          <path d="M636 398 C650 398 650 412 636 412" stroke="#eceef1" strokeWidth="4" fill="none" />
          <rect x="606" y="390" width="30" height="7" rx="3" fill="#8a5a3a" />
          <g className="ws-steam" stroke="#cdd6e3" strokeWidth="3" fill="none" strokeLinecap="round">
            <path d="M614 384 C608 374 620 368 614 358" />
            <path d="M626 384 C620 372 632 368 626 356" style={{ animationDelay: '0.8s' }} />
          </g>
        </g>


        {/* caption chip */}
        <g>
          {CAPTIONS.map((c, i) => (
            <g key={c} className="ws-panel" style={{ animationDelay: `${i * 6}s` }}>
              <rect x="404" y="182" width={c.length * 7.4 + 30} height="24" rx="12" fill="#c99a4e" />
              <text x="419" y="198" fontSize="12" fontWeight="700" fill="#15171c" fontFamily="Inter, sans-serif">{c}</text>
            </g>
          ))}
        </g>

        {/* second monitor: command-centre glimpse */}
        <g>
          <rect x="792" y="384" width="12" height="14" fill="#1a1a22" />
          <rect x="770" y="396" width="56" height="5" rx="2" fill="#1a1a22" />
          <rect x="716" y="288" width="164" height="98" rx="6" fill="#0d0f14" stroke="#2f3340" strokeWidth="3" />
          <rect x="724" y="296" width="148" height="82" rx="3" fill="#15171c" />
          <text x="731" y="308" fontSize="8" fill="#c99a4e" fontFamily="Inter, sans-serif" fontWeight="700">Command Center</text>
          {[0, 1, 2].map((i) => (
            <rect key={i} x={731 + i * 46} y="314" width="40" height="22" rx="3" fill="#1c1e25" stroke="#3a3f4b" />
          ))}
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} className="ws-tick" x="731" y={344 + i * 8} width={90 + ((i * 23) % 40)} height="4" rx="2" fill={['#8fa876', '#c99a4e', '#7c93ad', '#6fa39d'][i]} style={{ animationDelay: `${i * 1.1}s` }} />
          ))}
        </g>

        {/* floating pop-ups */}
        {[['Build succeeded', '#8fa876', 2], ['Clash resolved', '#2cc7d3', 9], ['Report updated', '#f9b233', 15]].map(([t, c, d]) => {
          const w = t.length * 7.4 + 36;
          return (
            <g key={t} className="ws-pop" style={{ animationDelay: `${d}s` }}>
              <rect x={560 - w / 2} y="140" width={w} height="28" rx="14" fill={c} />
              <text x="560" y="159" textAnchor="middle" fontSize="12" fontWeight="700" fill="#15171c" fontFamily="Inter, sans-serif">{t}</text>
            </g>
          );
        })}
        <g className="ws-note" fill="#e0b673">
          <text x="330" y="196" fontSize="18">♪</text>
          <text x="358" y="176" fontSize="14" style={{ animationDelay: '1.2s' }}>♫</text>
        </g>

        {/* night shading + lamp glow + screen glow */}
        <rect className="ws-dark" width="960" height="540" fill="#050a1c" pointerEvents="none" />
        <ellipse className="ws-lampglow" cx="130" cy="330" rx="170" ry="130" fill="url(#ws-glow)" />
        <ellipse className="ws-scrglow" cx="540" cy="300" rx="260" ry="150" fill="url(#ws-screen)" />

        <text x="34" y="510" fontFamily="Georgia, serif" fontSize="30" fontWeight="700" fill="#e0b673" opacity="0.95">
          Coding day and night.
        </text>
      </svg>
    </div>
    <div className="scene-music">
      <button type="button" className={`scene-music__btn ${music ? 'is-on' : ''}`} aria-pressed={music} onClick={() => setMusic((m) => !m)}>
        <span aria-hidden="true">{music ? '⏸' : '♪'}</span> {music ? 'Stop the music' : 'Play music while you watch'}
      </button>
      {music && (
        <iframe
          className="scene-music__frame"
          title="Background music (YouTube player)"
          src={`https://www.youtube-nocookie.com/embed/${MUSIC_ID}?autoplay=1&loop=1&playlist=${MUSIC_ID}&rel=0`}
          allow="autoplay; encrypted-media"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      )}
    </div>
    </div>
  );
}
