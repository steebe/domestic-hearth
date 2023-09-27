// Action behaviors
chrome.action.isEnabled().then((isEnabled) => {
  if (!isEnabled) {
    chrome.action.setIcon({
      path: {
        "16": "assets/disabled-16_16.png",
        "32": "assets/disabled-32_32.png",
        "48": "assets/disabled-48_48.png",
        "128": "assets/disabled-128_128.png"
      }
    });
  }
});

const urlOverrides = [
  {
    url: "reddit.com",
    redirect: "https://steebe.dev",
  }
];

urlOverrides.forEach((override, index) => {
  chrome.declarativeNetRequest.updateDynamicRules({
    addRules: [{
      id : index + 1,
      priority: 1,
      action: {
        type: chrome.declarativeNetRequest.RuleActionType.REDIRECT,
        redirect: { "url": override.redirect },
      },
      condition: {
        urlFilter: override.url,
        resourceTypes: [chrome.declarativeNetRequest.ResourceType.MAIN_FRAME]
      }
    }],
    removeRuleIds: [index + 1]
  });
});