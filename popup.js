'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // 獲取 HTML 中的元素
    const mainIcon = document.getElementById('main-icon');
    const messageElement = document.getElementById('message');
    const statusDot = document.getElementById('status-dot');
    const linkContainer = document.getElementById('rate-link-container');
    const footerContainer = document.getElementById('footer-container');
    const storeUrl = 'https://chromewebstore.google.com/detail/%E7%A6%81%E7%94%A8-fb-%E8%87%AA%E5%8B%95%E5%88%B7%E6%96%B0/bmeagdnojhgdgaoeiknnahagmdeakhkd';

    // 讀取國際化文字並設定到介面上
    const rateLink = document.createElement('a');
    rateLink.href = storeUrl;
    rateLink.textContent = chrome.i18n.getMessage("popupRate"); // 國際化
    rateLink.target = '_blank';
    linkContainer.appendChild(rateLink);

    /**
     * 更新 Popup 的顯示內容
     * @param {string} messageKey - messages.json 中的鍵名
     * @param {'checking'|'active'|'inactive'} status - 當前狀態
     * @param {object} options - 其他選項
     */
    function updatePopup(messageKey, status, options = {}) {
        const { showIcon = true, layout = 'full' } = options;

        // 從 i18n API 獲取對應的文字
        messageElement.textContent = chrome.i18n.getMessage(messageKey);
        
        // 更新指示燈
        statusDot.className = 'status-dot';
        if (status === 'active' || status === 'inactive') {
            statusDot.classList.add(status);
        }

        // 控制圖示顯示
        mainIcon.classList.toggle('hidden', !showIcon);

        // 控制底部區塊
        footerContainer.classList.toggle('visible', status === 'active');
        
        // 控制整體高度
        document.body.classList.remove('compact', 'super-compact');
        if (layout === 'compact') {
            document.body.classList.add('compact');
        } else if (layout === 'super-compact') {
            document.body.classList.add('super-compact');
        }
    }

    // 設置初始狀態
    updatePopup('popupChecking', 'checking', { layout: 'compact' });

    // 查詢當前活動的分頁
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs[0];

        if (!currentTab || !currentTab.url) {
            updatePopup('popupInactiveDetect', 'inactive', { showIcon: false, layout: 'super-compact' });
            return;
        }

        if (currentTab.url.includes('facebook.com')) {
            const timeout = setTimeout(() => {
                updatePopup('popupInactiveScript', 'inactive', { layout: 'super-compact' });
            }, 500);

            chrome.tabs.sendMessage(currentTab.id, { type: 'CHECK_STATUS' }, (response) => {
                clearTimeout(timeout);

                if (chrome.runtime.lastError) {
                    console.warn('Content script not available:', chrome.runtime.lastError.message);
                    updatePopup('popupInactiveScript', 'inactive', { layout: 'super-compact' });
                } else if (response && response.status === 'active') {
                    updatePopup('popupActive', 'active');
                } else {
                    updatePopup('popupInactiveError', 'inactive', { layout: 'super-compact' });
                }
            });
        } else {
            // 非 Facebook 頁面
            updatePopup('popupInactivePage', 'inactive', { showIcon: false, layout: 'super-compact' });
        }
    });
});
