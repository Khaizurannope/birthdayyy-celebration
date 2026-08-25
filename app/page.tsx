"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  Check,
  Heart,
  Lock,
  Music,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  WandSparkles,
} from "lucide-react";
import { birthdayData } from "@/lib/birthday-data";

type Stage =
  | "loading"
  | "mystery"
  | "password"
  | "anticipation"
  | "intro"
  | "story"
  | "gallery"
  | "game"
  | "personality"
  | "letter"
  | "cake"
  | "surprise"
  | "ending";
const stages: Stage[] = [
  "mystery",
  "password",
  "anticipation",
  "intro",
  "story",
  "gallery",
  "game",
  "personality",
  "letter",
  "cake",
  "surprise",
  "ending",
];

function Button({
  children,
  onClick,
  subtle = false,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  subtle?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={subtle ? "story-button story-button-subtle" : "story-button"}
    >
      {children}
    </button>
  );
}

export default function Page() {
  const [stage, setStage] = useState<Stage>("loading");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [count, setCount] = useState(10);
  const [question, setQuestion] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [letterOpen, setLetterOpen] = useState(false);
  const [candleLit, setCandleLit] = useState(true);
  const [candleClicks, setCandleClicks] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.45);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setStage("mystery"), 1000);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (stage !== "anticipation") return;
    setCount(10);
    const timer = setInterval(
      () =>
        setCount((value) => {
          if (value <= 1) {
            clearInterval(timer);
            setStage("intro");
            return 0;
          }
          return value - 1;
        }),
      1000,
    );
    return () => clearInterval(timer);
  }, [stage]);
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = muted;
    }
  }, [volume, muted]);

  const progress = useMemo(() => Math.max(0, stages.indexOf(stage)), [stage]);
  const next = () => {
    const index = stages.indexOf(stage);
    if (index >= 0 && index < stages.length - 1) setStage(stages[index + 1]);
  };
  const startMusic = async () => {
    if (!audioRef.current) return;
    try {
      await audioRef.current.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  };
  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else startMusic();
  };
  const submitPassword = (event: React.FormEvent) => {
    event.preventDefault();
    if (password === birthdayData.password) {
      setError("");
      setStage("anticipation");
    } else
      setError(
        "That doesn’t look quite right. Try the date that changed everything.",
      );
  };
  const chooseAnswer = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
    if (index === birthdayData.questions[question].answer) setScore(score + 1);
  };
  const nextQuestion = () => {
    if (question < birthdayData.questions.length - 1) {
      setQuestion(question + 1);
      setSelected(null);
    } else next();
  };
  const replay = () => {
    setStage("mystery");
    setPassword("");
    setQuestion(0);
    setSelected(null);
    setScore(0);
    setLetterOpen(false);
    setCandleLit(true);
    setCandleClicks(0);
  };
  const clickCandle = () => {
    if (!candleLit) return;
    const clicks = candleClicks + 1;
    setCandleClicks(clicks);
    if (clicks >= 5) {
      setCandleLit(false);
      startMusic();
    }
  };

  if (stage === "loading")
    return (
      <main className="loading-screen">
        <div className="loading-mark">
          <Heart size={18} fill="currentColor" />
        </div>
        <p>preparing something special</p>
      </main>
    );
  return (
    <main className="birthday-shell">
      <audio
        ref={audioRef}
        loop
        src="/music/best-part.mp3"
        onError={() => setPlaying(false)}
      />
      <div className="grain" aria-hidden="true" />
      <header className="topbar">
        <span className="monogram">Z / K</span>
        <span className="chapter">
          {stage === "mystery" || stage === "password"
            ? "a little surprise"
            : `chapter ${String(Math.max(progress, 1)).padStart(2, "0")}`}
        </span>
        <button
          className="music-control"
          onClick={toggleMusic}
          aria-label={playing ? "Pause music" : "Play music"}
        >
          {playing ? <Pause size={15} /> : <Play size={15} />}{" "}
          <span>{playing ? "playing" : "music"}</span>
        </button>
      </header>
      <div className="progress-track">
        <span style={{ width: `${(progress / (stages.length - 1)) * 100}%` }} />
      </div>

      {stage === "mystery" && (
        <section className="center-stage mystery-stage">
          <p className="eyebrow fade-up">for someone very, very special</p>
          <h1 className="display fade-up delay-1">
            I made you
            <br />
            <em>something.</em>
          </h1>
          <p className="lede fade-up delay-2">
            It’s small. It’s sentimental.
            <br />
            It’s entirely yours.
          </p>
          <Button onClick={() => setStage("password")}>
            Open when ready <ArrowRight size={17} />
          </Button>
          <p className="microcopy">(there’s a secret inside)</p>
        </section>
      )}
      {stage === "password" && (
        <section className="center-stage">
          <Lock className="icon-burgundy" size={22} />
          <p className="eyebrow">a tiny little lock</p>
          <h2 className="title">Only you can open this.</h2>
          <p className="lede">Enter a password</p>
          <form className="password-form" onSubmit={submitPassword}>
            <input
              autoFocus
              value={password}
              onChange={(e) =>
                setPassword(e.target.value.replace(/\D/g, "").slice(0, 8))
              }
              inputMode="numeric"
              maxLength={8}
              aria-label="Secret password"
              placeholder="DDMMYYYY"
            />
            <Button type="submit">
              Unlock <ArrowRight size={17} />
            </Button>
          </form>
          {error && <p className="error-text">{error}</p>}
          <p className="microcopy">the day you came into this world</p>
        </section>
      )}
      {stage === "anticipation" && (
        <section className="center-stage anticipation">
          <p className="eyebrow">take a breath</p>
          <div className="countdown">{String(count).padStart(2, "0")}</div>
          <p className="lede">something lovely is on its way.</p>
        </section>
      )}
      {stage === "intro" && (
        <section className="center-stage">
          <div className="date-stamp">26 · 08 · 2026</div>
          <p className="eyebrow">today is about</p>
          <h1 className="display">
            you,
            <br />
            <em>Zulfa.</em>
          </h1>
          <p className="lede">
            Happy 19th birthday to the person
            <br />
            who makes everything feel a little brighter.
          </p>
          <Button
            onClick={() => {
              startMusic();
              next();
            }}
          >
            Begin the story <ArrowDown size={17} />
          </Button>
        </section>
      )}
      {stage === "story" && (
        <section className="content-stage">
          <div className="section-heading">
            <p className="eyebrow">where it all began</p>
            <h2 className="title">
              A few moments
              <br />
              <em>worth keeping.</em>
            </h2>
          </div>
          <div className="timeline">
            {birthdayData.timeline.map(([date, copy]) => (
              <div className="timeline-row" key={date}>
                <span className="date-label">{date}</span>
                <p>{copy}</p>
                <span className="timeline-dot" />
              </div>
            ))}
          </div>
          <Button onClick={next}>
            There’s more <ArrowRight size={17} />
          </Button>
        </section>
      )}
      {stage === "gallery" && (
        <section className="content-stage">
          <div className="section-heading">
            <p className="eyebrow">a small collection</p>

            <h2 className="title">
              The many faces
              <br />
              <em>of you.</em>
            </h2>
          </div>

          <div className="polaroids">
            {birthdayData.gallery.map((photo) => (
              <article className={`polaroid ${photo.tone}`} key={photo.title}>
                <div className="photo-frame">
                  <img
                    src={photo.image}
                    alt={photo.title}
                    className="photo-image"
                  />
                </div>

                <div className="polaroid-caption">
                  <strong>{photo.title}</strong>

                  {photo.note && <small>{photo.note}</small>}
                </div>
              </article>
            ))}
          </div>

          <Button onClick={next}>
            Keep going <ArrowRight size={17} />
          </Button>
        </section>
      )}

      {stage === "game" && (
        <section className="content-stage game-stage">
          <p className="eyebrow">a very serious quiz</p>
          <h2 className="title">
            How well do you know
            <br />
            <em>what I’m thinking?</em>
          </h2>
          <div className="question-card">
            <span className="question-number">0{question + 1} / 03</span>
            <h3>{birthdayData.questions[question].prompt}</h3>
            <div className="options">
              {birthdayData.questions[question].options.map((option, i) => (
                <button
                  key={option}
                  className={`option ${selected !== null ? (i === birthdayData.questions[question].answer ? "correct" : i === selected ? "wrong" : "") : ""}`}
                  onClick={() => chooseAnswer(i)}
                >
                  {option}
                  {selected !== null &&
                    i === birthdayData.questions[question].answer && (
                      <Check size={16} />
                    )}
                </button>
              ))}
            </div>
            {selected !== null && (
              <>
                <p className="feedback">
                  {selected === birthdayData.questions[question].answer
                    ? "I knew you’d get that one."
                    : "Close enough. I’ll give you a hint next time."}
                </p>
                <p className="answer-reveal">
                  Answer:{" "}
                  <strong>
                    {
                      birthdayData.questions[question].options[
                        birthdayData.questions[question].answer
                      ]
                    }
                  </strong>
                </p>
              </>
            )}
          </div>
          {selected !== null && (
            <Button onClick={nextQuestion}>
              {question === 2 ? `Finish (${score}/3)` : "Next question"}{" "}
              <ArrowRight size={17} />
            </Button>
          )}
        </section>
      )}
      {stage === "personality" && (
        <section className="center-stage">
          <WandSparkles className="icon-burgundy" size={25} />
          <p className="eyebrow">official findings</p>
          <h2 className="title">
            You are made of
            <br />
            <em>good things.</em>
          </h2>
          <p className="lede">
            A little brave. A little chaotic.
            <br />
            Deeply kind. Impossible not to love.
          </p>
          <div className="traits">
            <span>soft heart</span>
            <span>bright mind</span>
            <span>main character</span>
          </div>
          <Button onClick={next}>
            One last thing <ArrowRight size={17} />
          </Button>
        </section>
      )}
      {stage === "letter" && (
        <section className="center-stage letter-stage">
          <p className="eyebrow">for your eyes only</p>
          <h2 className="title">
            A letter,
            <br />
            <em>from me to you.</em>
          </h2>
          <button
            className={`envelope ${letterOpen ? "open" : ""}`}
            onClick={() => setLetterOpen(true)}
            aria-label="Open birthday letter"
          >
            <span className="envelope-flap" />
            <span className="envelope-paper">
              Dear Zulfa,
              <br />
              <br />
              May this year bring you all the good things you deserve. Thank you
              for being who you are. I'm so lucky to have you in my life, and I
              hope you will forever! Love you!
              <br />
              <br />
              With all my heart,
              <br />
              Khai
            </span>
            <span className="envelope-seal">
              <Heart size={15} fill="currentColor" />
            </span>
          </button>
          {letterOpen && (
            <Button onClick={next}>
              I’ll keep this <Heart size={16} fill="currentColor" />
            </Button>
          )}
          {!letterOpen && <p className="microcopy">tap the envelope</p>}
        </section>
      )}
      {stage === "cake" && (
        <section className="center-stage cake-stage">
          <p className="eyebrow">make a wish</p>

          <h2 className="title">
            Make a wish,
            <br />
            <em>Zulfa!</em>
          </h2>

          <button
            className={`pixel-cake ${!candleLit ? "blown" : ""}`}
            onClick={clickCandle}
            aria-label="Blow out the birthday candles"
          >
            {/* CAKE PLATE */}
            <span className="pixel-plate" />

            {/* NUMBER CANDLE 1 */}
            <span className="number-candle candle-one">
              <span
                className={`real-flame ${!candleLit ? "extinguished" : ""}`}
              />
              <span className="number-wick" />
              <span className="pixel-number">1</span>
            </span>

            {/* NUMBER CANDLE 9 */}
            <span className="number-candle candle-nine">
              <span
                className={`real-flame ${!candleLit ? "extinguished" : ""}`}
              />
              <span className="number-wick" />
              <span className="pixel-number">9</span>
            </span>

            {/* CAKE TOP */}
            <span className="pixel-cake-top" />

            {/* CAKE BODY */}
            <span className="pixel-cake-body">
              <span className="pixel-frosting" />
              <span className="pixel-drip drip-one" />
              <span className="pixel-drip drip-two" />
              <span className="pixel-drip drip-three" />

              <span className="pixel-decoration decoration-one" />
              <span className="pixel-decoration decoration-two" />
              <span className="pixel-decoration decoration-three" />
            </span>
          </button>

          <p className="lede">
            {candleLit
              ? `make a wish · ${candleClicks}/5`
              : "may every little wish find its way to you."}
          </p>

          {!candleLit && (
            <Button onClick={next}>
              See your surprise <WandSparkles size={16} />
            </Button>
          )}
        </section>
      )}

      {stage === "surprise" && (
        <section className="center-stage">
          <div className="surprise-heart">
            <Heart size={34} fill="currentColor" />
          </div>
          <p className="eyebrow">the real surprise</p>
          <h1 className="display">
            You are
            <br />
            <em>so loved.</em>
          </h1>
          <p className="lede">
            More than this little page could ever say.
            <br />
            More than you probably realize.
          </p>
          <Button onClick={next}>
            Keep this feeling <ArrowRight size={17} />
          </Button>
        </section>
      )}
      {stage === "ending" && (
        <section className="center-stage ending">
          <p className="eyebrow">until the next chapter</p>
          <h1 className="display">
            Happy birthday,
            <br />
            <em>{birthdayData.nickname}.</em>
          </h1>
          <p className="lede">
            I hope you replay this whenever
            <br />
            you need a reminder.
          </p>
          <Button onClick={replay}>
            <RotateCcw size={16} /> Replay from the beginning
          </Button>
          <p className="microcopy">made with love · always</p>
        </section>
      )}

      <footer className="footer">
        <span>26.08.26</span>
        <span className="footer-music">
          <button onClick={toggleMusic}>
            {playing ? <Volume2 size={14} /> : <VolumeX size={14} />}{" "}
            {playing ? "sound on" : "turn on the music"}
          </button>
          <input
            aria-label="Music volume"
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
          />
        </span>
        <span>
          {progress > 0 ? `${progress} / ${stages.length - 1}` : "for you"}
        </span>
      </footer>
    </main>
  );
}
