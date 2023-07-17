function render() {
  fetch(`/assets/json/articles.json`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error();
      }
    })
    .then((data) => {
      var template = document.getElementById("write-ups-template").innerHTML;
      var rendered = Mustache.render(template, data);
      document.getElementById("write-ups-target").innerHTML = rendered;

      template = document.getElementById("demos-template").innerHTML;
      rendered = Mustache.render(template, data);
      document.getElementById("demos-target").innerHTML = rendered;

      template = document.getElementById("thoughts-template").innerHTML;
      rendered = Mustache.render(template, data);
      document.getElementById("thoughts-target").innerHTML = rendered;

      template = document.getElementById("misc-template").innerHTML;
      rendered = Mustache.render(template, data);
      document.getElementById("misc-target").innerHTML = rendered;
    })
    .catch((error) => {
      console.error(error);
      fetch(`/assets/html/error.html`)
        .then((response) => response.text())
        .then((template) => {
          const rendered = Mustache.render(template);
          document.getElementById("demos-target").innerHTML = rendered;
        });
    });
}
