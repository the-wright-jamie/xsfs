function render(article, year) {
  fetch(`/assets/html/error.html`)
    .then((response) => {
      return response.text();
    })
    .then((template) => {
      const rendered = Mustache.render(template);
      document.getElementById("target").innerHTML = rendered;
    });
}
