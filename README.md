

```
📋 程式碼結構說明
🏗️ 主要架構：
HTML 結構
├── Header (標題區域)
├── Statistics (統計卡片 - 訪客計數器已更新至 GAS)
├── Navigation Cards (主要功能卡片)
│   ├── 關於我卡片
│   └── 作品集卡片
├── Portfolio Modal (作品集彈窗)
├── Add Project Modal (新增/編輯作品彈窗)
└── Footer (頁尾)
```

⚙️ 核心功能模組：
📁 路徑配置 (PATHS)
🔒 **GitHub 整合 (GITHUB\_CONFIG)** - **已更新為 Secrets 機制**
💾 數據管理 (portfolioData)
🎯 導航系統
📊 **統計計數器** - **已更新為 Google Apps Script (GAS)**

-----

### 🚀 系統配置與運維指南

#### 1\. 訪客計數器配置 (Google Apps Script)

為了穩定性和可靠性，訪客計數器已改用 Google Apps Script (GAS) 搭配 Google Sheet 實現。

**🔧 必填設定：**

1.  **在 `index.html` 的 `<script>` 區塊中，找到並替換您的 GAS Web App URL：**
    ```javascript
    // 範例：請替換為您的實際部署 URL
    const GAS_API_URL = 'YOUR_DEPLOYED_GAS_WEB_APP_URL'; 
    ```
2.  **GAS 程式碼：** 必須將提供的 GAS 程式碼貼到 Google Sheet 綁定的 Apps Script 專案中，並執行 `autoSetup` 函式來儲存 Sheet ID。

#### 2\. GitHub 整合與安全配置 (Secrets / 環境變數機制)

為遵循資安最佳實踐，GitHub Token 已移除硬編碼，改為透過 **GitHub Secrets** (環境變數) 和 **Actions** 注入。

**🚨 步驟 A：取得加密值 (本地操作)**

1.  **下載加密工具：** 使用提供的 `encrypt_tool.html` 檔案（或從程式碼中重建）在本地瀏覽器中執行加密。
2.  **設定密碼：** 輸入您打算用於加密的密碼（此密碼是原始文本）。
3.  **加密 Token：** 輸入您的原始 GitHub Token (PAT) 進行加密，得到一串長長的加密結果。

**⚙️ 步驟 B：設定 GitHub Secrets (環境變數)**
您必須在您的 GitHub 倉庫的 **Settings -\> Secrets -\> Actions** 中設定以下四個 Secrets (即環境變數)。**這四個 Secrets 會被 Actions 讀取並注入到程式碼中，實現自動解鎖。**

| Secret Name (環境變數) | Value (填寫內容) | 來源 | 說明 |
| :--- | :--- | :--- | :--- |
| `REPO_OWNER_USERNAME` | 您的 GitHub 用戶名 | 手動填寫 | Actions 將用此覆蓋程式碼中的用戶名。 |
| `REPO_NAME` | 您的倉庫名稱 | 手動填寫 | Actions 將用此覆蓋程式碼中的倉庫名。 |
| `AUTH_TOKEN_SECRET` | **加密後的 Token** 字符串 | 來自加密工具的輸出 | 儲存加密密文 (密文 C)。網站運行時解密此值。 |
| `AUTH_PASSWORD_SECRET` | **加密時使用的原始密碼** | 來自加密工具的輸出 | 儲存原始密碼 (密碼 A)。用於在網站運行時解密密文 C。**此值為原始文本，無需加密。** |

**✅ 運行驗證：** 每次運行 GitHub Actions 時，它會自動將這些 Secrets 注入到您的靜態 HTML 中，並由前端程式碼解密，實現安全同步。

-----

### 🎯 關於我 - 修改指南

📍 **位置：** Navigation Cards 區域的第一個卡片
🔧 **常見修改：**

```js
// 在 PATHS.about 中修改或新增路徑
const PATHS = {
    about: {
        gpt: './aboutme/gpt/index.html',        // ChatGPT 版本
        // ... (現有的 AI 版本)
        新AI名稱: './aboutme/新AI名稱/index.html' // 新增 AI 版本
    }
    // ...
};
```
```js
function getAIName(aiName) {
    const aiNames = {
        // 現有的...
        '新AI名稱': '顯示名稱'
    };
    return aiNames[aiName] || aiName;
}```

### 💼 作品集 - 修改指南

📍 **位置：** Navigation Cards 區域的第二個卡片 + Portfolio Modal
🔧 **核心變更：** 網站已加入作品**編輯**功能和優化了**查看**按鈕的 UI/UX。

```js
// 範例：新增一個內頁作品
const PATHS = {
    // ...
    projects: {
        kabc: './projects/kabc/about/index.html', // 你的關於我頁面
        project1: './projects/kabc/project1/index.html' // 新增專案路徑
    }
};
```

```css
🎨 外觀修改指南
1. 更換配色
/* 顏色主要集中在 Tailwind 配置區塊或內聯樣式中 */

2. 修改卡片樣式
3. 更換圖示顏色
📝 文字內容修改
1. 網站標題
2. 統計標籤
3. 頁尾文字
```

⚠️ **注意事項**

  * **部署前**：確保您已在 GitHub Secrets 中設定所有四個必要的環境變數。
  * **計數器**：確保您的 GAS Web App URL 已經部署並能夠在瀏覽器中成功回傳 JSON。
  * **修改路徑**：確保檔案確實存在於指定位置。

<!-- end list -->

```
```