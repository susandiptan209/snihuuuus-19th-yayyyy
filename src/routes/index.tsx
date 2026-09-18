import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown, Heart, Music2, Pause, RotateCcw, Volume2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import coverAsset from "@/assets/snihu-cover.webp.asset.json";
import collageAsset from "@/assets/snihu-collage.png.asset.json";
import soloAsset from "@/assets/snihu-solo.png.asset.json";
import firstSongAsset from "@/assets/du-haatey-mutho-bhorey.mp3.asset.json";
import secondSongAsset from "@/assets/ishq-hai.mp3.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Happy Birthday SNIHUUUUU ❤️" },
      {
        name: "description",
        content: "A little birthday surprise made with love for SNIHUUUUU's 19th.",
      },
      { property: "og:title", content: "Happy Birthday SNIHUUUUU ❤️" },
      {
        property: "og:description",
        content: "One tap, three memories, and a whole lot of love.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BirthdayExperience,
});

const wishParagraphs = [
  "Happy Birthday Bacchu i hopeeee and i prayyyy that your day be brighter and your life be the brightest...",
  "The most wonderfulll and the most cutuestttt being I've ever come acrossss 🫠❤️",
  "I wish and i hope maa durga keeps bestowing her divine blessings upon you, protects you and that you outshine in any field you go to.",
  "You've always been a motivator someone who pushes me everytime i fall back... i have nothing more but a heart full of love and yk oi (more).. 🫠❤️",
  "Etat etla lekha jayna baki to normal wish e ase hehee ❤️",
];

function BirthdayExperience() {
  const [scene, setScene] = useState(0);
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(false);
  const firstAudio = useRef<HTMLAudioElement>(null);
  const secondAudio = useRef<HTMLAudioElement>(null);
  const fadeTimer = useRef<number | null>(null);

  const clearFade = useCallback(() => {
    if (fadeTimer.current !== null) window.clearInterval(fadeTimer.current);
    fadeTimer.current = null;
  }, []);

  useEffect(() => clearFade, [clearFade]);

  const startExperience = async () => {
    const audio = firstAudio.current;
    if (!audio) return;
    audio.volume = 0.72;
    try {
      await audio.play();
      setStarted(true);
    } catch {
      setStarted(true);
      setMuted(true);
    }
  };

  const openWish = async () => {
    const first = firstAudio.current;
    const second = secondAudio.current;
    setScene(1);
    if (!first || !second || muted) return;

    clearFade();
    second.volume = 0;
    try {
      await second.play();
    } catch {
      return;
    }

    const steps = 24;
    let step = 0;
    fadeTimer.current = window.setInterval(() => {
      step += 1;
      first.volume = Math.max(0, 0.72 * (1 - step / steps));
      second.volume = Math.min(0.72, 0.72 * (step / steps));
      if (step >= steps) {
        first.pause();
        clearFade();
      }
    }, 75);
  };

  const backToStart = () => {
    setScene(0);
    clearFade();
    const first = firstAudio.current;
    const second = secondAudio.current;
    if (second) {
      second.pause();
      second.volume = 0;
    }
    if (first && !muted) {
      first.volume = 0.72;
      first.play().catch(() => setMuted(true));
    }
  };

  const toggleSound = async () => {
    const nextMuted = !muted;
    setMuted(nextMuted);
    const active = scene === 0 ? firstAudio.current : secondAudio.current;
    if (!active) return;
    active.muted = nextMuted;
    if (!nextMuted) {
      try {
        await active.play();
      } catch {
        setMuted(true);
      }
    }
  };

  return (
    <main className="birthday-shell">
      <audio ref={firstAudio} src={firstSongAsset.url} loop preload="auto" />
      <audio ref={secondAudio} src={secondSongAsset.url} loop preload="auto" />

      {started && (
        <button className="sound-button" onClick={toggleSound} aria-label={muted ? "Turn sound on" : "Mute music"}>
          {muted ? <Music2 aria-hidden="true" /> : <Volume2 aria-hidden="true" />}
        </button>
      )}

      <nav className="scene-progress" aria-label={`Scene ${scene + 1} of 3`}>
        {[0, 1, 2].map((dot) => (
          <span key={dot} className={dot === scene ? "progress-dot is-active" : "progress-dot"} />
        ))}
      </nav>

      <section className={scene === 0 ? "birthday-scene cover-scene is-active" : "birthday-scene cover-scene"} aria-hidden={scene !== 0}>
        <img className="scene-image cover-image" src={coverAsset.url} alt="Birthday memories in a filmstrip collage" />
        <div className="scene-shade" />
        <div className="cover-content">
          <p className="eyebrow">For the girl who makes ordinary feel cinematic</p>
          <h1>Not your average 19.<br /><em>Not your average girl.</em></h1>
          {!started ? (
            <button className="volume-card" onClick={startExperience}>
              <span className="headphone-pulse"><Volume2 aria-hidden="true" /></span>
              <span><strong>Turn your volume up</strong><small>tap here to begin</small></span>
            </button>
          ) : (
            <button className="primary-action" onClick={openWish}>
              Tap if you dare <Heart aria-hidden="true" />
            </button>
          )}
        </div>
      </section>

      <section className={scene === 1 ? "birthday-scene wish-scene is-active" : "birthday-scene wish-scene"} aria-hidden={scene !== 1}>
        <img className="scene-image wish-image" src={collageAsset.url} alt="A handmade yellow birthday collage for Snihu" />
        <div className="wish-veil" />
        <div className="wish-scroll">
          <p className="eyebrow">A little note from your Bachu</p>
          <h2>Happy Birthday,<br /><em>Bacchu.</em></h2>
          <div className="wish-copy">
            {wishParagraphs.map((paragraph, index) => (
              <p key={paragraph} style={{ animationDelay: `${0.35 + index * 0.2}s` }}>{paragraph}</p>
            ))}
          </div>
          <button className="next-action" onClick={() => setScene(2)}>
            One last thing <ChevronDown aria-hidden="true" />
          </button>
        </div>
      </section>

      <section className={scene === 2 ? "birthday-scene final-scene is-active" : "birthday-scene final-scene"} aria-hidden={scene !== 2}>
        <img className="scene-image final-image" src={soloAsset.url} alt="Snihu in blue, surrounded by lotus flowers" />
        <div className="final-shade" />
        <div className="final-message">
          <span className="final-kicker">nineteen looks lovely on you</span>
          <p>Cheers to your 19th year — your last teen year 🥂</p>
          <p>I hope and pray the good Lord keeps you safe, happy, and healthy.</p>
           <strong>Lots of love,<br /><em>your Bachuuuuu</em> 💛</strong>
          <Pause className="closing-mark" aria-hidden="true" />
          <button className="back-action" onClick={backToStart}>
            Relive it from the start <RotateCcw aria-hidden="true" />
          </button>
        </div>
      </section>
    </main>
  );
}