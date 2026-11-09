import { useId } from "react";

type ProductArtProps = { category: string; brand?: string; className?: string };

/** Local vector product illustrations: no third-party images or network requests. */
export default function ProductArt({
  category,
  brand,
  className,
}: ProductArtProps) {
  const id = `hardware-${useId().replace(/:/g, "")}`;
  const fill = (name: string) => `url(#${id}-${name})`;
  const fan = (x: number, y: number, r: number, glowing = false) => (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r + 2} fill="#0a0c0d" stroke="#424749" strokeWidth="1.4" />
      <circle
        r={r}
        fill="#15191b"
        stroke={glowing ? "#b3f472" : "#5b6264"}
        strokeWidth={glowing ? 1.5 : 0.7}
      />
      {Array.from({ length: 7 }, (_, i) => (
        <path
          key={i}
          d={`M 0 -2 C ${r * 0.6} ${-r * 0.9}, ${r * 0.95} ${-r * 0.8}, ${r * 0.55} ${-r * 0.1} L 2 2 Z`}
          fill={fill("blade")}
          transform={`rotate(${(i * 360) / 7})`}
        />
      ))}
      <circle r={r * 0.23} fill="#6d7477" stroke="#24282a" strokeWidth="1" />
      <circle r={r * 0.1} fill="#303638" />
    </g>
  );
  let artwork;
  switch (category) {
    case "cpu":
      artwork = (
        <>
          <path
            d="M23 29 70 15 100 43 53 62Z"
            fill="#263c32"
            stroke="#536350"
          />
          <path
            d="M23 29v12l30 29 47-15V43L53 62Z"
            fill="#142c24"
            stroke="#385143"
            strokeWidth=".7"
          />
          {Array.from({ length: 14 }, (_, i) => (
            <path
              key={i}
              d={`m${29 + i * 1.9} ${45 + i * 1.85} 0 4`}
              stroke="#b29b58"
              strokeWidth="1.1"
            />
          ))}
          <path
            d="M30 28 70 18 93 42 53 54Z"
            fill={fill("silver")}
            stroke="#c9cecd"
            strokeWidth=".8"
          />
          <path d="M30 28v7l23 25 40-13v-5L53 54Z" fill={fill("edge")} />
          <path
            d="m35 30 34-9 18 20-34 10Z"
            fill="none"
            stroke="#eef1ee"
            strokeWidth=".5"
            opacity=".6"
          />
          <g transform="translate(48 32) rotate(-16) skewX(28)">
            <text
              fill="#4b5050"
              fontFamily="Arial,sans-serif"
              fontSize="8"
              fontWeight="700"
            >
              {brand?.toLowerCase().includes("intel") ? "intel" : "AMD"}
            </text>
            <text
              y="9"
              fill="#68706f"
              fontFamily="Arial,sans-serif"
              fontSize="3.7"
              letterSpacing=".8"
            >
              {brand?.toLowerCase().includes("intel") ? "CORE" : "RYZEN"}
            </text>
          </g>
        </>
      );
      break;
    case "gpu":
      artwork = (
        <>
          <path
            d="m9 35 85-11 18 12-85 12Z"
            fill="#4c5254"
            stroke="#707677"
            strokeWidth=".7"
          />
          <path
            d="m27 48 85-12-1 26-84 13Z"
            fill={fill("graphite")}
            stroke="#5d6466"
            strokeWidth=".7"
          />
          <path
            d="m9 35 18 13v27L9 60Z"
            fill="#232729"
            stroke="#515658"
            strokeWidth=".8"
          />
          <path d="m30 72 77-12v3L30 75Z" fill="#b3f472" opacity=".7" />
          <g transform="translate(0 4) skewY(-8)">
            {fan(42, 56, 11)}
            {fan(69, 56, 11)}
            {fan(96, 56, 11)}
          </g>
          <path d="m18 38 73-10 7 5-72 10Z" fill="#191d20" />
          <text
            x="46"
            y="36"
            transform="rotate(-8 46 36)"
            fill="#d2d9d7"
            fontSize="4"
            fontFamily="Arial,sans-serif"
            letterSpacing=".6"
          >
            GEFORCE RTX
          </text>
          <path
            d="M10 37v20m4-16v16m5-12v16"
            stroke="#73797a"
            strokeWidth="1"
          />
        </>
      );
      break;
    case "motherboard":
      artwork = (
        <>
          <path
            d="m25 16 70-4 27 57-48 8Z"
            fill="#111b1a"
            stroke="#626b67"
            strokeWidth="1"
          />
          <path d="m25 16 24 61v5l48-8v-5l-48 8Z" fill="#0e1212" />
          <g transform="matrix(.78,-.08,.32,.78,25,18)">
            <rect
              width="55"
              height="66"
              rx="1"
              fill={fill("board")}
              stroke="#56605b"
              strokeWidth="1"
            />
            <path
              d="M9 0v17h13v27H5m17-20h26v37M0 35h14v23h20V45h21M28 0v9h25M4 6v17m30 0h17v10"
              fill="none"
              stroke="#7f8e78"
              opacity=".37"
              strokeWidth=".7"
            />
            <rect
              x="15"
              y="12"
              width="22"
              height="23"
              rx="1"
              fill="#8a9390"
              stroke="#c2c8c0"
              strokeWidth="1"
            />
            <rect
              x="18"
              y="15"
              width="16"
              height="17"
              fill="#242b29"
              stroke="#515d56"
            />
            <path
              d="M1 2h10v27H1zM13 1h24v7H13Z"
              fill="#3f4745"
              stroke="#68716d"
              strokeWidth=".6"
            />
            {[0, 1, 2].map((i) => (
              <rect
                key={i}
                x={41 + i * 4}
                y="7"
                width="2.5"
                height="31"
                fill={i === 1 ? "#869b61" : "#5d665b"}
              />
            ))}
            <rect x="9" y="41" width="29" height="4" fill="#a1aaa2" />
            <rect x="10" y="48" width="30" height="3" fill="#555e58" />
            <rect x="9" y="56" width="24" height="3" fill="#8e988d" />
            <path d="m44 45 9 3v14l-15-6Z" fill="#414a43" stroke="#7e8c70" />
            <path d="m42 50 9 3m-9 1 9 3" stroke="#b3f472" strokeWidth="1.2" />
            {[5, 10, 15, 20].map((x) => (
              <circle key={x} cx={x} cy="63" r="1.5" fill="#8b9676" />
            ))}
          </g>
        </>
      );
      break;
    case "ram":
      artwork = (
        <>
          {[0, 1].map((i) => (
            <g key={i} transform={`translate(${i * 10} ${i * 18})`}>
              <path
                d="m17 22 69-11 8 5-69 11Z"
                fill="#c5f4a8"
                stroke="#d6ffba"
                strokeWidth=".5"
              />
              <path
                d="m25 27 69-11v25L25 54Z"
                fill={fill("graphite")}
                stroke="#69726c"
                strokeWidth=".8"
              />
              <path d="m17 22 8 5v27l-8-6Z" fill="#39423c" />
              <path
                d="m29 32 17-3v14l-17 3Zm44-7 17-3v14l-17 3Z"
                fill="#232a25"
                stroke="#626f5b"
                strokeWidth=".5"
              />
              <path d="m29 50 61-12v5L29 55Z" fill="#b9a163" />
              {Array.from({ length: 17 }, (_, j) => (
                <path
                  key={j}
                  d={`m${31 + j * 3.3} ${50 - j * 0.65} 0 4`}
                  stroke="#4f4e32"
                  strokeWidth=".7"
                />
              ))}
              <text
                x="50"
                y="37"
                transform="rotate(-10 50 37)"
                fontFamily="Arial,sans-serif"
                fontWeight="700"
                fontSize="4.3"
                fill="#cdd7c8"
              >
                DDR5
              </text>
            </g>
          ))}
        </>
      );
      break;
    case "storage":
      artwork = (
        <>
          <path d="m10 45 82-17 19 14-82 18Z" fill="#254338" stroke="#65745c" />
          <path d="m10 45 19 15v4l82-18v-4L29 60Z" fill="#142c23" />
          <path
            d="m17 44 72-14 14 10-72 16Z"
            fill="#24292c"
            stroke="#727a78"
            strokeWidth=".7"
          />
          <path d="m22 45 13-3 8 6-13 3Zm19-4 13-3 8 6-13 3Z" fill="#464d4c" />
          <path d="m60 37 26-5 11 8-26 6Z" fill="#bdc5c1" />
          <path d="m92 28 8-1 15 12-5 2Z" fill="#c5a95d" />
          <path d="m99 30 10 8m-7-9 10 8" stroke="#52533a" strokeWidth=".8" />
          <circle cx="19" cy="48" r="2.3" fill="#0b1510" stroke="#a4ad9e" />
          <text
            x="68"
            y="39"
            transform="rotate(-12 68 39)"
            fill="#2c3430"
            fontFamily="Arial,sans-serif"
            fontSize="4"
            fontWeight="700"
          >
            NVMe
          </text>
        </>
      );
      break;
    case "cooler":
      artwork = (
        <>
          <path
            d="m33 20 37-8 24 12-36 9Z"
            fill="#7d8585"
            stroke="#b5bcba"
            strokeWidth=".7"
          />
          <path d="m33 20 25 13v38L33 58Z" fill="#424a4c" />
          <path
            d="m58 33 36-9v38l-36 9Z"
            fill="#626a6b"
            stroke="#8a9290"
            strokeWidth=".7"
          />
          {Array.from({ length: 12 }, (_, i) => (
            <path
              key={i}
              d={`m34 ${23 + i * 3} 24 12 35-9`}
              fill="none"
              stroke={i % 2 ? "#a9b0ac" : "#283234"}
              strokeWidth="1"
            />
          ))}
          <path d="m28 32 29 8v34l-29-9Z" fill="#1e2426" stroke="#636e6c" />
          <g transform="matrix(.88,.28,0,1,42,52)">{fan(0, 0, 14, true)}</g>
          <path
            d="m63 71-2 7m11-9-2 7m10-9-2 7"
            stroke="#b7a68e"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="m37 23 28-6m-21 9 28-6m-21 9 28-6"
            stroke="#c6cdca"
            strokeWidth="1.5"
          />
        </>
      );
      break;
    case "psu":
      artwork = (
        <>
          <path
            d="m18 28 44-12 39 22-46 14Z"
            fill="#383e40"
            stroke="#666e70"
            strokeWidth=".8"
          />
          <path
            d="m18 28 37 24v26L18 53Z"
            fill="#24292b"
            stroke="#474f51"
            strokeWidth=".8"
          />
          <path
            d="m55 52 46-14v27L55 78Z"
            fill={fill("graphite")}
            stroke="#535d5d"
            strokeWidth=".8"
          />
          <g transform="matrix(1,-.29,.64,.56,60,34)">{fan(0, 0, 23)}</g>
          <path
            d="m61 55 31-9v15l-31 9Z"
            fill="#212625"
            stroke="#818b79"
            strokeWidth=".6"
          />
          <text
            x="65"
            y="62"
            transform="rotate(-16 65 62)"
            fill="#d9e2d1"
            fontSize="8"
            fontFamily="Arial,sans-serif"
            fontWeight="700"
          >
            750W
          </text>
          <path d="m25 40 12 8v9l-12-8Z" fill="#0e1315" stroke="#656e70" />
          <path d="m42 53 6 4v7l-6-4Z" fill="#0d1213" stroke="#6b7471" />
        </>
      );
      break;
    case "case":
      artwork = (
        <>
          <path
            d="m32 12 34-7 23 12-34 8Z"
            fill="#3f4849"
            stroke="#79817e"
            strokeWidth=".6"
          />
          <path
            d="m32 12 23 13v56L32 67Z"
            fill={fill("graphite")}
            stroke="#687371"
            strokeWidth=".7"
          />
          <path
            d="m55 25 34-8v56l-34 8Z"
            fill="#151b1c"
            stroke="#687472"
            strokeWidth=".8"
          />
          <path
            d="m36 20 15 8v43l-15-9Z"
            fill="#26332f"
            fillOpacity=".8"
            stroke="#536e5c"
            strokeWidth=".6"
          />
          <path d="m37 47 12 6v7l-12-6Z" fill="#779074" />
          <path d="m38 35 4 2v9l-4-2Z" fill="#809d74" />
          <g transform="matrix(1,-.24,0,1,71,36)">
            {fan(0, 0, 8, true)}
            {fan(0, 17, 8, true)}
            {fan(0, 34, 8, true)}
          </g>
          <path d="m59 29 3-1v44l-3 1Z" fill="#8cb4a0" opacity=".25" />
          <path
            d="m58 80 0 4m26-11v4M36 68v4"
            stroke="#111718"
            strokeWidth="4"
          />
          <path d="m59 17 10-2m2-1 3-.5" stroke="#a7b6ae" strokeWidth="1" />
        </>
      );
      break;
    default:
      artwork = (
        <rect
          x="35"
          y="20"
          width="50"
          height="50"
          rx="9"
          fill={fill("graphite")}
          stroke="#607056"
        />
      );
  }
  return (
    <svg
      className={className}
      viewBox="0 0 120 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient
          id={`${id}-silver`}
          x1="32"
          y1="20"
          x2="78"
          y2="55"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#eef1eb" />
          <stop offset=".45" stopColor="#adb8b5" />
          <stop offset=".52" stopColor="#e4e8df" />
          <stop offset="1" stopColor="#869492" />
        </linearGradient>
        <linearGradient
          id={`${id}-edge`}
          x1="30"
          y1="32"
          x2="90"
          y2="54"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#828e8b" />
          <stop offset=".4" stopColor="#c6ceca" />
          <stop offset="1" stopColor="#5c6a69" />
        </linearGradient>
        <linearGradient
          id={`${id}-graphite`}
          x1="20"
          y1="20"
          x2="90"
          y2="75"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#4f5859" />
          <stop offset=".4" stopColor="#2c3335" />
          <stop offset="1" stopColor="#141a1c" />
        </linearGradient>
        <linearGradient
          id={`${id}-board`}
          x1="0"
          y1="0"
          x2="55"
          y2="66"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2b3731" />
          <stop offset="1" stopColor="#141d18" />
        </linearGradient>
        <linearGradient
          id={`${id}-blade`}
          x1="-10"
          y1="-10"
          x2="10"
          y2="10"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#7a8585" />
          <stop offset=".45" stopColor="#394548" />
          <stop offset="1" stopColor="#131c1f" />
        </linearGradient>
        <radialGradient id={`${id}-shadow`}>
          <stop stopColor="#000" stopOpacity=".5" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="62" cy="77" rx="47" ry="10" fill={fill("shadow")} />
      {artwork}
    </svg>
  );
}
