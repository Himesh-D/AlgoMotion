import { useState, useEffect, useCallback } from 'react';
import { SpiralAnimation } from './SpiralAnimation.jsx';

export function IntroScreen({ onComplete }) {
  const [ctaVisible, setCTAVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Fade in the CTA after 1.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setCTAVisible(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Handle "Start Visualizing" click
  const handleEnter = useCallback(() => {
    setIsExiting(true);

    // Wait for exit animation to complete
    setTimeout(() => {
      onComplete();
    }, 600);
  }, [onComplete]);

  // Handle "Skip" click
  const handleSkip = useCallback(() => {
    onComplete();
  }, [onComplete]);

  return (
    <div className={`intro-screen ${isExiting ? 'intro-exiting' : ''}`} id="intro-screen">
      {/* Background Spiral Animation */}
      <div className="intro-spiral-bg">
        <SpiralAnimation />
      </div>

      {/* Overlay Gradient */}
      <div className="intro-overlay" />

      {/* Skip Button (top-right) */}
      <button
        className="intro-skip-btn"
        onClick={handleSkip}
        id="intro-skip-btn"
        aria-label="Skip intro animation"
        tabIndex={0}
      >
        Skip <span className="skip-arrow">→</span>
      </button>

      {/* Center Content */}
      <div className={`intro-content ${ctaVisible ? 'intro-content-visible' : ''}`}>
        <h1 className="intro-title">
          <span className="intro-title-algo">Algo</span>
          <span className="intro-title-motion">Motion</span>
        </h1>

        <p className="intro-subtitle">
          Visualize Algorithms. Understand Logic.
        </p>

        <button
          className={`intro-cta-btn ${ctaVisible ? 'intro-cta-visible' : ''}`}
          onClick={handleEnter}
          id="intro-cta-btn"
          tabIndex={0}
        >
          <span className="cta-text">Start Visualizing</span>
          <span className="cta-glow" />
        </button>
      </div>

      {/* Ambient Particles Overlay */}
      <div className="intro-particles">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="intro-float-particle"
            style={{
              '--delay': `${i * 0.8}s`,
              '--x': `${15 + Math.random() * 70}%`,
              '--y': `${10 + Math.random() * 80}%`,
              '--size': `${2 + Math.random() * 4}px`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
