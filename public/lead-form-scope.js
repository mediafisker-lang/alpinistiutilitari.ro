(() => {
  const activeClasses = ["border-[#176B87]", "bg-[#E8F0F3]", "text-[#102A43]"];
  const inactiveClasses = [
    "border-[#DCE4E9]",
    "bg-white",
    "text-[#334E68]",
    "hover:border-[#176B87]/40",
  ];

  function styleButton(button, active) {
    button.setAttribute("aria-pressed", String(active));
    button.classList.remove(...(active ? inactiveClasses : activeClasses));
    button.classList.add(...(active ? activeClasses : inactiveClasses));
  }

  function applyScope(form, scope) {
    const national = scope === "national";
    let scopeInput = form.querySelector('input[name="distributionScope"]');
    const countySelect = form.querySelector('select[name="countyId"]');
    const countyText = form.querySelector('input[name="countyText"]');
    const help = form.querySelector("[data-national-scope-help]");

    if (!scopeInput) {
      scopeInput = document.createElement("input");
      scopeInput.type = "hidden";
      scopeInput.name = "distributionScope";
      form.append(scopeInput);
    }
    scopeInput.value = scope;
    if (countySelect) {
      countySelect.disabled = national;
      countySelect.required = !national;
      if (national) countySelect.value = "";
    }
    if (countyText && national) countyText.value = "National";
    if (help) help.hidden = !national;

    form.querySelectorAll("[data-lead-scope]").forEach((button) => {
      styleButton(button, button.dataset.leadScope === scope);
    });
  }

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-lead-scope]");
    if (!button) return;
    const form = button.closest("form");
    if (!form) return;
    event.preventDefault();
    event.stopPropagation();
    applyScope(form, button.dataset.leadScope);
  }, true);

  document.addEventListener("change", (event) => {
    const select = event.target.closest('select[name="countyId"]');
    if (!select) return;
    const form = select.closest("form");
    const countyText = form?.querySelector('input[name="countyText"]');
    if (countyText) countyText.value = select.selectedOptions[0]?.text ?? "";
  }, true);
})();
