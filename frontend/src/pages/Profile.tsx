import { H2, Paragraph } from "../components/Typography/Typography";
import { useProfile } from "../contexts/ProfileContext";

import "./Profile.scss";

export function ProfileTab() {
  const { isCurrentUser, fullName } = useProfile();

  return (
    <section className="profile-content" aria-label="Profile content">
      <div className="coming-soon">
        <div className="coming-soon__icon" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <H2
          className="coming-soon__title"
          fontFamily="sans-serif"
          variant="heading-3"
          color="high-contrast"
        >
          Coming soon
        </H2>
        <Paragraph className="coming-soon__description" variant="body-2" color="mid-contrast">
          {isCurrentUser ? (
            <>
              Your album calendar, recommendations, and shared picks will live here.
              Start trading albums with friends to fill it up.
            </>
          ) : (
            <>
              {fullName}&apos;s album calendar and recommendations will appear here once
              they start sharing.
            </>
          )}
        </Paragraph>
      </div>
    </section>
  );
}
