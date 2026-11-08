(function () {
  "use strict";
  var D = window.SIT_DATA || { laptops: [], stores: [], phone: "919665373829", phoneDisplay: "+91 96653 73829" };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var COND = {
    new: { label: "New", cls: "b-green" },
    open_box: { label: "Open Box", cls: "b-teal" },
    refurbished: { label: "Refurbished", cls: "b-orange" },
    used: { label: "Used", cls: "b-orange" }
  };
  var inr = function (n) { return "₹" + Number(n).toLocaleString("en-IN"); };
  var waUrl = function (text) { return "https://wa.me/" + D.phone + "?text=" + encodeURIComponent(text); };
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; });
  };
  var track = function (name, params) {
    try { if (typeof window.gtag === "function") window.gtag("event", name, params || {}); } catch (e) {}
  };

  /* ---------- WhatsApp links ---------- */
  $$("[data-wa]").forEach(function (a) {
    a.href = waUrl(a.getAttribute("data-wa"));
    a.addEventListener("click", function () { track("whatsapp_click", { context: "general" }); });
  });
  $$("[data-wa-service]").forEach(function (a) {
    var s = a.getAttribute("data-wa-service");
    a.href = waUrl("Hi Smart IT Solution, I need help with " + s + ".");
    a.addEventListener("click", function () { track("whatsapp_click", { context: "service", item: s }); });
  });
  $$("[data-track]").forEach(function (a) {
    a.addEventListener("click", function () { track(a.getAttribute("data-track"), { location: a.getAttribute("data-loc") || "" }); });
  });

  /* ---------- Header: sticky shadow + mobile menu ---------- */
  var header = $(".site-header");
  var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 8); };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  var menuBtn = $("#menu-btn");
  var mobileNav = $("#mobile-nav");
  var setMenu = function (open) {
    mobileNav.hidden = !open;
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menuBtn.querySelector("use").setAttribute("href", open ? "#i-x" : "#i-menu");
  };
  menuBtn.addEventListener("click", function () { setMenu(mobileNav.hidden); });
  $$("a, button", mobileNav).forEach(function (el) { el.addEventListener("click", function () { setMenu(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !mobileNav.hidden) { setMenu(false); menuBtn.focus(); } });
  window.addEventListener("resize", function () { if (window.innerWidth > 1023 && !mobileNav.hidden) setMenu(false); });

  /* ---------- Active nav link ---------- */
  var navLinks = $$("[data-nav]");
  if ("IntersectionObserver" in window) {
    var secIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navLinks.forEach(function (l) { l.setAttribute("aria-current", l.getAttribute("data-nav") === en.target.id ? "true" : "false"); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    ["home", "laptops", "services", "about", "contact"].forEach(function (id) { var s = document.getElementById(id); if (s) secIo.observe(s); });
  }

  /* ---------- Laptop art ---------- */
  var laptopSvg = function (l, label) {
    var c = l.colors || {};
    var style = "--scr:" + (c.scr || "#1D5FD1") + ";--scr2:" + (c.scr2 || "#7FB0FF") +
      (l.deck ? ";--deck:" + l.deck : "") + (l.deckEdge ? ";--deck-edge:" + l.deckEdge : "");
    return '<svg viewBox="0 0 240 160" role="img" aria-label="' + esc(label) + '" style="' + style + '"><use href="#laptop-art"/></svg>';
  };
  var specLine = function (l) { return [l.processor.replace("Intel Core ", "").replace("AMD ", ""), l.ram_gb + "GB RAM", l.storage].join(" | "); };

  /* ---------- Featured laptops ---------- */
  var grid = $("#lap-grid");
  var current = "All";
  var renderLaptops = function () {
    var list = D.laptops.filter(function (l) { return l.featured && (current === "All" || l.brand === current); });
    if (!list.length) {
      grid.innerHTML = '<div class="lap-empty"><p>No ' + esc(current) + ' laptops in stock right now. WhatsApp us and we\'ll find one.</p>' +
        '<a class="btn btn-wa" target="_blank" rel="noopener noreferrer" href="' + waUrl("Hi Smart IT Solution, can you find me a " + current + " laptop?") + '">Find me a ' + esc(current) + ' laptop</a></div>';
      return;
    }
    grid.innerHTML = list.map(function (l) {
      var cond = COND[l.condition] || COND.used;
      var badge = l.badge ? '<span class="badge b-blue">' + esc(l.badge) + "</span>" : '<span class="badge ' + cond.cls + '">' + cond.label + "</span>";
      return '<button class="lap" type="button" data-id="' + l.id + '" aria-haspopup="dialog" aria-label="' + esc(l.model + ", " + cond.label + ", " + inr(l.price_inr) + ". View specifications") + '">' +
        '<div class="lap-media">' + badge + laptopSvg(l, "") + "</div>" +
        '<div class="lap-body"><h3>' + esc(l.model) + '</h3><p class="lap-specs">' + esc(specLine(l)) + "</p>" +
        '<div class="lap-foot"><span class="price">' + inr(l.price_inr) + '</span><span class="round-go" aria-hidden="true"><svg class="icon"><use href="#i-arrow"/></svg></span></div></div>' +
        "</button>";
    }).join("");
  };
  renderLaptops();

  $$("#brand-chips .chip").forEach(function (chip) {
    chip.addEventListener("click", function () {
      current = chip.getAttribute("data-brand");
      $$("#brand-chips .chip").forEach(function (c) { c.setAttribute("aria-pressed", String(c === chip)); });
      renderLaptops();
      track("filter_brand", { brand: current });
    });
  });

  /* ---------- Dialog helpers ---------- */
  var lastFocus = null;
  var openDialog = function (dlg) {
    lastFocus = document.activeElement;
    if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
  };
  var closeDialog = function (dlg) {
    if (typeof dlg.close === "function") dlg.close(); else dlg.removeAttribute("open");
  };
  $$("dialog.sheet").forEach(function (dlg) {
    dlg.addEventListener("click", function (e) { if (e.target === dlg) closeDialog(dlg); });
    $$("[data-close]", dlg).forEach(function (b) { b.addEventListener("click", function () { closeDialog(dlg); }); });
    dlg.addEventListener("close", function () { if (lastFocus && lastFocus.focus) lastFocus.focus(); });
  });

  /* ---------- Spec popup ---------- */
  var specDlg = $("#spec-dialog");
  grid.addEventListener("click", function (e) {
    var card = e.target.closest(".lap[data-id]");
    if (!card) return;
    var l = D.laptops.filter(function (x) { return String(x.id) === card.getAttribute("data-id"); })[0];
    if (!l) return;
    var cond = COND[l.condition] || COND.used;
    $("#spec-title").textContent = l.model;
    $("#spec-sub").textContent = cond.label + (l.badge ? " | " + l.badge : "");
    $("#spec-media").innerHTML = laptopSvg(l, l.model);
    var rows = [["Brand", l.brand], ["Processor", l.processor], ["RAM", l.ram_gb + " GB"], ["Storage", l.storage], ["Display", l.screen], ["Condition", cond.label], ["Warranty", l.warranty]];
    $("#spec-rows").innerHTML = rows.map(function (r) { return "<tr><th scope=\"row\">" + esc(r[0]) + "</th><td>" + esc(r[1]) + "</td></tr>"; }).join("");
    $("#spec-price").textContent = inr(l.price_inr);
    var wa = $("#spec-wa");
    wa.href = waUrl("Hi Smart IT Solution, is the " + l.model + " (" + cond.label + ", " + inr(l.price_inr) + ") available?");
    wa.onclick = function () { track("laptop_enquiry", { brand: l.brand, condition: l.condition, price: l.price_inr }); };
    openDialog(specDlg);
  });

  /* ---------- Repair / quote popup ---------- */
  var enqDlg = $("#enq-dialog");
  var form = $("#enq-form");
  var done = $("#enq-done");
  var mode = "repair";
  var MODES = {
    repair: {
      title: "Book a Repair",
      sub: "Tell us what's wrong. We'll reply on WhatsApp with the next steps.",
      deviceLabel: "Device",
      devices: ["Laptop", "Desktop / All-in-One", "Printer", "LED TV", "CCTV", "Other"],
      issueLabel: "What's the problem?",
      chips: ["No power", "Screen broken", "Very slow", "Liquid spill", "Keyboard", "Battery / charging"],
      intro: "Hi Smart IT Solution, I'd like to book a repair."
    },
    quote: {
      title: "Get a Quote",
      sub: "Tell us what you need. We'll send a quote on WhatsApp.",
      deviceLabel: "Service",
      devices: ["IT AMC & office support", "CCTV installation", "Bulk laptops / desktops", "Laptop or PC upgrade", "Repair", "Other"],
      issueLabel: "What do you need?",
      chips: ["Office of 5-10 systems", "Office of 10-25 systems", "4 CCTV cameras", "8 CCTV cameras", "RAM / SSD upgrade"],
      intro: "Hi Smart IT Solution, I'd like a quote."
    }
  };
  var issue = $("#f-issue");
  var setMode = function (m) {
    mode = MODES[m] ? m : "repair";
    var M = MODES[mode];
    $("#enq-dlg-title").textContent = M.title;
    $("#enq-dlg-sub").textContent = M.sub;
    $("#f-device-label").textContent = M.deviceLabel;
    $("#f-issue-label").textContent = M.issueLabel;
    $("#f-device").innerHTML = M.devices.map(function (d) { return "<option>" + esc(d) + "</option>"; }).join("");
    $("#quick-chips").innerHTML = M.chips.map(function (c) { return '<button type="button">' + esc(c) + "</button>"; }).join("");
  };
  $("#quick-chips").addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    var t = b.textContent;
    issue.value = issue.value.trim() ? issue.value.trim().replace(/[.,]?$/, ", ") + t.toLowerCase() : t;
    issue.focus();
    clearErr("issue");
  });
  $$("[data-open-enquiry]").forEach(function (b) {
    b.addEventListener("click", function () {
      setMode(b.getAttribute("data-open-enquiry"));
      form.hidden = false; done.hidden = true;
      openDialog(enqDlg);
      setTimeout(function () { $("#f-name").focus(); }, 60);
    });
  });

  var setErr = function (name, on) { var f = $('[data-field="' + name + '"]', form); if (f) f.classList.toggle("has-error", on); };
  var clearErr = function (name) { setErr(name, false); };
  ["name", "mobile", "issue"].forEach(function (n) {
    var el = form.elements[n];
    el.addEventListener("input", function () { clearErr(n); });
  });
  var mobile = $("#f-mobile");
  mobile.addEventListener("input", function () { mobile.value = mobile.value.replace(/\D/g, "").slice(0, 10); });

  var lastMsg = "";
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = form.elements.name.value.trim();
    var mob = mobile.value.trim();
    var txt = issue.value.trim();
    var ok = true;
    if (name.length < 2) { setErr("name", true); ok = false; }
    if (!/^[6-9]\d{9}$/.test(mob)) { setErr("mobile", true); ok = false; }
    if (txt.length < 10) { setErr("issue", true); ok = false; }
    if (!ok) { var firstBad = $(".has-error .input", form); if (firstBad) firstBad.focus(); return; }

    var M = MODES[mode];
    var model = form.elements.model.value.trim();
    var store = (form.querySelector('input[name="store"]:checked') || {}).value || "Sector 20";
    lastMsg = M.intro + "\n\n" +
      "Name: " + name + "\n" +
      "Mobile: +91 " + mob + "\n" +
      M.deviceLabel + ": " + form.elements.device.value + "\n" +
      (model ? "Brand & model: " + model + "\n" : "") +
      (mode === "repair" ? "Problem: " : "Requirement: ") + txt + "\n" +
      "Preferred store: " + store + ", Kharghar";
    var url = waUrl(lastMsg);
    $("#msg-preview").textContent = lastMsg;
    $("#done-wa").href = url;
    form.hidden = true; done.hidden = false;
    track(mode === "repair" ? "booking_submit" : "quote_submit", { device: form.elements.device.value, store: store });
    try { window.open(url, "_blank", "noopener"); } catch (err) {}
    $("#done-wa").focus();
  });
  $("#edit-msg").addEventListener("click", function () { done.hidden = true; form.hidden = false; $("#f-name").focus(); });
  $("#copy-msg").addEventListener("click", function () {
    var btn = this;
    var fallback = function () {
      var r = document.createRange(); r.selectNodeContents($("#msg-preview"));
      var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
      btn.lastChild.textContent = "Selected, press copy";
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(lastMsg).then(function () { btn.lastChild.textContent = "Copied"; }, fallback);
    } else { fallback(); }
  });

  /* ---------- Stores ---------- */
  var locGrid = $("#loc-grid");
  locGrid.innerHTML = D.stores.map(function (s) {
    var dir = "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(s.mapQuery);
    return '<article class="loc rv">' +
      '<div class="loc-photo"><svg viewBox="0 0 320 240" role="img" aria-label="Illustration of the ' + esc(s.name) + ' store. Real photo to be added."><use href="#store-art"/></svg></div>' +
      '<div class="loc-body"><h3><svg class="icon" aria-hidden="true"><use href="#i-pin"/></svg>' + esc(s.name) + "</h3>" +
      '<p class="loc-addr">' + esc(s.address) + "</p>" +
      '<p class="loc-meta">' + esc(s.hours) + " | " + esc(s.phoneDisplay) + "</p>" +
      '<div class="loc-actions">' +
      '<a class="btn btn-primary btn-sm" href="' + dir + '" target="_blank" rel="noopener noreferrer" data-store="' + esc(s.name) + '">Get Directions<svg class="icon"><use href="#i-arrow-up-right"/></svg></a>' +
      '<a class="btn btn-outline btn-sm" href="tel:+' + s.phone + '"><svg class="icon"><use href="#i-phone"/></svg>Call</a>' +
      "</div></div></article>";
  }).join("");
  $$("[data-store]", locGrid).forEach(function (a) { a.addEventListener("click", function () { track("directions_click", { store: a.getAttribute("data-store") }); }); });

  /* ---------- Floating WhatsApp hides over footer ---------- */
  var fab = $("#fab");
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (en) { fab.classList.toggle("is-hidden", en[0].isIntersecting); }, { threshold: 0.15 }).observe($("#footer"));
  }

  /* ---------- Scroll reveal: only below-the-fold content, readable at rest ---------- */
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce && "IntersectionObserver" in window) {
    var items = $$(".rv");
    var vh = window.innerHeight;
    items.forEach(function (el) { if (el.getBoundingClientRect().top < vh) el.classList.add("in"); });
    document.documentElement.classList.add("reveal-ready");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (el) { if (!el.classList.contains("in")) io.observe(el); });
  }

  /* ---------- Hero board animation ---------- */
  if (!reduce) { var board = $("#board"); if (board) board.classList.add("anim"); }

  var y = $("#year"); if (y) y.textContent = String(new Date().getFullYear());
})();
