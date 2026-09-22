(function () {
  const listEl = document.getElementById("pub-list");
  const publications = window.PUBLICATIONS || [];

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
    });
  }

  function highlightName(authors) {
    return escapeHtml(authors).replace(
      /C\.-Y\. Shen/g,
      "<strong>C.-Y. Shen</strong>"
    );
  }

  function renderPublications() {
    if (!listEl) return;
    const recent = publications.slice(0, 8);
    listEl.innerHTML = recent
      .map(function (pub) {
        return (
          '<div class="pub">' +
          highlightName(pub.authors) +
          '. <a href="' +
          escapeHtml(pub.url) +
          '" target="_blank" rel="noopener noreferrer">"' +
          escapeHtml(pub.title) +
          '"</a>. <span class="venue">' +
          escapeHtml(pub.venue) +
          "</span> (" +
          escapeHtml(pub.year) +
          ").</div>"
        );
      })
      .join("");
  }

  async function updateScholarStats() {
    const citationsEl = document.getElementById("total-citations");
    const hIndexEl = document.getElementById("h-index");
    if (!citationsEl || !hIndexEl) return;

    const scholarUrl =
      "https://scholar.google.com/citations?user=XcXcmNsAAAAJ&hl=en";
    const proxyUrl =
      "https://api.allorigins.win/get?url=" + encodeURIComponent(scholarUrl);

    try {
      const response = await fetch(proxyUrl);
      if (!response.ok) return;
      const data = await response.json();
      const parser = new DOMParser();
      const doc = parser.parseFromString(data.contents, "text/html");
      const stats = doc.querySelectorAll(".gsc_rsb_std");
      if (stats.length >= 3) {
        citationsEl.textContent = stats[0].textContent.trim();
        hIndexEl.textContent = stats[2].textContent.trim();
      }
    } catch (error) {
      // Leave placeholders if Scholar is unreachable.
    }
  }

  renderPublications();
  updateScholarStats();
})();
