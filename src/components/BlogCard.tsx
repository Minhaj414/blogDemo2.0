import React from 'react';
import { BlogPost } from '../types';
import { Heart, ArrowUpRight } from 'lucide-react';

interface BlogCardProps {
  post: BlogPost;
  onRead: (id: string) => void;
  onLikeToggle?: (id: string) => void;
  isLiked?: boolean;
}

export const BlogCard: React.FC<BlogCardProps> = ({
  post,
  onRead,
  onLikeToggle,
  isLiked = false,
}) => {
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <article
      onClick={() => onRead(post.id)}
      className="group flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-[#1e1e24]/70 hover:bg-[#1e1e24] border border-white/[0.08] hover:border-emerald-500/30 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-xl hover:shadow-emerald-950/20"
    >
      <div>
        {/* Clean unboxed metadata with typographic separator - ZERO PILLS */}
        <div className="flex items-center gap-2 text-xs text-stone-400 mb-3.5 flex-wrap">
          <span className="font-medium text-emerald-400">{post.category}</span>
          <span aria-hidden="true">·</span>
          <span>{post.readTime} min read</span>
          <span aria-hidden="true">·</span>
          <span>{formattedDate}</span>
        </div>

        {/* Title */}
        <h2 className="font-editorial text-xl sm:text-2xl font-bold text-stone-100 group-hover:text-emerald-300 transition-colors tracking-tight line-clamp-2 leading-snug mb-3">
          {post.title}
        </h2>

        {/* Excerpt */}
        <p className="text-sm text-stone-400 line-clamp-3 leading-relaxed mb-6 font-normal">
          {post.excerpt}
        </p>
      </div>

      {/* Author line and interaction affordances */}
      <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-stone-400">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-stone-700 to-stone-500 text-stone-200 font-semibold text-[11px] flex items-center justify-center">
            {post.author.charAt(0)}
          </div>
          <span className="font-medium text-stone-300 group-hover:text-white transition-colors">
            {post.author}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {onLikeToggle && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLikeToggle(post.id);
              }}
              className={`flex items-center gap-1 p-1 rounded hover:bg-white/5 transition-colors cursor-pointer ${
                isLiked ? 'text-rose-400' : 'text-stone-400 hover:text-stone-200'
              }`}
              title={isLiked ? 'Unlike post' : 'Like post'}
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="tabular-nums font-mono text-[11px]">{post.likes}</span>
            </button>
          )}

          <span className="inline-flex items-center gap-0.5 text-emerald-400 font-medium group-hover:translate-x-0.5 transition-transform">
            <span>Read</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </article>
  );
};
