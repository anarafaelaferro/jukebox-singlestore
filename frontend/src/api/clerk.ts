import axios from 'axios';
import camelcaseKeys from 'camelcase-keys';

export type ClerkUser = {
  id: string;
  username: string | null;
  externalId: string | null;
  imageUrl: string;
  firstName: string | null;
  lastName: string | null;
};

type FetchClerkUsersParams = {
  username?: string;
  external_id?: string;
  external_ids?: string;
};

function normalizeUsersResponse(data: unknown): ClerkUser[] {
  if (Array.isArray(data)) {
    return data.map((user) => camelcaseKeys(user, { deep: true })) as ClerkUser[];
  }

  const normalized = camelcaseKeys(data as Record<string, unknown>, { deep: true }) as {
    data?: ClerkUser[];
  };

  return normalized.data ?? [];
}

export const fetchClerkUser = async (userId?: string) => {
  try {
    const response = await axios.get(`/api/clerk/user`, {
      params: {
        user_id: userId,
      },
    });
    return camelcaseKeys(response.data) as ClerkUser;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

export const fetchClerkUsers = async (
  params: FetchClerkUsersParams
): Promise<ClerkUser[]> => {
  try {
    const response = await axios.get('/api/clerk/users', {
      params,
    });

    return normalizeUsersResponse(response.data);
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const fetchClerkUserByUsername = async (username: string) => {
  try {
    const users = await fetchClerkUsers({ username });
    return users[0] ?? null;
  } catch (error) {
    console.error("Error fetching user by username:", error);
    return null;
  }
};

export const fetchClerkUsersByExternalIds = async (externalIds: string[]) => {
  if (externalIds.length === 0) {
    return [];
  }

  return fetchClerkUsers({ external_ids: externalIds.join(',') });
};
