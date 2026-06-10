import axios from "axios";
import { fetchClerkUsersByExternalIds } from "./clerk";
import camelcaseKeys from 'camelcase-keys';

type FollowProps = {
  followerUserId: string;
  followeeUserId: string;
  status: "pending" | "accepted" | "rejected";
};

type FollowRequestProps = Pick<FollowProps, "followerUserId" | "followeeUserId">;

type FollowStatusResponse = {
  status: "none" | "pending" | "accepted" | "rejected";
  initiator_user_id: string | null;
};

const defaultFollowStatus: FollowStatusResponse = {
  status: "none",
  initiator_user_id: null,
};

export async function sendFollowRequest({ followerUserId, followeeUserId }: FollowRequestProps) {
  const response = await axios.post('/api/follow-request', {
    follower_user_id: followerUserId,
    followee_user_id: followeeUserId,
  });

  return response.data;
}

export async function getFollowStatus({
  followerUserId,
  followeeUserId,
}: FollowRequestProps): Promise<FollowStatusResponse> {
  try {
    const response = await axios.get('/api/follow-status', {
      params: {
        follower_user_id: followerUserId,
        followee_user_id: followeeUserId,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching follow status:', error);
    return defaultFollowStatus;
  }
}

export async function cancelFollowRequest ({ followerUserId, followeeUserId }: FollowRequestProps) {
  const response = await axios.post('/api/follow-action', {
    action: 'cancel',
    follower_user_id: followerUserId,
    followee_user_id: followeeUserId,
  });
  return response.data;
}

export const acceptFollowRequest = async ({ followerUserId, followeeUserId }: FollowRequestProps) => {
  const response = await axios.post('/api/follow-action', {
    action: 'accept',
    follower_user_id: followerUserId,
    followee_user_id: followeeUserId,
  });
  return response.data;
};

export const rejectFollowRequest = async ({ followerUserId, followeeUserId }: FollowRequestProps) => {
  const response = await axios.post('/api/follow-action', {
    action: 'reject',
    follower_user_id: followerUserId,
    followee_user_id: followeeUserId,
  });
  return response.data;
};

export const getPendingFollowRequests = async (userId: string) => {
  const response = await axios.get('/api/follow-requests', {
    params: {
      user_id: userId,
    },
  });

  const requests = camelcaseKeys(response.data.requests, { deep: true }) as FollowProps[];

  if (requests.length === 0) {
    return [];
  }

  const requestUserIds = requests.map((request) => request.followerUserId);
  return fetchClerkUsersByExternalIds(requestUserIds);
};

export const getFollowers = async (userId: string) => {
  const response = await axios.get('/api/followers', {
    params: {
      user_id: userId,
    },
  });

  const followers = camelcaseKeys(response.data.followers, { deep: true }) as FollowProps[];

  if (followers.length === 0) {
    return [];
  }

  const followerUserIds = followers.map((follower) => follower.followerUserId);
  return fetchClerkUsersByExternalIds(followerUserIds);
};
