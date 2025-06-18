
"use client";

import type { ReactNode } from 'react';
import React, { createContext, useState, useContext, useCallback } from 'react';

interface LayoutVisibilityContextType {
  showLayoutElements: boolean;
  setShowLayoutElements: (show: boolean) => void;
}

const LayoutVisibilityContext = createContext<LayoutVisibilityContextType | undefined>(undefined);

export function LayoutVisibilityProvider({ children }: { children: ReactNode }) {
  const [showLayoutElements, setShowLayoutElementsState] = useState(true);

  // useCallback to stabilize setShowLayoutElements function reference
  const setShowLayoutElements = useCallback((show: boolean) => {
    setShowLayoutElementsState(show);
  }, []);

  return (
    <LayoutVisibilityContext.Provider value={{ showLayoutElements, setShowLayoutElements }}>
      {children}
    </LayoutVisibilityContext.Provider>
  );
}

export function useLayoutVisibility() {
  const context = useContext(LayoutVisibilityContext);
  if (context === undefined) {
    // This fallback ensures the app doesn't break if context is missing,
    // though ideally it should always be used within a provider.
    // console.warn('useLayoutVisibility must be used within a LayoutVisibilityProvider. Defaulting to show elements.');
    return { showLayoutElements: true, setShowLayoutElements: () => {} };
  }
  return context;
}
