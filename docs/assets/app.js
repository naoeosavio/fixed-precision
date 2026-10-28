(function () {
  "use strict";

  const DEFAULT_LANG = "pt";
  const LANG_KEY = "fp.site.lang";
  const MAX_PLACES = 20;
  const LAB_PARSE_PLACES = 20;
  const DEFAULT_LAB_PLACES = 2;
  const COPY_FEEDBACK_MS = 1600;
  const HERO_LINE_DELAY_MS = 130;
  const HERO_CMD_DELAY_MS = 260;
  const TYPE_MIN_MS = 18;
  const TYPE_MAX_MS = 42;
  const SUPERSCRIPT_DIGITS = [
    "⁰", "¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹",
  ];

  const I18N = window.FP_I18N || {};
  const FP = window.FixedPrecisionLib
    ? window.FixedPrecisionLib.default
    : null;
  const COPY_TIMERS = new WeakMap();
  const REDUCED_MOTION = typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const HERO_SEQ = [
    { type: "cmd", text: "0.1 + 0.2" },
    { type: "out", cls: "err", text: "0.30000000000000004" },
    {
      type: "cmd",
      text: 'new FixedPrecision("0.1").add("0.2").toString()',
    },
    { type: "out", cls: "ok", text: "'0.3'" },
    { type: "cmd", text: 'Money("19.99").mul("3").toString()' },
    { type: "out", cls: "ok", text: "'59.97'" },
    {
      type: "cmd",
      text: 'new FixedPrecision("1").div("3").toString()',
    },
    { type: "out", cls: "ok", text: "'0.33333333'" },
    { type: "cmd", text: "FixedPrecision.PI().toString()" },
    { type: "out", cls: "ok", text: "'3.14159265'" },
    { type: "cursor" },
  ];

  let current_lang = DEFAULT_LANG;
  let hero_run = 0;
  let lab_render = null;
  let lab_factory = null;

  function by_id(id) {
    return document.getElementById(id);
  }

  function all(selector) {
    return document.querySelectorAll(selector);
  }

  function set_text(id, text) {
    const node = by_id(id);
    if (node) {
      node.textContent = text;
      return node;
    } else {
      return null;
    }
  }

  function dict() {
    if (I18N[current_lang]) {
      return I18N[current_lang];
    } else {
      return {};
    }
  }

  function tr(key) {
    const value = dict()[key];
    if (typeof value === "string") {
      return value;
    } else {
      return "";
    }
  }

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function sleep(ms) {
    return new Promise(function (resolve) {
      if (REDUCED_MOTION || ms <= 0) {
        resolve();
      } else {
        setTimeout(resolve, ms);
      }
    });
  }

  function to_superscript(number) {
    return String(number)
      .split("")
      .map(function (digit) {
        return SUPERSCRIPT_DIGITS[Number(digit)];
      })
      .join("");
  }

  function read_language() {
    try {
      const stored = window.localStorage.getItem(LANG_KEY);
      if (stored === "pt" || stored === "en") {
        return stored;
      } else {
        return DEFAULT_LANG;
      }
    } catch (error) {
      // Storage can be blocked. The page uses the default language.
      return DEFAULT_LANG;
    }
  }

  function store_language(lang) {
    try {
      window.localStorage.setItem(LANG_KEY, lang);
    } catch (error) {
      // Storage can be blocked. The choice stays for this session only.
    }
  }

  function set_meta(selector, value) {
    const node = document.querySelector(selector);
    if (node) {
      node.setAttribute("content", value);
    } else {
      // The optional sharing tag is absent. Nothing to update.
    }
  }

  function build_marquee() {
    const track = by_id("mq-track");
    if (track) {
      const block = "<span>" + tr("mq").repeat(3) + "</span>";
      track.innerHTML = block + block;
    } else {
      // The decorative marquee is optional.
    }
  }

  function copy_text_for(button) {
    const target_selector = button.getAttribute("data-copy-target");
    const literal = button.getAttribute("data-copy");
    if (literal !== null) {
      return literal;
    } else if (target_selector) {
      const node = document.querySelector(target_selector);
      if (node) {
        return node.textContent.trim();
      } else {
        return "";
      }
    } else {
      return "";
    }
  }

  function copy_with_textarea(text) {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.top = "-1000px";
    document.body.appendChild(area);
    area.select();
    let is_ok = false;
    if (typeof document.execCommand === "function") {
      try {
        is_ok = document.execCommand("copy");
      } catch (error) {
        is_ok = false;
      }
    } else {
      is_ok = false;
    }
    area.remove();
    return is_ok;
  }

  async function write_clipboard(text) {
    if (navigator.clipboard &&
      typeof navigator.clipboard.writeText === "function") {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (error) {
        return copy_with_textarea(text);
      }
    } else {
      return copy_with_textarea(text);
    }
  }

  function show_copy_state(button, is_ok) {
    const label = button.querySelector("[data-i18n]");
    if (label) {
      label.textContent = is_ok ? tr("ui.copied") : tr("ui.copyfail");
      button.classList.toggle("ok", is_ok);
      button.classList.toggle("bad", !is_ok);
      const previous = COPY_TIMERS.get(button);
      if (previous) {
        clearTimeout(previous);
      } else {
        // No feedback is pending.
      }
      const timer = setTimeout(function () {
        label.textContent = tr("ui.copy");
        button.classList.remove("ok", "bad");
        COPY_TIMERS.delete(button);
      }, COPY_FEEDBACK_MS);
      COPY_TIMERS.set(button, timer);
      return true;
    } else {
      return false;
    }
  }

  function setup_copy_buttons() {
    all(".copy").forEach(function (button) {
      button.addEventListener("click", async function () {
        const text = copy_text_for(button);
        if (text === "") {
          show_copy_state(button, false);
        } else {
          const is_ok = await write_clipboard(text);
          show_copy_state(button, is_ok);
        }
      });
    });
  }

  function setup_language_buttons() {
    all("[data-lang]").forEach(function (button) {
      button.addEventListener("click", function () {
        const lang = button.getAttribute("data-lang");
        if (lang === "pt" || lang === "en") {
          apply_language(lang);
        } else {
          // Unknown language buttons are ignored.
        }
      });
    });
  }

  function setup_reveal() {
    const elements = Array.from(all(".rv"));
    if (REDUCED_MOTION || !("IntersectionObserver" in window)) {
      elements.forEach(function (element) {
        element.classList.add("on");
      });
    } else {
      const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("on");
            observer.unobserve(entry.target);
          } else {
            // The element stays hidden until it enters the viewport.
          }
        });
      }, { threshold: 0.12 });
      elements.forEach(function (element) {
        observer.observe(element);
      });
    }
  }

  function update_scroll_percent() {
    const max = document.documentElement.scrollHeight -
      window.innerHeight;
    const percent = max > 0
      ? Math.round((window.scrollY / max) * 100)
      : 0;
    set_text("sb-scroll", percent + "%");
  }

  function update_clock() {
    const locale = current_lang === "pt" ? "pt-BR" : "en-GB";
    set_text("sb-clock", new Date().toLocaleTimeString(locale));
  }

  function setup_status_bar() {
    window.addEventListener("scroll", update_scroll_percent,
      { passive: true });
    window.addEventListener("resize", update_scroll_percent,
      { passive: true });
    update_scroll_percent();
    update_clock();
    setInterval(update_clock, 1000);
  }

  function append_meta_line(body, text) {
    const line = document.createElement("div");
    line.className = "tl meta";
    line.textContent = text;
    body.appendChild(line);
  }

  function append_output_line(body, item) {
    const line = document.createElement("div");
    line.className = "tl out" + (item.cls ? " " + item.cls : "");
    line.textContent = item.text;
    body.appendChild(line);
    body.scrollTop = body.scrollHeight;
  }

  function append_cursor_line(body) {
    const line = document.createElement("div");
    line.className = "tl cmdline";
    const prompt = document.createElement("span");
    prompt.className = "ps1";
    prompt.textContent = "> ";
    const cursor = document.createElement("i");
    cursor.className = "cur";
    line.append(prompt, cursor);
    body.appendChild(line);
    body.scrollTop = body.scrollHeight;
  }

  async function append_typed_command(body, text, token) {
    const line = document.createElement("div");
    line.className = "tl cmdline";
    const prompt = document.createElement("span");
    prompt.className = "ps1";
    prompt.textContent = "> ";
    const typed = document.createElement("span");
    typed.className = "tc";
    const cursor = document.createElement("i");
    cursor.className = "cur";
    line.append(prompt, typed, cursor);
    body.appendChild(line);
    body.scrollTop = body.scrollHeight;
    for (const character of text) {
      if (token !== hero_run) {
        return;
      } else {
        typed.textContent += character;
        await sleep(rand(TYPE_MIN_MS, TYPE_MAX_MS));
      }
    }
    cursor.remove();
  }

  async function run_hero() {
    const body = by_id("hero-term");
    if (!body) {
      return;
    } else {
      const token = ++hero_run;
      body.innerHTML = "";
      append_meta_line(body, tr("term.meta"));
      for (const item of HERO_SEQ) {
        if (token !== hero_run) {
          return;
        } else if (item.type === "cmd" && !REDUCED_MOTION) {
          await append_typed_command(body, item.text, token);
          await sleep(HERO_CMD_DELAY_MS);
        } else if (item.type === "cmd") {
          const line = document.createElement("div");
          line.className = "tl cmdline";
          const prompt = document.createElement("span");
          prompt.className = "ps1";
          prompt.textContent = "> ";
          const text = document.createElement("span");
          text.className = "tc";
          text.textContent = item.text;
          line.append(prompt, text);
          body.appendChild(line);
          body.scrollTop = body.scrollHeight;
        } else if (item.type === "cursor") {
          append_cursor_line(body);
        } else {
          append_output_line(body, item);
          await sleep(HERO_LINE_DELAY_MS);
        }
      }
    }
  }

  function show_lab_error() {
    const error = by_id("lab-error");
    if (error) {
      error.hidden = false;
    } else {
      // The lab is not present. Nothing to show.
    }
    all("[data-res]").forEach(function (cell) {
      cell.textContent = "—";
    });
    set_text("lab-raw", "—");
    set_text("lab-scale", "—");
    set_text("lab-code", "—");
    const float = set_text("lab-float", "—");
    if (float) {
      float.classList.remove("bad");
    } else {
      // The detail panel is optional.
    }
  }

  function read_places(input) {
    const parsed = Number.parseInt(input.value, 10);
    if (Number.isNaN(parsed)) {
      return DEFAULT_LAB_PLACES;
    } else {
      return Math.min(MAX_PLACES, Math.max(0, parsed));
    }
  }

  function render_lab() {
    const value_input = by_id("lab-value");
    const places_input = by_id("lab-places");
    if (!value_input || !places_input || !lab_factory) {
      return;
    } else {
      const places = read_places(places_input);
      const raw = value_input.value.trim();
      try {
        const value = lab_factory(raw);
        all("[data-mode]").forEach(function (row) {
          const mode = Number(row.getAttribute("data-mode"));
          const cell = row.querySelector("[data-res]");
          if (cell) {
            cell.textContent = value.scale(places, mode).toFixed(places);
          } else {
            // A malformed row is ignored.
          }
        });
        const half_up = value.scale(places, 4).toFixed(places);
        const float_value = Number(raw);
        let float_text = "—";
        if (Number.isFinite(float_value)) {
          float_text = float_value.toFixed(places);
        } else {
          // The value is outside the Number range. The dash shows it.
        }
        set_text("lab-raw", value.raw().toString());
        set_text("lab-scale", "10" + to_superscript(places) +
          " = " + (10n ** BigInt(places)).toString());
        set_text("lab-float-key", "Number.toFixed(" + places + ")");
        const float_cell = set_text("lab-float", float_text);
        if (float_cell) {
          float_cell.classList.toggle("bad",
            float_text !== "—" && float_text !== half_up);
        } else {
          // The detail panel is optional.
        }
        set_text("lab-code", 'P20("' + raw + '").scale(' + places +
          ", 4).toFixed(" + places + ') // "' + half_up + '"');
        const error = by_id("lab-error");
        if (error) {
          error.hidden = true;
        } else {
          // The error line is optional.
        }
      } catch (error) {
        // An invalid value is a normal path. The error line explains it.
        show_lab_error();
      }
    }
  }

  function setup_lab() {
    const value_input = by_id("lab-value");
    const places_input = by_id("lab-places");
    if (!value_input || !places_input) {
      return;
    } else {
      lab_factory = FP.create({
        places: LAB_PARSE_PLACES,
        roundingMode: 4,
      });
      all("[data-set]").forEach(function (chip) {
        chip.addEventListener("click", function () {
          value_input.value = chip.getAttribute("data-set");
          render_lab();
          value_input.focus();
        });
      });
      value_input.addEventListener("input", render_lab);
      places_input.addEventListener("input", render_lab);
      places_input.addEventListener("change", function () {
        places_input.value = String(read_places(places_input));
        render_lab();
      });
      lab_render = render_lab;
      render_lab();
    }
  }

  function show_lab_unavailable() {
    const error = by_id("lab-error");
    if (error) {
      error.setAttribute("data-i18n", "lab.unavailable");
      error.innerHTML = tr("lab.unavailable");
      error.hidden = false;
    } else {
      // The lab is not present. Nothing to show.
    }
    all("[data-res]").forEach(function (cell) {
      cell.textContent = "—";
    });
    show_lab_error();
  }

  function init_lab() {
    if (FP && typeof FP.create === "function") {
      setup_lab();
    } else {
      show_lab_unavailable();
    }
  }

  function apply_language(lang) {
    if (lang === "pt" || lang === "en") {
      current_lang = lang;
    } else {
      current_lang = DEFAULT_LANG;
    }
    document.documentElement.lang = current_lang === "pt" ? "pt-BR" : "en";
    const title = tr("meta.title");
    if (title !== "") {
      document.title = title;
    } else {
      // The fallback page title stays in place.
    }
    set_meta('meta[name="description"]', tr("meta.desc"));
    set_meta('meta[property="og:title"]', tr("meta.title"));
    set_meta('meta[property="og:description"]', tr("meta.desc"));

    all("[data-i18n]").forEach(function (element) {
      const key = element.getAttribute("data-i18n");
      const value = tr(key);
      if (value !== "") {
        element.innerHTML = value;
      } else {
        // The authored fallback text stays in place.
      }
    });
    all("[data-i18n-aria]").forEach(function (element) {
      const key = element.getAttribute("data-i18n-aria");
      const value = tr(key);
      if (value !== "") {
        element.setAttribute("aria-label", value);
      } else {
        // The authored fallback label stays in place.
      }
    });
    all("[data-lang]").forEach(function (button) {
      const is_on = button.getAttribute("data-lang") === current_lang;
      button.classList.toggle("on", is_on);
      button.setAttribute("aria-pressed", is_on ? "true" : "false");
    });
    set_text("sb-mode", tr("sb.exact"));
    build_marquee();
    if (lab_render) {
      lab_render();
    } else {
      // The lab is unavailable. Its message is already set.
    }
    run_hero();
    store_language(current_lang);
  }

  function init() {
    set_text("year", String(new Date().getFullYear()));
    setup_reveal();
    setup_copy_buttons();
    setup_language_buttons();
    setup_status_bar();
    init_lab();
    const replay = by_id("replay");
    if (replay) {
      replay.addEventListener("click", function () {
        run_hero();
      });
    } else {
      // The replay control is optional.
    }
    apply_language(read_language());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
}());
