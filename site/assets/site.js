/* Ezoic Examples - shared helper. No build step, no dependencies.
 *
 * Two responsibilities:
 *   1. Add a "Copy" button to every <pre class="snippet"> display block.
 *   2. Render the shared id-less debug bar when <body data-idless-debug> is set.
 *
 * This file is an external script and never contains a live integration call,
 * so the id-less inline-script scanner never treats it as an ad snippet.
 */
(function () {
  "use strict";

  function initCopyButtons() {
    var blocks = document.querySelectorAll("pre.snippet");
    for (var i = 0; i < blocks.length; i++) {
      addCopyButton(blocks[i]);
    }
  }

  function addCopyButton(pre) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "copy-btn";
    btn.textContent = "Copy";
    btn.addEventListener("click", function () {
      var code = pre.querySelector("code") || pre;
      var text = code.textContent;
      copyText(text).then(function () {
        flash(btn, "Copied");
      }, function () {
        flash(btn, "Press Ctrl+C");
      });
    });
    pre.appendChild(btn);
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "absolute";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      try {
        var ok = document.execCommand("copy");
        document.body.removeChild(ta);
        ok ? resolve() : reject();
      } catch (e) {
        document.body.removeChild(ta);
        reject(e);
      }
    });
  }

  function flash(btn, label) {
    var original = "Copy";
    btn.textContent = label;
    btn.classList.add("copied");
    setTimeout(function () {
      btn.textContent = original;
      btn.classList.remove("copied");
    }, 1600);
  }

  /* Shared debug bar for the id-less demo pages. Lists each inserted
   * placeholder's id, location label, previous sibling, and filled state.
   * Mirrors the behaviour of the reference test pages. */
  function initDebugBar() {
    if (!document.body.hasAttribute("data-idless-debug")) {
      return;
    }
    document.body.classList.add("has-debug-bar");

    var bar = document.createElement("div");
    bar.className = "idless-debug";
    document.body.appendChild(bar);

    function refresh() {
      var els = document.querySelectorAll('[data-inserter="sa-idless"]');
      var lines = [];
      for (var i = 0; i < els.length; i++) {
        var e = els[i];
        var p = e.previousElementSibling || {};
        lines.push(
          e.id +
            " loc=" + e.getAttribute("data-ez-idless-location") +
            " after=" + (p.tagName || "-") + (p.id ? "#" + p.id : "") +
            " filled=" + (e.childNodes.length > 0)
        );
      }
      var body = lines.join("  |  ") || "waiting for id-less placeholders...";
      bar.innerHTML = "";
      var tag = document.createElement("span");
      tag.className = "debug-tag";
      tag.textContent = "debug";
      bar.appendChild(tag);
      bar.appendChild(document.createTextNode(body));
    }

    refresh();
    setInterval(refresh, 2000);
  }

  function init() {
    initCopyButtons();
    initDebugBar();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
