import React, { useState, useRef, useEffect } from 'react';
import { BlogPost, User } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';
import { calculateReadTime } from '../lib/storage';
import {
  Bold,
  Italic,
  Code,
  Link2,
  List,
  ListOrdered,
  Quote,
  Heading2,
  Heading3,
  Eye,
  Edit2,
  Trash2,
  ArrowLeft,
  Sparkles,
  Columns,
} from 'lucide-react';

interface DashboardProps {
  currentUser: User;
  posts: BlogPost[];
  onSavePost: (postData: Partial<BlogPost>) => void;
  onDeletePost: (id: string) => void;
  onNavigateHome: () => void;
  onReadPost: (id: string) => void;
  initialEditingPost?: BlogPost | null;
  onShowToast: (msg: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  currentUser,
  posts,
  onSavePost,
  onDeletePost,
  onNavigateHome,
  onReadPost,
  initialEditingPost = null,
  onShowToast,
}) => {
  const [editingId, setEditingId] = useState<string | null>(initialEditingPost?.id || null);
  const [title, setTitle] = useState(initialEditingPost?.title || '');
  const [content, setContent] = useState(initialEditingPost?.content || '');
  const [category, setCategory] = useState<BlogPost['category']>(initialEditingPost?.category || 'Engineering');
  const [activeTab, setActiveTab] = useState<'write' | 'preview' | 'split'>('write');

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync when initialEditingPost changes
  useEffect(() => {
    if (initialEditingPost) {
      setEditingId(initialEditingPost.id);
      setTitle(initialEditingPost.title);
      setContent(initialEditingPost.content);
      setCategory(initialEditingPost.category);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [initialEditingPost]);

  const authorPosts = posts.filter(
    (p) => p.userId === currentUser.id || p.author.toLowerCase() === currentUser.username.toLowerCase()
  );

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const estimatedReadTime = calculateReadTime(content);

  // Insert markdown syntax into textarea
  const insertFormatting = (prefix: string, suffix: string = '', defaultText: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end) || defaultText;

    const replacement = `${prefix}${selectedText}${suffix}`;
    const newContent = text.substring(0, start) + replacement + text.substring(end);

    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 10);
  };

  const handleEditClick = (p: BlogPost) => {
    setEditingId(p.id);
    setTitle(p.title);
    setContent(p.content);
    setCategory(p.category);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onShowToast(`Editing "${p.title.slice(0, 25)}..."`);
  };

  const [pendingDelete, setPendingDelete] = useState<{ id: string; title: string } | null>(null);

  const confirmDelete = () => {
    if (pendingDelete) {
      onDeletePost(pendingDelete.id);
      if (editingId === pendingDelete.id) {
        handleReset();
      }
      onShowToast('Article deleted successfully');
      setPendingDelete(null);
    }
  };

  const handleReset = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
    setCategory('Engineering');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      onShowToast('Please provide an article title');
      return;
    }
    if (!content.trim()) {
      onShowToast('Please write some content before publishing');
      return;
    }

    // Auto-generate excerpt from first clean sentence if not provided
    const cleanFirstLine = content
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/\*\*|`|\*|>|\-/g, '')
      .trim()
      .split('\n')[0] || '';
    const excerpt = cleanFirstLine.slice(0, 150) + (cleanFirstLine.length > 150 ? '…' : '');

    onSavePost({
      id: editingId || undefined,
      title: title.trim(),
      content: content.trim(),
      category,
      excerpt,
      readTime: estimatedReadTime,
      userId: currentUser.id,
      author: currentUser.name,
      authorRole: currentUser.role,
      authorEmail: currentUser.email,
    });

    onShowToast(editingId ? 'Article updated successfully!' : 'Article published live!');
    handleReset();
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-white/[0.08]">
        <div>
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-white transition-colors mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Feed</span>
          </button>
          <h1 className="font-editorial text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            My Workshop
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Publish, edit, and organize your architectural notes and devlogs.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-stone-400 block">Logged in as</span>
          <span className="text-sm font-semibold text-emerald-400">{currentUser.name}</span>
        </div>
      </div>

      {/* Editor Form */}
      <div className="rounded-2xl bg-[#1e1e24]/80 border border-white/[0.08] p-6 sm:p-8 mb-12 shadow-xl">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
          <h2 className="font-editorial text-xl font-bold text-stone-100 flex items-center gap-2">
            <span>{editingId ? 'Edit Post' : 'Compose New Article'}</span>
            {editingId && (
              <span className="text-xs font-mono font-normal text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                Editing Mode
              </span>
            )}
          </h2>

          {/* View Mode Tabs */}
          <div className="flex items-center bg-white/5 p-1 rounded-lg text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('write')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                activeTab === 'write' ? 'bg-white/10 text-white font-medium' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Write
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('split')}
              className={`hidden md:block px-3 py-1 rounded-md transition-colors cursor-pointer ${
                activeTab === 'split' ? 'bg-white/10 text-white font-medium' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Split View
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                activeTab === 'preview' ? 'bg-white/10 text-white font-medium' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Preview
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Metadata Row: Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            <div className="sm:col-span-2">
              <label htmlFor="post-title" className="block text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
                Post Title
              </label>
              <input
                id="post-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your article a compelling, clear title…"
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-stone-100 placeholder:text-stone-400 text-sm focus:outline-none focus:border-emerald-400/80 transition-all font-medium"
                required
              />
            </div>

            <div>
              <label htmlFor="post-category" className="block text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
                Category
              </label>
              <select
                id="post-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as BlogPost['category'])}
                className="w-full px-4 py-2.5 rounded-xl bg-[#1e1e24] border border-white/10 text-stone-100 text-sm focus:outline-none focus:border-emerald-400/80 transition-all cursor-pointer"
              >
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Systems">Systems</option>
                <option value="Architecture">Architecture</option>
                <option value="Philosophy">Philosophy</option>
                <option value="Culture">Culture</option>
              </select>
            </div>
          </div>

          {/* Formatting Toolbar */}
          <div className="flex flex-wrap items-center gap-1 p-2 rounded-t-xl bg-white/[0.03] border border-white/10 border-b-0 text-stone-300">
            <button
              type="button"
              onClick={() => insertFormatting('## ', '', 'Section Heading')}
              className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              title="Heading 2"
            >
              <Heading2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('### ', '', 'Subsection Heading')}
              className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              title="Heading 3"
            >
              <Heading3 className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-white/10 mx-1" />
            <button
              type="button"
              onClick={() => insertFormatting('**', '**', 'bold text')}
              className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              title="Bold (Ctrl+B)"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('*', '*', 'italic text')}
              className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              title="Italic (Ctrl+I)"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('`', '`', 'inline code')}
              className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              title="Inline Code"
            >
              <Code className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-white/10 mx-1" />
            <button
              type="button"
              onClick={() => insertFormatting('[', '](https://example.com)', 'link label')}
              className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              title="Hyperlink"
            >
              <Link2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('> ', '', 'Quoted thought')}
              className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              title="Blockquote"
            >
              <Quote className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('- ', '', 'List item')}
              className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('1. ', '', 'Numbered item')}
              className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              title="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('```typescript\n', '\n```', '// Code snippet here')}
              className="px-2 py-1 text-xs rounded hover:bg-white/10 hover:text-white transition-colors font-mono cursor-pointer"
              title="Code Block"
            >
              {'{ }'}
            </button>

            {/* Live Stats */}
            <div className="ml-auto flex items-center gap-3 text-[11px] text-stone-400 font-mono">
              <span>{wordCount} words</span>
              <span>·</span>
              <span>~{estimatedReadTime} min read</span>
            </div>
          </div>

          {/* Editor Body */}
          {activeTab === 'split' ? (
            <div className="grid grid-cols-2 gap-4 border border-white/10 rounded-b-xl p-3 bg-white/[0.02]">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your article in Markdown..."
                rows={16}
                className="w-full p-3 rounded-lg bg-[#141417] text-stone-100 placeholder:text-stone-400 text-sm focus:outline-none font-mono resize-y leading-relaxed"
                required
              />
              <div className="p-4 rounded-lg bg-[#141417] overflow-y-auto max-h-[460px] border border-white/5">
                <MarkdownRenderer content={content || '*Live preview appears here as you write…*'} enableDropCap={false} />
              </div>
            </div>
          ) : activeTab === 'preview' ? (
            <div className="p-6 rounded-b-xl bg-[#141417] border border-white/10 min-h-[360px] max-h-[500px] overflow-y-auto">
              <MarkdownRenderer content={content || '*Nothing to preview yet. Start typing!*'} enableDropCap={true} />
            </div>
          ) : (
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your article in Markdown. Use headings, lists, blockquotes, code blocks, and reflections..."
              rows={14}
              className="w-full p-4 rounded-b-xl bg-[#141417] border border-white/10 text-stone-100 placeholder:text-stone-400 text-sm focus:outline-none focus:border-emerald-400/80 transition-all font-mono leading-relaxed"
              required
            />
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
            <div className="text-xs text-stone-400">
              Supports full Markdown with drop caps, code syntax, blockquotes, and tables.
            </div>

            <div className="flex items-center gap-3">
              {editingId && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 text-xs font-semibold text-stone-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel Edit
                </button>
              )}
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-stone-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-colors cursor-pointer shadow-md shadow-emerald-500/20"
              >
                {editingId ? 'Save Changes' : 'Publish Article'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Your Published Articles List */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-editorial text-2xl font-bold text-white tracking-tight">
            Your Articles ({authorPosts.length})
          </h2>
        </div>

        {authorPosts.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <Sparkles className="w-8 h-8 text-stone-400 mx-auto mb-3" />
            <p className="text-base font-medium text-stone-300">You haven&apos;t published any articles yet.</p>
            <p className="text-xs text-stone-400 mt-1">
              Use the workshop editor above to publish your first piece to the world.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {authorPosts.map((post) => (
              <div
                key={post.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-[#1e1e24]/70 hover:bg-[#1e1e24] border border-white/[0.08] transition-all"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-[11px] text-stone-400 mb-1">
                    <span className="text-emerald-400 font-medium uppercase">{post.category}</span>
                    <span>·</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    <span>·</span>
                    <span>{post.readTime} min read</span>
                  </div>
                  <h3
                    onClick={() => onReadPost(post.id)}
                    className="font-editorial text-lg font-bold text-stone-100 hover:text-emerald-300 transition-colors cursor-pointer truncate"
                  >
                    {post.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => onReadPost(post.id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white transition-colors cursor-pointer"
                    title="Read post"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => handleEditClick(post)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-white/5 hover:bg-white/10 text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                    title="Edit post"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => setPendingDelete({ id: post.id, title: post.title })}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 transition-colors cursor-pointer"
                    title="Delete post"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      {pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-[#1e1e24] border border-white/10 p-6 shadow-2xl text-center">
            <h3 className="font-editorial text-lg font-bold text-white mb-2">Delete Article?</h3>
            <p className="text-xs text-stone-300 mb-6 leading-relaxed">
              Are you sure you want to permanently delete &ldquo;{pendingDelete.title}&rdquo;?
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setPendingDelete(null)}
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

    </div>
  );
};
