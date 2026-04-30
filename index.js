(function () {
    const STORAGE_KEY = "weather-app-theme";
    const html = document.documentElement;
    const toggle = document.getElementById("theme-toggle");

    function getStoredTheme() {
        try {
            return localStorage.getItem(STORAGE_KEY);
        } catch {
            return null;
        }
    }

    function setStoredTheme(theme) {
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch {
            /* ignore */
        }
    }

   
    function applyTheme(theme) {
        const isDark = theme === "dark";
        html.setAttribute("data-theme", isDark ? "dark" : "light");
        html.classList.toggle("sl-theme-dark", isDark);
        if (toggle) {
            toggle.setAttribute(
                "aria-label",
                isDark ? "Switch to light mode" : "Switch to dark mode"
            );
        }
    }

    function resolveInitialTheme() {
        const stored = getStoredTheme();
        if (stored === "light" || stored === "dark") {
            return stored;
        }
        return window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
    }

    applyTheme(resolveInitialTheme());

    toggle?.addEventListener("click", function () {
        const next =
            html.getAttribute("data-theme") === "dark" ? "light" : "dark";
        applyTheme(next);
        setStoredTheme(next);
    });

    window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", function (e) {
            if (getStoredTheme()) return;
            applyTheme(e.matches ? "dark" : "light");
        });
})();
