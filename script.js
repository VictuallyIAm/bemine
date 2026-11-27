const STORAGE_KEY = "bemine-agreed";
// Подпишись на этот топик в приложении ntfy (или на https://ntfy.sh/app)
const NTFY_TOPIC = "bemine-vbeketov-yes";

const yesToggle = document.getElementById("reasons-yes-toggle");
const yesPanel = document.getElementById("reasons-yes-panel");
const noToggle = document.getElementById("reasons-no-toggle");
const noPanel = document.getElementById("reasons-no-panel");
const agreeBtn = document.getElementById("agree-btn");
const agreeContent = document.getElementById("agree-content");
const disclaimer = document.getElementById("disclaimer");
const disclaimerLink = document.getElementById("disclaimer-link");

function bindAccordion(toggle, panel) {
  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    const next = !isOpen;

    toggle.setAttribute("aria-expanded", String(next));
    panel.classList.toggle("open", next);
  });
}

function hasAgreed() {
  return localStorage.getItem(STORAGE_KEY) === "true";
}

function setAgreed() {
  localStorage.setItem(STORAGE_KEY, "true");
  localStorage.setItem("bemine-agreed-at", new Date().toISOString());
}

function notifyAgreed() {
  return fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
    method: "POST",
    headers: {
      Title: "Be my girlfriend",
      Priority: "high",
      Tags: "heart,tada",
    },
    body: "Она нажала «Согласиться» 💍",
  }).catch(() => {
    // Не блокируем UI, если сеть недоступна
  });
}

function showDoneState(label = "Ты уже согласилась )))") {
  agreeBtn.classList.remove("waiting");
  agreeBtn.classList.add("done");
  agreeBtn.disabled = true;
  agreeContent.textContent = label;
}

function showWaitingState() {
  agreeBtn.classList.add("waiting");
  agreeBtn.disabled = true;
  agreeContent.innerHTML =
    '<span class="loader" aria-hidden="true"></span><span>Ожидание подтверждения</span>';
}

bindAccordion(yesToggle, yesPanel);
bindAccordion(noToggle, noPanel);

disclaimerLink.addEventListener("click", () => {
  if (disclaimer.dataset.revealed === "true") return;

  disclaimer.dataset.revealed = "true";
  disclaimer.classList.add("is-swapping");

  setTimeout(() => {
    disclaimer.textContent =
      "Правда думала, что тут какие-то условия? Я тебя люблю без условий";
    disclaimer.classList.remove("is-swapping");
  }, 220);
});

if (hasAgreed()) {
  showDoneState();
} else {
  agreeBtn.addEventListener("click", () => {
    if (hasAgreed() || agreeBtn.classList.contains("waiting")) return;

    setAgreed();
    showWaitingState();
    notifyAgreed();

    setTimeout(() => {
      showDoneState("Ты согласилась");
    }, 4000);
  });
}
