import React from 'react';
import { ExternalLink, Github, Linkedin, Globe } from 'lucide-react';

interface FooterProps {
  onSelectCategory: (cat: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory }) => {
  return (
    <footer className="mt-24 border-t border-white/[0.08] bg-[#141417]/80 text-stone-400 text-xs">
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Brand & Mission */}
        <div className="md:col-span-2">
          <h3 className="font-editorial text-2xl font-bold text-white mb-3 tracking-tight">
            Blogify<span className="text-emerald-400">.</span>
          </h3>
          <p className="text-stone-400 max-w-sm leading-relaxed mb-4 text-xs sm:text-sm">
            An independent, zero-latency publishing platform for engineers, creators, and architects. Designed for clean thought, deep focus, and timeless prose.
          </p>
          <p className="text-[11px] text-stone-400">
            &copy; 2026 Blogify &mdash; Built with craft by{' '}
            <a
              href="https://minhaj414.github.io/portfolio2/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 font-medium underline underline-offset-2"
            >
              MJM. Minhaj
            </a>
          </p>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-200 mb-3">
            Topics
          </h4>
          <ul className="space-y-2 text-stone-400">
            {['Engineering', 'Design', 'Systems', 'Architecture', 'Philosophy', 'Culture'].map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => {
                    onSelectCategory(cat);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Developer & Creator Connect */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-200 mb-3">
            Developer
          </h4>
          <ul className="space-y-2.5">
            <li>
              <a
                href="https://minhaj414.github.io/portfolio2/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Portfolio Website</span>
                <ExternalLink className="w-3 h-3 text-stone-400 ml-auto" />
              </a>
            </li>
            <li>
              <a
                href="https://github.com/minhaj414"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub Profile</span>
                <ExternalLink className="w-3 h-3 text-stone-400 ml-auto" />
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/minhaj-it/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
                <ExternalLink className="w-3 h-3 text-stone-400 ml-auto" />
              </a>
            </li>
          </ul>
        </div>

      </div>
    </footer>
  );
};
