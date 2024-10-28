import React from 'react';

import { BaseLayout } from "../layouts/BaseLayout";

import "./About.scss";

export function About() {
  return (
    <BaseLayout className="page-about">
      <h1>About Jukebox</h1>
      <p>Jukebox is a calendar made from a collection of several people's favorite albums.</p>
      <p>
        I asked around for favorites and have been listening to almost one each day, which
        has been far more insteresting than listening to Spotify's recommendations.
        As these albums weren't picked based on my taste, the music is much more diverse.
      </p>
      <p>Send me yours through <a href="https://twitter.com/anarafaelaferro" target="_blank" rel="noreferrer">Twitter</a>{" "}
        or <a href="https://instagram.com/anarafaelaferro" target="_blank" rel="noreferrer">Instagram</a>.</p>

      <p>collected by <a href="http://www.rafaelaferro.com/" target="_blank" rel="noreferrer">rafaelaferro</a></p>
    </BaseLayout>
  );
}

