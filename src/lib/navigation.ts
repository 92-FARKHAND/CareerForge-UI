import type { LucideIcon } from 'lucide-react';
import {
  Binary,
  Briefcase,
  ClipboardCheck,
  FileText,
  LayoutDashboard,
  Layers,
  Radar,
  Settings,
  UserRound,
} from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export interface NavItemWithChildren extends NavItem {
  items: NavItem[];
}

/** Top-level workspace links shown first in the sidebar. */
export const primaryNav: NavItem[] = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { title: 'Resumes', href: '/resumes', icon: FileText },
  { title: 'Compatibility', href: '/compatibility', icon: Radar },
];

/** Learning has its own overview page plus two always-visible sub-tracks. */
export const learningNav: NavItemWithChildren = {
  title: 'Learning',
  href: '/learning',
  icon: Layers,
  items: [
    { title: 'OOP', href: '/learning/oop', icon: Layers },
    { title: 'DSA', href: '/learning/dsa', icon: Binary },
  ],
};

/** Feature areas that are extensible but not fully built out yet. */
export const secondaryFeatureNav: NavItem[] = [
  { title: 'Assessments', href: '/assessments', icon: ClipboardCheck },
  { title: 'Jobs', href: '/jobs', icon: Briefcase },
];

/** Account-scoped links, grouped separately at the bottom of the nav. */
export const accountNav: NavItem[] = [
  { title: 'Profile', href: '/profile', icon: UserRound },
  { title: 'Settings', href: '/settings', icon: Settings },
];

const allNavItems: NavItem[] = [
  ...primaryNav,
  learningNav,
  ...learningNav.items,
  ...secondaryFeatureNav,
  ...accountNav,
];

/**
 * Resolves the current route to a human-readable page title for the topbar.
 * Falls back to formatting the last path segment for routes not yet in the nav config.
 */
export function getPageTitle(pathname: string): string {
  const exactMatch = allNavItems.find((item) => item.href === pathname);
  if (exactMatch) {
    return exactMatch.title;
  }

  // Detail routes like /resumes/<id> take their section's title.
  const sectionMatch = allNavItems
    .filter((item) => pathname.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0];
  if (sectionMatch) {
    return sectionMatch.title;
  }

  const segments = pathname.split('/').filter(Boolean);
  const lastSegment = segments.at(-1) ?? 'Dashboard';

  return lastSegment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
