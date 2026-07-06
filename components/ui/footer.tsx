export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-8 px-4 md:px-8 bg-[#0b0d1a]/50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
            <span className="text-[#0b0d1a] text-sm font-bold">C</span>
          </div>
          <span className="text-gold font-bold text-lg">CUKIMAI</span>
        </div>

        {/* API Credits */}
        <div className="flex items-center gap-6 text-xs text-white/30">
          <span>Data: ExchangeRate-API · CoinGecko · Gold-API</span>
          <span>© 2026 CUKIMAI</span>
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-4 text-white/30 text-sm">
          {/* Telegram */}
          <a
            href="https://t.me/GlitchMusee"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gold transition-colors flex items-center gap-1.5 group"
          >
            <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.02-.14-.1-.2-.12-.06-.28-.04-.4-.02-.16.02-2.64 1.68-3.45 2.19-.32.22-.61.33-.88.33-.29 0-.85-.17-1.26-.31-.5-.18-1.01-.46-.9-.82.06-.2.31-.4.94-.69 3.07-1.34 5.12-2.22 6.15-2.64 2.93-1.2 3.54-1.41 3.94-1.42.09 0 .28.02.4.15.11.12.13.28.14.41-.01.16-.01.34-.01.51z"/>
            </svg>
            <span className="hover:text-gold transition-colors">@GlitchMusee</span>
          </a>

          <span className="text-white/10">|</span>

          {/* GitHub */}
          <a
            href="https://github.com/Glitch-Muse"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gold transition-colors flex items-center gap-1.5 group"
          >
            <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.205 11.387.6.113.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.468-2.381 1.235-3.221-.123-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.241 2.874.118 3.176.77.84 1.233 1.911 1.233 3.221 0 4.609-2.804 5.624-5.476 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .321.214.696.825.577C20.565 21.795 24 17.298 24 12c0-6.627-5.373-12-12-12z"/>
            </svg>
            <span className="hover:text-gold transition-colors">Glitch-Muse</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
