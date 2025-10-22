'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useSavedProperties } from '@/contexts/SavedPropertiesContext';
import { useUserRole } from '@/contexts/UserRoleContext';
import Link from 'next/link';
import type { FavoritesList } from '@/types/favoritesList';

export default function DashboardHome() {
  const { user } = useUser();
  const { savedProperties } = useSavedProperties();
  const { role } = useUserRole();
  const [favoritesLists, setFavoritesLists] = useState<FavoritesList[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch favorites lists
  useEffect(() => {
    async function fetchLists() {
      try {
        const response = await fetch('/api/lists');
        if (response.ok) {
          const data = await response.json();
          setFavoritesLists(data.lists);
        }
      } catch (error) {
        console.error('Error fetching lists:', error);
      } finally {
        setLoading(false);
      }
    }

    if (role === 'agent' || role === 'admin' || role === 'realtor') {
      fetchLists();
    } else {
      setLoading(false);
    }
  }, [role]);

  const totalLists = favoritesLists.length;
  const totalPropertiesInLists = favoritesLists.reduce((sum, list) => sum + list._count.properties, 0);
  const sharedLists = favoritesLists.filter(list => list.shareUuid).length;

  // Show different view for non-agents
  if (role !== 'agent' && role !== 'admin' && role !== 'realtor') {
    return (
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-4">Welcome to Antigua MLS</h1>
          <p className="text-xl opacity-90 mb-6">
            Your gateway to finding the perfect property in Antigua
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Start Browsing Properties →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HERO: Favorites Lists Feature */}
      <div className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-xl p-8 text-white">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl font-bold mb-4">
              🎯 Win More Clients with Favorites Lists
            </h1>
            <p className="text-xl opacity-90 mb-6">
              <strong>Stop losing clients to competitors.</strong> Create personalized property collections, 
              add your expert notes, and share professional branded lists that clients actually use.
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">✅</span>
                <span className="text-lg">Create unlimited client-specific property lists</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">✅</span>
                <span className="text-lg">Add your professional notes and insights</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">✅</span>
                <span className="text-lg">Share branded links that showcase your expertise</span>
              </div>
            </div>
            <Link
              href="/dashboard/favorites-lists"
              className="inline-flex items-center px-6 py-3 bg-white text-emerald-600 font-bold rounded-lg hover:bg-gray-100 transition-colors text-lg"
            >
              {totalLists > 0 ? 'Manage Your Lists' : 'Create Your First List'} →
            </Link>
          </div>
          
          <div className="bg-white/10 backdrop-blur rounded-xl p-6">
            <h3 className="text-2xl font-bold mb-4">Your Impact</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-300">{totalLists}</div>
                <div className="text-sm opacity-80">Lists Created</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-300">{totalPropertiesInLists}</div>
                <div className="text-sm opacity-80">Properties Curated</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-300">{sharedLists}</div>
                <div className="text-sm opacity-80">Lists Shared</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-300">∞</div>
                <div className="text-sm opacity-80">Client Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why This Matters Section */}
      <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-r-xl">
        <div className="flex items-start space-x-3">
          <span className="text-3xl">⚠️</span>
          <div>
            <h3 className="text-xl font-bold text-red-800 mb-2">
              Reality Check: Your Clients Are Shopping Around
            </h3>
            <p className="text-red-700 mb-4">
              <strong>Every day you don&apos;t use this tool, competitors are winning your potential clients.</strong> 
              Modern buyers expect curated, personalized service. Generic property emails are dead.
            </p>
            <p className="text-red-600">
              <strong>Favorites Lists make you look like the expert you are.</strong> Show clients you understand 
              their needs with organized, annotated property collections they can&apos;t get anywhere else.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions - Favorites Lists Focused */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href="/dashboard/favorites-lists"
          className="bg-emerald-50 border-2 border-emerald-200 text-emerald-800 p-6 rounded-xl hover:bg-emerald-100 hover:border-emerald-300 transition-all duration-200 group"
        >
          <div className="text-center">
            <span className="text-4xl mb-3 block">📋</span>
            <h3 className="font-bold text-lg mb-2">Manage Lists</h3>
            <p className="text-sm text-emerald-600 mb-3">
              Create, edit, and organize your client property lists
            </p>
            <div className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">
              {totalLists} Active Lists
            </div>
          </div>
        </Link>

        <Link
          href="/residential"
          className="bg-blue-50 border-2 border-blue-200 text-blue-800 p-6 rounded-xl hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 group"
        >
          <div className="text-center">
            <span className="text-4xl mb-3 block">🏠</span>
            <h3 className="font-bold text-lg mb-2">Add Properties</h3>
            <p className="text-sm text-blue-600 mb-3">
              Browse and add properties to your client lists
            </p>
            <div className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">
              Browse Now
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/saved-properties"
          className="bg-purple-50 border-2 border-purple-200 text-purple-800 p-6 rounded-xl hover:bg-purple-100 hover:border-purple-300 transition-all duration-200 group"
        >
          <div className="text-center">
            <span className="text-4xl mb-3 block">💾</span>
            <h3 className="font-bold text-lg mb-2">Saved Properties</h3>
            <p className="text-sm text-purple-600 mb-3">
              Your personal saved properties collection
            </p>
            <div className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">
              {savedProperties.length} Properties
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Lists */}
      {totalLists > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Your Recent Lists</h3>
            <Link
              href="/dashboard/favorites-lists"
              className="text-emerald-600 hover:text-emerald-700 font-semibold"
            >
              View All →
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoritesLists.slice(0, 3).map((list) => (
              <div key={list.id} className="border border-gray-200 rounded-lg p-4 hover:border-emerald-300 transition-colors">
                <h4 className="font-semibold text-gray-900 mb-2">{list.title}</h4>
                {list.description && (
                  <p className="text-sm text-gray-600 mb-3">{list.description}</p>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{list._count.properties} properties</span>
                  {list.shareUuid ? (
                    <span className="text-emerald-600 font-medium">📤 Shared</span>
                  ) : (
                    <span className="text-gray-400">Private</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Success Stories / Social Proof */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-8 border border-yellow-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          💼 How Agents Are Winning with Favorites Lists
        </h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl mb-3">🎯</div>
            <h4 className="font-bold text-lg mb-2">Sarah M.</h4>
            <p className="text-sm text-gray-600">
              &quot;Closed 3 deals last month using custom lists. Clients love the personalized approach!&quot;
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl mb-3">🚀</div>
            <h4 className="font-bold text-lg mb-2">Marcus T.</h4>
            <p className="text-sm text-gray-600">
              &quot;Sharing lists with my notes shows expertise. Referrals increased 40% this quarter.&quot;
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl mb-3">💎</div>
            <h4 className="font-bold text-lg mb-2">Elena R.</h4>
            <p className="text-sm text-gray-600">
              &quot;Clients forward my lists to friends. Each list generates 2-3 new leads on average.&quot;
            </p>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      {totalLists === 0 && (
        <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-xl p-8 text-white text-center">
          <h3 className="text-3xl font-bold mb-4">⏰ Don&apos;t Wait - Start Today</h3>
          <p className="text-xl opacity-90 mb-6">
            Every day without organized client lists is a day your competitors get ahead. 
            <br /><strong>Start your first list now and see the difference.</strong>
          </p>
          <Link
            href="/dashboard/favorites-lists"
            className="inline-flex items-center px-8 py-4 bg-white text-red-600 font-bold rounded-lg hover:bg-gray-100 transition-colors text-lg"
          >
            Create Your First Client List Now →
          </Link>
        </div>
      )}
    </div>
  );
}