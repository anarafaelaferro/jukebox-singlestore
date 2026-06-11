import React from "react";

import { ClerkUser } from "../api/clerk";

export type ProfileContextValue = {
  userData: ClerkUser;
  friends: ClerkUser[];
  followersCount: number;
  isCurrentUser: boolean;
  isLoaded: boolean;
  fullName: string;
  refreshFriends: () => Promise<void>;
};

const ProfileContext = React.createContext<ProfileContextValue | null>(null);

export function ProfileProvider({
  value,
  children,
}: React.PropsWithChildren<{ value: ProfileContextValue }>) {
  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const context = React.useContext(ProfileContext);

  if (!context) {
    throw new Error("useProfile must be used within ProfileLayout");
  }

  return context;
}
