import { useState, useEffect, useRef, useCallback } from "react";
// ─── DATA ──────────────────────────────────────────────────────────────────────
const WORKOUT_DAYS = [
  {
    id: "monday", label: "Понедельник", tag: "Пн", dayType: "PUSH", color: "#C8F542",
    focus: "Грудь + Плечи + Трицепс",
    exercises: [
      { name: "Жим гантелей на горизонтальной скамье", sets: 4, reps: "8–10", weight: "30–34 кг", rest: 90, muscles: "Грудь, трицепс, передняя дельта", tips: "Локти 45°, лопатки прижаты к скамье. Не поднимай поясницу." },
      { name: "Сведение в кроссовере (снизу вверх)", sets: 3, reps: "12–15", weight: "12–18 кг/руку", rest: 60, muscles: "Верхняя часть груди", tips: "Угол локтя фиксирован. Движение от грудных, не от рук." },
      { name: "Отжимания на брусьях (акцент грудь)", sets: 3, reps: "10–12", weight: "Своё / +10 кг", rest: 90, muscles: "Нижняя грудь, трицепс", tips: "Наклон корпуса вперёд 15–20° — акцент на грудь." },
      { name: "Жим гантелей стоя (строгий)", sets: 4, reps: "10–12", weight: "24–28 кг", rest: 90, muscles: "Средняя и передняя дельта, трицепс", tips: "Без читинга — строго вертикально. Не прогибай поясницу!" },
      { name: "Разведения в стороны (дроп-сет)", sets: 3, reps: "10+10", weight: "10→6 кг", rest: 60, muscles: "Средняя дельта", tips: "10 повт → сразу без отдыха 10 повт с меньшим весом." },
      { name: "Face Pull", sets: 3, reps: "15", weight: "25–30 кг", rest: 60, muscles: "Задняя дельта, ротаторная манжета", tips: "Тяни к лицу, не к шее. Локти вверх в конце движения." },
      { name: "Жим узким хватом в Смите", sets: 3, reps: "10–12", weight: "50–60 кг", rest: 90, muscles: "Трицепс, грудь (внутренняя)", tips: "Хват чуть уже плеч. Локти вдоль тела." },
      { name: "Канат над головой (трицепс)", sets: 3, reps: "12–15", weight: "20–30 кг", rest: 60, muscles: "Длинная головка трицепса", tips: "Локти смотрят в потолок и не двигаются. Секрет объёма рук." },
      { name: "Сгибание на блоке (оба блока)", sets: 2, reps: "15", weight: "10–15 кг/руку", rest: 60, muscles: "Бицепс (пик)", tips: "Максимальное сокращение наверху — задержи 1 сек." },
      { name: "Молотки сидя", sets: 2, reps: "12", weight: "16–18 кг", rest: 60, muscles: "Брахиалис, брахиорадиалис", tips: "Нейтральный хват делает руку визуально толще." },
    ],
  },
  {
    id: "wednesday", label: "Среда", tag: "Ср", dayType: "PULL", color: "#42C8F5",
    focus: "Спина + Бицепс",
    exercises: [
      { name: "Тяга верхнего блока параллельным хватом", sets: 4, reps: "8–12", weight: "75–85 кг", rest: 90, muscles: "Широчайшие, бицепс, задняя дельта", tips: "Тяни локтями вниз, не руками. Свести лопатки в конце." },
      { name: "Тяга горизонтального блока (широкий хват)", sets: 4, reps: "10–12", weight: "65–75 кг", rest: 90, muscles: "Средняя спина, ромбовидные", tips: "Широкий хват — акцент на верхнюю-среднюю спину. Не раскачивайся." },
      { name: "Тяга гантели одной рукой (опора)", sets: 3, reps: "12/ст.", weight: "36–40 кг", rest: 75, muscles: "Широчайшие, бицепс", tips: "Думай, что тянешь локтем к потолку. Не скручивай корпус." },
      { name: "Прямая тяга в кроссовере (нижний блок)", sets: 3, reps: "12–15", weight: "25–35 кг", rest: 60, muscles: "Нижняя часть широчайших", tips: "Руки прямые. Движение по дуге вниз к бёдрам." },
      { name: "Incline Curl (наклонная скамья)", sets: 4, reps: "10–12", weight: "14–18 кг", rest: 75, muscles: "Бицепс (длинная головка)", tips: "Лучшее упражнение для роста бицепса. Локти смотрят вниз, не вперёд." },
      { name: "EZ-штанга на скамье Скотта", sets: 3, reps: "10–12", weight: "25–30 кг", rest: 75, muscles: "Бицепс, брахиалис", tips: "Скамья Скотта исключает читинг. Работай честно." },
      { name: "Концентрированное сгибание", sets: 2, reps: "12", weight: "16–18 кг", rest: 60, muscles: "Бицепс (пик)", tips: "Локоть упирается в бедро и не двигается. Задержи наверху 2 сек." },
      { name: "Разгибание на блоке (прямой гриф)", sets: 2, reps: "15", weight: "30–40 кг", rest: 60, muscles: "Трицепс (все головки)", tips: "Локти прижаты к телу — якорь. Только предплечья двигаются." },
      { name: "Отжимания от скамьи", sets: 2, reps: "12–15", weight: "+20 кг", rest: 60, muscles: "Трицепс, нижняя грудь", tips: "Корпус вертикально и близко к скамье — акцент на трицепс." },
    ],
  },
  {
    id: "friday", label: "Пятница", tag: "Пт", dayType: "LEGS", color: "#F5A442",
    focus: "Ноги + Ягодицы + Добивка рук",
    exercises: [
      { name: "Жим ногами (широкая постановка)", sets: 4, reps: "10–12", weight: "260–320 кг", rest: 120, muscles: "Квадрицепс, ягодицы, внутренняя поверхность бедра", tips: "ВАЖНО: поясница плотно к спинке. Ноги широко, носки 45°." },
      { name: "Жим ногами (узкая постановка)", sets: 2, reps: "15", weight: "180–220 кг", rest: 90, muscles: "Квадрицепс (внешняя часть)", tips: "Ноги узко по центру, носки прямо. Колени не заваливаются." },
      { name: "Разгибания ног (пауза 1 сек наверху)", sets: 3, reps: "12–15", weight: "50–60 кг", rest: 60, muscles: "Квадрицепс", tips: "Пауза 1 сек наверху — ключевое! Медленно опускать (4 сек)." },
      { name: "Сгибания ног лёжа", sets: 3, reps: "12", weight: "55–65 кг", rest: 75, muscles: "Бицепс бедра", tips: "Таз прижат к скамье на протяжении всего подхода. Без рывков." },
      { name: "Ягодичный мост со штангой", sets: 4, reps: "10–12", weight: "60–80 кг", rest: 90, muscles: "Ягодицы, бицепс бедра", tips: "Подложи что-то мягкое под гриф. Не переразгибай поясницу." },
      { name: "Отведение ноги в кроссовере", sets: 3, reps: "15/ст.", weight: "20–25 кг", rest: 60, muscles: "Средняя и малая ягодичная", tips: "Корпус строго вертикально — только так изолируется ягодица." },
      { name: "Суперсет: Бицепс + Трицепс (блок)", sets: 3, reps: "12+12", weight: "15 / 35 кг", rest: 60, muscles: "Бицепс + Трицепс", tips: "Без отдыха между упражнениями. Отдых 60 сек между суперсетами." },
      { name: "Молотки + Французский жим сидя", sets: 2, reps: "12+12", weight: "18 / 26 кг", rest: 60, muscles: "Брахиалис + Длинная головка трицепса", tips: "Гантель двумя руками, опустить за голову — разогнуть. Локти не разводи." },
    ],
  },
];

