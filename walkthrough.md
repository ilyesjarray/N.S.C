# 🛡️ Frontend Security Suite: Reusable Implementation Guide

This document contains the complete code for the aggressive front-end security suite we built. It is designed to act as a "strong shield" against casual asset theft, "Inspect Element" copying, and unauthorized offline/domain hosting. 

You can copy and paste these exact blocks into any future HTML/JS repository to instantly secure it.

---

## 1. CSS Hardening (Anti-Select & Anti-Touch)

These CSS rules prevent users from highlighting text, holding down on mobile to save images (the native browser popup), and physically dragging images out of the browser window.

Place this inside your `<style>` block or `.css` file:

```css
/* 1. Global Block: Stops text selection and mobile "Hold to Save/Share" menus */
* {
    -webkit-user-select: none;
    user-select: none;
    -webkit-touch-callout: none;
}

/* 2. Image Block: Stops users dragging images to their desktop or right-clicking them */
img {
    -webkit-user-drag: none;
    -khtml-user-drag: none;
    -moz-user-drag: none;
    -o-user-drag: none;
    pointer-events: none; /* Makes the image fundamentally unclickable to the browser */
}
```

> [!NOTE]
> If you have buttons or links that use `<img>` tags and *need* to be clickable, you must manually override `pointer-events: auto;` on those specific elements.

---

## 2. JavaScript Security Injection

This script implements five distinct layers of security. It uses an **IIFE (Immediately Invoked Function Expression)** so it runs the absolute microsecond the page loads, before the user can react. 

Place this exact snippet inside a `<script>` tag at the very top of your `<body>` or `<head>`:

```html
<script>
    // --- FULL SECURITY SUITE AND DOMAIN LOCK ---
    (function() {
        // ==========================================
        // 1. DOMAIN ANTI-CLONING LOCK
        // ==========================================
        // Update this list with ONLY the domains you officially own.
        // It completely blocks 'file:///' execution if someone downloads the source code.
        const allowedDomains = [
            'your-official-site.vercel.app', 
            'your-custom-domain.com', 
            'localhost', 
            '127.0.0.1'
        ];
        
        if (!allowedDomains.includes(window.location.hostname)) {
            // Instantly delete the HTML and show a red error screen
            document.documentElement.innerHTML = '<body style="background:#000;color:#f00;display:flex;justify-content:center;align-items:center;height:100vh;font-family:monospace;font-size:20px;text-align:center;">SECURITY ERROR: UNAUTHORIZED DOMAIN / LOCAL FILE TAMPERING.<br>REDIRECTING TO OFFICIAL SERVER...</body>';
            // Redirect them to your real site
            setTimeout(() => { window.location.href = 'https://your-custom-domain.com'; }, 2000);
            return;
        }

        // ==========================================
        // 2. ANTI RIGHT-CLICK & TOUCH HOLD
        // ==========================================
        document.addEventListener('contextmenu', event => event.preventDefault());

        // ==========================================
        // 3. ANTI-KEYBOARD SHORTCUTS (DevTools Blocker)
        // ==========================================
        // Blocks F12, Ctrl+U (Source), Ctrl+S (Save), and Ctrl+Shift+I/J/C (Inspectors)
        document.addEventListener('keydown', (e) => {
            if (
                e.key === 'F12' ||
                (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) ||
                (e.ctrlKey && ['U', 'S', 'P'].includes(e.key.toUpperCase())) ||
                (e.metaKey && e.altKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) || // MacOS equivalents
                (e.metaKey && ['U', 'S', 'P'].includes(e.key.toUpperCase()))               // MacOS equivalents
            ) {
                e.preventDefault();
                return false;
            }
        });

        // ==========================================
        // 4. ANTI-DRAG AND DROP
        // ==========================================
        document.addEventListener('dragstart', e => e.preventDefault());
        document.addEventListener('drop', e => e.preventDefault());

        // ==========================================
        // 5. AGGRESSIVE DEBUGGER TRAP
        // ==========================================
        // If an expert forces DevTools open via the browser menu, this loop will 
        // infinitely freeze their screen. If it detects the freeze, it wipes the DOM.
        setInterval(function() {
            const before = new Date().getTime();
            debugger; // Triggers DevTools breakpoint
            const after = new Date().getTime();
            
            // If it takes more than 100ms, the browser was paused by the debugger
            if (after - before > 100) { 
                document.body.innerHTML = ''; // Nuke the body
                window.location.replace('about:blank'); // Force exit
            }
        }, 500);
    })();
    // --- END SECURITY SUITE ---
</script>
```

---

## Testing & Maintenance

> [!CAUTION]
> **Domain Lock Failure Mode:** If you migrate to a new framework or purchase a new `.com` domain, you **must** update the `allowedDomains` array *before* deploying to the new host. Otherwise, the live site will lock you out!

### How to test your implementation:
1. **Right-Click Test:** Try right-clicking the background and images. Nothing should happen.
2. **Keyboard Test:** Press `F12` or `Ctrl+Shift+I`. Nothing should happen.
3. **Save-As Test:** Try to click and drag an image to your desktop. It should slide off seamlessly without creating an icon.
4. **Offline Tamper Test:** Download your live `index.html` file to your computer and double-click it (Which opens it as a `file:///` address). You should immediately see the Red Security Screen and get redirected.
