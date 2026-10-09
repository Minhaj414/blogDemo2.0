import { BlogPost, User } from '../types';

const USERS_KEY = 'blogify_users_v2';
const POSTS_KEY = 'blogify_posts_v2';
const CURRENT_USER_KEY = 'blogify_current_user_v2';
const LIKES_KEY = 'blogify_liked_posts_v2';

export const DEFAULT_USERS: User[] = [
  {
    id: 'user-minhaj',
    username: 'minhaj',
    name: 'MJM. Minhaj',
    email: 'mohamedminhaj008@gmail.com',
    role: 'Lead Architect & Creator',
    bio: 'Full-stack software engineer and designer dedicated to craft, zero-latency architectures, and expressive interfaces.',
    createdAt: '2025-01-15T10:00:00Z',
  },
  {
    id: 'user-elena',
    username: 'elena_r',
    name: 'Elena Rostova',
    email: 'elena@designcraft.dev',
    role: 'Staff UI Technologist',
    bio: 'Bridging the chasm between design tokens, typographic harmony, and sub-16ms render loops.',
    createdAt: '2025-02-01T08:30:00Z',
  },
  {
    id: 'user-marcus',
    username: 'marcus_c',
    name: 'Marcus Chen',
    email: 'marcus@systems.io',
    role: 'Distributed Systems Lead',
    bio: 'Obsessed with memory layouts, database connection pooling, and eliminating network round-trips.',
    createdAt: '2025-02-18T14:20:00Z',
  },
];

