import React, { useEffect, useState } from 'react';
import { CriteriaSOPModal } from './criteria/SOPModal';

interface SOPModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LIGHT_THEME = {
  surface: '#ffffff',
  surface2: '#f8fafc',
  border: '#e4e4e7',
  border2: '#d4d4d8',
  text: '#18181b',
  text2: '#3f3f46',
  text3: '#71717a',
};

const DARK_THEME = {
  surface: '#09090b',
  surface2: '#18181b',
  border: '#27272a',
  border2: '#3f3f46',
  text: '#fafafa',
  text2: '#d4d4d8',
  text3: '#a1a1aa',
};

export function SOPModal({ isOpen, onClose }: SOPModalProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const syncViewport = () => setIsMobile(window.innerWidth < 768);
    const syncTheme = () => {
      setIsDark(
        document.documentElement.classList.contains('dark') ||
          document.body.classList.contains('dark'),
      );
    };

    syncViewport();
    syncTheme();

    window.addEventListener('resize', syncViewport);

    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      window.removeEventListener('resize', syncViewport);
      observer.disconnect();
    };
  }, []);

  if (!isOpen) return null;

  return (
    <CriteriaSOPModal
      th={isDark ? DARK_THEME : LIGHT_THEME}
      onClose={onClose}
      isMobile={isMobile}
    />
  );
}
