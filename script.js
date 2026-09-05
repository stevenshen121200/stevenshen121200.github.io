(function () {
  const navLinks = document.querySelectorAll(".site-nav a[href^='#']");
  const sections = Array.from(navLinks)
    .map(function (link) {
      return document.querySelector(link.getAttribute("href"));
    })
    .filter(Boolean);

  function setActiveNav() {
    const fromTop = window.scrollY + 96;
    let current = sections[0];
    sections.forEach(function (section) {
      if (section.offsetTop <= fromTop) current = section;
    });
    navLinks.forEach(function (link) {
      link.classList.toggle("is-active", link.getAttribute("href") === "#" + current.id);
    });
  }

  window.addEventListener("scroll", setActiveNav, { passive: true });
  setActiveNav();

  const listEl = document.getElementById("pub-list");
  const countEl = document.getElementById("pub-count");
  const filters = document.querySelectorAll(".filter");
  const publications = window.PUBLICATIONS || [];
  let activeFilter = "all";

  function matches(pub, filter) {
    if (filter === "all") return true;
    if (filter === "first") return pub.firstAuthor;
    return pub.tags.indexOf(filter) !== -1;
  }

  function highlightName(authors) {
    return authors.replace(
      /C\.-Y\. Shen/g,
      "<strong>C.-Y. Shen</strong>"
    );
  }

  function render() {
    const items = publications.filter(function (pub) {
      return matches(pub, activeFilter);
    });
    countEl.textContent = items.length + " item" + (items.length === 1 ? "" : "s");
    listEl.innerHTML = "";

    let lastYear = null;
    items.forEach(function (pub) {
      if (pub.year !== lastYear) {
        const year = document.createElement("div");
        year.className = "year-label";
        year.textContent = String(pub.year);
        listEl.appendChild(year);
        lastYear = pub.year;
      }

      const article = document.createElement("article");
      article.className = "pub-item";
      const badge = pub.firstAuthor ? '<span class="badge">First author</span>' : "";
      article.innerHTML =
        '<div class="title"><a href="' +
        pub.url +
        '" target="_blank" rel="noopener noreferrer">' +
        pub.title +
        "</a>" +
        badge +
        "</div>" +
        '<div class="authors">' +
        highlightName(pub.authors) +
        "</div>" +
        '<div class="venue">' +
        pub.venue +
        " " +
        pub.issue +
        "</div>";
      listEl.appendChild(article);
    });
  }

  filters.forEach(function (button) {
    button.addEventListener("click", function () {
      activeFilter = button.getAttribute("data-filter");
      filters.forEach(function (other) {
        const on = other === button;
        other.classList.toggle("is-active", on);
        other.setAttribute("aria-pressed", on ? "true" : "false");
      });
      render();
    });
  });

  render();
})();
