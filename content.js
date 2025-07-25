'use strict';

// --- 核心策略 v7：精簡版 (僅保留模擬互動) ---
// 這個版本移除了所有 UI 和其他防護層，
// 只專注於定期模擬使用者活動來防止頁面因閒置而刷新。

console.log('Facebook 防止閒置刷新擴充功能已啟動 (v7 - 僅模擬活動模式)。');

// --- 全域變數與設定 ---
const SIMULATE_ACTIVITY_INTERVAL_MS = 30000; // 每 30 秒模擬一次活動

let activityInterval = null;

// --- 保護層邏輯 ---

/**
 * 模擬使用者活動，包含聚焦視窗、點擊和微幅滾動，
 * 以欺騙閒置偵測機制。
 */
function simulateAdvancedActivity() {
    // 模擬焦點事件，讓頁面認為使用者正在互動
    window.dispatchEvent(new Event('focus'));
    
    // 模擬在頁面 body 上的點擊事件
    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    
    // 模擬微小的滾動，這是許多網站偵測活動的方式之一
    window.scrollBy(0, 1);
    window.scrollBy(0, -1);
    
    console.log('[Anti-Refresh] 已執行一次背景活動模擬。');
}

/**
 * 啟動定時的活動模擬。
 * 如果計時器已在執行中，則不會重複啟動。
 */
function startActivitySimulation() {
    if (activityInterval) return; // 如果已經在執行，則直接返回
    activityInterval = setInterval(simulateAdvancedActivity, SIMULATE_ACTIVITY_INTERVAL_MS);
    console.log('[Anti-Refresh] 已啟用保護 3: 強化活動模擬。');
}

// --- 啟動 ---
// 腳本載入後直接啟動活動模擬
startActivitySimulation();
