import { getNextOverrideId } from "./chrome/storage.js";
import { UnfinishedOverrideError } from "./error.js";
import { Override } from "./override.js";
import { isValidUrl } from "./utils/url.js";

export const DATA_ID_ATTRIBUTE_NAME = "data-id";

export function clearOverridesTable(): void {
  const overrideTable = document?.querySelector(".overrideTable");
  while(overrideTable?.firstChild) {
    overrideTable.firstChild.remove();
  }
}

export function renderPlaceholderRow(): void {
  const distractionInput = document?.createElement("input");
  distractionInput.classList.add("distraction");
  distractionInput.type = "text";
  distractionInput.placeholder = "...";

  const replacementInput = document?.createElement("input");
  replacementInput.classList.add("replacement");
  replacementInput.type = "text";
  replacementInput.placeholder = "...";

  const distractionCell = document?.createElement("td");
  distractionCell.appendChild(distractionInput);

  const replacementCell = document?.createElement("td");
  replacementCell.appendChild(replacementInput);

  const overrideRow = document?.createElement("tr");
  overrideRow.classList.add("override");
  overrideRow.appendChild(distractionCell);
  overrideRow.appendChild(replacementCell);

  const overrideTable = document?.querySelector(".overrideTable");
  overrideTable?.appendChild(overrideRow);
}

export function renderOverrideRow(override: Override): void {
  if (override === null || override === undefined) {
    throw new Error("Must provide valid Override");
  }
  const distractionInput = document?.createElement("input");
  distractionInput.classList.add("distraction");
  distractionInput.type = "text";
  distractionInput.value = override.distraction;

  const replacementInput = document?.createElement("input");
  replacementInput.classList.add("replacement");
  replacementInput.type = "text";
  replacementInput.value = override.replacement;

  const distractionCell = document?.createElement("td");
  distractionCell.appendChild(distractionInput);

  const replacementCell = document?.createElement("td");
  replacementCell.appendChild(replacementInput);
  
  const overrideRow = document?.createElement("tr");
  if (override.id) {
    overrideRow.setAttribute(DATA_ID_ATTRIBUTE_NAME, override.id.toString());
    distractionInput.setAttribute("disabled", "true");
    replacementInput.setAttribute("disabled", "true");
  }
  overrideRow.classList.add("override");
  overrideRow.appendChild(distractionCell);
  overrideRow.appendChild(replacementCell);
  
  const overrideTable = document?.querySelector(".overrideTable");
  overrideTable?.prepend(overrideRow);
}

export const getLatestOverrideDraft = async (): Promise<Override | null> => {
  const overrideRowNodes = document?.querySelectorAll(".override");
  if (overrideRowNodes === null || overrideRowNodes.length === 0) {
    throw new Error("No override rows present in UI...");
  }

  const overrideId = await getNextOverrideId();

  let override: Override | null = null;

  const overrideDraft = [...overrideRowNodes].find(node => {
    const overrideId = node.getAttribute(DATA_ID_ATTRIBUTE_NAME);
    if (overrideId === null || overrideId === undefined) {
      return node;
    }
  });

  if (overrideDraft === undefined) {
    throw new Error("No override draft present...");
  }

  let missingRequiredField = false;
  const distractionInputElement = (overrideDraft.querySelector(".distraction") as HTMLInputElement);
  const distraction = distractionInputElement?.value;
  if (
    distraction === null
    || distraction === undefined
    || distraction.length === 0
  ) {
    distractionInputElement.setAttribute("id", "error");
    missingRequiredField = true;
  } else {
    distractionInputElement.removeAttribute("id");
  }

  const replacementInputElement = (overrideDraft.querySelector(".replacement") as HTMLInputElement);
  const replacement = replacementInputElement?.value;
  console.log("Replacement valid: ", isValidUrl(replacement));
  if (
    replacement === null
    || replacement === undefined
    || replacement.length === 0
    || !isValidUrl(replacement)
  ) {
    replacementInputElement.setAttribute("id", "error");
    missingRequiredField = true;
  } else {
    replacementInputElement.removeAttribute("id");
  }

  if (missingRequiredField) {
    throw new UnfinishedOverrideError();
  }

  overrideDraft.setAttribute(DATA_ID_ATTRIBUTE_NAME, overrideId.toString());
  distractionInputElement.setAttribute("disabled", "true");
  replacementInputElement.setAttribute("disabled", "true");

  override = {
    distraction: distraction,
    replacement: replacement,
    id: overrideId
  };

  return override;
}