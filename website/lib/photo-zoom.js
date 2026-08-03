/* photo-zoom.js — dependency-free lightbox for zoomable photos.
   Vanilla JS, no build step, no external CDN. Drop this file in and load it
   with a plain <script src="photo-zoom.js"></script> (or import as a module
   in bundler-based projects — it still attaches window.PhotoZoom).

   Declarative wiring: mark clickable elements with data-* attributes and the
   module delegates the click itself — no manual array-building required.

     Single photo (portrait/avatar — NO nav, there's nothing to navigate to):
       <button type="button" data-photozoom
               data-photozoom-src="/full-res.jpg"
               data-photozoom-alt="Jane Doe">…thumbnail…</button>

     Gallery (2+ photos of the same set — WITH nav: arrows, swipe, keyboard):
       <a href="/photo-1.jpg" data-photozoom data-photozoom-group="gallery-x"
          data-photozoom-src="/photo-1.jpg" data-photozoom-alt="…">…</a>
       <a href="/photo-2.jpg" data-photozoom data-photozoom-group="gallery-x"
          data-photozoom-src="/photo-2.jpg" data-photozoom-alt="…">…</a>
       (same data-photozoom-group on every thumbnail in the set — clicking
       ANY of them opens the lightbox at that photo and gathers the rest of
       the group automatically, in DOM order.)

   THE DECISION RULE (this is the point of the module, not an implementation
   detail — see SKILL.md for the full rationale):
     - No data-photozoom-group, or the group has only one member → lightbox
       opens WITHOUT prev/next arrows or a counter. A single photo has no
       "next".
     - 2+ elements share the same data-photozoom-group → lightbox opens WITH
       prev/next arrows, a "n / total" counter, swipe, and arrow-key nav —
       scoped to that group only. Never share a group id across two logically
       different galleries on the same page.

   <a href="…"> triggers degrade gracefully without JS (the href still opens
   the image directly) — keep data-photozoom-src equal to href when the
   trigger is a link.

   Programmatic API (open the viewer without any markup, e.g. from another
   component):
     PhotoZoom.open("/photo.jpg")                          // single, no nav
     PhotoZoom.open("/photo.jpg", {alt:"Jane Doe"})
     PhotoZoom.open([{src,alt}, {src,alt}, …], {index:0})   // gallery, nav
     PhotoZoom.close()

   Interaction contract (deliberately simple — see SKILL.md "why simple"):
     - Click/tap thumbnail → large centered photo. That IS the zoom; no
       pinch/pan physics layered on top.
     - Large, always-visible × button closes.
     - Click outside the photo (the dark backdrop) closes.
     - Escape closes.
     - Gallery only: large ‹ › buttons at the sides, horizontal swipe, and
       ArrowLeft/ArrowRight — every gesture has a visible button fallback,
       nothing is gesture-only.
     - Focus moves to the close button on open and back to the trigger
       element on close (keyboard/screen-reader friendly). role="dialog"
       aria-modal="true".

   Port to React/Vue/etc: keep this exact interaction contract (single = no
   nav, group = nav; swipe + keys + visible buttons; focus management) — the
   implementation below is the reference, not the only valid form. See
   SKILL.md "Framework ports" for the shape of an equivalent component. */
