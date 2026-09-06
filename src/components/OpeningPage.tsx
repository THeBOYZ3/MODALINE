import AnimatedContent from "@/components/AnimatedContent";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import SplitText from "@/components/SplitText";
import Ballpit from "@/components/Ballpit";
import FlowingMenu from "@/components/FlowingMenu";
import BlobCursor from "@/components/BlobCursor";

const demoItems = [
  { link: '#shop', text: 'Black Edition', image: '/images/products/black.png' },
  { link: '#shop', text: 'Navy Blue', image: '/images/products/navy_blue.png' },
  { link: '#shop', text: 'Royal Blue', image: '/images/products/Blue.png' },
  { link: '#shop', text: 'Pure White', image: '/images/products/white.png' }
];

interface OpeningPageProps {
  onEnter: () => void;
}

export default function OpeningPage({ onEnter }: OpeningPageProps) {
  const playExploreSound = () => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const now = ctx.currentTime;

      // Primary tone: smooth ascending frequency ramp for a sleek transition chime
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(520, now);
      osc1.frequency.exponentialRampToValueAtTime(1040, now + 0.12);
      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.25);

      // Secondary tone: warm bass pop for tactile click feedback
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(260, now);
      osc2.frequency.exponentialRampToValueAtTime(130, now + 0.15);
      gain2.gain.setValueAtTime(0.2, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now);
      osc2.stop(now + 0.15);
    } catch (e) {
      console.warn("Audio play failed:", e);
    }
  };

  const handleClick = () => {
    playExploreSound();
    setTimeout(() => {
      onEnter();
    }, 120);
  };

  const words = [
    {
      text: "Designed",
    },
    {
      text: "For",
    },
    {
      text: "Style.",
      className: "text-blue-500 dark:text-blue-500",
    },
    {
      text: "Made",
    },
    {
      text: "Comfortable.",
    },
  ];

  return (
    // Main wrapper: min 200vh height to allow 2 pages, background #0CC0DF
    <main className="relative w-full min-h-[200vh] bg-[#0CC0DF] flex flex-col selection:bg-blue-500/30">
      <BlobCursor
        blobType="circle"
        fillColor="#00deff"
        trailCount={3}
        sizes={[22,125,75]}
        innerSizes={[20,35,25]}
        innerColor="#ffffff"
        opacities={[0.6,0.6,0.6]}
        shadowColor="#1100eb"
        shadowBlur={5}
        shadowOffsetX={10}
        shadowOffsetY={10}
        filterStdDeviation={30}
        useFilter={true}
        fastDuration={0.1}
        slowDuration={0.5}
        zIndex={100}
      />

      {/* Background Ballpit Layer (Behind Text) */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-85 overflow-hidden">
        <Ballpit
          count={25}
          gravity={0}
          friction={0.985}
          wallBounce={0.35}
          followCursor
          colors={["#0063ff", "#ffffff", "#000000"]}
          className="w-full h-full"
        />
      </div>

      {/* Page 1: Main Intro Content */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center w-full px-4">
        <AnimatedContent
          distance={120}
          direction="vertical"
          reverse={false}
          duration={1.0}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          scale={1}
          threshold={0.1}
          delay={0.1}
          className="relative z-10 flex flex-col items-center justify-center w-full max-w-7xl px-4 gap-8 sm:gap-10 my-auto"
        >
          {/* 2. Main Text: Modaline Brand Typography */}
          <div className="relative w-full flex items-center justify-center px-4 max-w-full">
            <SplitText
              text="MODALINE"
              tag="h1"
              className="font-anton text-white uppercase text-center leading-none select-none tracking-normal text-[clamp(36px,11.5vw,200px)] max-w-full"
              delay={50}
              duration={1.25}
              splitType="chars"
            />
          </div>

          <div className="flex flex-col items-center justify-center font-montserrat">
            <TypewriterEffectSmooth words={words} className="font-montserrat" />
          </div>

          {/* 3. Launch/Start Button */}
          <button
            onClick={handleClick}
            className="flex justify-center gap-2 items-center mx-auto shadow-xl text-lg bg-gray-50 backdrop-blur-md lg:font-semibold isolation-auto border-gray-50 before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-blue-500 hover:text-gray-50 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative z-30 px-6 py-2.5 overflow-hidden border-2 rounded-full group cursor-pointer"
          >
            Explore
            <svg
              className="w-8 h-8 justify-end group-hover:rotate-90 group-hover:bg-gray-50 text-gray-50 ease-linear duration-300 rounded-full border border-gray-700 group-hover:border-none p-2 rotate-45"
              viewBox="0 0 16 19"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
                className="fill-gray-800 group-hover:fill-gray-800"
              ></path>
            </svg>
          </button>
        </AnimatedContent>
      </section>

      {/* Page 2: FlowingMenu Section */}
      <section className="relative z-10 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        <div className="w-full h-full relative">
          <FlowingMenu
            items={demoItems}
            speed={15}
            textColor="#ffffff"
            bgColor="transparent"
            marqueeBgColor="#ffffff"
            marqueeTextColor="#120F17"
            borderColor="transparent"
          />
        </div>
      </section>

      {/* Foreground Ballpit Layer (In Front of Text) */}
      <div className="fixed inset-0 z-20 pointer-events-none opacity-85 overflow-hidden">
        <Ballpit
          count={25}
          gravity={0}
          friction={0.985}
          wallBounce={0.35}
          followCursor
          colors={["#0063ff", "#ffffff", "#000000"]}
          className="w-full h-full"
        />
      </div>
    </main>
  );
}
