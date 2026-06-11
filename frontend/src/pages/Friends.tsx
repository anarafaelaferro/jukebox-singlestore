import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

import { H2, Paragraph, Bold, Span } from "../components/Typography/Typography";
import { FollowActions } from "../components/FollowActions/FollowActions";
import { LoadingSpinner } from "../components/LoadingSpinner/LoadingSpinner";
import { useProfile } from "../contexts/ProfileContext";
import { ClerkUser } from "../api/clerk";
import { getPendingFollowRequests } from "../api/follows";

import "./Friends.scss";

export function FriendsTab() {
  const { user, isLoaded } = useUser();
  const { userData, friends, isCurrentUser, refreshFriends } = useProfile();

  const [isLoadingRequests, setIsLoadingRequests] = React.useState(true);
  const [pendingFollowRequests, setPendingFollowRequests] = React.useState<ClerkUser[]>([]);

  const loadPendingRequests = React.useCallback(async () => {
    if (isLoaded && isCurrentUser && user?.externalId) {
      setIsLoadingRequests(true);

      try {
        const requestsResponse = await getPendingFollowRequests(user.externalId);
        setPendingFollowRequests(requestsResponse);
      } catch (error) {
        console.error("Error loading friend requests:", error);
        setPendingFollowRequests([]);
      } finally {
        setIsLoadingRequests(false);
      }
    } else {
      setPendingFollowRequests([]);
      setIsLoadingRequests(false);
    }
  }, [isLoaded, isCurrentUser, user?.externalId]);

  const loadFriendsData = React.useCallback(async () => {
    await refreshFriends();
    await loadPendingRequests();
  }, [refreshFriends, loadPendingRequests]);

  React.useEffect(() => {
    loadPendingRequests();
  }, [loadPendingRequests]);

  let friendRequestsSection = null;
  if (isCurrentUser && !isLoadingRequests && pendingFollowRequests.length > 0) {
    friendRequestsSection = (
      <ul className="pending-requests">
        {pendingFollowRequests.map((request) => (
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
        ))}
      </ul>
    );
  }

  return (
    <section className="friends-page__content" aria-label="Friends">
      {isCurrentUser && isLoadingRequests && <LoadingSpinner />}

      {friendRequestsSection}

      {friends.length > 0 ? (
        <ul className="friends-list">
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
        <div className="friends-page__empty-state">
          <Paragraph variant="body-2" color="mid-contrast">
            {isCurrentUser
              ? "No friends yet. Visit someone's profile and send them a friend request to start trading albums."
              : `@${userData.username} hasn't added any friends yet.`}
          </Paragraph>
        </div>
      )}
    </section>
  );
}
