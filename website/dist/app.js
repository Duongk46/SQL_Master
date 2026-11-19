/* Browser-local exercise workspace. It intentionally does not connect to SQL Server. */
(() => {
  "use strict";
  const modules = window.SQL_MODULES;
  const exercises = window.SQL_EXERCISES;
  const byId = new Map(exercises.map((item) => [item.id, item]));
  const storageKey = "sql-master-northwind-v1";
  let state;
  try {
    state = JSON.parse(localStorage.getItem(storageKey)) || {};
  } catch {
    state = {};
  }
  state.drafts ||= {};
  state.completed ||= {};
  let selected = byId.has(location.hash.slice(1))
    ? location.hash.slice(1)
    : exercises[0].id;
  let showHint = false;
  let showAnswer = false;

  const $ = (selector) => document.querySelector(selector);
  const escapeHtml = (value) =>
    String(value).replace(
      /[&<>"']/g,
      (char) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[char],
    );
  const save = () => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      /* Storage may be unavailable. */
    }
  };
  const filtered = () => {
    const term = $("#search").value.trim().toLocaleLowerCase("vi");
    const level = $("#level-filter").value;
    const status = $("#status-filter").value;
    return exercises.filter(
      (item) =>
        (level === "all" || item.level === level) &&
        (status === "all" ||
          (status === "done") === Boolean(state.completed[item.id])) &&
        (!term ||
          `${item.title} ${item.prompt} ${modules.find((module) => module.id === item.module).name}`
            .toLocaleLowerCase("vi")
            .includes(term)),
    );
  };
  const renderProgress = () => {
    const count = exercises.filter((item) => state.completed[item.id]).length;
    $("#progress-label").textContent =
      `${count} / ${exercises.length} bài hoàn thành`;
    $("#progress-fill").style.width = `${(100 * count) / exercises.length}%`;
  };
  const renderNav = () => {
    $("#module-nav").innerHTML = modules
      .map((module, index) => {
        const count = exercises.filter(
          (item) => item.module === module.id && state.completed[item.id],
        ).length;
        const total = exercises.filter(
          (item) => item.module === module.id,
        ).length;
        return `<a class="nav-item ${byId.get(selected).module === module.id ? "active" : ""}" href="#practice" data-module="${module.id}"><span class="nav-num">${String(index + 1).padStart(2, "0")}</span>${escapeHtml(module.name)}<span class="nav-count">${count}/${total}</span></a>`;
      })
      .join("");
  };
  const renderList = () => {
    const items = filtered();
    const groups = modules
      .map((module) => ({
        module,
        items: items.filter((item) => item.module === module.id),
      }))
      .filter((group) => group.items.length);
    $("#exercise-list").innerHTML = groups.length
      ? groups
          .map(
            ({ module, items }) =>
              `<div class="list-heading">${escapeHtml(module.name.toUpperCase())}</div>${items.map((item) => `<button class="exercise-item ${item.id === selected ? "active" : ""}" data-id="${item.id}" aria-current="${item.id === selected ? "true" : "false"}"><span class="exercise-number">${item.id}</span><span class="exercise-text"><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.level)}</small></span>${state.completed[item.id] ? '<span class="done-icon" aria-label="Hoàn thành">✓</span>' : ""}</button>`).join("")}`,
          )
          .join("")
      : '<div class="empty">Không tìm thấy bài tập phù hợp.</div>';
  };
  const renderDetail = () => {
    const item = byId.get(selected);
    const module = modules.find((entry) => entry.id === item.module);
    const index = exercises.indexOf(item);
    const done = Boolean(state.completed[item.id]);
    $("#exercise-detail").innerHTML =
      `<div class="detail-top"><div><div class="module-tag">${escapeHtml(module.name.toUpperCase())} / BÀI ${item.id}</div><h2 class="detail-title">${escapeHtml(item.title)}</h2><div class="detail-meta"><span class="level ${item.level === "Nâng cao" ? "advanced" : ""}">${escapeHtml(item.level)}</span><span>${escapeHtml(item.topic)}</span></div></div></div>
      <section class="detail-section"><h3>TRỌNG TÂM CHỦ ĐỀ</h3><div class="detail-content">${escapeHtml(module.summary)}</div></section>
      <section class="detail-section"><h3>YÊU CẦU</h3><div class="detail-content">${escapeHtml(item.prompt)}</div></section>
      <section class="detail-section"><label class="editor-label" for="sql-editor">SQL của bạn <small>Tự lưu trên trình duyệt</small></label><textarea id="sql-editor" class="sql-editor" spellcheck="false" placeholder="-- Gõ câu lệnh T-SQL của bạn ở đây...">${escapeHtml(state.drafts[item.id] || "")}</textarea><div class="detail-actions"><button id="hint-btn" class="small-btn">${showHint ? "Ẩn gợi ý" : "Xem gợi ý"}</button><button id="answer-btn" class="small-btn muted">${showAnswer ? "Ẩn đáp án" : "Hiện đáp án"}</button><button id="complete-btn" class="small-btn ${done ? "" : "success"}">${done ? "Đánh dấu chưa xong" : "Đánh dấu đã làm"}</button></div>
      ${showHint ? `<div class="reveal"><strong>GỢI Ý</strong><p>${escapeHtml(item.hint)}</p></div>` : ""}
      ${showAnswer ? `<div class="reveal"><strong>ĐÁP ÁN THAM KHẢO</strong><pre><code>${escapeHtml(item.answer)}</code></pre><p>${escapeHtml(item.explain)}</p><button class="copy-btn" data-copy-answer>Sao chép đáp án</button></div>` : ""}</section>
      <div class="detail-nav"><button id="prev-btn" ${index === 0 ? "disabled" : ""}>Bài trước</button><button id="next-btn" ${index === exercises.length - 1 ? "disabled" : ""}>Bài tiếp theo</button></div>`;
    $("#sql-editor").addEventListener("input", (event) => {
      state.drafts[item.id] = event.target.value;
      save();
    });
    $("#hint-btn").addEventListener("click", () => {
      showHint = !showHint;
      renderDetail();
    });
    $("#answer-btn").addEventListener("click", () => {
      showAnswer = !showAnswer;
      renderDetail();
    });
    $("#complete-btn").addEventListener("click", () => {
      state.completed[item.id] = !state.completed[item.id];
      save();
      renderProgress();
      renderNav();
      renderList();
      renderDetail();
    });
    $("#prev-btn").addEventListener("click", () =>
      select(exercises[index - 1]?.id),
    );
    $("#next-btn").addEventListener("click", () =>
      select(exercises[index + 1]?.id),
    );
    $("#exercise-detail [data-copy-answer]")?.addEventListener("click", () =>
      copy(item.answer),
    );
  };
  const select = (id) => {
    if (!byId.has(id)) return;
    selected = id;
    showHint = false;
    showAnswer = false;
    history.replaceState(null, "", `#${id}`);
    renderNav();
    renderList();
    renderDetail();
    if (window.innerWidth < 720)
      $("#exercise-detail").scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };
  const copy = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      /* Clipboard requires a secure context in some browsers. */
    }
  };
  $("#module-nav").addEventListener("click", (event) => {
    const link = event.target.closest("[data-module]");
    if (!link) return;
    event.preventDefault();
    const first = exercises.find((item) => item.module === link.dataset.module);
    if (first) {
      $("#search").value = "";
      $("#level-filter").value = "all";
      $("#status-filter").value = "all";
      select(first.id);
      $("#practice").scrollIntoView({ behavior: "smooth" });
    }
  });
  $("#exercise-list").addEventListener("click", (event) =>
    select(event.target.closest("[data-id]")?.dataset.id),
  );
  ["#search", "#level-filter", "#status-filter"].forEach((selector) =>
    $(selector).addEventListener(
      selector === "#search" ? "input" : "change",
      renderList,
    ),
  );
  document
    .querySelectorAll("[data-copy]")
    .forEach((button) =>
      button.addEventListener("click", () => copy(button.dataset.copy)),
    );
  window.addEventListener("hashchange", () => {
    if (byId.has(location.hash.slice(1))) select(location.hash.slice(1));
  });
  $("#stat-exercises").textContent = exercises.length;
  $("#stat-modules").textContent = modules.length;
  renderProgress();
  renderNav();
  renderList();
  renderDetail();
})();
