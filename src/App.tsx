import React, { useState, useEffect, useMemo } from 'react';
import { BlogPost, User, ViewMode } from './types';
import {
  getStoredPosts,
  savePosts,
  getCurrentUser,
  setCurrentUser,
  getLikedPostIds,
  togglePostLike,
} from './lib/storage';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { BlogCard } from './components/BlogCard';
import { BlogView } from './components/BlogView';
import { Dashboard } from './components/Dashboard';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function App() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [view, setView] = useState<ViewMode>('feed');
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(true);

  // Initial load
  useEffect(() => {
    const loadedPosts = getStoredPosts();
    const loadedUser = getCurrentUser();
    const loadedLikes = getLikedPostIds();
    setPosts(loadedPosts);
    setCurrentUserState(loadedUser);
    setLikedIds(loadedLikes);

    const savedTheme = localStorage.getItem('blogify_theme') || 'dark';
    const isDarkMode = savedTheme === 'dark';
    setIsDark(isDarkMode);
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, []);

  const handleToggleTheme = () => {
    const nextIsDark = !isDark;
    setIsDark(nextIsDark);
    const themeName = nextIsDark ? 'dark' : 'light';
    localStorage.setItem('blogify_theme', themeName);
    document.documentElement.setAttribute('data-theme', themeName);
    showToast(`Switched to ${nextIsDark ? 'Dark' : 'Light'} theme`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3000);
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentUserState(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentUserState(null);
    showToast('Signed out successfully');
    if (view === 'dashboard') {
      setView('feed');
    }
  };

  // Like Toggle
  const handleLikeToggle = (postId: string) => {
    const { liked } = togglePostLike(postId);
    const nextLikes = liked ? [...likedIds, postId] : likedIds.filter((id) => id !== postId);
    setLikedIds(nextLikes);

    setPosts((prevPosts) =>
      prevPosts.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            likes: liked ? p.likes + 1 : Math.max(0, p.likes - 1),
          };
        }
        return p;
      })
    );
  };

  // CRUD Operations
  const handleSavePost = (postData: Partial<BlogPost>) => {
    let nextPosts: BlogPost[];
    if (postData.id) {
      // Update existing
      nextPosts = posts.map((p) =>
        p.id === postData.id
          ? {
              ...p,
              ...postData,
              updatedAt: new Date().toISOString(),
            } as BlogPost
          : p
      );
    } else {
      // Create new
      const newPost: BlogPost = {
        id: `post-${Date.now()}`,
        userId: currentUser?.id || 'anonymous',
        author: currentUser?.name || 'Anonymous Writer',
        authorRole: currentUser?.role || 'Author',
        authorEmail: currentUser?.email,
        title: postData.title || 'Untitled Post',
        content: postData.content || '',
        excerpt: postData.excerpt || '',
        category: postData.category || 'Engineering',
        readTime: postData.readTime || 3,
        likes: 0,
        views: 1,
        createdAt: new Date().toISOString(),
      };
      nextPosts = [newPost, ...posts];
    }

    setPosts(nextPosts);
    savePosts(nextPosts);
    setEditingPost(null);
  };

  const handleDeletePost = (postId: string) => {
    const nextPosts = posts.filter((p) => p.id !== postId);
    setPosts(nextPosts);
    savePosts(nextPosts);
    if (selectedPostId === postId) {
      setView('feed');
      setSelectedPostId(null);
    }
  };

  const handleReadPost = (postId: string) => {
    setSelectedPostId(postId);
    setView('read');
  };

  const handleStartEdit = (post: BlogPost) => {
    setEditingPost(post);
    setView('dashboard');
  };

  // Filtered Posts
  const categories = ['All', 'Engineering', 'Design', 'Systems', 'Architecture', 'Philosophy', 'Culture'];

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      const matchesSearch =
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.author.toLowerCase().includes(q) ||
        post.content.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  const activePost = useMemo(() => {
    return posts.find((p) => p.id === selectedPostId) || posts[0] || null;
  }, [posts, selectedPostId]);

  const relatedPosts = useMemo(() => {
    if (!activePost) return [];
    return posts
      .filter((p) => p.id !== activePost.id && (p.category === activePost.category || p.userId === activePost.userId))
      .slice(0, 4);
  }, [posts, activePost]);

  // Lead / Featured Post (first in filtered list)
  const leadPost = filteredPosts[0];
  const secondaryPosts = filteredPosts.slice(1);

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-200">
      
      {/* Navbar (3-zone contract) */}
      <Navbar
        currentUser={currentUser}
        onNavigate={(newView) => {
          setView(newView);
          if (newView === 'dashboard') {
            setEditingPost(null);
          }
        }}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setView('feed');
        }}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        currentView={view}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {view === 'feed' && (
          <div>
            {/* Hero Section */}
            <Hero
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              categories={categories}
              totalPosts={filteredPosts.length}
            />

            {/* Articles Showcase */}
            <section className="max-w-6xl mx-auto px-6 py-12 md:py-16">
              {filteredPosts.length === 0 ? (
                <div className="text-center py-20 px-4 rounded-2xl border border-white/5 bg-white/[0.02]">
                  <Sparkles className="w-8 h-8 text-stone-400 mx-auto mb-3" />
                  <h3 className="font-editorial text-2xl font-bold text-white mb-2">No articles match your query</h3>
                  <p className="text-stone-400 text-sm max-w-md mx-auto mb-6">
                    Try searching for another term or clear your active category filters to explore all pieces.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-950 bg-emerald-400 hover:bg-emerald-300 transition-colors cursor-pointer"
                  >
                    Reset Search & Filters
                  </button>
                </div>
              ) : (
                <div className="space-y-12">
                  
                  {/* Lead Featured Story (when not actively searching) */}
                  {!searchQuery && leadPost && (
                    <div
                      onClick={() => handleReadPost(leadPost.id)}
                      className="group p-8 md:p-10 rounded-3xl bg-[#1e1e24]/90 border border-white/10 hover:border-emerald-500/40 transition-all cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-emerald-950/20"
                    >
                      <div className="max-w-3xl">
                        {/* Unboxed Metadata Line - Zero Pills */}
                        <div className="flex items-center gap-2 text-xs text-stone-400 mb-4 flex-wrap">
                          <span className="font-semibold text-emerald-400 uppercase tracking-wider">{leadPost.category}</span>
                          <span aria-hidden="true">·</span>
                          <span>Lead Story</span>
                          <span aria-hidden="true">·</span>
                          <span>{leadPost.readTime} min read</span>
                          <span aria-hidden="true">·</span>
                          <span>{new Date(leadPost.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>

                        <h2 className="font-editorial text-2xl sm:text-3xl md:text-4xl font-extrabold text-white group-hover:text-emerald-300 transition-colors tracking-tight leading-[1.2] mb-4">
                          {leadPost.title}
                        </h2>

                        <p className="text-stone-300 text-sm sm:text-base leading-relaxed mb-6 font-normal">
                          {leadPost.excerpt}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 text-stone-950 font-bold text-xs flex items-center justify-center">
                              {leadPost.author.charAt(0)}
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-white">{leadPost.author}</p>
                              <p className="text-[11px] text-stone-400">{leadPost.authorRole || 'Author'}</p>
                            </div>
                          </div>

                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform">
                            <span>Read Lead Story</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Secondary Articles Grid */}
                  <div>
                    <div className="flex items-center justify-between mb-8 pb-3 border-b border-white/[0.08]">
                      <h2 className="font-editorial text-2xl font-bold text-white tracking-tight">
                        {searchQuery ? 'Search Results' : 'Recent Dispatches'}
                      </h2>
                      <span className="text-xs text-stone-400 font-mono">
                        {filteredPosts.length} articles
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {(searchQuery ? filteredPosts : secondaryPosts).map((post) => (
                        <BlogCard
                          key={post.id}
                          post={post}
                          onRead={handleReadPost}
                          onLikeToggle={handleLikeToggle}
                          isLiked={likedIds.includes(post.id)}
                        />
                      ))}
                    </div>
                  </div>

                </div>
              )}
            </section>
          </div>
        )}

        {view === 'read' && activePost && (
          <BlogView
            post={activePost}
            currentUser={currentUser}
            onBack={() => setView('feed')}
            onEdit={handleStartEdit}
            onDelete={handleDeletePost}
            onLikeToggle={handleLikeToggle}
            isLiked={likedIds.includes(activePost.id)}
            relatedPosts={relatedPosts}
            onSelectRelated={handleReadPost}
            onShowToast={showToast}
          />
        )}

        {view === 'dashboard' && (
          <Dashboard
            currentUser={currentUser || {
              id: 'user-guest',
              username: 'guest',
              name: 'Guest Writer',
              email: 'guest@blogify.io',
              role: 'Writer',
              createdAt: new Date().toISOString(),
            }}
            posts={posts}
            onSavePost={handleSavePost}
            onDeletePost={handleDeletePost}
            onNavigateHome={() => setView('feed')}
            onReadPost={handleReadPost}
            initialEditingPost={editingPost}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setView('feed');
        }}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLogin}
        onShowToast={showToast}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#27272f] text-stone-100 text-xs font-medium border border-white/10 shadow-2xl animate-bounce-subtle">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
