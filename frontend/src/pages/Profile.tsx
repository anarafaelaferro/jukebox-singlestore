import React from "react";
import { useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { BaseLayout } from "../layouts/BaseLayout";
import { PageContainer } from "../components/PageContainer/PageContainer";
import { Tag } from "../components/Tag/Tag";
import { H1, Paragraph, Bold } from "../components/Typography/Typography";
import { FollowActions } from "../components/FollowActions/FollowActions";
import { LoadingSpinner } from "../components/LoadingSpinner/LoadingSpinner";
import { fetchClerkUserByUsername, ClerkUser } from "../api/clerk";
import { getFollowers } from "../api/follows";

import "./Profile.scss";

export const ProfilePage = () => {
  const { username } = useParams();
  const { user, isLoaded } = useUser();

  const [userData, setUserData] = React.useState<ClerkUser | null>(null);
  const [followersCount, setFollowersCount] = React.useState<number>(0);
  const [isLoadingProfile, setIsLoadingProfile] = React.useState(true);

  const [loadError, setLoadError] = React.useState<string | null>(null);

  const isCurrentUser = isLoaded && user?.username === username;

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
      } finally {
        setIsLoadingProfile(false);
      }
    };

    getUserData();
  }, [username]);

  React.useEffect(() => {
    const fetchFollowers = async () => {
      if (!userData?.externalId) {
        setFollowersCount(0);
        return;
      }

      const response = await getFollowers(userData.externalId);
      setFollowersCount(response.length);
    };

    fetchFollowers();
  }, [userData]);

  let fullName: string = userData?.username ?? "";
  if (userData?.firstName || userData?.lastName) {
    fullName = `${userData.firstName} ${userData.lastName}`.trim();
  }

  if (isLoadingProfile) {
    return (
      <BaseLayout className="profile-page">
        <PageContainer>
          <LoadingSpinner />
        </PageContainer>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout className="profile-page">
      <PageContainer>
        {loadError && <Paragraph variant="body-2">{loadError}</Paragraph>}
        {!userData && !loadError && (
          <Paragraph variant="body-2">User not found.</Paragraph>
        )}
        {userData && (
        <div className="header">
          <div className="profile-image">
            {Boolean(userData?.imageUrl) && (
              <img src={userData?.imageUrl} alt={fullName} width="150" height="150" />
            )}
          </div>
          <div>
            <H1 className="username">
              <span>{fullName || "…"}</span>
              <Tag>@{userData?.username}</Tag>
            </H1>
            <div className="stats">
              <Paragraph>
                <Bold>102</Bold> albums listened
              </Paragraph>
              <Paragraph>
                <Bold>45</Bold> albums shared
              </Paragraph>
              <Paragraph>
                <Bold>{followersCount}</Bold>{" "}
                {followersCount === 1 ? "friend" : "friends"}
              </Paragraph>
            </div>

            {isLoaded && !isCurrentUser && (
              <FollowActions otherUserId={userData?.externalId} />
            )}
          </div>
        </div>
        )}
      </PageContainer>
    </BaseLayout>
  );
};
