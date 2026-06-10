notification_app_fe/context/ReadContext.js
import React, { createContext, useEffect, useState } from 'react';

// Key used in localStorage
const STORAGE_KEY = 'readNotifications';

export const ReadContext = createContext({
  readIds: new Set(),
  markAsRead: (id) => {},
  isRead: (id) => false,
});

export const ReadProvider = ({ children }) => {
  const [readIds, setReadIds] = useState(new Set());

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const arr = JSON.parse(stored);
        setReadIds(new Set(arr));
      } catch (e) {
        console.error('Failed to parse read notifications from storage', e);
      }
    }
  }, []);

  // Persist changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(readIds)));
  }, [readIds]);

  const markAsRead = (id) => {
    setReadIds((prev) => new Set(prev).add(id));
  };

  const isRead = (id) => readIds.has(id);

  return (
    <ReadContext.Provider value={{ readIds, markAsRead, isRead }}>
      {children}
    </ReadContext.Provider>
  );
};
