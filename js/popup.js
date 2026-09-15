const keys = ['premium', 'news', 'now', 'recommned', 'ads'];

// ポップアップを開いたときに現在の状態を反映
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(keys, (result) => {
    keys.forEach((key) => {
      const checkbox = document.getElementById(key);
      if (checkbox) {
        checkbox.checked = !!result[key];
      }
    });
  });

  // チェックボックスが変更されたら保存
  keys.forEach((key) => {
    const checkbox = document.getElementById(key);
    if (checkbox) {
      checkbox.addEventListener('change', () => {
        chrome.storage.local.set({ [key]: checkbox.checked });
      });
    }
  });
});
