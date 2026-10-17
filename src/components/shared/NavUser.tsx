'use client';

import Link from 'next/link';
import { ChevronsUpDown, LogOut, Settings, UserRound } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useProfile } from '@/lib/hooks/account-queries';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux';
import { useSignoutMutation } from '@/lib/redux/api/authApi';
import { baseApi } from '@/lib/redux/api/baseApi';
import { clearUser } from '@/lib/redux/slices/authSlice';

function getInitials(source: string): string {
  const words = source.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export function NavUser() {
  const { isMobile } = useSidebar();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  // Shares the cache RequireAuth already filled, so this costs no request.
  const { data: profile } = useProfile();

  // After a reload the only things we may have are the saved email (see
  // ReduxProvider) and, once loaded, the profile name — use whichever
  // exist rather than claiming the user isn't signed in.
  const profileName = profile?.name?.trim() || '';
  const displayName =
    profileName || (user ? user.email.split('@')[0] : 'Account');
  const subtitle = user?.email ?? 'Signed in';
  const initials = getInitials(profileName || user?.email || '');

  const [signout, { isLoading: isSigningOut }] = useSignoutMutation();

  async function handleLogout() {
    if (isSigningOut) return;

    try {
      // Ask the backend to end the session (it clears the auth cookies).
      await signout().unwrap();
    } catch {
      // Even if the request fails (offline, already-expired session), the
      // user asked to leave — never trap them signed in on this device.
      // If the cookie did survive, the next load will simply restore the
      // session, which is the correct behaviour for a failed signout.
    }

    // Wipe auth and the RTK Query cache. clearUser also marks us as a known
    // guest, which makes RequireAuth redirect to /login — with no further
    // request — and lets /login render without asking the server anything.
    dispatch(clearUser());
    dispatch(baseApi.util.resetApiState());
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground"
              />
            }
          >
            <Avatar size="sm" className="rounded-lg">
              <AvatarFallback className="rounded-lg">
                {initials || <UserRound className="h-4 w-4" />}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{displayName}</span>
              <span className="truncate text-xs text-muted-foreground">
                {subtitle}
              </span>
            </div>
            <ChevronsUpDown className="ml-auto size-4" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-(--anchor-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            {/* base-ui throws if a label isn't inside a group — this is what
                crashed the whole menu when it was opened. */}
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal">
                <span className="block truncate text-sm font-medium">
                  {displayName}
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {subtitle}
                </span>
              </DropdownMenuLabel>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem render={<Link href="/profile" />}>
              <UserRound />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href="/settings" />}>
              <Settings />
              Settings
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              variant="destructive"
              disabled={isSigningOut}
              onClick={handleLogout}
            >
              <LogOut />
              {isSigningOut ? 'Logging out…' : 'Log out'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