(function (root) {
  "use strict";
  if (!root || !root.document) return;
  var doc = root.document;

  var state = { items: [], index: 0, trigger: null };
  var el = null; // { overlay, stage, img, close, prev, next, counter }
  var touchX = null;

  function injectStyles() {
    if (doc.getElementById("photozoom-styles")) return;
    var css =
      ".pz-overlay{position:fixed;inset:0;background:rgba(20,16,12,.94);z-index:9999;display:none;}" +
      ".pz-overlay.pz-open{display:block;}" +
      ".pz-stage{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:56px 16px;cursor:zoom-out;}" +
      ".pz-img{max-width:100%;max-height:100%;object-fit:contain;border-radius:6px;box-shadow:0 20px 60px -20px rgba(0,0,0,.6);cursor:default;" +
        "opacity:0;transition:opacity .15s ease;}" +
      ".pz-img.pz-ready{opacity:1;}" +
      ".pz-btn{position:absolute;border:0;border-radius:50%;background:rgba(255,255,255,.14);color:#fff;cursor:pointer;" +
        "display:flex;align-items:center;justify-content:center;transition:background .12s;-webkit-tap-highlight-color:transparent;}" +
      ".pz-btn:hover{background:rgba(255,255,255,.26);}" +
      ".pz-btn:focus-visible{outline:2px solid #fff;outline-offset:2px;}" +
      ".pz-close{top:14px;right:14px;width:46px;height:46px;font-size:24px;line-height:1;}" +
      ".pz-prev,.pz-next{top:50%;transform:translateY(-50%);width:52px;height:52px;font-size:26px;}" +
      ".pz-prev{left:10px;} .pz-next{right:10px;}" +
      ".pz-counter{position:absolute;left:0;right:0;bottom:14px;text-align:center;color:rgba(255,255,255,.8);" +
        "font:500 13px/1 system-ui,sans-serif;pointer-events:none;}" +
      "@media(max-width:640px){.pz-close{top:8px;right:8px;}.pz-prev{left:4px;}.pz-next{right:4px;}}";
    var st = doc.createElement("style");
    st.id = "photozoom-styles";
    st.textContent = css;
    doc.head.appendChild(st);
  }

  function build() {
    if (el) return;
    injectStyles();
    var overlay = doc.createElement("div");
    overlay.className = "pz-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-hidden", "true");
    overlay.innerHTML =
      '<div class="pz-stage">' +
        '<img class="pz-img" alt="">' +
      "</div>" +
      '<button type="button" class="pz-btn pz-close" aria-label="Close">×</button>' +
      '<button type="button" class="pz-btn pz-prev" aria-label="Previous photo">‹</button>' +
      '<button type="button" class="pz-btn pz-next" aria-label="Next photo">›</button>' +
      '<div class="pz-counter"></div>';
    doc.body.appendChild(overlay);

    el = {
      overlay: overlay,
      stage: overlay.querySelector(".pz-stage"),
      img: overlay.querySelector(".pz-img"),
      close: overlay.querySelector(".pz-close"),
      prev: overlay.querySelector(".pz-prev"),
      next: overlay.querySelector(".pz-next"),
      counter: overlay.querySelector(".pz-counter"),
    };

    el.close.addEventListener("click", close);
    el.prev.addEventListener("click", function (e) { e.stopPropagation(); prev(); });
    el.next.addEventListener("click", function (e) { e.stopPropagation(); next(); });
    // click outside the photo (the stage backdrop) closes; click on the
    // photo itself does nothing (no pinch-zoom to toggle on tap).
    el.stage.addEventListener("click", function (e) {
      if (e.target === el.stage) close();
    });
    el.stage.addEventListener("touchstart", function (e) {
      touchX = e.touches && e.touches.length ? e.touches[0].clientX : null;
    }, { passive: true });
    el.stage.addEventListener("touchend", function (e) {
      if (touchX == null || state.items.length < 2) { touchX = null; return; }
      var endX = e.changedTouches && e.changedTouches.length ? e.changedTouches[0].clientX : null;
      if (endX == null) { touchX = null; return; }
      var dx = endX - touchX;
      touchX = null;
      if (Math.abs(dx) < 40) return;
      if (dx < 0) next(); else prev();
    });
  }

  function onKey(e) {
    if (e.key === "Escape" || e.key === "Esc") close();
    else if (state.items.length > 1 && e.key === "ArrowRight") next();
    else if (state.items.length > 1 && e.key === "ArrowLeft") prev();
  }

  function render() {
    var it = state.items[state.index] || {};
    el.img.classList.remove("pz-ready");
    el.img.alt = it.alt || "";
    el.img.src = it.src || "";
    el.img.onload = function () { el.img.classList.add("pz-ready"); };
    var multi = state.items.length > 1;
    el.prev.style.display = multi ? "" : "none";
    el.next.style.display = multi ? "" : "none";
    el.counter.style.display = multi ? "" : "none";
    if (multi) el.counter.textContent = (state.index + 1) + " / " + state.items.length;
  }

  function next() { state.index = (state.index + 1) % state.items.length; render(); }
  function prev() { state.index = (state.index - 1 + state.items.length) % state.items.length; render(); }

  function normalize(itemsOrSrc, opts) {
    if (typeof itemsOrSrc === "string") return [{ src: itemsOrSrc, alt: (opts && opts.alt) || "" }];
    return (itemsOrSrc || []).map(function (it) {
      return typeof it === "string" ? { src: it, alt: "" } : { src: it.src, alt: it.alt || "" };
    });
  }

  function open(itemsOrSrc, opts) {
    opts = opts || {};
    var items = normalize(itemsOrSrc, opts).filter(function (it) { return it.src; });
    if (!items.length) return;
    build();
    state.items = items;
    state.index = Math.min(Math.max(opts.index || 0, 0), items.length - 1);
    state.trigger = doc.activeElement;
    render();
    el.overlay.classList.add("pz-open");
    el.overlay.setAttribute("aria-hidden", "false");
    doc.documentElement.style.overflow = "hidden";
    doc.addEventListener("keydown", onKey);
    el.close.focus();
  }

  function close() {
    if (!el || !el.overlay.classList.contains("pz-open")) return;
    el.overlay.classList.remove("pz-open");
    el.overlay.setAttribute("aria-hidden", "true");
    el.img.src = "";
    doc.documentElement.style.overflow = "";
    doc.removeEventListener("keydown", onKey);
    if (state.trigger && typeof state.trigger.focus === "function") state.trigger.focus();
  }

  // ---- declarative delegation: data-photozoom[-group|-src|-alt] ----
  function groupItems(group) {
    var all = doc.querySelectorAll("[data-photozoom]");
    var nodes = [];
    for (var i = 0; i < all.length; i++) {
      if ((all[i].getAttribute("data-photozoom-group") || "") === group) nodes.push(all[i]);
    }
    return nodes;
  }

  function readItem(node) {
    return {
      src: node.getAttribute("data-photozoom-src") || node.getAttribute("href") || "",
      alt: node.getAttribute("data-photozoom-alt") || node.getAttribute("aria-label") || "",
    };
  }

  doc.addEventListener("click", function (e) {
    var trigger = e.target.closest ? e.target.closest("[data-photozoom]") : null;
    if (!trigger) return;
    e.preventDefault();
    var group = trigger.getAttribute("data-photozoom-group") || "";
    var nodes = group ? groupItems(group) : [trigger];
    var idx = nodes.indexOf(trigger);
    open(nodes.map(readItem), { index: idx < 0 ? 0 : idx });
  });

  root.PhotoZoom = { open: open, close: close };
})(typeof window !== "undefined" ? window : this);
