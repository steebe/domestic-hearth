import { clear, init, submitLatestOverride } from "./hearth-service.js";
import { $ } from "./ui.js";

const submit = async () => submitLatestOverride();

$("overridesForm")?.addEventListener("submit", (event) => {
  event.preventDefault();
  submit();
});

$("clear")?.addEventListener("click", async () => {
  clear();
});

init();