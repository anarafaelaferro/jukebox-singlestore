import React from "react";
import { useParams, Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

import { BaseLayout } from "../layouts/BaseLayout";
import { PageContainer } from "../components/PageContainer/PageContainer";
import { H1, H2, Paragraph, Bold, Span } from "../components/Typography/Typography";
import { FollowActions } from "../components/FollowActions/FollowActions";
import { LoadingSpinner } from "../components/LoadingSpinner/LoadingSpinner";
import { fetchClerkUserByUsername, ClerkUser } from "../api/clerk";
import { getPendingFollowRequests, getFollowers } from "../api/follows";

import "./Friends.scss";

export function FriendsPage() {
  const { username } = useParams();
  const { user, isLoaded } = useUser();

  const [profileOwner, setProfileOwner] = React.useState<ClerkUser | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = React.useState(true);
  const [isLoadingRequests, setIsLoadingRequests] = React.useState(true);
  const [friends, setFriends] = React.useState<ClerkUser[]>([]);
  const [pendingFollowRequests, setPendingFollowRequests] = React.useState<ClerkUser[]>([]);

  const isCurrentUser = isLoaded && user?.username === username;

  const [loadError, setLoadError] = React.useState<string | null>(null);

  const loadFriendsData = React.useCallback(async () => {
    if (!username) {
      return;
    }

    setIsLoadingProfile(true);
    setLoadError(null);

    try {
      const owner = await fetchClerkUserByUsername(username);
      setProfileOwner(owner);

      if (!owner?.externalId) {
        setFriends([]);
        setPendingFollowRequests([]);
        return;
      }

      const friendsResponse = await getFollowers(owner.externalId);
      setFriends(friendsResponse);

      if (isLoaded && user?.username === username && user.externalId) {
        setIsLoadingRequests(true);
        const requestsResponse = await getPendingFollowRequests(user.externalId);
        setPendingFollowRequests(requestsResponse);
      } else {
        setPendingFollowRequests([]);
      }
    } catch (error) {
      console.error("Error loading friends page:", error);
      setLoadError("Could not load friends. Make sure the API server is running.");
    } finally {
      setIsLoadingProfile(false);
      setIsLoadingRequests(false);
    }
  }, [username, isLoaded, user?.username, user?.externalId]);

  React.useEffect(() => {
    loadFriendsData();
  }, [loadFriendsData]);

  if (isLoadingProfile) {
    return (
      <BaseLayout className="friends-page">
        <PageContainer>
          <LoadingSpinner />
        </PageContainer>
      </BaseLayout>
    );
  }

  if (!profileOwner) {
    return (
      <BaseLayout className="friends-page">
        <PageContainer>
          <H1>Friends</H1>
          <Paragraph variant="body-2">
            {loadError ?? "User not found."}
          </Paragraph>
        </PageContainer>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout className="friends-page">
      <PageContainer>
        <H1>
          {isCurrentUser ? "Friends" : `@${profileOwner.username}'s friends`}
        </H1>

        {isCurrentUser && (
          <>
            <H2 fontFamily="sans-serif" variant="heading-3">
              Friend requests
            </H2>
            <ul className="pending-requests">
              {isLoadingRequests ? (
                <LoadingSpinner />
              ) : pendingFollowRequests.length > 0 ? (
                pendingFollowRequests.map((request) => (
                  <li key={request.id} className="follower-row">
                    <img
                      src={request.imageUrl}
                      alt={request.username ?? "user"}
                      width="45"
                      height="45"
                    />
                    <Paragraph>
                      <Bold>
                        <Link to={`/${request.username}`}>@{request.username}</Link>
                      </Bold>{" "}
                      wants to trade albums with you
                    </Paragraph>
                    <FollowActions
                      otherUserId={request.externalId}
                      initialFollowStatus="pending"
                      onStatusChange={loadFriendsData}
                    />
                  </li>
                ))
              ) : (
                <Paragraph variant="body-2">No pending friend requests</Paragraph>
              )}
            </ul>
          </>
        )}

        <H2 fontFamily="sans-serif" variant="heading-3">
          Friends <Span weight="normal">({friends.length})</Span>
        </H2>
        {friends.length > 0 ? (
          <ul>
            {friends.map((friend) => (
              <li key={friend.id} className="follower-row">
                <img
                  src={friend.imageUrl}
                  alt={friend.username ?? "user"}
                  width="45"
                  height="45"
                />
                <Paragraph>
                  <Bold>
                    <Link to={`/${friend.username}`}>@{friend.username}</Link>
                  </Bold>
                </Paragraph>
                {isCurrentUser && (
                  <FollowActions
                    otherUserId={friend.externalId}
                    initialFollowStatus="accepted"
                    onStatusChange={loadFriendsData}
                  />
                )}
              </li>
            ))}
          </ul>
        ) : (
          <Paragraph variant="body-2">No friends yet</Paragraph>
        )}
      </PageContainer>
    </BaseLayout>
  );
}
