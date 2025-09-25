<p align="center">
  <img src="https://media.giphy.com/media/hvRJCLFzcasrR4ia7z/giphy.gif" width="40" alt="wave" />
</p>

<h1 align="center">🔒 Security Policy <img src="https://img.shields.io/badge/Security%20First-%2300BFAE?style=flat-square&logo=shield&logoColor=white" alt="Security Badge" /></h1>

<p align="center">
  <b>Responsible Disclosure | Static Frontend Security | Bypass Strictly Prohibited</b><br>
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&duration=3500&pause=700&color=E63946&center=true&vCenter=true&width=480&lines=Client+Only+%7C+No+Backend+Secrets;Session+Tokens+(LocalStorage)+Only;Safe+Redirects%2C+Best+Practices;Support+%26+Verify+%5BUPDATED%5D+%7BLatest%7D+Version" alt="Security Typing SVG">
</p>

<p align="center">
  <!-- Previous confetti image link removed as it was not working -->
  <img src="https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif" width="180" alt="Confetti Celebration" />
</p>

---

## 📢 Reporting a Vulnerability

Found a security issue or exploit? Please help keep this project safe for everyone!

- **Do NOT open a public issue for vulnerabilities.**
- Email your findings directly to:  
  <a href="mailto:contact@deepdeyiitk.com"><img src="https://img.shields.io/badge/Email-contact@deepdeyiitk.com-yellow?style=for-the-badge" /></a>
- If possible, include:
  - Steps to reproduce
  - Screenshots or code snippets
  - Impact assessment (if known)
- We will respond as quickly as possible and coordinate a fix or mitigation.
- Get credit on the repo’s acknowledgements (if desired)!

---

## 🔐 Security Scope

**This project is fully static** (HTML, CSS, JS on GitHub Pages).  
There is **no backend, no database, and no server-side logic**. All verification and session management are handled in the browser.

- **Session tokens:**  
  Stored in `localStorage`, valid for up to 6 hours.
- **No sensitive secrets:**  
  All logic is public and open source by design.
- **Redirects:**  
  Implemented in `dd.html` using session checks and fallback timers.
- **Browser support:**  
  Latest versions of Chrome, Firefox, and Edge are recommended for best security.

---

## 🛡️ Best Practices & Limitations

- **Frontend-only:**  
  Do not use this for high-risk authentication or sensitive data protection.
- **No passwords or personal data** should ever be collected.
- **Session tokens** are not cryptographically secure; they're for basic verification only.
- **For stronger security** (e.g., for sensitive forms), pair this with a backend or use a service with proven bot protection.
- **Keep dependencies up-to-date** to avoid known vulnerabilities.
- **Use HTTPS** to serve your site for secure transport (GitHub Pages does this automatically).
- **Bypass strictly prohibited:**  
  Any method, tool, or advice to bypass the verification, token, or redirect mechanism is strictly prohibited and not tolerated.  
  If you discover a bypass, report it privately—do not share, demonstrate, or use it.

---

## 🔗 Support & Verify [UPDATED] {Latest} Version

- This project includes a **Support & Verify system** designed for modular, client-side human verification.
- Always use the **latest version** available for the best security practices and features.
- Visit: [support.deepdeyiitk.com](https://support.deepdeyiitk.com/) for documentation and updates.

---

## 🧪 Common Security Issues & How to Fix

### 1. LocalStorage Not Working?  
- Make sure your browser allows localStorage (not in private/incognito mode).
- Some extensions may block storage APIs; try in a clean browser profile.

### 2. Redirects Not Functional?  
- Confirm you’re accessing via HTTPS and not file://
- Check the redirect URL in `dd.html` is set correctly:

```js
// dd.html
const REDIRECT_TARGET = "https://docs.google.com/forms/d/e/1FAIpQLSdqcVijtxP2qtiwFtuS-NFBL9_Pnbf6WwiydLnzh4nbxQWy1Q/viewform";
if (localStorage.getItem("verifiedToken")) {
    window.location.href = REDIRECT_TARGET;
} else {
    setTimeout(() => {
        window.location.href = "index.html";
    }, 7000);
}
```

### 3. JS Challenge Not Loading?
- Check for JavaScript errors in the browser console.
- Ensure all scripts are loaded properly and not blocked by browser settings.

---

## 🧑‍💻 How to Test Your Security

- Complete verification modules as intended.
- Attempting, facilitating, or publishing bypass or circumvention techniques is STRICTLY PROHIBITED.
- Access the redirect page (`dd.html`) without a valid token only to report flaws, never for malicious purposes.
- Test on multiple browsers and devices.
- Report any unintended access or unexpected behavior!

---

## 🤝 Responsible Disclosure

We appreciate **responsible security research**.  
Please give us a chance to address issues **before public disclosure**.

- Private reports = faster, safer fixes for all users.
- Credit will be given in the repo (if desired).
- For urgent issues, mention “SECURITY” in your email subject.

---

## 📦 Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: Support & Verify [UPDATED] {Latest}|

---

## 👨‍🔧 Security Maintenance

- **Regular dependency checks** (for any external libraries or npm packages)
- **Review all code contributions** for security risks before merging
- **Community feedback** is always welcome!

---

## 🙏 Thank You!

Your contributions make this project safer and better for everyone.

<p align="center">
  <em>Designed & Maintained with ❤️ by <b>Deep Dey</b> — Modular, Frontend-Only, Security-Conscious</em>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Anuj579/Anuj579/output/github-contribution-grid-snake-dark.svg" alt="Snake animation" />
</p>