export const DEFAULT_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    userId: 'user-minhaj',
    author: 'MJM. Minhaj',
    authorRole: 'Lead Architect & Creator',
    authorEmail: 'mohamedminhaj008@gmail.com',
    title: 'Solving Latency: Why Free Hosts Lag and How We Engineered Zero-Delay Publishing',
    category: 'Engineering',
    excerpt: 'A deep dive into cold-starts, PHP session contention, MySQL connection pooling bottlenecks, and our transition to an instantaneous reactive architecture.',
    readTime: 4,
    likes: 84,
    views: 1240,
    createdAt: '2026-03-28T09:15:00Z',
    content: `# Solving Latency: Why Free Hosts Lag and How We Engineered Zero-Delay Publishing

Every engineer who has deployed a web application to traditional LAMP stacks or shared free hosting (such as XAMPP or free MySQL hosts) eventually encounters the dreaded **latency wall**. You click a button, the browser spinner turns for four seconds, and your thoughts grind to a halt.

In this retrospective, we explore the mechanical causes of web application sluggishness and how we transformed Blogify into an instantaneous, reactive publishing experience.

---

## 1. The Anatomy of a Sluggish Request

When a user visits a traditional web script or performs a query, several hidden bottlenecks compound:

\`\`\`
[Browser] ──(DNS + TLS: ~120ms)──> [Reverse Proxy]
                                        │
                                (Process Fork: ~80ms)
                                        ▼
                                   [PHP Worker]
                                        │
                             (Socket Handshake: ~250ms)
                                        ▼
                                [MySQL DB Instance]
\`\`\`

If your database server is on a cold or throttled node, database connection handshakes alone can consume **800ms to 2.5 seconds** per request. Add synchronous session file locks and un-cached DOM updates, and the user interface feels like swimming in molasses.

### Key Factors Causing Delays:
1. **Unpooled Database Connections**: Establishing a new TCP and TLS handshake to MySQL on every single API route.
2. **Blocking Network Roundtrips**: Waiting for synchronous payloads before allowing the writer to type or see their changes.
3. **Redundant DOM Re-renders**: Swapping whole HTML pages instead of performing optimistic local updates.

---

## 2. The Solution: Reactive, Zero-Delay Architecture

To deliver a snappy writing flow, an editorial app must honor three golden rules:

> "The user should never wait on a network roundtrip to see what they just typed or saved."

By adopting local-first persistence with immediate state reconciliation, all read and write operations complete in **under 4 milliseconds**:

- **Optimistic Mutation**: When you edit or publish a post, the UI updates instantly.
- **In-Memory Query Indexes**: Search, filter, and category groupings run synchronously without waiting for external API latency.
- **Zero Layout Shifts**: Typography and layout dimensions are pre-calculated to prevent visual jitter.

---

## 3. Measurable Performance Results

| Metric | Legacy Host | Optimized Blogify | Improvement |
| :--- | :--- | :--- | :--- |
| First Contentful Paint | 2,450 ms | **140 ms** | 17.5× faster |
| Post Save Latency | 1,820 ms | **< 5 ms** | Instant |
| Search Interaction | 650 ms | **Instant (0 ms)** | Real-time |
| Memory Footprint | 48 MB | **1.2 MB** | 40× lighter |

Great software is respectful of human attention. By eliminating systemic lag, writing shifts from a chore to an effortless flow state.`,
  },
  {
    id: 'post-2',
    userId: 'user-elena',
    author: 'Elena Rostova',
    authorRole: 'Staff UI Technologist',
    authorEmail: 'elena@designcraft.dev',
    title: 'Designing Beyond the AI Slop: Crafting Editorial Interfaces with Character',
    category: 'Design',
    excerpt: 'Why modern web apps look identical, the danger of static pill badges everywhere, and how thoughtful typography elevates reader comprehension.',
    readTime: 5,
    likes: 62,
    views: 980,
    createdAt: '2026-03-24T14:40:00Z',
    content: `# Designing Beyond the AI Slop: Crafting Editorial Interfaces with Character

Look at twenty landing pages built in the last twelve months, and you will witness an uncanny homogenization:
- Floating purple blur orbs in the corners
- Pill-shaped badges wrapping every single word
- Rounded cards with neon hairline borders
- Meaningless decorative green dots that pulse for no reason

When interfaces all look identical, they communicate to the reader that no human cared enough to craft the visual hierarchy.

---

## The Zero-Pill Discipline

One of the most insidious trends is the **badge sandwich**: wrapping dates, tags, and categories in colored pill capsules. 

Consider this contrast:

\`\`\`
❌ AI Slop:
[pill: TECHNOLOGY] [pill: 4 MIN READ] [pill: MARCH 2026]

✅ Editorial Clarity:
Technology · 4 min read · March 24, 2026
\`\`\`

When metadata is rendered as quiet, unboxed typographic prose separated by subtle dots (\`·\`), the reader's eye effortlessly glides past the taxonomy and focuses on the story itself.

---

## Typographic Weight & Hierarchy

In Blogify, we pair the high-contrast **Playfair Display** editorial serif for titles with **Inter** for sustained reading comfort.

\`\`\`css
/* Reading column mathematical harmony */
.reading-column {
  max-width: 68ch; /* Optimal measure for human saccades */
  line-height: 1.8;
  font-size: 1.125rem;
}
\`\`\`

Notice the drop cap opening, the generous vertical rhythm, and the absence of flashy gimmicks. Clean design is not the absence of personality—it is the deliberate removal of noise so that true substance can shine.`,
  },
  {
    id: 'post-3',
    userId: 'user-marcus',
    author: 'Marcus Chen',
    authorRole: 'Distributed Systems Lead',
    authorEmail: 'marcus@systems.io',
    title: 'The Architecture of Modern Local-First Web Storage',
    category: 'Systems',
    excerpt: 'Examining client-side durability, multi-tab broadcast channels, optimistic reconciliation, and conflict-free data models for writers.',
    readTime: 6,
    likes: 47,
    views: 730,
    createdAt: '2026-03-18T11:00:00Z',
    content: `# The Architecture of Modern Local-First Web Storage

The web was built on a request-response paradigm: the client asks, the server ponders, and the client receives. But for creative tools—text editors, canvas workspaces, and code notebooks—this model is fundamentally flawed.

When you type a paragraph in an article, that paragraph should exist durably on your machine before any packet leaves your network card.

---

## Core Tenets of Local-First Architecture

1. **Immediate Write-Ahead Durability**:
   Every keystroke is persisted synchronously to local storage or IndexedDB. A sudden network outage or tab crash loses zero words.

2. **Autonomous Offline Functionality**:
   The application continues to function in airplanes, subway tunnels, or unstable coffee shop Wi-Fi without degrading into error states.

3. **Background Synchronization**:
   Data synchronization is decoupled from the user input loop. The user experiences zero latency, while the synchronization worker reconciles state in the background.

\`\`\`typescript
// Pure local write with zero network wait
export function persistDraft(draft: BlogPost): void {
  const current = getLocalRepository();
  current.set(draft.id, {
    ...draft,
    updatedAt: new Date().toISOString()
  });
  saveToLocalStorage(current);
}
\`\`\`

By putting the user's browser in authoritative control of the editing experience, we return agency and speed to the individual.`,
  },
  {
    id: 'post-4',
    userId: 'user-minhaj',
    author: 'MJM. Minhaj',
    authorRole: 'Lead Architect & Creator',
    authorEmail: 'mohamedminhaj008@gmail.com',
    title: 'Building Blogify: From an Academic Prototype to a Production Platform',
    category: 'Architecture',
    excerpt: 'Reflecting on the evolution of Blogify, from vanilla scripts to a polished, modular ecosystem built for effortless publishing.',
    readTime: 3,
    likes: 95,
    views: 1580,
    createdAt: '2026-03-12T16:20:00Z',
    content: `# Building Blogify: From an Academic Prototype to a Production Platform

When I initially prototyped Blogify, the mission was straightforward: create an unencumbered space where developers and thinkers could document build logs and architectural discoveries without fighting complex CMS overhead.

Over time, hundreds of small friction points emerged:
- Needing to switch tabs to check markdown syntax
- Unpredictable backend responses on shared hosting
- Visual clutter taking away from the reading experience

---

## Reimagining the Workshop

In the new iteration of Blogify, the **Workshop** is the focal point. It features:
- A distraction-free canvas with live markdown formatting
- Instant keyboard shortcuts (\`Ctrl+B\` for bold, \`Ctrl+I\` for italic, \`Ctrl+K\` for links)
- Real-time word counts and reading pace estimates
- A clean author inventory where you can modify or retire posts with a single click

We don't need heavyweight bloated platforms to share ideas with the world. We need speed, clarity, and tools that respect our time.

Welcome to the new Blogify. Happy writing!`,
  },
];

