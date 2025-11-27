// 时间管理服务 - 处理晨间计划和每日回顾的时间逻辑

export class TimeService {
  private static readonly MORNING_PLANNER_KEY = 'lastMorningPlanner';
  private static readonly DAILY_REVIEW_KEY = 'lastDailyReview';
  
  /**
   * 检查是否应该显示晨间计划器
   * 规则: 每天首次访问时显示
   */
  static shouldShowMorningPlanner(): boolean {
    if (typeof window === 'undefined') return false;
    
    const lastShown = localStorage.getItem(this.MORNING_PLANNER_KEY);
    const today = new Date().toDateString();
    
    return lastShown !== today;
  }
  
  /**
   * 检查是否应该显示每日回顾
   * 规则: 晚上6点后且当天还未回顾
   */
  static shouldShowDailyReview(): boolean {
    if (typeof window === 'undefined') return false;
    
    const now = new Date();
    const hour = now.getHours();
    const lastReview = localStorage.getItem(this.DAILY_REVIEW_KEY);
    const today = now.toDateString();
    
    return hour >= 18 && lastReview !== today;
  }
  
  /**
   * 标记晨间计划器已显示
   */
  static markMorningPlannerShown(): void {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem(this.MORNING_PLANNER_KEY, new Date().toDateString());
  }
  
  /**
   * 标记每日回顾已完成
   */
  static markDailyReviewCompleted(): void {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem(this.DAILY_REVIEW_KEY, new Date().toDateString());
  }
  
  /**
   * 获取当前时段问候语
   * 
   * ⚠️ 水合风险：服务器时间 != 客户端时间
   * 推荐：在使用此方法的组件上添加 suppressHydrationWarning
   * 或者确保组件是纯 Client Component
   */
  static getGreeting(): string {
    if (typeof window === 'undefined') return 'Hello'; // SSR 默认值
    
    const hour = new Date().getHours();
    
    if (hour < 6) return 'Night Owl';
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }
  
  /**
   * 检查是否是工作日
   */
  static isWeekday(): boolean {
    const day = new Date().getDay();
    return day >= 1 && day <= 5;
  }
  
  /**
   * 获取今天的日期字符串 (YYYY-MM-DD)
   */
  static getTodayString(): string {
    return new Date().toISOString().split('T')[0];
  }
}
