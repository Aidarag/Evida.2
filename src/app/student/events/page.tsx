'use client';

import React, { useState, useEffect } from 'react';
import { useEvents } from '@/lib/context/EventContext';
import { useUser } from '@/lib/context/UserContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import EventCard from '@/components/student/EventCard';
import Input from '@/components/ui/Input';
import EmptyState from '@/components/ui/EmptyState';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Search, Compass, Shield, Users, GraduationCap, Megaphone, Calendar, MapPin, Mail, X, Heart, Plus, MessageSquare, Bookmark, Share2, ChevronLeft, CheckCircle2, MessageCircle, User, Home, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Event, Promotion } from '@/lib/types';

import VerifiedBadge from '@/components/ui/VerifiedBadge';

type OwnershipFilter = 'school' | 'organization' | 'student' | 'promotion';

export default function StudentEventsFeed() {
  const { events, organizations, saveToggle } = useEvents();
  const { currentUser } = useUser();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'campus' | 'promotions'>('campus');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [selectedPromo, setSelectedPromo] = useState<Promotion | null>(null);
  const [feedMode, setFeedMode] = useState<'grid' | 'tiktok'>('tiktok');
  const [isMobile, setIsMobile] = useState(false);
  const [activeFeedIndex, setActiveFeedIndex] = useState(0);

  // TikTok feed states
  const [tiktokTab, setTiktokTab] = useState<'foryou' | 'school' | 'organization'>('foryou');
  const [searchOpen, setSearchOpen] = useState(false);
  const [likedItems, setLikedItems] = useState<Record<string, boolean>>({});
  const [likesCounts, setLikesCounts] = useState<Record<string, number>>({});
  const [commentsMap, setCommentsMap] = useState<Record<string, { user: string; text: string; time: string }[]>>({});
  const [followedOrganizers, setFollowedOrganizers] = useState<Record<string, boolean>>({});
  const [commentsOpenItem, setCommentsOpenItem] = useState<(Event | Promotion) | null>(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [copiedItemId, setCopiedItemId] = useState<string | null>(null);
  const [activeRightTab, setActiveRightTab] = useState<'details' | 'comments'>('details');

  const getMockComments = (id: string, title: string) => {
    const commentsPool = [
      "Can't wait for this! Count me in!",
      "Is this open to non-majors?",
      "Finally, an event like this on campus!",
      "Who wants to go together? Let's make a group chat.",
      "Last year was super fun, definitely going again.",
      "Highly recommended! 🔥",
      "Is RSVP required or can we just show up?",
      "Will there be free food?",
      "So excited for this!"
    ];
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const count = (hash % 3) + 2; // 2 to 4 comments
    const selected: { user: string; text: string; time: string }[] = [];
    const names = ["Alex Smith", "Emma Watson", "John Doe", "Sophia Lee", "Michael Chen", "Olivia Taylor"];
    for (let i = 0; i < count; i++) {
      const nameIndex = (hash + i) % names.length;
      const commentIndex = (hash * (i + 1)) % commentsPool.length;
      selected.push({
        user: names[nameIndex],
        text: commentsPool[commentIndex],
        time: `${(hash + i) % 12 + 1}h ago`
      });
    }
    return selected;
  };

  useEffect(() => {
    if (events.length === 0 && promotions.length === 0) return;

    const storedLikes = localStorage.getItem('evida_feed_likes');
    const storedLikedItems = localStorage.getItem('evida_feed_liked_items');
    const storedComments = localStorage.getItem('evida_feed_comments');
    const storedFollowed = localStorage.getItem('evida_feed_followed');

    let parsedLikes = storedLikes ? JSON.parse(storedLikes) : {};
    let parsedLikedItems = storedLikedItems ? JSON.parse(storedLikedItems) : {};
    let parsedComments = storedComments ? JSON.parse(storedComments) : {};
    let parsedFollowed = storedFollowed ? JSON.parse(storedFollowed) : {};

    events.forEach(e => {
      if (parsedLikes[e.id] === undefined) {
        parsedLikes[e.id] = Math.max(3, Math.floor(e.views * 0.3) + (e.title.length % 7));
      }
      if (parsedComments[e.id] === undefined) {
        parsedComments[e.id] = getMockComments(e.id, e.title);
      }
    });

    promotions.forEach(p => {
      if (parsedLikes[p.id] === undefined) {
        parsedLikes[p.id] = Math.max(5, (p.title.length * 2) % 35 + 4);
      }
      if (parsedComments[p.id] === undefined) {
        parsedComments[p.id] = getMockComments(p.id, p.title);
      }
    });

    setLikesCounts(parsedLikes);
    setLikedItems(parsedLikedItems);
    setCommentsMap(parsedComments);
    setFollowedOrganizers(parsedFollowed);
  }, [events, promotions]);

  const handleLikeToggle = (itemId: string) => {
    const isLiked = !likedItems[itemId];
    const newLikedItems = { ...likedItems, [itemId]: isLiked };
    const newLikesCounts = {
      ...likesCounts,
      [itemId]: (likesCounts[itemId] || 0) + (isLiked ? 1 : -1)
    };

    setLikedItems(newLikedItems);
    setLikesCounts(newLikesCounts);

    localStorage.setItem('evida_feed_liked_items', JSON.stringify(newLikedItems));
    localStorage.setItem('evida_feed_likes', JSON.stringify(newLikesCounts));
  };

  const handleFollowToggle = (organizer: string) => {
    const isFollowed = !followedOrganizers[organizer];
    const newFollowed = { ...followedOrganizers, [organizer]: isFollowed };
    setFollowedOrganizers(newFollowed);
    localStorage.setItem('evida_feed_followed', JSON.stringify(newFollowed));
  };

  const handleAddComment = (itemId: string) => {
    if (!newCommentText.trim() || !currentUser) return;
    const userComments = commentsMap[itemId] || [];
    const newComment = {
      user: currentUser.name,
      text: newCommentText.trim(),
      time: 'Just now'
    };
    const newComments = { ...commentsMap, [itemId]: [newComment, ...userComments] };
    setCommentsMap(newComments);
    setNewCommentText('');
    localStorage.setItem('evida_feed_comments', JSON.stringify(newComments));
  };

  const handleShare = (item: Event | Promotion) => {
    const isEvent = 'ownershipType' in item;
    const link = isEvent 
      ? `${window.location.origin}/events/${item.id}`
      : `mailto:${item.contactInfo}?subject=Check out this promotion: ${item.title}`;
    
    if (isEvent) {
      navigator.clipboard.writeText(link);
      setCopiedItemId(item.id);
      setTimeout(() => setCopiedItemId(null), 2000);
    } else {
      window.location.href = link;
    }
  };

  // Compute combined/filtered items for the TikTok feed tab
  const tiktokFeedItems = (() => {
    let items: (Event | Promotion)[] = [];
    if (tiktokTab === 'foryou') {
      // Combined approved student events and promotions
      const studentEvents = events.filter(e => e.status === 'approved' && e.ownershipType === 'student');
      const approvedPromos = promotions;
      items = [...studentEvents, ...approvedPromos];
    } else if (tiktokTab === 'school') {
      items = events.filter(e => e.status === 'approved' && e.ownershipType === 'school');
    } else if (tiktokTab === 'organization') {
      items = events.filter(e => e.status === 'approved' && e.ownershipType === 'organization');
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      items = items.filter(item => {
        const title = item.title.toLowerCase();
        const desc = item.description.toLowerCase();
        const org = 'ownershipType' in item 
          ? (item.organizationName || item.organizer || '').toLowerCase() 
          : item.organizer.toLowerCase();
        const loc = 'ownershipType' in item ? (item.location || '').toLowerCase() : '';
        return title.includes(q) || desc.includes(q) || org.includes(q) || loc.includes(q);
      });
    }

    return [...items].sort((a, b) => {
      const aFeat = ('ownershipType' in a) && (a.featured || a.isFeatured) ? 1 : 0;
      const bFeat = ('ownershipType' in b) && (b.featured || b.isFeatured) ? 1 : 0;
      if (aFeat !== bFeat) return bFeat - aFeat;
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  })();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch promotions
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const res = await fetch('/api/promotions');
        if (res.ok) {
          const data = await res.json();
          // Only show approved promotions
          setPromotions(data.filter((p: Promotion) => p.status === 'approved') || []);
        }
      } catch (e) {
        console.error('Failed to fetch promotions', e);
      }
    };
    fetchPromotions();
  }, []);

  const categories = ['All', 'Academic', 'Career', 'Sports', 'Social', 'Culture', 'Arts', 'Volunteer', 'Networking'];

  // Prioritize Featured Event
  const getFeaturedEvent = () => {
    const approvedEvents = events.filter(e => e.status === 'approved');
    
    // 1. Official School Featured
    const schoolFeatured = approvedEvents.find(e => e.isFeatured && e.ownershipType === 'school');
    if (schoolFeatured) return schoolFeatured;
    
    // 2. Organization Featured
    const orgFeatured = approvedEvents.find(e => e.isFeatured && e.ownershipType === 'organization');
    if (orgFeatured) return orgFeatured;
    
    // 3. Student Featured
    const studentFeatured = approvedEvents.find(e => e.isFeatured && e.ownershipType === 'student');
    if (studentFeatured) return studentFeatured;

    // Fallback to first available approved event based on ownership priority
    const schoolFallback = approvedEvents.find(e => e.ownershipType === 'school');
    if (schoolFallback) return schoolFallback;

    const orgFallback = approvedEvents.find(e => e.ownershipType === 'organization');
    if (orgFallback) return orgFallback;

    const studentFallback = approvedEvents.find(e => e.ownershipType === 'student');
    if (studentFallback) return studentFallback;

    return null;
  };

  const featuredEvent = getFeaturedEvent();

  // Category matching helper
  const matchesCategory = (item: Event | Promotion) => {
    if (selectedCategory === 'All') return true;

    const itemCat = item.category?.toLowerCase() || '';
    const selCat = selectedCategory.toLowerCase();

    // Map promotions to main categories
    if (!('ownershipType' in item)) {
      if (selCat === 'academic' && itemCat === 'tutoring') return true;
      if (selCat === 'arts' && itemCat === 'photography') return true;
      if (selCat === 'social' && (itemCat === 'food' || itemCat === 'initiative')) return true;
      if (selCat === 'volunteer' && itemCat === 'initiative') return true;
      if (selCat === 'career' && itemCat === 'tutoring') return true;
      return false;
    }

    // Direct event category match or sub-matches
    if (itemCat === selCat) return true;
    if (selCat === 'academic' && itemCat.includes('acad')) return true;
    if (selCat === 'career' && (itemCat.includes('career') || itemCat.includes('work'))) return true;
    if (selCat === 'social' && (itemCat.includes('social') || itemCat.includes('party') || itemCat.includes('homecoming') || itemCat.includes('greek'))) return true;
    if (selCat === 'culture' && itemCat.includes('cult')) return true;
    if (selCat === 'arts' && itemCat.includes('art')) return true;

    return false;
  };

  // Filtered items based on active selections
  const filteredItems: (Event | Promotion)[] = (() => {
    if (selectedTab === 'promotions') {
      return promotions.filter((promo) => {
        const matchesSearch = 
          promo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          promo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          promo.organizer.toLowerCase().includes(searchQuery.toLowerCase());
        
        return matchesSearch && matchesCategory(promo);
      });
    } else {
      return events.filter((e) => {
        if (e.status !== 'approved') return false;

        const matchesSearch = 
          e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (e.organizationName || '').toLowerCase().includes(searchQuery.toLowerCase());

        return matchesSearch && matchesCategory(e);
      });
    }
  })();

  const sortedFilteredItems = [...filteredItems].sort((a, b) => {
    // 1. Featured pins at top
    const aFeat = ('ownershipType' in a) && (a.featured || a.isFeatured) ? 1 : 0;
    const bFeat = ('ownershipType' in b) && (b.featured || b.isFeatured) ? 1 : 0;
    if (aFeat > bFeat) return -1;
    if (aFeat < bFeat) return 1;

    // 2. Default by date
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const matchedOrgs = searchQuery.trim() !== '' 
    ? organizations.filter(org => org.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const handleCardClick = (item: Event | Promotion) => {
    if ('ownershipType' in item) {
      router.push(`/events/${item.id}`);
    } else {
      setSelectedPromo(item as Promotion);
    }
  };

  const handleWebFeedScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const index = Math.round(target.scrollTop / target.clientHeight);
    if (index >= 0 && index < sortedFilteredItems.length && index !== activeFeedIndex) {
      setActiveFeedIndex(index);
    }
  };

  return (
    <div className={`mx-auto ${
      feedMode === 'tiktok' 
        ? 'w-full max-w-none h-screen overflow-hidden p-0 relative bg-[#DFDED7]' 
        : 'max-w-7xl p-6 md:p-10 space-y-8'
    }`}>
      {/* Explore Navigation Header */}
      <div className={`z-50 flex flex-col gap-4 border-b ${
        feedMode === 'tiktok' 
          ? 'fixed top-0 inset-x-0 bg-black/45 backdrop-blur-md text-white border-white/10 w-full max-w-none px-6 py-4' 
          : 'bg-[#DFDED7]/80 backdrop-blur-md text-[#191919] border-black/[0.04] sticky top-0 px-6 py-4 -mx-6 md:mx-0 md:px-0'
      }`}>
        <div className="flex items-center justify-between w-full">
          {/* Left Corner: Single switch button (Feed <-> Grid in one) */}
          <button
            type="button"
            onClick={() => setFeedMode(feedMode === 'tiktok' ? 'grid' : 'tiktok')}
            className={`h-10 w-10 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-sm border ${
              feedMode === 'tiktok' 
                ? 'bg-black/40 backdrop-blur-md border-white/10 text-white hover:bg-black/60' 
                : 'bg-white border-black/10 text-[#191919] hover:bg-black/5'
            }`}
            title={feedMode === 'tiktok' ? "Switch to Grid view" : "Switch to Feed view"}
          >
            <LayoutGrid className="h-5 w-5" />
          </button>

          {/* Middle: Centered Filters (Events & Promotions) */}
          <div className={`flex p-1 rounded-full border shadow-sm ${
            feedMode === 'tiktok' 
              ? 'bg-black/40 border-white/10' 
              : 'bg-black/[0.04] border-black/[0.04]'
          }`}>
            <button
              type="button"
              onClick={() => {
                setSelectedTab('campus');
                setSelectedCategory('All');
              }}
              className={`px-5 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                selectedTab === 'campus' 
                  ? 'bg-[#BDFB04] text-[#191919] font-black' 
                  : (feedMode === 'tiktok' ? 'text-white/80 hover:text-white' : 'text-[#4F5666] hover:text-[#191919]')
              }`}
            >
              Events
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedTab('promotions');
                setSelectedCategory('All');
              }}
              className={`px-5 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                selectedTab === 'promotions' 
                  ? 'bg-[#BDFB04] text-[#191919] font-black' 
                  : (feedMode === 'tiktok' ? 'text-white/80 hover:text-white' : 'text-[#4F5666] hover:text-[#191919]')
              }`}
            >
              Promotions
            </button>
          </div>

          {/* Right Corner: Back button */}
          <button
            type="button"
            onClick={() => router.back()}
            className={`h-10 w-10 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-sm border ${
              feedMode === 'tiktok' 
                ? 'bg-black/40 backdrop-blur-md border-white/10 text-white hover:bg-black/60' 
                : 'bg-white border-black/10 text-[#191919] hover:bg-black/5'
            }`}
            title="Go Back"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>

        {/* Search & Category Filters - Only visible in Grid Mode */}
        {feedMode === 'grid' && (
          <div className="space-y-4 pt-2">
            <div className="w-full md:w-96">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search events, organizers, or keywords..."
                  className="pl-12 rounded-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Matched Organizations */}
            {matchedOrgs.length > 0 && (
              <div className="space-y-2 mt-2 max-w-md">
                <span className="text-[9px] font-bold text-[#4F5666] uppercase tracking-[0.2em] block pl-1">// MATCHED ORGANIZATIONS</span>
                {matchedOrgs.map(org => (
                  <div 
                    key={org.id} 
                    onClick={() => router.push(`/student/organizations/${org.id}`)}
                    className="bg-white rounded-2xl p-3 flex items-center justify-between border border-black/[0.04] shadow-sm hover:border-[#BDFB04] transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-[#BDFB04]/10 border border-[#BDFB04]/20 flex items-center justify-center text-[#191919] font-extrabold uppercase text-xs shadow-sm">
                        {org.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-[11px] font-bold text-[#191919] uppercase tracking-tight flex items-center group-hover:text-[#BDFB04] transition-colors">
                          {org.name}
                          {org.verified && <VerifiedBadge className="h-3 w-3 ml-1" />}
                        </h4>
                        <p className="text-[9px] text-[#4F5666]">{org.members.length} members • Campus Group</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-[#7B8290] group-hover:text-[#191919] transition-colors uppercase">View →</span>
                  </div>
                ))}
              </div>
            )}

            {/* Category Filters */}
            <div className="space-y-3 pt-1">
              <span className="text-[9px] font-bold text-[#4F5666] uppercase tracking-[0.2em] block pl-1">// Category</span>
              <div className="flex gap-2.5 overflow-x-auto pb-3 scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
                {categories.map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <motion.button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      whileHover={{ y: -1.5, scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      className={`relative shrink-0 px-5.5 py-2.5 h-9.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider cursor-pointer select-none transition-colors duration-200 ${
                        isActive
                          ? 'text-[#191919]'
                          : 'bg-black/[0.02] border border-black/[0.06] text-[#4F5666] hover:bg-black/[0.04] hover:text-[#191919]'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeCategoryBg"
                          className="absolute inset-0 bg-[#BDFB04] rounded-full z-0"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">{cat}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
 
      {/* Featured Hero (Only show in Grid mode if no search/filter applied and featured exists) */}
      {feedMode === 'grid' && featuredEvent && searchQuery === '' && selectedCategory === 'All' && selectedTab === 'campus' && (
        <div 
          onClick={() => router.push(`/events/${featuredEvent.id}`)}
          className="relative rounded-[32px] overflow-hidden aspect-[16/9] md:aspect-[21/9] cursor-pointer group border border-black/[0.04] shadow-md"
        >
          <div 
            className="absolute inset-0 opacity-45 group-hover:opacity-55 transition-opacity duration-500"
            style={featuredEvent.coverImage.startsWith('/') 
              ? { backgroundImage: `url(${featuredEvent.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
              : { background: `linear-gradient(to top right, var(--tw-gradient-stops))` }
            }
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent z-10" />
          
          <div className="absolute inset-x-8 bottom-8 z-20 flex flex-col items-start gap-3">
            <span className="rounded-full bg-red-500/20 text-red-400 border border-red-500/30 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
              Featured Official Event
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight line-clamp-3" style={{ fontFamily: 'var(--font-display)' }}>
              {featuredEvent.title}
            </h2>
            <div className="flex items-center gap-4 text-sm font-medium text-white/80">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-white" />
                {new Date(featuredEvent.date).toLocaleDateString()}
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-white" />
                {featuredEvent.location}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Grid or TikTok Feed */}
      {feedMode === 'tiktok' ? (
        sortedFilteredItems.length > 0 ? (
          <div className="relative w-full h-full flex flex-col items-center bg-black">
            
            {/* TikTok Vertical Swipe Container */}
            <div className="h-full w-full overflow-y-scroll snap-y snap-mandatory scrollbar-none flex flex-col items-center">
              {sortedFilteredItems.map((item) => {
                const isPromo = !('ownershipType' in item);
                
                // Set up cover image
                const coverImage = isPromo 
                  ? '/pexels-markus-winkler-1430818-12199407.jpg' 
                  : item.coverImage;

                const isGradient = coverImage ? coverImage.includes('from-') : false;
                const bgClass = isGradient ? coverImage : '';
                const bgStyle = (!isGradient && coverImage) ? { backgroundImage: `url(${coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {};

                // Date parsing
                const dateObj = new Date(item.date);
                const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
                const month = dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
                const day = dateObj.getDate();
                const formattedDate = `${weekday}, ${month} ${day}`;

                const timeStr = !isPromo && (item as Event).time ? (item as Event).time : '7:00 PM';
                const goingCount = 32 + (item.title.length * 2);

                const orgName = isPromo ? item.organizer : (item as Event).organizationName || item.organizer;
                
                const isOrgVerified = !isPromo && (item as Event).organizationId
                  ? organizations.find(o => o.id === (item as Event).organizationId)?.verified
                  : false;

                const isLiked = likedItems[item.id] || false;
                const likesCount = likesCounts[item.id] || 0;
                const itemComments = commentsMap[item.id] || [];
                const isCommentOpen = commentsOpenItem?.id === item.id;
                const isSaved = 'ownershipType' in item ? item.savedBy?.includes(currentUser?.name || '') : false;

                return (
                  <div 
                    key={item.id} 
                    className="snap-start shrink-0 h-full w-full relative overflow-hidden flex flex-col justify-end bg-black"
                  >
                    {/* Full-Screen Media Background */}
                    {isGradient ? (
                      <div className={`absolute inset-0 w-full h-full z-0 ${bgClass}`} />
                    ) : (
                      <img 
                        src={coverImage} 
                        alt={item.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-75 z-0 select-none pointer-events-none"
                      />
                    )}
                    
                    {/* Gradient Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/60 z-10 pointer-events-none" />

                    {/* Bottom-Left Information Overlay */}
                    <div className="absolute bottom-24 left-4 z-20 max-w-[72%] text-white text-left space-y-2 select-none">
                      {/* Organization/Hoster Name */}
                      <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#BDFB04]">
                        <span>@{orgName.toLowerCase().replace(/\s+/g, '')}</span>
                        {isOrgVerified && <VerifiedBadge className="h-4 w-4 fill-[#BDFB04] text-black" />}
                      </div>

                      {/* Event Title */}
                      <h2 
                        onClick={() => handleCardClick(item)}
                        className="text-lg font-extrabold uppercase leading-tight tracking-tight hover:text-white/80 transition-colors cursor-pointer"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {item.title}
                      </h2>

                      {/* Short Description */}
                      <p className="text-white/95 text-[11px] leading-relaxed font-light line-clamp-2">
                        {item.description || `Join us for the ${item.title}, happening soon.`}
                      </p>

                      {/* Info badges/rows (Date, Time, Location) */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className="px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wider rounded-md bg-white/10 border border-white/10">
                          {isPromo ? 'Promotion' : item.category}
                        </span>
                        <span className="px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wider rounded-md bg-[#BDFB04] text-[#191919]">
                          {isPromo ? 'FREE' : (item.free ? 'FREE' : 'TICKETED')}
                        </span>
                        {!isPromo && !item.free && (item as Event).price && (
                          <span className="px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wider rounded-md bg-white/20">
                            ${(item as Event).price}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col gap-1 text-[10px] font-bold text-white/80 uppercase pt-1">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-[#BDFB04]" />
                          <span>{formattedDate} • {timeStr}</span>
                        </div>
                        <div className="flex items-center gap-1.5 truncate">
                          <MapPin className="h-3.5 w-3.5 text-white/60" />
                          <span className="truncate">{isPromo ? (item as Promotion).organizer : (item as Event).location}</span>
                        </div>
                      </div>

                      {/* RSVP / Contact Button inside Overlay */}
                      <button
                        onClick={() => handleCardClick(item)}
                        className="mt-2 bg-[#BDFB04] text-[#191919] hover:bg-[#c5ff0a] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                      >
                        {isPromo ? 'Contact Organizer' : "I'm In"}
                      </button>

                      {/* Inline comments drawer (Floating) */}
                      {isCommentOpen && (
                        <div className="pt-2 bg-black/60 border border-white/10 rounded-2xl p-3 space-y-2 mt-2 backdrop-blur-sm max-w-sm">
                          <span className="text-[8px] font-extrabold text-[#BDFB04] uppercase tracking-wider block">Comments ({itemComments.length})</span>
                          <div className="max-h-24 overflow-y-auto space-y-1.5 pr-1 text-[10px] text-white">
                            {itemComments.length === 0 ? (
                              <p className="text-[9px] text-white/40 italic">No comments yet.</p>
                            ) : (
                              itemComments.map((c, i) => (
                                <div key={i} className="leading-tight">
                                  <span className="font-extrabold text-[#BDFB04]">{c.user}:</span>{' '}
                                  <span className="text-white/90 font-light">{c.text}</span>
                                </div>
                              ))
                            )}
                          </div>
                          {/* Add comment input */}
                          <div className="flex gap-2 pt-1 border-t border-white/10">
                            <input
                              value={newCommentText}
                              onChange={(e) => setNewCommentText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleAddComment(item.id);
                                }
                              }}
                              placeholder="Add comment..."
                              className="flex-1 bg-white/10 border border-white/10 rounded-xl px-2.5 py-1 text-[9px] text-white placeholder-white/40 focus:outline-none focus:border-[#BDFB04]"
                            />
                            <button
                              onClick={() => handleAddComment(item.id)}
                              className="px-2 py-1 bg-[#BDFB04] text-[#191919] text-[9px] font-bold rounded-lg uppercase tracking-wider hover:bg-[#c5ff0a] transition-all"
                            >
                              Post
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right-Side Interaction Column Overlay */}
                    <div className="absolute right-4 bottom-24 z-20 flex flex-col gap-4 items-center">
                      
                      {/* Like Action */}
                      <div className="flex flex-col items-center gap-1">
                        <button
                          onClick={() => handleLikeToggle(item.id)}
                          className={`h-11 w-11 rounded-full flex items-center justify-center backdrop-blur-md border transition-all cursor-pointer shadow-lg ${
                            isLiked
                              ? 'bg-rose-500 border-rose-600 text-white'
                              : 'bg-black/40 border-white/10 text-white hover:bg-black/60'
                          }`}
                          title="Like Event"
                        >
                          <Heart className={`h-5 w-5 ${isLiked ? 'fill-white' : ''}`} />
                        </button>
                        <span className="text-[10px] font-extrabold text-white tracking-wide shadow-sm">{likesCount}</span>
                      </div>

                      {/* Comment Action */}
                      <div className="flex flex-col items-center gap-1">
                        <button
                          onClick={() => setCommentsOpenItem(isCommentOpen ? null : item)}
                          className={`h-11 w-11 rounded-full flex items-center justify-center backdrop-blur-md border transition-all cursor-pointer shadow-lg ${
                            isCommentOpen 
                              ? 'bg-[#BDFB04] border-[#c5ff0a] text-[#191919]' 
                              : 'bg-black/40 border-white/10 text-white hover:bg-black/60'
                          }`}
                          title="Show Comments"
                        >
                          <MessageCircle className="h-5 w-5" />
                        </button>
                        <span className="text-[10px] font-extrabold text-white tracking-wide shadow-sm">{itemComments.length}</span>
                      </div>

                      {/* Save Action */}
                      <div className="flex flex-col items-center gap-1">
                        <button
                          onClick={() => 'ownershipType' in item ? saveToggle(item.id) : undefined}
                          className={`h-11 w-11 rounded-full flex items-center justify-center backdrop-blur-md border transition-all cursor-pointer shadow-lg ${
                            isSaved
                              ? 'bg-[#BDFB04] border-[#c5ff0a] text-[#191919]'
                              : 'bg-black/40 border-white/10 text-white hover:bg-black/60'
                          }`}
                          title="Save Event"
                        >
                          <Bookmark className={`h-5 w-5 ${isSaved ? 'fill-[#191919]' : ''}`} />
                        </button>
                        <span className="text-[10px] font-extrabold text-white tracking-wide shadow-sm">Save</span>
                      </div>

                      {/* Share Action */}
                      <div className="flex flex-col items-center gap-1">
                        <button
                          className="h-11 w-11 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition-all cursor-pointer shadow-lg"
                          title="Share Event"
                          onClick={() => {
                            if (navigator.share) {
                              navigator.share({
                                title: item.title,
                                text: item.description,
                                url: window.location.href,
                              }).catch(() => {});
                            } else {
                              alert('Link copied to clipboard!');
                            }
                          }}
                        >
                          <Share2 className="h-5 w-5" />
                        </button>
                        <span className="text-[10px] font-extrabold text-white tracking-wide shadow-sm">Share</span>
                      </div>

                      {/* Spinning vinyl decoration */}
                      <div className="h-11 w-11 rounded-full bg-black/80 border border-white/10 flex items-center justify-center shadow-lg animate-spin [animation-duration:6s]">
                        <div className="h-4 w-4 rounded-full bg-[#BDFB04] border border-black flex items-center justify-center">
                          <Compass className="h-2 w-2 text-black" />
                        </div>
                      </div>

                    </div>

                  </div>
                );
              })}
            </div>

            {/* Floating Persistent Bottom Navigation */}
            <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto">
              <nav className="flex items-center justify-around rounded-full bg-white/90 backdrop-blur-2xl border border-black/[0.04] px-2 py-2 shadow-[var(--shadow-premium-lg)]">
                {/* Home */}
                <Link
                  href="/student/dashboard"
                  className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl text-gray-400 hover:text-[#191919] transition-colors cursor-pointer"
                >
                  <Home className="h-5 w-5" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Home</span>
                </Link>
                
                {/* Explore */}
                <Link
                  href="/student/events"
                  className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl text-[#191919] font-extrabold transition-colors cursor-pointer"
                >
                  <Compass className="h-5 w-5" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Explore</span>
                </Link>
                
                {/* Create */}
                <Link href="/student/create" className="-mt-6">
                  <div className="h-14 w-14 rounded-full bg-[#BDFB04] flex items-center justify-center shadow-lg shadow-[#BDFB04]/30 cursor-pointer hover:scale-105 active:scale-95 transition-all">
                    <Plus className="h-6 w-6 text-[#191919] stroke-[2.5]" />
                  </div>
                </Link>
                
                {/* Saved */}
                <Link
                  href="/student/saved"
                  className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl text-gray-400 hover:text-[#191919] transition-colors cursor-pointer"
                >
                  <Bookmark className="h-5 w-5" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Saved</span>
                </Link>
                
                {/* Profile */}
                <Link
                  href="/student/profile"
                  className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl text-gray-400 hover:text-[#191919] transition-colors cursor-pointer"
                >
                  <User className="h-5 w-5" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Profile</span>
                </Link>
              </nav>
            </div>
            
          </div>
        ) : (
          <EmptyState
            icon={<Compass className="h-8 w-8 text-gray-400" />}
            title="No events found"
            description="Try adjusting your search or category filters to discover campus activities."
          />
        )
      ) : (
        /* Original Grid view */
        sortedFilteredItems.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {sortedFilteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <EventCard
                    event={item}
                    onClick={() => handleCardClick(item)}
                    isSaved={'ownershipType' in item ? item.savedBy?.includes(currentUser?.name || '') : false}
                    onSave={'ownershipType' in item ? (e) => {
                      e.stopPropagation();
                      saveToggle(item.id);
                    } : undefined}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <EmptyState
            icon={<Compass className="h-8 w-8 text-gray-400" />}
            title="No events found"
            description="Try adjusting your search or category filters to discover campus activities."
          />
        )
      )}

      {/* Custom Promotion Details Modal */}
      <AnimatePresence>
        {selectedPromo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPromo(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white border border-black/[0.06] rounded-[28px] max-w-lg w-full overflow-hidden shadow-2xl relative z-10"
            >
              {/* Header Decorative Image Cover */}
              <div className="h-40 bg-gradient-to-tr from-purple-900 via-slate-900 to-violet-950 relative flex items-end p-6">
                <div className="absolute top-4 right-4">
                  <button 
                    onClick={() => setSelectedPromo(null)}
                    className="h-8 w-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div>
                  <span className="bg-purple-500/20 text-purple-400 border border-purple-500/30 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider backdrop-blur-sm">
                    Promotion Card
                  </span>
                  <h2 className="text-xl md:text-2xl font-extrabold text-white mt-2" style={{ fontFamily: 'var(--font-display)' }}>
                    {selectedPromo.title}
                  </h2>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  {/* Category & Date */}
                  <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[#4F5666]">
                    <span className="bg-black/5 px-2.5 py-1 rounded-full text-[#191919] capitalize">
                      Category: {selectedPromo.category}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-[#BDFB04]" />
                      Posted: {new Date(selectedPromo.date).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">About this Promotion</h3>
                    <p className="text-sm text-[#4F5666] leading-relaxed whitespace-pre-wrap">
                      {selectedPromo.description}
                    </p>
                  </div>

                  {/* Organizer Contact Info */}
                  <div className="bg-black/5 border border-black/[0.04] p-4 rounded-2xl space-y-3">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Organizer Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-[#191919]">
                        <span className="text-gray-400">Name:</span>
                        <span className="font-bold">{selectedPromo.organizer}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#4F5666]">
                        <Mail className="h-3.5 w-3.5 text-[#BDFB04] shrink-0" />
                        <span className="break-all">{selectedPromo.contactInfo}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="flex justify-end gap-3 pt-2">
                  <Button 
                    variant="secondary" 
                    onClick={() => setSelectedPromo(null)}
                  >
                    Close
                  </Button>
                  <a 
                    href={`mailto:${selectedPromo.contactInfo}?subject=Inquiry about: ${selectedPromo.title}`}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#BDFB04] hover:bg-[#BDFB04]/90 text-[#191919] rounded-xl text-xs font-bold transition-all shadow-lg shadow-orange-500/10"
                  >
                    <Mail className="h-4 w-4" />
                    Contact Organizer
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Slide-Up Comments Drawer Overlay */}
      <AnimatePresence>
        {commentsOpenItem && isMobile && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCommentsOpenItem(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />
            
            {/* Drawer Body */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="relative z-10 w-full max-w-lg bg-[#18181b] border-t border-white/10 rounded-t-[32px] p-6 flex flex-col h-[70vh] text-white font-sans"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <div className="w-8" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                  Comments ({(commentsMap[commentsOpenItem.id] || []).length})
                </h3>
                <button
                  onClick={() => setCommentsOpenItem(null)}
                  className="p-1 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Comments Scroll Area */}
              <div className="flex-1 overflow-y-auto py-4 space-y-4 scrollbar-thin text-left">
                {(commentsMap[commentsOpenItem.id] || []).length === 0 ? (
                  <div className="text-center py-12 text-xs text-gray-500 font-medium">
                    No comments yet. Share your thoughts!
                  </div>
                ) : (
                  (commentsMap[commentsOpenItem.id] || []).map((comment, idx) => (
                    <div key={idx} className="flex gap-3 items-start animate-fadeIn">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-white/10 to-white/5 border border-white/10 flex items-center justify-center font-bold text-xs uppercase text-[#BDFB04] shrink-0">
                        {comment.user.charAt(0)}
                      </div>
                      <div className="flex-1 space-y-0.5 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-extrabold text-gray-300 truncate">{comment.user}</span>
                          <span className="text-[9px] text-gray-500 shrink-0">{comment.time}</span>
                        </div>
                        <p className="text-xs text-gray-200 font-light leading-relaxed break-words">{comment.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Comment Input Footer */}
              <div className="pt-4 border-t border-white/5 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-[#BDFB04] text-[#191919] flex items-center justify-center font-bold text-xs">
                  {currentUser?.name?.charAt(0) || 'U'}
                </div>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Add comment..."
                    className="w-full bg-white/5 border border-white/10 text-white pl-4 pr-12 py-2.5 rounded-full text-xs focus:outline-none focus:ring-1 focus:ring-[#BDFB04]"
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddComment(commentsOpenItem.id);
                    }}
                  />
                  <button
                    onClick={() => handleAddComment(commentsOpenItem.id)}
                    disabled={!newCommentText.trim()}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-[#BDFB04] disabled:text-white/20 hover:scale-105 transition-all cursor-pointer"
                  >
                    <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Full-screen TikTok overlay modal removed - TikTok mobile/web layouts are now rendered directly inline. */}
    </div>
  );
}
