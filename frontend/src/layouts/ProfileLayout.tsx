import React from "react";
import { Outlet, useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

import { BaseLayout } from "./BaseLayout";
import { PageContainer } from "../components/PageContainer/PageContainer";
import { ProfileHeader, getFullName } from "../components/ProfileHeader/ProfileHeader";
import { LoadingSpinner } from "../components/LoadingSpinner/LoadingSpinner";
import { Paragraph } from "../components/Typography/Typography";
import { ProfileProvider } from "../contexts/ProfileContext";
import { fetchClerkUserByUsername, ClerkUser } from "../api/clerk";
import { getFollowers } from "../api/follows";

import "../pages/Profile.scss";

export function ProfileLayout() {
  const { username } = useParams();
  const { user, isLoaded } = useUser();

  const [userData, setUserData] = React.useState<ClerkUser | null>(null);
  const [friends, setFriends] = React.useState<ClerkUser[]>([]);
  const [isLoadingProfile, setIsLoadingProfile] = React.useState(true);
  const [loadError, setLoadError] = React.useState<string | null>(null);

  const isCurrentUser = isLoaded && user?.username === username;

  const refreshFriends = React.useCallback(async () => {
    if (!userData?.externalId) {
      setFriends([]);
      return;
    }

    const response = await getFollowers(userData.externalId);
    setFriends(response);
  }, [userData?.externalId]);

  React.useEffect(() => {
    const getUserData = async () => {
      if (!username) {
        return;
      }

      setIsLoadingProfile(true);
      setLoadError(null);

      try {
        const response = await fetchClerkUserByUsername(username);
        setUserData(response);
      } catch (error) {
        console.error("Error loading profile:", error);
        setLoadError("Could not load profile. Make sure the API server is running.");
        setUserData(null);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    getUserData();
  }, [username]);

  React.useEffect(() => {
    refreshFriends();
  }, [refreshFriends]);

  if (isLoadingProfile) {
    return (
      <BaseLayout className="profile-page">
        <PageContainer>
          <LoadingSpinner />
        </PageContainer>
      </BaseLayout>
    );
  }

  if (!userData) {
    return (
      <BaseLayout className="profile-page">
        <PageContainer>
          <Paragraph variant="body-2">{loadError ?? "User not found."}</Paragraph>
        </PageContainer>
      </BaseLayout>
    );
  }

  const fullName = getFullName(userData);

  return (
    <BaseLayout className="profile-page">
      <PageContainer>
        <ProfileProvider
          value={{
            userData,
            friends,
            followersCount: friends.length,
            isCurrentUser,
            isLoaded,
            fullName,
            refreshFriends,
          }}
        >
          <ProfileHeader
            userData={userData}
            followersCount={friends.length}
            isCurrentUser={isCurrentUser}
            isLoaded={isLoaded}
          />
          <Outlet />
        </ProfileProvider>
      </PageContainer>
    </BaseLayout>
  );
}
