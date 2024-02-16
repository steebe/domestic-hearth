import { Override } from "../override.js";

export const HEARTH_STORAGE_KEY = "hearth";
export const HEARTH_ID_MIN = 2000;

export const getHearth = async () => {
  const hearth = await chrome.storage.local.get(HEARTH_STORAGE_KEY);
  return hearth;
}

export const clearHearth = async () => {
  const hearth = await getHearth();
  if (hearth === null || Object.keys(hearth).length === 0) {
    return;
  }
  chrome.storage.local.set(
    {hearth: []},
  );
}

export const amendHearth = async (override: Override) => {
  const hearth = await getHearth();
  if (hearth === null || Object.keys(hearth).length === 0) {
    throw new Error("Hearth state missing. Cannot amend Hearth.");
  }
  const currentOverrides: Array<Override> = hearth["hearth"];
  currentOverrides.push(override);
  chrome.storage.local.set(
    {hearth: currentOverrides},
  );
}

export const getNextOverrideId = async (): Promise<number> => {
  const hearth = await getHearth();
  if (hearth === null || Object.keys(hearth).length === 0) {
    throw new Error("Hearth state missing. Cannot amend Hearth.");
  }
  const currentOverrides: Array<Override> = hearth["hearth"];
  let maxOverrideId = 0;
  if (currentOverrides !== null && Object.keys(currentOverrides).length !== 0) {
    maxOverrideId = Math.max(
      ...currentOverrides.map(override => override.id)
                         .filter(id => id !== null && id !== undefined) as number[]
    ) + 1;
  }
  return Math.max(HEARTH_ID_MIN, maxOverrideId);
}