// Small hand-drawn style illustrations for each step of the bilona process.
// Colours are fixed (cards always sit on warm cream/gold gradients in both themes).

const G = "#1f3d1c"; // forest outline
const CREAM = "#fffdf7";
const POT = "#b8743f";
const POT_D = "#8a5229";

function Milk() {
  return (
    <svg viewBox="0 0 120 120" className="size-full">
      <ellipse cx="60" cy="106" rx="34" ry="5" fill={G} opacity="0.12" />
      <path d="M38 52 Q34 40 44 34 L76 34 Q86 40 82 52 Q98 64 92 86 Q86 104 60 104 Q34 104 28 86 Q22 64 38 52 Z" fill="#c9a24c" stroke={G} strokeWidth="2.5" />
      <ellipse cx="60" cy="34" rx="18" ry="5" fill={CREAM} stroke={G} strokeWidth="2.5" />
      <path d="M36 70 Q60 76 84 70" stroke={G} strokeWidth="2" fill="none" opacity="0.5" />
      <g className="origin-[60px_20px] animate-float">
        <path d="M60 4 C66 14 70 19 70 24 A10 10 0 0 1 50 24 C50 19 54 14 60 4 Z" fill={CREAM} stroke={G} strokeWidth="2.5" />
      </g>
    </svg>
  );
}

function Curd() {
  return (
    <svg viewBox="0 0 120 120" className="size-full">
      <ellipse cx="60" cy="104" rx="38" ry="5" fill={G} opacity="0.12" />
      <path d="M18 58 L102 58 Q100 96 60 100 Q20 96 18 58 Z" fill={POT} stroke={G} strokeWidth="2.5" />
      <ellipse cx="60" cy="58" rx="42" ry="10" fill={CREAM} stroke={G} strokeWidth="2.5" />
      <path d="M34 58 Q42 52 50 58 T66 58 T82 58" stroke="#e9e1cc" strokeWidth="3" fill="none" />
      <path d="M26 74 Q60 82 94 74" stroke={POT_D} strokeWidth="2.5" fill="none" />
      <g className="animate-float-slow">
        <path d="M86 14 A14 14 0 1 0 100 32 A11 11 0 1 1 86 14 Z" fill="#e2bf6c" stroke={G} strokeWidth="2" />
        <circle cx="70" cy="18" r="1.8" fill="#e2bf6c" />
        <circle cx="104" cy="12" r="1.4" fill="#e2bf6c" />
      </g>
    </svg>
  );
}

function Churn() {
  return (
    <svg viewBox="0 0 120 120" className="size-full">
      <ellipse cx="60" cy="108" rx="34" ry="5" fill={G} opacity="0.12" />
      <g className="origin-[60px_70px] animate-churn">
        <rect x="57" y="2" width="6" height="70" rx="3" fill="#8a5a2b" stroke={G} strokeWidth="2" />
        <path d="M48 66 L72 66 L66 80 L54 80 Z" fill="#8a5a2b" stroke={G} strokeWidth="2" />
        <path d="M42 22 Q60 30 78 22" stroke="#e2bf6c" strokeWidth="2.5" fill="none" />
      </g>
      <path d="M30 56 Q24 50 34 46 L86 46 Q96 50 90 56 Q104 70 96 90 Q88 106 60 106 Q32 106 24 90 Q16 70 30 56 Z" fill={POT} stroke={G} strokeWidth="2.5" />
      <ellipse cx="60" cy="47" rx="26" ry="5" fill={CREAM} stroke={G} strokeWidth="2.5" />
      <path d="M24 78 Q60 88 96 78" stroke={POT_D} strokeWidth="2.5" fill="none" />
      <circle cx="40" cy="40" r="2.5" fill={CREAM} className="animate-float" />
      <circle cx="82" cy="38" r="2" fill={CREAM} className="animate-float-slow" />
    </svg>
  );
}

