export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-8 px-4 md:px-8 bg-[#0b0d1a]/50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
            <span className="text-[#0b0d1a] text-sm font-bold">C</span>
          </div>
          <span className="text-gold font-bold text-lg">CUKIMAI</span>
        </div>
        <div className="flex items-center gap-6 text-xs text-white/30">
          <span>Data: ExchangeRate-API · CoinGecko · Gold-API</span>
          <span>© 2026 CUKIMAI</span>
        </div>
        <div className="flex items-center gap-4 text-white/20">
          <a href="#" className="hover:text-white/40 transition-colors">Twitter</a>
          <a href="#" className="hover:text-white/40 transition-colors">GitHub</a>
          <a href="#" className="hover:text-white/40 transition-colors">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
}
