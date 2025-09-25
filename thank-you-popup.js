// thank-you-popup.js

document.addEventListener("DOMContentLoaded", () => {
  // Force fullscreen on load
  function openFullscreen() {
    let elem = document.documentElement;
    if (elem.requestFullscreen) elem.requestFullscreen();
    else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
    else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
  }
  openFullscreen();

  // Redirect if user exits fullscreen
  document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement) {
      window.location.href = "home.html";
    }
  });

  // Create popup overlay
  const popup = document.createElement("div");
  popup.className = "donate-popup-overlay";
  popup.innerHTML = `
    <div class="donate-popup">
      <h2>🎉 Supporter Details 🎉</h2>
      <form id="donorForm">
        <label>Name:<br><input type="text" name="name" required></label><br>
        <label>Date of Birth:<br><input type="date" name="dob" required></label><br>
        <label>
          Select:
          <select name="type" required>
            <option value="">--Choose--</option>
            <option value="school">School</option>
            <option value="college">College</option>
          </select>
        </label><br>
        <div id="extraFields"></div>
        <button type="submit" disabled>Submit</button>
      </form>
    </div>
  `;
  document.body.appendChild(popup);

  const form = document.getElementById("donorForm");
  const extraFields = document.getElementById("extraFields");
  const submitBtn = form.querySelector("button");

  // Dynamic fields for school/college
  form.type.addEventListener("change", (e) => {
    const val = e.target.value;
    extraFields.innerHTML = "";
    if (val === "school") {
      extraFields.innerHTML = `
        <label>Class:<br>
          <input type="text" name="class" required>
        </label><br>
      `;
    } else if (val === "college") {
      extraFields.innerHTML = `
        <label>Stream:<br>
          <input type="text" name="stream" required>
        </label><br>
        <label>Year:<br>
          <input type="text" name="year" required>
        </label><br>
      `;
    }
  });

  // Enable submit only if valid
  form.addEventListener("input", () => {
    submitBtn.disabled = !form.checkValidity();
  });

  // On submit → hide popup + show custom paragraph
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());

    popup.remove(); // remove popup overlay

    const container = document.querySelector(".thankyou-container");
    const paragraph = document.createElement("div");
    paragraph.className = "donor-paragraph";

    if (data.type === "school") {
      paragraph.innerHTML = `
        <p class="animated-text">
          Thank you <b>${data.name}</b> 🎉 (Born: ${data.dob}).  
          Your support as a <b>Class ${data.class}</b> student means so much —  
          you're not just donating, you're proving that even school students can spark real change! 💡
        </p>
      `;
    } else if (data.type === "college") {
      paragraph.innerHTML = `
        <p class="animated-text">
          Thank you <b>${data.name}</b> 🎉 (Born: ${data.dob}).  
          As a proud <b>${data.stream} student, Year ${data.year}</b>, your support inspires an entire community.  
          You're showing that future leaders invest in future dreamers. 🚀
        </p>
      `;
    }

    container.appendChild(paragraph);

    // Animate paragraph text (typewriter style)
    const textEl = paragraph.querySelector(".animated-text");
    const text = textEl.innerHTML;
    let i = 0;
    textEl.innerHTML = "";
    function typeWriter() {
      if (i < text.length) {
        textEl.innerHTML += text.charAt(i);
        i++;
        setTimeout(typeWriter, 30);
      }
    }
    typeWriter();

    // Trigger confetti (if available)
    if (typeof animate === "function") {
      animate();
    }
  });
});
