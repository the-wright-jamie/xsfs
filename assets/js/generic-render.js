function render(article, year) {
  fetch(`/articles/${year}/${article}.html`)
    .then((response) => response.text())
    .then((template) => {
      const rendered = Mustache.render(template);
      document.getElementById("target").innerHTML = rendered;
    });

  fetch(`/assets/html/footer.html`)
    .then((response) => response.text())
    .then((template) => {
      const rendered = Mustache.render(template);
      document.getElementById("footer-target").innerHTML = rendered;
    });
}