function Makkhan() {
  return (
    <svg viewBox="0 0 120 120" className="size-full">
      <ellipse cx="60" cy="102" rx="40" ry="5" fill={G} opacity="0.12" />
      <path d="M16 66 L104 66 Q102 96 60 98 Q18 96 16 66 Z" fill="#9c6b3d" stroke={G} strokeWidth="2.5" />
      <ellipse cx="60" cy="66" rx="44" ry="9" fill="#7a5230" stroke={G} strokeWidth="2.5" />
      <g className="animate-float-slow">
        <path d="M34 66 Q30 46 46 42 Q50 28 64 32 Q80 28 84 44 Q94 50 86 66 Z" fill="#fff6d8" stroke={G} strokeWidth="2.5" />
        <path d="M48 46 Q54 42 60 46" stroke="#e9dcae" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="72" cy="44" r="3" fill="#ffffff" />
      </g>
    </svg>
  );
}

function SlowCook() {
  return (
    <svg viewBox="0 0 120 120" className="size-full">
      <g className="origin-[60px_108px] animate-flicker">
        <path d="M42 108 C36 96 46 90 46 80 C54 88 52 94 56 96 C56 86 62 80 62 72 C72 82 74 92 70 100 C76 98 78 92 78 88 C86 96 82 106 78 108 Z" fill="#f08a24" />
        <path d="M52 108 C48 100 56 96 56 90 C60 96 62 100 66 100 C68 104 66 108 64 108 Z" fill="#ffd166" />
      </g>
      <path d="M14 46 L106 46 Q102 74 60 76 Q18 74 14 46 Z" fill="#4b4b4b" stroke={G} strokeWidth="2.5" />
      <path d="M8 46 L22 46 M98 46 L112 46" stroke={G} strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="60" cy="46" rx="44" ry="8" fill="#e8b84a" stroke={G} strokeWidth="2.5" />
      <g opacity="0.7">
        <path d="M44 34 Q40 26 46 20 Q52 14 46 6" stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" className="animate-float" />
        <path d="M66 32 Q62 24 68 18 Q74 12 68 4" stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" className="animate-float-slow" />
      </g>
    </svg>
  );
}

function GheeJar() {
  return (
    <svg viewBox="0 0 120 120" className="size-full">
      <ellipse cx="60" cy="110" rx="32" ry="5" fill={G} opacity="0.15" />
      <rect x="32" y="16" width="56" height="16" rx="5" fill="#c9a24c" stroke={G} strokeWidth="2.5" />
      <path d="M30 34 Q28 30 34 30 L86 30 Q92 30 90 34 L92 98 Q92 108 82 108 L38 108 Q28 108 28 98 Z" fill="#f2c55a" stroke={G} strokeWidth="2.5" />
      <rect x="38" y="56" width="44" height="32" rx="4" fill={CREAM} stroke={G} strokeWidth="2" />
      <path d="M52 66 C46 66 44 62 44 60 C50 60 52 62 52 66 Z M56 66 C56 61 60 58 66 58 C66 62 62 66 56 66 Z" fill="#4f7a28" />
      <rect x="46" y="72" width="28" height="3" rx="1.5" fill={G} opacity="0.6" />
      <rect x="50" y="79" width="20" height="2.5" rx="1.25" fill={G} opacity="0.35" />
      <path d="M36 40 L36 96" stroke="#fff" strokeOpacity="0.6" strokeWidth="4" strokeLinecap="round" />
      <g fill="#fff6d8" className="animate-pulse">
        <path d="M100 18 L102 24 L108 26 L102 28 L100 34 L98 28 L92 26 L98 24 Z" />
        <path d="M16 54 L17.5 58 L21.5 59.5 L17.5 61 L16 65 L14.5 61 L10.5 59.5 L14.5 58 Z" />
      </g>
    </svg>
  );
}

export const BILONA_ART = [Milk, Curd, Churn, Makkhan, SlowCook, GheeJar];
