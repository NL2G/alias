/* ALIAS — renders content from data.js and wires up interactions. */
(() => {
  "use strict";

  const D = window.ALIAS_DATA || {};
  const P = D.project || {};
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const esc = (v) =>
    String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const pillar = (id) => (D.pillars && D.pillars[id]) || { label: id };
  const placeholderTag = '<span class="placeholder-tag">Placeholder</span>';
  const ext = (url, label) =>
    `<a class="text-link" href="${esc(url)}" target="_blank" rel="noopener">${esc(label)} <span aria-hidden="true">↗</span></a>`;

  /* ---------------- Project facts ---------------- */
  function renderFacts() {
    $$("[data-fact]").forEach((el) => {
      const value = P[el.dataset.fact];
      if (value) {
        el.textContent = value;
        el.hidden = false;
      }
    });

    const dl = $("#project-facts");
    if (!dl) return;
    const rows = [
      ["Funded by", esc(P.funder)],
      ["Programme", P.programme ? `<span lang="de">${esc(P.programme)}</span>` : ""],
      ["Partners", (P.partners || []).map(esc).join("<br>")],
      ["Research period", esc(P.period)],
      ["Grant reference", P.grantUrl ? `<a href="${esc(P.grantUrl)}" target="_blank" rel="noopener">${esc(P.grant)} ↗</a>` : esc(P.grant)],
    ].filter(([, v]) => v);
    dl.innerHTML = rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${v}</dd></div>`).join("");

    const funding = $("#funding-line");
    if (funding) {
      const funder = P.funderShort || P.funder;
      funding.textContent = [funder && `Funded by the ${funder}`, P.programme, P.grant].filter(Boolean).join(" · ");
    }
  }

  /* ---------------- People ---------------- */
  function initials(name) {
    const parts = String(name).trim().split(/\s+/);
    return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
  }

  function personCard(p, n) {
    const visual = p.photo
      ? `<img class="portrait" src="${esc(p.photo)}" alt="${esc(p.name)}" width="84" height="84" loading="lazy">`
      : `<div class="monogram" aria-hidden="true">${esc(initials(p.name))}</div>`;
    const links = (p.links || []).filter((l) => l && l.url).map((l) => ext(l.url, l.label));
    if (p.email) links.push(`<a class="text-link" href="mailto:${esc(p.email)}">Email <span aria-hidden="true">→</span></a>`);

    return `<article class="person">
      <div class="person-top">
        ${visual}
        <div class="person-tags">
          <span class="person-num">${String(n).padStart(2, "0")} / ${esc(P.name || "ALIAS")}</span>
          ${p.placeholder ? placeholderTag : ""}
        </div>
      </div>
      ${p.role ? `<p class="person-role">${esc(p.role)}</p>` : ""}
      <h4>${p.title ? `<span class="person-title">${esc(p.title)}</span> ` : ""}${esc(p.name)}</h4>
      ${p.affiliation ? `<p class="person-aff">${esc(p.affiliation)}</p>` : ""}
      ${p.bio ? `<p class="person-bio">${esc(p.bio)}</p>` : ""}
      ${links.length ? `<div class="person-links">${links.join("")}</div>` : ""}
    </article>`;
  }

  function renderPeople() {
    const root = $("#people-groups");
    if (!root) return;
    const people = D.people || [];
    let n = 0;
    const groups = (D.groups || [])
      .map((g) => ({ ...g, members: people.filter((p) => p.group === g.id) }))
      .filter((g) => g.members.length);
    // With a single group, its heading would only repeat "Project team".
    root.innerHTML = groups
      .map((g) => `<div class="team-group">
          ${groups.length > 1 ? `<h3 class="team-subheading"><span>${esc(g.label)}</span></h3>` : ""}
          <div class="people-grid">${g.members.map((p) => personCard(p, ++n)).join("")}</div>
        </div>`)
      .join("");

    // Credit portraits by source, e.g. "Portraits: UTN (Steffen Eger)."
    const bySource = {};
    people.filter((p) => p.photo && p.photoCredit).forEach((p) => (bySource[p.photoCredit] ||= []).push(p.name));
    const credits = Object.entries(bySource).map(([src, names]) => `${esc(src)} (${names.map(esc).join(", ")})`);
    if (credits.length) root.insertAdjacentHTML("beforeend", `<p class="portrait-credit">Portraits: ${credits.join(" · ")}.</p>`);
  }

  /* ---------------- Publications ---------------- */
  const team = new Set((D.people || []).map((p) => p.name));
  const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const pubYear = (p) => String(p.year || String(p.date || "").slice(0, 4) || "Forthcoming");
  const sortKey = (p) => String(p.date || p.year || "9999");

  function fmtDate(p) {
    const m = /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?$/.exec(String(p.date || ""));
    if (!m) return pubYear(p);
    const [, y, mo, d] = m;
    if (!mo) return y;
    return `${d ? Number(d) + " " : ""}${MONTHS[Number(mo) - 1]} ${y}`;
  }

  function bibKey(p) {
    if (p.key) return p.key;
    const fromRaw = p.bibtex && /@\w+\s*\{\s*([^,\s]+)\s*,/.exec(p.bibtex);
    if (fromRaw) return fromRaw[1];
    const last = String((p.authors || [])[0] || "anon").trim().split(/\s+/).pop();
    const word = String(p.title || "").split(/\s+/).find((w) => w.replace(/\W/g, "").length > 3) || "paper";
    return (last + pubYear(p) + word)
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/ß/g, "ss")
      .replace(/[^A-Za-z0-9]/g, "")
      .toLowerCase();
  }

  function bibtex(p) {
    if (p.bibtex) return String(p.bibtex).trim();
    const fields = [
      ["title", `{${p.title}}`],
      ["author", (p.authors || []).join(" and ")],
      ["booktitle", p.booktitle],
      ["journal", p.journal],
      ["volume", p.volume],
      ["number", p.number],
      ["pages", p.pages],
      ["publisher", p.publisher],
      ["year", pubYear(p)],
      ["eprint", p.eprint],
      ["archivePrefix", p.eprint ? "arXiv" : ""],
      ["primaryClass", p.eprint ? p.primaryClass || "cs.CL" : ""],
      ["doi", p.doi],
      ["url", p.url],
      ["note", p.note],
    ].filter(([, v]) => v);
    const width = Math.max(...fields.map(([k]) => k.length));
    return `@${p.type || "misc"}{${bibKey(p)},\n${fields.map(([k, v]) => `  ${k.padEnd(width)} = {${v}}`).join(",\n")}\n}`;
  }

  function pubCard(p) {
    const key = bibKey(p);
    const id = esc(p.id || key);
    const href = p.url || p.pdf;
    const title = href
      ? `<a href="${esc(href)}" target="_blank" rel="noopener">${esc(p.title)} <span aria-hidden="true">↗</span></a>`
      : esc(p.title);
    const tags = (p.pillars || [])
      .map((pid) => `<span class="pillar-tag" style="--pc: var(--p-${esc(pid)})">${esc(pillar(pid).label)}</span>`)
      .join("");
    const authors = (p.authors || [])
      .map((a) => (team.has(a) ? `<span class="member">${esc(a)}</span>` : esc(a)))
      .join(", ");
    const links = [["Paper", p.url], ["PDF", p.pdf], ["Code", p.code], ["Data", p.data], ["Slides", p.slides], ["Poster", p.poster]]
      .concat((p.links || []).map((l) => [l.label, l.url]))
      .filter(([, u]) => u)
      .map(([label, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(label)} <span aria-hidden="true">↗</span></a>`)
      .join("");
    const figure = p.figure && p.figure.src
      ? `<figure class="pub-figure"><img src="${esc(p.figure.src)}" alt="${esc(p.figure.alt || "")}" loading="lazy">${
          p.figure.caption ? `<figcaption>${esc(p.figure.caption)}</figcaption>` : ""
        }</figure>`
      : "";
    const hasSummary = Boolean(p.summary || figure);
    const toggle = (target, label) =>
      `<button type="button" class="pub-toggle" aria-expanded="false" aria-controls="${target}">${label}</button>`;

    // Compact row: venue/date/pillars on the left; title, authors and small links on the right.
    // Summary and BibTeX stay folded until asked for.
    return `<article class="pub" id="paper-${id}">
      <div class="pub-side">
        ${p.status ? `<span class="pub-status">${esc(p.status)}</span>` : ""}
        <span class="venue">${esc(p.venue || "Preprint")}</span>
        <time datetime="${esc(p.date || pubYear(p))}">${esc(fmtDate(p))}</time>
        ${tags ? `<span class="pub-tags">${tags}</span>` : ""}
        ${p.placeholder ? placeholderTag : ""}
      </div>
      <div class="pub-main">
        <h4>${title}</h4>
        <p class="pub-authors">${authors}</p>
        <div class="pub-actions">
          ${links}
          ${hasSummary ? toggle(`sum-${id}`, "Summary") : ""}
          ${toggle(`bib-${id}`, "BibTeX")}
        </div>
        ${hasSummary ? `<div class="pub-summary" id="sum-${id}" hidden>${p.summary ? `<p>${esc(p.summary)}</p>` : ""}${figure}</div>` : ""}
        <div class="cite-body" id="bib-${id}" hidden>
          <div class="cite-toolbar">
            <span>${esc(key)}</span>
            <div>
              <button type="button" data-copy>Copy BibTeX</button>
              <button type="button" data-download="${esc(key)}.bib">Download .bib ↓</button>
            </div>
          </div>
          <p class="cite-status" role="status"></p>
          <pre tabindex="0" aria-label="BibTeX for ${esc(p.title)}"><code>${esc(bibtex(p))}</code></pre>
        </div>
      </div>
    </article>`;
  }

  let activeFilter = "all";

  function renderPubs() {
    const root = $("#pub-list");
    if (!root) return;
    const pubs = (D.publications || []).slice().sort((a, b) => sortKey(b).localeCompare(sortKey(a)));
    const shown = activeFilter === "all" ? pubs : pubs.filter((p) => (p.pillars || []).includes(activeFilter));
    if (!shown.length) {
      root.innerHTML = `<p class="pub-empty">No publications ${activeFilter === "all" ? "yet" : "in this pillar yet"}.</p>`;
      return;
    }
    const years = [...new Set(shown.map(pubYear))];
    root.innerHTML = years
      .map((y) => `<section class="pub-year" aria-label="${esc(y)}">
          <h3 class="pub-year-label"><span>${esc(y)}</span></h3>
          ${shown.filter((p) => pubYear(p) === y).map(pubCard).join("")}
        </section>`)
      .join("");
  }

  function renderFilters() {
    const bar = $("#pub-filters");
    if (!bar) return;
    const pubs = D.publications || [];
    const chip = (id, label, count) =>
      `<button type="button" class="chip" data-filter="${esc(id)}" aria-pressed="${id === activeFilter}"${
        id === "all" ? "" : ` style="--pc: var(--p-${esc(id)})"`
      }>${id === "all" ? "" : "<i></i>"}${esc(label)} <span class="count">${count}</span></button>`;

    // Only offer pillars that have at least one publication; hide the bar if none do.
    const used = Object.keys(D.pillars || {})
      .map((id) => [id, pubs.filter((p) => (p.pillars || []).includes(id)).length])
      .filter(([, count]) => count > 0);
    bar.hidden = used.length === 0;
    bar.innerHTML = chip("all", "All", pubs.length) + used.map(([id, count]) => chip(id, pillar(id).label, count)).join("");

    bar.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-filter]");
      if (!btn) return;
      activeFilter = btn.dataset.filter;
      $$("[data-filter]", bar).forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      renderPubs();
    });
  }

  function initCitations() {
    const root = $("#pub-list");
    if (!root) return;
    root.addEventListener("click", async (e) => {
      // Summary / BibTeX toggles
      const toggle = e.target.closest(".pub-toggle");
      if (toggle) {
        const panel = document.getElementById(toggle.getAttribute("aria-controls"));
        const open = toggle.getAttribute("aria-expanded") !== "true";
        toggle.setAttribute("aria-expanded", String(open));
        if (panel) panel.hidden = !open;
        return;
      }

      const copyBtn = e.target.closest("[data-copy]");
      const dlBtn = e.target.closest("[data-download]");
      if (!copyBtn && !dlBtn) return;
      const body = e.target.closest(".cite-body");
      const text = $("code", body).textContent;
      const status = $(".cite-status", body);

      if (copyBtn) {
        try {
          await navigator.clipboard.writeText(text);
          status.textContent = "Copied to clipboard.";
        } catch {
          const range = document.createRange();
          range.selectNodeContents($("code", body));
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
          status.textContent = "Selected. Press Ctrl/⌘ + C to copy.";
        }
      } else {
        const url = URL.createObjectURL(new Blob([text + "\n"], { type: "application/x-bibtex" }));
        const a = Object.assign(document.createElement("a"), { href: url, download: dlBtn.dataset.download });
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        status.textContent = `Saved ${dlBtn.dataset.download}.`;
      }
      clearTimeout(status._timer);
      status._timer = setTimeout(() => (status.textContent = ""), 3000);
    });
  }

  /* ---------------- Contact ---------------- */
  function renderContacts() {
    const root = $("#contact-links");
    if (!root) return;
    // The address is shown as text (mail links don't open everywhere), with a copy button.
    root.innerHTML = (D.contacts || [])
      .map((c) => `<div class="contact-row">
          <div class="contact-who">
            <small>${esc(c.label)}</small>
            <strong>${esc(c.name)}</strong>
            <span class="contact-email">${esc(c.email)}</span>
          </div>
          <div class="contact-actions">
            <button type="button" class="contact-copy" data-email="${esc(c.email)}">Copy</button>
            <a class="arrow" href="mailto:${esc(c.email)}" aria-label="Email ${esc(c.name)}">↗</a>
          </div>
        </div>`)
      .join("");

    root.addEventListener("click", async (e) => {
      const btn = e.target.closest(".contact-copy");
      if (!btn) return;
      try {
        await navigator.clipboard.writeText(btn.dataset.email);
        btn.textContent = "Copied";
      } catch {
        const range = document.createRange();
        range.selectNodeContents($(".contact-email", btn.closest(".contact-row")));
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        btn.textContent = "Selected";
      }
      clearTimeout(btn._timer);
      btn._timer = setTimeout(() => (btn.textContent = "Copy"), 2000);
    });
  }

  /* ---------------- Pillar tabs ---------------- */
  function initTabs() {
    const tabs = $$('[role="tab"]');
    const panels = tabs.map((t) => document.getElementById(t.getAttribute("aria-controls")));
    if (!tabs.length) return;
    let seen = false;
    let current = 0;

    function select(i, focus) {
      current = i;
      tabs.forEach((t, j) => {
        const on = i === j;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        panels[j].hidden = !on;
        panels[j].classList.remove("is-shown");
      });
      if (seen) requestAnimationFrame(() => requestAnimationFrame(() => panels[i].classList.add("is-shown")));
      if (focus) tabs[i].focus();
    }

    tabs.forEach((t, i) => {
      t.addEventListener("click", () => select(i));
      t.addEventListener("keydown", (e) => {
        const last = tabs.length - 1;
        const next = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: last }[e.key];
        if (next === undefined) return;
        e.preventDefault();
        select((next + tabs.length) % tabs.length, true);
      });
    });

    $$("[data-pillar]").forEach((a) =>
      a.addEventListener("click", () => {
        const i = tabs.findIndex((t) => t.dataset.tab === a.dataset.pillar);
        if (i >= 0) select(i);
      })
    );

    select(0);

    // Animate the bars the first time a pillar visual scrolls into view.
    // Hidden panels never intersect, so observing every visual is safe.
    const visuals = $$(".viz", $("#pillars") || document);
    if (!visuals.length || !("IntersectionObserver" in window)) {
      seen = true;
      panels[current].classList.add("is-shown");
      return;
    }
    const io = new IntersectionObserver((entries) => {
      if (entries.some((en) => en.isIntersecting)) {
        seen = true;
        panels[current].classList.add("is-shown");
        io.disconnect();
      }
    }, { threshold: 0.4 });
    visuals.forEach((v) => io.observe(v));
  }

  /* ---------------- Fig. 01: isolate a feature on hover or tap ---------------- */
  function initFeatures() {
    const fig = $("#fig1");
    if (!fig) return;
    const items = $$("[data-f]", fig);
    let pinned = null;
    const focus = (f) => {
      fig.classList.toggle("has-focus", Boolean(f));
      items.forEach((el) => el.classList.toggle("is-on", el.dataset.f === f));
    };
    items.forEach((el) => {
      el.addEventListener("mouseenter", () => focus(el.dataset.f));
      el.addEventListener("mouseleave", () => focus(pinned));
      el.addEventListener("click", () => {
        pinned = pinned === el.dataset.f ? null : el.dataset.f;
        focus(pinned);
      });
    });
  }

  /* ---------------- Navigation ---------------- */
  function initNav() {
    const btn = $(".menu-button");
    const nav = $("#site-nav");
    if (btn && nav) {
      const setOpen = (open) => {
        nav.classList.toggle("is-open", open);
        btn.setAttribute("aria-expanded", String(open));
        btn.querySelector("span").textContent = open ? "−" : "+";
      };
      btn.addEventListener("click", () => setOpen(!nav.classList.contains("is-open")));
      nav.addEventListener("click", (e) => e.target.closest("a") && setOpen(false));
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && nav.classList.contains("is-open")) {
          setOpen(false);
          btn.focus();
        }
      });
    }

    if (!("IntersectionObserver" in window)) return;
    const links = $$('#site-nav a[href^="#"]');
    const byId = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          links.forEach((a) => a.removeAttribute("aria-current"));
          const link = byId.get(en.target.id);
          if (link) link.setAttribute("aria-current", "location");
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    $$("main > section[id]").forEach((s) => io.observe(s));
  }

  /* ---------------- Highlighter strokes ---------------- */
  function initHighlights() {
    const marks = $$(".hl");
    if (!("IntersectionObserver" in window)) {
      marks.forEach((m) => m.classList.add("is-lit"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("is-lit");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.8 }
    );
    marks.forEach((m) => io.observe(m));
  }

  /* ---------------- Boot ---------------- */
  renderFacts();
  renderPeople();
  renderFilters();
  renderPubs();
  renderContacts();
  initCitations();
  initTabs();
  initFeatures();
  initNav();
  initHighlights();
  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
