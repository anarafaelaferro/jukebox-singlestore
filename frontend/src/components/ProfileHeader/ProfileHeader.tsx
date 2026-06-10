import React from "react";
import { Link, useLocation } from "react-router-dom";

import { Tag } from "../Tag/Tag";
import { H1, Paragraph, Bold } from "../Typography/Typography";
import { FollowActions } from "../FollowActions/FollowActions";
import { ClerkUser } from "../../api/clerk";

import "./ProfileHeader.scss";

type ProfileHeaderProps = {
  userData: ClerkUser;
  followersCount: number;
  isCurrentUser: boolean;
  isLoaded: boolean;
};

function getFullName(userData: ClerkUser): string {
  if (userData.firstName || userData.lastName) {
    return `${userData.firstName ?? ""} ${userData.lastName ?? ""}`.trim();
  }

  return userData.username ?? "";
}

export function ProfileHeader({
  userData,
  followersCount,
  isCurrentUser,
  isLoaded,
}: ProfileHeaderProps) {
  const location = useLocation();
  const activeTab = location.pathname.endsWith("/friends") ? "friends" : "profile";
  const fullName = getFullName(userData);
  const friendsLabel = followersCount === 1 ? "friend" : "friends";

  return (
    <header className="profile-header">
      <div className="profile-header__identity">
        <div className="profile-header__image">
          {Boolean(userData.imageUrl) && (
            <img src={userData.imageUrl} alt={fullName} width="150" height="150" />
          )}
        </div>
        <div>
          <H1 className="profile-header__username">
            <span>{fullName || "…"}</span>
            <Tag>@{userData.username}</Tag>
          </H1>
          <div className="profile-header__stats">
            <Paragraph>
              <Bold>102</Bold> albums listened
            </Paragraph>
            <Paragraph>
              <Bold>45</Bold> albums shared
            </Paragraph>
            <Paragraph>
              {activeTab === "friends" ? (
                <>
                  <Bold>{followersCount}</Bold> {friendsLabel}
                </>
              ) : (
                <Link className="profile-header__friends-link" to={`/${userData.username}/friends`}>
                  <Bold>{followersCount}</Bold> {friendsLabel}
                </Link>
              )}
            </Paragraph>
          </div>

          {isLoaded && !isCurrentUser && (
            <FollowActions otherUserId={userData.externalId} />
          )}
        </div>
      </div>

      <nav className="profile-tabs" aria-label="Profile sections">
        <Link
          className={`profile-tabs__tab${activeTab === "profile" ? " profile-tabs__tab--active" : ""}`}
          to={`/${userData.username}`}
          aria-current={activeTab === "profile" ? "page" : undefined}
        >
          Profile
        </Link>
        <Link
          className={`profile-tabs__tab${activeTab === "friends" ? " profile-tabs__tab--active" : ""}`}
          to={`/${userData.username}/friends`}
          aria-current={activeTab === "friends" ? "page" : undefined}
        >
          Friends
        </Link>
      </nav>
    </header>
  );
}

export { getFullName };
