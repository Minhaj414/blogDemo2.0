import React, { useEffect, useState } from 'react';
import { BlogPost, User } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';
import { ArrowLeft, Heart, Share2, Edit3, Trash2, Clock, Calendar, Check } from 'lucide-react';

interface BlogViewProps {
  post: BlogPost;
  currentUser: User | null;
  onBack: () => void;
  onEdit: (post: BlogPost) => void;
  onDelete: (postId: string) => void;
  onLikeToggle: (postId: string) => void;
  isLiked: boolean;
  relatedPosts: BlogPost[];
  onSelectRelated: (postId: string) => void;
  onShowToast: (msg: string) => void;
}

export const BlogView: React.FC<BlogViewProps> = ({
  post,
  currentUser,
  onBack,
  onEdit,
  onDelete,
  onLikeToggle,
  isLiked,
  relatedPosts,
  onSelectRelated,
  onShowToast,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copiedShare, setCopiedShare] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });

    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        setScrollProgress((window.scrollY / total) * 100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [post.id]);

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const isOwner = currentUser && (currentUser.id === post.userId || currentUser.username === post.author.toLowerCase());

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      onShowToast('Link copied to clipboard');
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const confirmDelete = () => {
    setShowDeleteConfirm(false);
    onDelete(post.id);
    onShowToast('Article deleted');
  };

  return (
    <div className="relative">
      {/* Reading Progress Indicator */}
      <div
        className="fixed top-0 left-0 h-1 bg-emerald-400 z-50 transition-all duration-75"
        style={{ width: `${scrollProgress}%` }}
      />

      <article className="max-w-3xl mx-auto px-6 py-10 sm:py-16">
        
        {/* Navigation & Controls Bar */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/[0.08]">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-medium text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Feed</span>
          </button>

          <div className="flex items-center gap-2">
            {/* Owner Actions */}
            {isOwner && (
              <div className="flex items-center gap-1.5 mr-2 pr-2 border-r border-white/10">
                <button
                  onClick={() => onEdit(post)}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-md bg-white/5 hover:bg-white/10 text-stone-200 hover:text-white transition-colors cursor-pointer"
                  title="Edit article"
                >
                  <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-md bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 transition-colors cursor-pointer"
                  title="Delete article"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            )}

            {/* Like */}
            <button
              onClick={() => onLikeToggle(post.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                isLiked
                  ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                  : 'bg-white/5 text-stone-300 hover:text-white hover:bg-white/10'
              }`}
              title={isLiked ? 'Unlike' : 'Like this post'}
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current text-rose-400' : ''}`} />
              <span className="tabular-nums font-mono">{post.likes}</span>
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg bg-white/5 text-stone-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Share article"
            >
              {copiedShare ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Article Header */}
        <header className="mb-12">
          {/* Unboxed Metadata Line */}
          <div className="flex items-center gap-2 text-xs text-stone-400 mb-4 flex-wrap">
            <span className="font-semibold text-emerald-400 uppercase tracking-wider">{post.category}</span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3 h-3 text-stone-400" />
              <span>{post.readTime} min read</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3 h-3 text-stone-400" />
              <span>{formattedDate}</span>
            </span>
          </div>

          <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.15] mb-6">
            {post.title}
          </h1>

          {/* Author Byline */}
          <div className="flex items-center gap-3.5 pt-4 border-t border-white/5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 text-stone-950 font-bold text-sm flex items-center justify-center">
              {post.author.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-semibold text-stone-100">{post.author}</p>
              <p className="text-xs text-stone-400">{post.authorRole || 'Contributing Author'}</p>
            </div>
          </div>
        </header>

        {/* Rendered Markdown Body */}
        <div className="text-stone-300 leading-relaxed">
          <MarkdownRenderer content={post.content} enableDropCap={true} />
        </div>

        {/* Author Bio Card */}
        <div className="mt-16 pt-8 border-t border-white/10 bg-white/[0.02] p-6 sm:p-8 rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 text-stone-950 font-bold text-base flex items-center justify-center shrink-0">
              {post.author.charAt(0)}
            </div>
            <div className="flex-1">
              <h3 className="font-editorial text-lg font-bold text-stone-100">
                Written by {post.author}
              </h3>
              <p className="text-xs text-emerald-400 mb-2 font-medium">
                {post.authorRole || 'Author on Blogify'}
              </p>
              <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                Dedicated to crafting thoughtful prose, systems architecture, and sharing engineering discoveries with the global community.
              </p>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 pt-10 border-t border-white/10">
            <h3 className="font-editorial text-2xl font-bold text-stone-100 mb-6">
              More from Blogify
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedPosts.map((rPost) => (
                <div
                  key={rPost.id}
                  onClick={() => onSelectRelated(rPost.id)}
                  className="p-5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-emerald-500/20 transition-all cursor-pointer group"
                >
                  <p className="text-[11px] font-medium text-emerald-400 mb-1.5 uppercase tracking-wider">
                    {rPost.category}
                  </p>
                  <h4 className="font-editorial text-base font-bold text-stone-200 group-hover:text-emerald-300 transition-colors line-clamp-2 mb-2">
                    {rPost.title}
                  </h4>
                  <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                    {rPost.excerpt}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-2xl bg-[#1e1e24] border border-white/10 p-6 shadow-2xl text-center">
              <h3 className="font-editorial text-lg font-bold text-white mb-2">Delete Article?</h3>
              <p className="text-xs text-stone-300 mb-6 leading-relaxed">
                Are you sure you want to permanently delete this article? This action cannot be undone.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-rose-500 hover:bg-rose-600 text-white transition-colors cursor-pointer shadow-md shadow-rose-500/20"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </article>
    </div>
  );
};
