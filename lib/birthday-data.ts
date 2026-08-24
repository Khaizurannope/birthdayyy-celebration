export const birthdayData = {
  recipientName: "Zulfa",
  nickname: "Zulfa",
  birthday: "26 August 2007",
  age: 19,
  meetingDate: "21 June 2026",
  meetingTime: "4:00 PM",
  password: "26082007",
  timeline: [
    ["21.06.26", "The day our little story quietly began."],
    ["04.07.26", "A hundred conversations, and still never enough."],
    ["Today", "Your nineteenth chapter — and every chapter after this."],
  ],

  gallery: [
    {
      title: "Grace",
      note: "Elegance that never asks to be noticed.",
      tone: "red",
      image: "/images/foto1.jpeg",
    },
    {
      title: "Lovely",
      note: "Beautiful in the simplest way.",
      tone: "cream",
      image: "/images/foto2.jpeg",
    },
    {
      title: "Poise",
      note: "Quiet confidence, beautifully yours.",
      tone: "dark",
      image: "/images/foto3.jpeg",
    },
    {
      title: "Wonder",
      note: "There is always more to admire in you.",
      tone: "red",
      image: "/images/foto4.jpeg",
    },
    {
      title: "Ease",
      note: "Somehow, you make everything feel lighter",
      tone: "cream",
      image: "/images/foto5.jpeg",
    },
    {
      title: "Muse",
      note: "You inspire more than you know.",
      tone: "dark",
      image: "/images/foto6.jpeg",
    },
    {
      title: "Cute",
      note: "Soft enough to make me smile.",
      tone: "red",
      image: "/images/foto7.jpeg",
    },
    {
      title: "Uncommon",
      note: "There is something about you that feels rare.",
      tone: "cream",
      image: "/images/foto8.jpeg",
    },
    {
      title: "Warmth.",
      note: "You make quiet moments feel warm.",
      tone: "dark",
      image: "/images/foto9.jpeg",
    },
  ],

  questions: [
    {
      prompt: "What is my favorite thing about you?",
      options: ["Your laugh", "Everything, obviously", "Your kindness"],
      answer: 1,
    },
    {
      prompt: "When did our story begin?",
      options: ["21 June 2026", "Somewhere in a dream", "Tomorrow"],
      answer: 0,
    },
    {
      prompt: "What do I wish for you today?",
      options: ["More ordinary days", "A life full of light", "Both, always"],
      answer: 2,
    },
  ],
} as const;
