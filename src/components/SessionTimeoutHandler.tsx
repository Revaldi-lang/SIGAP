'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '@/context/AppContext';

const WARNING_TIMEOUT = 29 * 60 * 1000; // 29 minutes (1 minute warning)
const TIMER_INTERVAL = 1000; // 1 second

export default function SessionTimeoutHandler() {
  const { currentUser, logout } = useApp();
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const lastActivityRef = useRef<number>(0);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleAutomaticLogout = useCallback(async () => {
    setShowWarning(false);
    await logout();
    alert('Sesi Anda telah berakhir secara otomatis karena tidak ada aktivitas.');
    window.location.href = '/';
  }, [logout]);

  const resetTimer = useCallback(() => {
    const now = Date.now();
    // Throttle writes to localStorage: at most once every 5 seconds
    if (now - lastActivityRef.current > 5000 || showWarning) {
      localStorage.setItem('sigap_session_last_activity', now.toString());
    }
    lastActivityRef.current = now;
    if (showWarning) {
      setShowWarning(false);
      setCountdown(60);
    }
  }, [showWarning]);

  useEffect(() => {
    if (!currentUser) return;

    // Initialize last activity timestamp on mount
    lastActivityRef.current = Date.now();

    // Track user actions
    const actions = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];
    actions.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    // Check inactivity every 10 seconds
    const inactivityInterval = setInterval(() => {
      if (showWarning) return; // Managed by countdown timer

      const lastActivity = parseInt(localStorage.getItem('sigap_session_last_activity') || '0') || lastActivityRef.current;
      const elapsed = Date.now() - lastActivity;

      if (elapsed >= WARNING_TIMEOUT) {
        setShowWarning(true);
        setCountdown(60);
      }
    }, 10000); // Check every 10s

    return () => {
      actions.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
      clearInterval(inactivityInterval);
    };
  }, [currentUser, showWarning, resetTimer]);

  // Countdown timer when warning modal is shown
  useEffect(() => {
    if (showWarning) {
      countdownIntervalRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownIntervalRef.current!);
            handleAutomaticLogout();
            return 0;
          }
          return prev - 1;
        });
      }, TIMER_INTERVAL);
    } else {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    }

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [showWarning, handleAutomaticLogout]);

  const handleKeepLoggedIn = () => {
    resetTimer();
  };

  if (!showWarning) return null;

  return (
    <div className="fixed inset-0 bg-[#1E1B18]/75 backdrop-blur-sm z-[200] flex items-center justify-center animate-fade-in">
      <div className="bg-white border border-[#D3C5B1] rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8 relative text-center mx-4">
        {/* Warning Icon */}
        <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center text-3xl mx-auto mb-4 border border-amber-200">
          <span className="material-symbols-outlined">hourglass_empty</span>
        </div>

        {/* Content */}
        <h3 className="text-lg font-bold text-[#1C1B18]">Peringatan Keamanan</h3>
        <p className="text-sm text-[#4E4639] mt-2 leading-relaxed">
          Sesi Anda akan segera kedaluwarsa dalam <span className="font-bold text-red-600 text-lg">{countdown}</span> detik karena tidak ada aktivitas.
        </p>

        {/* Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleAutomaticLogout}
            className="w-full bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold py-3 rounded-lg border border-red-200 uppercase tracking-wider transition"
          >
            Keluar Sekarang
          </button>
          <button
            onClick={handleKeepLoggedIn}
            className="w-full bg-[#001360] hover:opacity-90 text-white text-xs font-bold py-3 rounded-lg uppercase tracking-wider transition"
          >
            Tetap Masuk
          </button>
        </div>
      </div>
    </div>
  );
}
