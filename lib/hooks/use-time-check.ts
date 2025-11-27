'use client';

import { useEffect, useState } from 'react';
import { TimeService } from '@/lib/services/time-service';

interface TimeCheckResult {
  showMorningPlanner: boolean;
  showDailyReview: boolean;
  greeting: string;
}

export function useTimeCheck(): TimeCheckResult {
  const [showMorningPlanner, setShowMorningPlanner] = useState(false);
  const [showDailyReview, setShowDailyReview] = useState(false);
  const [greeting, setGreeting] = useState('Hello');
  
  useEffect(() => {
    // 检查是否需要显示晨间计划器
    if (TimeService.shouldShowMorningPlanner()) {
      // 延迟1秒显示，让用户先看到主界面
      const timer = setTimeout(() => {
        setShowMorningPlanner(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  useEffect(() => {
    // 检查是否需要显示每日回顾
    const checkDailyReview = () => {
      if (TimeService.shouldShowDailyReview()) {
        setShowDailyReview(true);
      }
    };
    
    // 立即检查一次
    checkDailyReview();
    
    // 每分钟检查一次
    const interval = setInterval(checkDailyReview, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    // 设置问候语
    setGreeting(TimeService.getGreeting());
  }, []);
  
  return {
    showMorningPlanner,
    showDailyReview,
    greeting,
  };
}

export function useMorningPlanner() {
  const [isOpen, setIsOpen] = useState(false);
  
  const open = () => setIsOpen(true);
  
  const close = () => {
    setIsOpen(false);
    TimeService.markMorningPlannerShown();
  };
  
  return { isOpen, open, close };
}

export function useDailyReview() {
  const [isOpen, setIsOpen] = useState(false);
  
  const open = () => setIsOpen(true);
  
  const close = () => {
    setIsOpen(false);
    TimeService.markDailyReviewCompleted();
  };
  
  return { isOpen, open, close };
}
