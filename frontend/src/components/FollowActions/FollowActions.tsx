import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

import { Button } from "../Button/Button";
import { Paragraph } from "../Typography/Typography";
import {
  sendFollowRequest,
  getFollowStatus,
  cancelFollowRequest,
  acceptFollowRequest,
  rejectFollowRequest,
} from "../../api/follows";

import "./FollowActions.scss";

type FollowActionsProps = {
  otherUserId?: string | null;
  initialFollowStatus?: "none" | "pending" | "accepted";
  onStatusChange?: () => void;
};

export function FollowActions({
  otherUserId,
  initialFollowStatus = "none",
  onStatusChange,
}: FollowActionsProps) {
  const { user, isLoaded } = useUser();
  const currentUserId = user?.externalId;

  const [isLoading, setIsLoading] = React.useState(true);
  const [followStatus, setFollowStatus] = React.useState(initialFollowStatus);
  const [initiatorUserId, setInitiatorUserId] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const fetchFollowStatus = React.useCallback(async () => {
    if (!currentUserId || !otherUserId) {
      setIsLoading(false);
      return;
    }

    const { status, initiator_user_id } = await getFollowStatus({
      followerUserId: currentUserId,
      followeeUserId: otherUserId,
    });

    setFollowStatus(status === "rejected" ? "none" : status);
    setInitiatorUserId(initiator_user_id ? String(initiator_user_id) : null);
    setIsLoading(false);
  }, [currentUserId, otherUserId]);

  React.useEffect(() => {
    fetchFollowStatus();
  }, [fetchFollowStatus]);

  const runAction = async (action: () => Promise<unknown>) => {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      await action();
      await fetchFollowStatus();
      onStatusChange?.();
    } catch (error: unknown) {
      const message =
        axiosErrorMessage(error) ?? "Something went wrong. Please try again.";
      setErrorMessage(message);
      await fetchFollowStatus();
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) {
    return null;
  }

  if (!user) {
    return (
      <Paragraph variant="body-2">
        <Link to="/login">Sign in</Link> to add friends
      </Paragraph>
    );
  }

  if (!user.externalId) {
    return (
      <Paragraph variant="body-2">
        Your account is still being set up. Try again in a moment.
      </Paragraph>
    );
  }

  if (!otherUserId) {
    return null;
  }

  if (String(currentUserId) === String(otherUserId)) {
    return null;
  }

  const handleFollow = () =>
    runAction(async () => {
      setFollowStatus("pending");
      setInitiatorUserId(String(currentUserId));
      await sendFollowRequest({
        followerUserId: currentUserId!,
        followeeUserId: otherUserId,
      });
    });

  const handleCancelRequest = () =>
    runAction(async () => {
      setFollowStatus("none");
      await cancelFollowRequest({
        followerUserId: currentUserId!,
        followeeUserId: otherUserId,
      });
    });

  const handleAccept = () =>
    runAction(async () => {
      setFollowStatus("accepted");
      await acceptFollowRequest({
        followerUserId: otherUserId,
        followeeUserId: currentUserId!,
      });
    });

  const handleReject = () =>
    runAction(async () => {
      setFollowStatus("none");
      await rejectFollowRequest({
        followerUserId: otherUserId,
        followeeUserId: currentUserId!,
      });
    });

  const handleRemoveFriend = () => {
    if (!window.confirm("Are you sure you want to remove this friend?")) {
      return;
    }

    runAction(async () => {
      setFollowStatus("none");
      await rejectFollowRequest({
        followerUserId: currentUserId!,
        followeeUserId: otherUserId,
      });
    });
  };

  return (
    <div className="follow-actions-component">
      {errorMessage && <Paragraph variant="body-2">{errorMessage}</Paragraph>}

      {followStatus === "none" && (
        <Button onClick={handleFollow} disabled={isLoading}>
          Add friend
        </Button>
      )}

      {followStatus === "pending" && initiatorUserId === currentUserId && (
        <Button onClick={handleCancelRequest} disabled={isLoading}>
          Cancel request
        </Button>
      )}

      {followStatus === "pending" && initiatorUserId !== currentUserId && (
        <>
          <Button onClick={handleAccept} disabled={isLoading}>
            Accept
          </Button>
          <Button onClick={handleReject} disabled={isLoading} variant="solid-neutral">
            Reject
          </Button>
        </>
      )}

      {followStatus === "accepted" && (
        <Button onClick={handleRemoveFriend} disabled={isLoading} variant="outline-neutral">
          Remove friend
        </Button>
      )}
    </div>
  );
}

function axiosErrorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: { data?: { error?: string } } }).response?.data?.error ===
      "string"
  ) {
    return (error as { response: { data: { error: string } } }).response.data.error;
  }

  return null;
}
