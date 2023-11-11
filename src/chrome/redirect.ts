import { Override } from "../override.js"

export function addRedirect(override: Override) {
  if (override === null || override.id === null || override.id === undefined) {
    throw new Error("A valid Override must be provided for redirect creation.");
  }
  chrome.declarativeNetRequest.updateDynamicRules({
    addRules: [{
      id : override.id,
      priority: 1,
      action: {
        type: chrome.declarativeNetRequest.RuleActionType.REDIRECT,
        redirect: { "url": override.replacement },
      },
      condition: {
        urlFilter: override.distraction,
        resourceTypes: [chrome.declarativeNetRequest.ResourceType.MAIN_FRAME]
      }
    }],
    removeRuleIds: [override.id]
  });
}

export function addRedirects(overrides: Array<Override>) {
  overrides.forEach(override => addRedirect(override));
}

export function removeRedirects(overrides: Array<Override>) {
  if (overrides === null || overrides.length === 0) {
    return;
  }
  const overrideIds = overrides.map(override => override.id)
                               .filter(id => id !== null && id !== undefined) as number[];
  if (overrideIds === null || overrideIds.length === 0) {
    throw new Error("A valid list of overrides must be provided.");
  }

  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [...overrideIds]
  });
}