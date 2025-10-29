作品集

我來詳細說明這個入口網站的程式碼結構和修改方法！
```
📋 程式碼結構說明
🏗️ 主要架構：
HTML 結構
├── Header (標題區域)
├── Statistics (統計卡片)
├── Navigation Cards (主要功能卡片)
│   ├── 關於我卡片
│   └── 作品集卡片
├── Portfolio Modal (作品集彈窗)
├── Add Project Modal (新增作品彈窗)
└── Footer (頁尾)
```
⚙️ 核心功能模組：
📁 路徑配置 (PATHS)
🔧 GitHub 整合 (GITHUB_CONFIG)
💾 數據管理 (portfolioData)
🎯 導航系統
📊 統計計數器
🎯 關於我 - 修改指南
📍 位置： Navigation Cards 區域的第一個卡片
🔧 常見修改：
``` js
1. 修改 AI 版本按鈕

// 在 PATHS.about 中修改路徑
const PATHS = {
    about: {
        gpt: './about/gpt/index.html',        // ChatGPT 版本
        claude: './about/claude/index.html',   // Claude 版本  
        deepseek: './about/deepseek/index.html', // DeepSeek 版本
        gemini: './about/gemini/index.html'    // Gemini 版本
    }
};

2. 新增 AI 版本

// 同時在 PATHS 和 getAIName 函數中新增
const PATHS = {
    about: {
        // 現有的...
        新AI名稱: './about/新AI名稱/index.html'
    }
};

function getAIName(aiName) {
    const aiNames = {
        // 現有的...
        '新AI名稱': '顯示名稱'
    };
    return aiNames[aiName] || aiName;
}

3. 修改卡片標題和描述

4. 更換圖示
```
💼 作品集 - 修改指南
📍 位置： Navigation Cards 區域的第二個卡片 + Portfolio Modal
🔧 常見修改：
``` html
1. 修改 kabc 資料夾路徑

// 在 PATHS.kabc 中修改
const PATHS = {
    kabc: {
        aboutme: './kabc/aboutme/index.html',  // 關於我作品路徑
        game: './kabc/game/index.html',        // 遊戲作品路徑
        // 新增更多作品類型
        project1: './kabc/project1/index.html'
    }
};

2. 新增作品類型按鈕

3. 修改作品分類選項

4. 修改 GitHub 配置

// 在程式碼頂部找到這個區塊並修改
const GITHUB_CONFIG = {
    username: 'your-github-username',    // 🔧 改成你的 GitHub 用戶名
    repo: 'your-repository-name',        // 🔧 改成你的倉庫名稱  
    token: 'your-github-token',          // 🔧 改成你的 GitHub Token
    dataFile: 'portfolio-data.json'      // 數據檔案名稱
};
``` css
🎨 外觀修改指南
1. 更換配色
/* 在 <style> 區域修改 */
.solid-bg {
    background: #your-color;  /* 主背景色 */
}

.stats-card {
    background: #your-color;  /* 統計卡片背景 */
    border: 1px solid #your-border-color;
}

2. 修改卡片樣式
3. 更換圖示顏色
📝 文字內容修改
1. 網站標題
2. 統計標籤
3. 頁尾文字
🚀 快速修改範例
範例 1：新增一個「部落格」按鈕到關於我卡片
// 在 PATHS 中新增
const PATHS = {
    about: {
        // 現有的...
        blog: './blog/index.html'
    }
};
```
範例 2：修改網站為「我的作品展示」
⚠️ 注意事項
修改路徑時：確保檔案確實存在於指定位置
新增按鈕時：記得同時更新 JavaScript 函數
修改配色時：注意對比度，確保文字清晰可讀
GitHub 配置：Token 需要有倉庫寫入權限