export function getStoredPosts(): BlogPost[] {
  try {
    const raw = localStorage.getItem(POSTS_KEY);
    if (!raw) {
      localStorage.setItem(POSTS_KEY, JSON.stringify(DEFAULT_POSTS));
      return DEFAULT_POSTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_POSTS;
  } catch {
    return DEFAULT_POSTS;
  }
}

export function savePosts(posts: BlogPost[]): void {
  try {
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  } catch (err) {
    console.error('Failed to save posts to localStorage', err);
  }
}

export function getStoredUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_USERS;
  } catch {
    return DEFAULT_USERS;
  }
}

export function saveUsers(users: User[]): void {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save users to localStorage', err);
  }
}

export function getCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) {
      // Default to Minhaj so user has an active author session right away to test everything
      const defaultUser = DEFAULT_USERS[0];
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(defaultUser));
      return defaultUser;
    }
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setCurrentUser(user: User | null): void {
  try {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  } catch (err) {
    console.error('Failed to update current user', err);
  }
}

export function getLikedPostIds(): string[] {
  try {
    const raw = localStorage.getItem(LIKES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function togglePostLike(postId: string): { liked: boolean; newCount: number } {
  const likedIds = getLikedPostIds();
  const posts = getStoredPosts();
  const post = posts.find((p) => p.id === postId);

  const isLiked = likedIds.includes(postId);
  let nextLikedIds: string[];
  let newCount = post ? post.likes : 0;

  if (isLiked) {
    nextLikedIds = likedIds.filter((id) => id !== postId);
    newCount = Math.max(0, newCount - 1);
  } else {
    nextLikedIds = [...likedIds, postId];
    newCount = newCount + 1;
  }

  try {
    localStorage.setItem(LIKES_KEY, JSON.stringify(nextLikedIds));
    if (post) {
      post.likes = newCount;
      savePosts(posts);
    }
  } catch (err) {
    console.error('Failed to toggle like', err);
  }

  return { liked: !isLiked, newCount };
}

export function calculateReadTime(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const wpm = 200;
  return Math.max(1, Math.ceil(words / wpm));
}
