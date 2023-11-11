import { clear, init, submitLatestOverride } from "./hearth-service.js";

const $ = (id: string): HTMLElement | null => document?.getElementById(id);

const submit = async () => submitLatestOverride();

$("submit")?.addEventListener("click", submit);
$("clear")?.addEventListener("click", async () => {
  clear();
});

init();