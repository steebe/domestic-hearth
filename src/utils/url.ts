import { InvalidReplacementError } from "../error.js";

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

export function massageReplacement(replacementPayload: string): string {
  if (replacementPayload === null || replacementPayload === undefined) {
    throw new InvalidReplacementError("The replacement cannot be empty.");
  }

  // Determine if there is a domain extension
  const domainAndExtension = replacementPayload.split(".");
  if (domainAndExtension.length == 1) {
    throw new InvalidReplacementError("The provided replacement is missing a domain extension.");
  }

  let result = replacementPayload;
  if (!isValidUrl(replacementPayload)) {
    // Determine if their is a protocol. If not, add one...
    const protocolAndHost = replacementPayload.split(":");
    if (protocolAndHost.length == 1) {
      result = "https://" + result;
    }
    if (!isValidUrl(result)) {
      throw new InvalidReplacementError("The provided replacement cannot be converted to a valid URL.");
    }
  }

  return result;
}