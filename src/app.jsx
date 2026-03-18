import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { IntroScreen } from './components/IntroScreen.jsx';
import './intro.css';

/**
 * IntroApp — React root that manages the intro animation lifecycle.
 * 
 * Flow:
 * 1. Check localStorage for 'introSeen' flag
 * 2. If not seen → render IntroScreen (spiral + CTA)
 * 3. On complete → hide intro, reveal the existing landing page beneath
 * 4. If already seen → immediately reveal landing page
 */
function IntroApp() {
  const [showIntro, setShowIntro] = useState(true);

  const handleIntroComplete = () => {
    setShowIntro(false);
    // Reveal the landing page content underneath
    const landingContent = document.querySelector('.landing-container');
    const landingBg = document.querySelector('.landing-background');
    if (landingContent) landingContent.style.opacity = '1';
    if (landingBg) landingBg.style.opacity = '1';
  };

  useEffect(() => {
    // If intro is showing, hide the landing content
    const landingContent = document.querySelector('.landing-container');
    const landingBg = document.querySelector('.landing-background');

    if (showIntro) {
      if (landingContent) landingContent.style.opacity = '0';
      if (landingBg) landingBg.style.opacity = '0';
    } else {
      if (landingContent) landingContent.style.opacity = '1';
      if (landingBg) landingBg.style.opacity = '1';
    }
  }, [showIntro]);

  if (!showIntro) return null;

  return <IntroScreen onComplete={handleIntroComplete} />;
}

// ── Mount React into the intro root ─────────────────────────────
const introRoot = document.getElementById('intro-root');
if (introRoot) {
  createRoot(introRoot).render(
    <React.StrictMode>
      <IntroApp />
    </React.StrictMode>
  );
}