// ─── AUDIO ─────────────────────────────────────────────────────────────────────
function playBeep(ctx, freq = 880, duration = 0.15, vol = 0.5) {
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    osc.type = "sine";
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch (e) {}
}

function playDone(ctx) {
  if (!ctx) return;
  [0, 0.2, 0.4].forEach((delay, i) => {
    setTimeout(() => playBeep(ctx, 523 + i * 262, 0.25, 0.7), delay * 1000);
  });
}

function playTick(ctx) {
  playBeep(ctx, 440, 0.06, 0.3);
}

// ─── REST TIMER ────────────────────────────────────────────────────────────────
function RestTimer({ seconds, onDone, color, audioCtx }) {
  const [left, setLeft] = useState(seconds);
  const ref = useRef(null);

  useEffect(() => { setLeft(seconds); }, [seconds]);

  useEffect(() => {
    if (left <= 0) {
      clearInterval(ref.current);
      playDone(audioCtx);
      setTimeout(onDone, 600);
      return;
    }
    ref.current = setInterval(() => {
      setLeft(p => {
        if (p <= 4 && p > 1) playTick(audioCtx);
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(ref.current);
  }, [left]);

  const pct = ((seconds - left) / seconds) * 100;
  const r = 54;
  const circ = 2 * Math.PI * r;
  const mins = Math.floor(left / 60);
  const secs = left % 60;

  return (
    <div style={{ textAlign: "center", padding: "24px 0 8px" }}>
      <div style={{ fontSize: 10, color: "#555", marginBottom: 14, letterSpacing: 1.5, fontFamily: "'Syne',sans-serif", fontWeight: 700 }}>ОТДЫХ</div>
      <div style={{ position: "relative", width: 130, height: 130, margin: "0 auto 20px" }}>
        <svg width="130" height="130" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="65" cy="65" r={r} fill="none" stroke="#1a1a1a" strokeWidth="7" />
          <circle cx="65" cy="65" r={r} fill="none" stroke={color} strokeWidth="7"
            strokeDasharray={circ}
            strokeDashoffset={circ * (1 - pct / 100)}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.95s linear" }}
          />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 32, color: "#f0f0f0", lineHeight: 1 }}>
            {mins > 0 ? `${mins}:${String(secs).padStart(2, "0")}` : secs}
          </div>
          <div style={{ fontSize: 9, color: "#444", marginTop: 4, letterSpacing: 1 }}>СЕК</div>
        </div>
      </div>
      <p style={{ fontSize: 11, color: "#444" }}>Звуковой сигнал когда время выйдет 🔔</p>
    </div>
  );
}

// ─── HOME ──────────────────────────────────────────────────────────────────────
function HomeScreen({ onStart }) {
  return (
    <div style={{ minHeight: "100vh", padding: "28px 16px 40px" }}>
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 24 }}>🏋️</span>
            <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 24, fontWeight: 800, letterSpacing: "-0.5px" }}>ТРЕНИРОВКИ</h1>
          </div>
          <p style={{ color: "#444", fontSize: 11 }}>PPL · Push / Pull / Legs · Грыжа — осевой нет</p>
        </div>

        {WORKOUT_DAYS.map((d, i) => (
          <button key={d.id} onClick={() => onStart(i)} style={{
            width: "100%", background: "#141414", border: `1.5px solid #1e1e1e`,
            borderRadius: 16, padding: "18px 16px", marginBottom: 12,
            cursor: "pointer", textAlign: "left", transition: "all .15s",
          }}
            onTouchStart={e => e.currentTarget.style.borderColor = d.color}
            onTouchEnd={e => e.currentTarget.style.borderColor = "#1e1e1e"}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 20, color: d.color }}>{d.tag}</span>
                  <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 15, color: "#e0e0e0" }}>{d.label}</span>
                  <span style={{ background: d.color + "22", color: d.color, border: `1px solid ${d.color}44`, borderRadius: 5, fontSize: 9, padding: "2px 7px", fontFamily: "'Syne',sans-serif", fontWeight: 700 }}>{d.dayType}</span>
                </div>
                <div style={{ fontSize: 11, color: "#555", marginBottom: 10 }}>{d.focus}</div>
                <div style={{ display: "flex", gap: 16 }}>
                  <span style={{ fontSize: 10, color: "#333" }}>{d.exercises.length} упр.</span>
                  <span style={{ fontSize: 10, color: "#333" }}>{d.exercises.reduce((a, e) => a + e.sets, 0)} подходов</span>
                  <span style={{ fontSize: 10, color: "#333" }}>~60 мин</span>
                </div>
              </div>
              <div style={{ background: d.color, color: "#0e0e0e", borderRadius: 10, padding: "10px 16px", fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 13, flexShrink: 0, marginLeft: 12 }}>
                ▶
              </div>
            </div>
          </button>
        ))}

        <div style={{ marginTop: 24, background: "#111", border: "1px solid #1a1a1a", borderRadius: 12, padding: 16 }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 10, fontWeight: 700, color: "#333", letterSpacing: 1, marginBottom: 10 }}>КАК ПОЛЬЗОВАТЬСЯ</div>
          {[
            "Выбери день → нажми ▶",
            "Читай описание упражнения",
            "Выполни подход → нажми ВЫПОЛНЕНО",
            "Таймер отдыха запустится автоматически",
            "Звуковой сигнал — пора следующий подход",
            "Держи экран включённым во время тренировки",
          ].map((t, i) => (
            <div key={i} style={{ display: "flex", gap: 10, padding: "6px 0", fontSize: 11, color: "#555", borderBottom: i < 5 ? "1px solid #1a1a1a" : "none" }}>
              <span style={{ color: "#C8F542", fontFamily: "'Syne',sans-serif", fontWeight: 800, flexShrink: 0 }}>{i + 1}</span>
              <span>{t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── DONE ──────────────────────────────────────────────────────────────────────
function DoneScreen({ day, onBack }) {
  const total = day.exercises.reduce((a, e) => a + e.sets, 0);
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", padding: 32, textAlign: "center" }}>
      <div style={{ fontSize: 72, marginBottom: 20 }}>🏆</div>
      <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, color: day.color, marginBottom: 8 }}>ГОТОВО!</h1>
      <p style={{ color: "#555", fontSize: 13, marginBottom: 4 }}>{day.label} — {day.dayType}</p>
      <p style={{ color: "#333", fontSize: 11, marginBottom: 36 }}>{day.exercises.length} упражнений · {total} подходов</p>
      <button onClick={onBack} style={{
        background: day.color, color: "#0e0e0e", border: "none",
        borderRadius: 14, padding: "16px 36px",
        fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 15, cursor: "pointer",
      }}>
        ← К ТРЕНИРОВКАМ
      </button>
    </div>
  );
}

// ─── WORKOUT ───────────────────────────────────────────────────────────────────
function WorkoutScreen({ day, onBack, audioCtx }) {
  const [exIdx, setExIdx] = useState(0);
  const [setsDone, setSetsDone] = useState(0);
  const [phase, setPhase] = useState("work");
  const [finished, setFinished] = useState(false);
  const [showPlan, setShowPlan] = useState(false);

  const ex = day.exercises[exIdx];
  const totalSets = day.exercises.reduce((a, e) => a + e.sets, 0);
  const doneSets = day.exercises.slice(0, exIdx).reduce((a, e) => a + e.sets, 0) + setsDone;
  const progress = Math.round((doneSets / totalSets) * 100);
  const isLastSet = setsDone + 1 >= ex.sets;
  const isLastEx = exIdx + 1 >= day.exercises.length;
  const nextEx = !isLastEx ? day.exercises[exIdx + 1] : null;

  function handleSetDone() {
    if (isLastSet && isLastEx) {
      playDone(audioCtx);
      setFinished(true);
      return;
    }
    setPhase("rest");
  }

  function handleRestDone() {
    if (isLastSet) {
      setExIdx(exIdx + 1);
      setSetsDone(0);
    } else {
      setSetsDone(setsDone + 1);
    }
    setPhase("work");
  }

  if (finished) return <DoneScreen day={day} onBack={onBack} />;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Top bar */}
      <div style={{
        background: "#111", borderBottom: "1px solid #1a1a1a",
        padding: "12px 16px", display: "flex", alignItems: "center", gap: 12,
        position: "sticky", top: 0, zIndex: 20,
      }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 20, padding: "2px 6px", lineHeight: 1 }}>←</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 13, color: day.color }}>{day.tag} {day.dayType}</div>
          <div style={{ fontSize: 10, color: "#333" }}>Упр. {exIdx + 1}/{day.exercises.length} · {progress}%</div>
        </div>
        <div style={{ width: 56, height: 5, background: "#222", borderRadius: 3, overflow: "hidden" }}>
          <div style={{ width: `${progress}%`, height: "100%", background: day.color, borderRadius: 3, transition: "width 0.4s" }} />
        </div>
        <button onClick={() => setShowPlan(!showPlan)} style={{ background: "none", border: "1px solid #222", color: "#555", cursor: "pointer", fontSize: 10, padding: "5px 9px", borderRadius: 7, fontFamily: "'Syne',sans-serif", fontWeight: 700 }}>
          {showPlan ? "✕" : "≡"}
        </button>
      </div>

      {/* Plan overlay */}
      {showPlan && (
        <div style={{ background: "#111", borderBottom: "1px solid #1a1a1a", padding: "10px 16px", maxHeight: "40vh", overflowY: "auto" }}>
          {day.exercises.map((e, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "7px 0", borderBottom: "1px solid #1a1a1a",
              cursor: i <= exIdx ? "pointer" : "default",
              opacity: i > exIdx ? 0.4 : 1,
            }}
              onClick={() => { if (i <= exIdx) { setExIdx(i); setSetsDone(0); setPhase("work"); setShowPlan(false); } }}
            >
              <div style={{
                width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                background: i < exIdx ? "#C8F542" : i === exIdx ? day.color : "#1a1a1a",
                border: `1.5px solid ${i < exIdx ? "#C8F542" : i === exIdx ? day.color : "#333"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 9, color: "#0e0e0e", fontFamily: "'Syne',sans-serif", fontWeight: 800,
              }}>
                {i < exIdx ? "✓" : i + 1}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, color: i === exIdx ? "#e0e0e0" : "#666", fontFamily: "'Syne',sans-serif", fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.name}</div>
                <div style={{ fontSize: 9, color: "#333" }}>{e.sets}×{e.reps} · {e.weight}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Content */}
      <div style={{ flex: 1, padding: "16px 16px 32px", maxWidth: 480, width: "100%", margin: "0 auto" }}>

        {phase === "work" ? (
          <>
            {/* Exercise card */}
            <div style={{ background: "#141414", border: `1.5px solid ${day.color}55`, borderRadius: 16, overflow: "hidden", marginBottom: 14 }}>
              <div style={{ background: day.color, padding: "12px 16px" }}>
                <div style={{ fontSize: 10, color: "#0e0e0e88", fontFamily: "'Syne',sans-serif", fontWeight: 700, letterSpacing: 0.5, marginBottom: 3 }}>
                  УПРАЖНЕНИЕ {exIdx + 1} / {day.exercises.length}
                </div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 16, color: "#0e0e0e", lineHeight: 1.25 }}>{ex.name}</div>
              </div>

              <div style={{ padding: 16 }}>
                {/* Sets dots */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <span style={{ fontSize: 10, color: "#444", marginRight: 2 }}>Подходы:</span>
                  {Array.from({ length: ex.sets }).map((_, i) => (
                    <div key={i} style={{
                      width: 11, height: 11, borderRadius: "50%",
                      background: i < setsDone ? "#C8F542" : "transparent",
                      border: `1.5px solid ${i < setsDone ? "#C8F542" : i === setsDone ? "#888" : "#333"}`,
                      transition: "all .2s",
                    }} />
                  ))}
                  <span style={{ fontSize: 11, color: "#666", marginLeft: 4 }}>{setsDone}/{ex.sets}</span>
                </div>

                {/* Stats */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
                  {[
                    { label: "ПОВТОРЕНИЙ", val: ex.reps },
                    { label: "ВЕС", val: ex.weight },
                    { label: "ОТДЫХ", val: `${ex.rest}с` },
                  ].map(({ label, val }) => (
                    <div key={label} style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 8, padding: "10px 6px", textAlign: "center" }}>
                      <div style={{ fontSize: 8, color: "#444", letterSpacing: 0.5, marginBottom: 4, fontFamily: "'Syne',sans-serif", fontWeight: 700 }}>{label}</div>
                      <div style={{ fontSize: 13, color: day.color, fontFamily: "'Syne',sans-serif", fontWeight: 800 }}>{val}</div>
                    </div>
                  ))}
                </div>

                {/* Muscles */}
                <div style={{ fontSize: 10, color: "#3a3a3a", marginBottom: 10 }}>
                  <span style={{ color: "#2a2a2a" }}>Мышцы: </span>{ex.muscles}
                </div>

                {/* Tips */}
                <div style={{ background: "#C8F54210", border: "1px solid #C8F54222", borderRadius: 8, padding: "10px 12px" }}>
                  <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 9, color: "#C8F542", letterSpacing: 0.5 }}>✦ ТЕХНИКА  </span>
                  <span style={{ fontSize: 11, color: "#8ab030", lineHeight: 1.6 }}>{ex.tips}</span>
                </div>
              </div>
            </div>

            {/* Next exercise hint */}
            {isLastSet && nextEx && (
              <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 10, padding: "9px 14px", marginBottom: 14, fontSize: 11, color: "#444" }}>
                Следующее: <span style={{ color: day.color }}>{nextEx.name}</span>
              </div>
            )}

            {/* CTA */}
            <button
              onClick={handleSetDone}
              style={{
                width: "100%", padding: "18px", background: day.color, color: "#0e0e0e",
                border: "none", borderRadius: 14, fontFamily: "'Syne',sans-serif",
                fontWeight: 800, fontSize: 16, cursor: "pointer", letterSpacing: 0.3,
                WebkitTapHighlightColor: "transparent",
              }}
            >
              {isLastSet && isLastEx ? "🏆 ПОСЛЕДНИЙ ПОДХОД!" : `ПОДХОД ${setsDone + 1}/${ex.sets} ВЫПОЛНЕН`}
            </button>
          </>
        ) : (
          <>
            {/* Rest phase */}
            <div style={{ background: "#141414", border: `1.5px solid ${day.color}33`, borderRadius: 16, padding: "20px 16px", marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: "#444", textAlign: "center", marginBottom: 2 }}>
                {ex.name}
              </div>
              <div style={{ fontSize: 10, color: "#333", textAlign: "center", marginBottom: 0 }}>
                Подход {setsDone + 1}/{ex.sets} выполнен ✓
              </div>
              <RestTimer
                key={`${exIdx}-${setsDone}`}
                seconds={ex.rest}
                onDone={handleRestDone}
                color={day.color}
                audioCtx={audioCtx}
              />
            </div>

            {/* Next info */}
            <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 10, padding: "12px 14px", marginBottom: 12 }}>
              <div style={{ fontSize: 9, color: "#333", marginBottom: 5, fontFamily: "'Syne',sans-serif", fontWeight: 700, letterSpacing: 1 }}>СЛЕДУЮЩИЙ</div>
              {!isLastSet ? (
                <div style={{ fontSize: 12, color: "#666" }}>{ex.name} · подход {setsDone + 2}/{ex.sets} · {ex.reps} повт · {ex.weight}</div>
              ) : nextEx ? (
                <div style={{ fontSize: 12, color: "#666" }}>→ <span style={{ color: day.color }}>{nextEx.name}</span> · {nextEx.sets}×{nextEx.reps} · {nextEx.weight}</div>
              ) : (
                <div style={{ fontSize: 12, color: "#C8F542" }}>🏆 Последнее упражнение!</div>
              )}
            </div>

            <button onClick={handleRestDone} style={{
              width: "100%", padding: "13px", background: "transparent", color: "#444",
              border: "1px solid #222", borderRadius: 10, fontFamily: "'DM Mono',monospace",
              fontSize: 12, cursor: "pointer", WebkitTapHighlightColor: "transparent",
            }}>
              Пропустить отдых →
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── ROOT ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("home");
  const [dayIdx, setDayIdx] = useState(null);
  const audioCtxRef = useRef(null);

  function startWorkout(idx) {
    // Init audio on user gesture (required by browsers)
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    } else if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    setDayIdx(idx);
    setScreen("workout");
  }

  const day = dayIdx !== null ? WORKOUT_DAYS[dayIdx] : null;

  return (
    <>
      {screen === "home" && <HomeScreen onStart={startWorkout} />}
      {screen === "workout" && day && (
        <WorkoutScreen
          key={dayIdx}
          day={day}
          onBack={() => setScreen("home")}
          audioCtx={audioCtxRef.current}
        />
      )}
    </>
  );
}
