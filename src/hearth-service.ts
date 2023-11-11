import { addRedirect, removeRedirects } from "./chrome/redirect.js";
import { Override } from "./override.js";
import { HEARTH_STORAGE_KEY, amendHearth, clearHearth, getHearth } from "./chrome/storage.js"
import { clearOverridesTable, getLatestOverrideDraft, renderOverrideRow, renderPlaceholderRow } from "./ui.js";

export const clear = async() => {
  try {
    const hearth = await getHearth();
    if (hearth === null || Object.keys(hearth).length === 0) {
      console.info("No hearth to clear.");
      return;
    }
    const currentOverrides: Array<Override> = hearth[HEARTH_STORAGE_KEY] || [];
    await clearHearth();
    removeRedirects(currentOverrides);
    clearOverridesTable();
    renderPlaceholderRow();
  } catch (e) {
    console.log(e);
  }
}

export const submitLatestOverride = async () => {
  try {
    const override = await getLatestOverrideDraft();
    if (override === null) {
      return;
    }
    await addOverride(override);
  } catch (e) { }
}

export const addOverride = async (override: Override) => {
  await amendHearth(override);
  addRedirect(override);
  renderPlaceholderRow();
}

export const init = async () => {
  // Obtain or create Hearth
  let hearth = await getHearth();
  if (hearth === null || Object.keys(hearth).length === 0) {
    const initialHearth = {
      hearth: new Array<Override>()
    };
    chrome.storage.local.set(
      initialHearth,
      () => console.info("Hearth initialized...")
    );
    hearth = await getHearth();
  }

  // Render UI elements
  const overrides: Array<Override> = hearth[HEARTH_STORAGE_KEY] || [];
  overrides.sort((a, b) => {
    if (a === undefined || a.id === undefined) {
      return -1;
    }
    if (b === undefined || b.id === undefined) {
      return 1;
    }
    return b.id - a.id;
  });
  if (overrides.length !== 0 && Object.keys(overrides).length !== 0) {
    overrides.forEach(override => renderOverrideRow(override));
  }
  renderPlaceholderRow();
}