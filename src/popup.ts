interface Override {
  id: number,
  distraction: string,
  replacement: string,
}

const HEARTH_STORAGE_KEY = "hearth";

const $ = (id: string) => document?.getElementById(id);

function addOverrideEntryRow() {
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

function addOverrideRow(override: Override) {
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
  overrideRow.classList.add("override");
  overrideRow.appendChild(distractionCell);
  overrideRow.appendChild(replacementCell);
  
  const overrideTable = document?.querySelector(".overrideTable");
  overrideTable?.prepend(overrideRow);
}

const syncStorageAndUi = async (): Promise<void> => {

  // Check local storage for hearth
  let hearthCurrentState = await chrome.storage.local.get([HEARTH_STORAGE_KEY]);
  if (hearthCurrentState === null || Object.keys(hearthCurrentState).length === 0) {
    console.log("No local storage, creating the Hearth.");

    const initialHearth = {
      hearth: new Array<Override>()
    };

    await chrome.storage.local.set(
      initialHearth,
      () => console.log("Hearth created...")
    );
    hearthCurrentState = await chrome.storage.local.get(HEARTH_STORAGE_KEY);
  }

  console.log("Hearth contents:", JSON.stringify(hearthCurrentState, null, 2));

  // // Create popup UI
  const currentOverrides: Array<Override> = hearthCurrentState[HEARTH_STORAGE_KEY];
  currentOverrides.sort((a, b) => a.id - b.id);
  currentOverrides.forEach(override => {
    console.log("Override: ", override);
    addOverrideRow(override);
  });

  addOverrideEntryRow();

  // const overrideTable = document?.querySelector(".overrideTable");

  // Establish static placeholder in the bottom of the table
  // overrideTable?.appendChild(createOverrideRow(
  //   {
  //     id: 0,
  //     distraction: 'reddit.com',
  //     replacement: 'https://work.com'
  //   } as Override
  // ));
}

const saveMappings = async () => {
  // Fetch Hearth
  const hearthCurrentState = await chrome.storage.local.get(HEARTH_STORAGE_KEY);
  if (hearthCurrentState === null || Object.keys(hearthCurrentState).length === 0) {
    throw new Error("init failed...");
  }

  let currentOverrides: Array<Override> = hearthCurrentState["hearth"];
  const savedOverrideIds: Array<number> = currentOverrides.map(override => override.id) || [0];

  const overrideRows = document?.querySelectorAll(".override");
  overrideRows.forEach(overrideRow => {
    const id = overrideRow.getAttribute("id");
    const distraction = (overrideRow.querySelector(".distraction") as HTMLInputElement)?.value;
    const replacement = (overrideRow.querySelector(".replacement") as HTMLInputElement)?.value;

    console.log("ID: ", id);
    console.log("Distraction: ", distraction);
    console.log("Replacement: ", replacement);

    if (id == null) {
      currentOverrides.push({
        id: currentOverrides.length === 0 ? 1 : Math.max(...savedOverrideIds) + 1,
        distraction: distraction,
        replacement: replacement
      } as Override);
      chrome.storage.local.set(
        {hearth: currentOverrides},
        () => console.log("Pushed new override to storage: ", distraction, replacement)
      );
    }
    syncStorageAndUi();
  });

  // setTimeout(() => window?.close(), 350);
}

$("submit")?.addEventListener("click", saveMappings);
$("clear")?.addEventListener("click", async () => {
  await chrome.storage.local.clear().then(() => console.log("cleared storage..."));
  await syncStorageAndUi();
});

syncStorageAndUi().catch(e => console.log(e));