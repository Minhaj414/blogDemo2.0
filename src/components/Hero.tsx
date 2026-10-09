import React from 'react';
import { Search, X } from 'lucide-react';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (c: string) => void;
  categories: string[];
  totalPosts: number;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  totalPosts,
}) => {
  return (
    <section className="py-14 md:py-20 border-b border-white/[0.08]">
      <div className="max-w-4xl mx-auto px-6 text-center">
        
        {/* Subtle, unboxed category descriptor */}
        <p className="text-xs uppercase tracking-widest font-medium text-emerald-400 mb-4">
          Independent Editorial Publishing
        </p>

        {/* Display headline */}
        <h1 className="font-editorial text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
          Ideas worth <span className="italic text-emerald-400">sharing.</span>
        </h1>

        <p className="text-base sm:text-lg text-stone-300 max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
          An ultra-fast publishing space for engineers, designers, and thinkers. Zero server delay, zero distractions, crafted for thoughtful minds.
        </p>

        {/* Instant Search Bar */}
        <div className="relative max-w-xl mx-auto mb-8">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-4 h-4 text-stone-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by title, topic, author or keyword…"
              className="w-full pl-11 pr-10 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-stone-100 placeholder:text-stone-400 text-sm focus:outline-none focus:border-emerald-400/80 focus:bg-white/[0.07] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 p-1 rounded-md text-stone-400 hover:text-white transition-colors"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Interactive Filter Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-emerald-400 text-stone-950 font-semibold shadow-sm'
                    : 'bg-white/5 text-stone-400 hover:text-stone-200 hover:bg-white/10 border border-white/5'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {searchQuery && (
          <p className="mt-4 text-xs text-stone-400">
            Showing results for &ldquo;{searchQuery}&rdquo; ({totalPosts} {totalPosts === 1 ? 'post' : 'posts'} found)
          </p>
        )}

      </div>
    </section>
  );
};
