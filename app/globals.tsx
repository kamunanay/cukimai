@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
  }
}

@layer base {
  * { @apply border-border; }
  body { 
    @apply bg-[#070912] text-foreground; 
    overflow-x: hidden;
    font-feature-settings: "ss01" on, "calt" on;
  }
}

@layer utilities {
  .glass {
    background: rgba(255, 255, 255, 0.04);
    backdrop-filter: blur(24px) saturate(1.6);
    -webkit-backdrop-filter: blur(24px) saturate(1.6);
    border: 1px solid rgba(255, 255, 255, 0.06);
  }
  .glass-gold {
    background: rgba(245, 200, 66, 0.06);
    backdrop-filter: blur(24px) saturate(1.6);
    -webkit-backdrop-filter: blur(24px) saturate(1.6);
    border: 1px solid rgba(245, 200, 66, 0.12);
  }
  .bg-gradient-primary {
    background: radial-gradient(ellipse at 20% 30%, #1a1f3a, #0b0d1a 70%, #05070e);
  }
}

::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
::-webkit-scrollbar-thumb { background: rgba(245,200,66,0.3); border-radius: 99px; }
::-webkit-scrollbar-thumb:hover { background: rgba(245,200,66,0.6); }

::selection { background: rgba(245, 200, 66, 0.25); color: #fff; }
