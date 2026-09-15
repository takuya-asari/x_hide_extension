// 要素のセレクタとストレージキーの対応定義（「news」で一括管理）
const targetElements = {
  premium: 'aside[aria-label="プレミアムにサブスクライブ"]',
  news: '[data-testid^="news_sidebar_article"][role="link"]', // 個別記事
  now: '[aria-label="タイムライン: 速報"]',
  recommned: 'aside[aria-label="おすすめユーザー"]',
};

// 設定を適用する関数
function applySettings(settings) {
  // 1. セレクタで一括指定できる要素の処理
  let styleTag = document.getElementById('x-toggle-style');
  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.id = 'x-toggle-style';
    document.head.appendChild(styleTag);
  }

  let css = '';
  for (const [key, selector] of Object.entries(targetElements)) {
    if (settings[key]) {
      css += `${selector} { display: none !important; }\n`;
    }
  }
  styleTag.textContent = css;

  // 2. 「本日のニュース」の見出し（h2）をテキスト完全一致で判定して処理（news連動）
  const headings = document.querySelectorAll('h2[aria-level="2"][role="heading"]');
  headings.forEach(h2 => {
    if (h2.textContent.trim() === '本日のニュース') {
      if (settings.news) {
        h2.style.display = 'none';
      } else {
        h2.style.display = '';
      }
    }
  });

  // 3. 広告（テキスト判定が必要なもの）の処理
  const tweets = document.querySelectorAll('article[data-testid="tweet"]');
  tweets.forEach(tweet => {
    if (settings.ads) {
      if (tweet.innerText.includes('広告')) {
        tweet.style.display = 'none';
      }
    } else {
      // スイッチがOFFの時は元に戻す
      if (tweet.innerText.includes('広告')) {
        tweet.style.display = '';
      }
    }
  });
}

// 初期化時にストレージからデータを読み込む
const keysToGet = [...Object.keys(targetElements), 'ads'];
chrome.storage.local.get(keysToGet, (result) => {
  applySettings(result);
});

// ポップアップ等からの変更通知を受け取る
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local') {
    chrome.storage.local.get(keysToGet, (result) => {
      applySettings(result);
    });
  }
});

// スクロール時などの動的追加に対応する監視役
const observer = new MutationObserver(() => {
  chrome.storage.local.get(keysToGet, (result) => {
    applySettings(result);
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
