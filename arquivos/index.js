document.querySelector("#find").addEventListener("click", () => {
  fetch("teste.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao carregar o arquivo JSON");
      }
      return response.json();
    })
    .then((data) => {
      console.log("DATA: ", data.items);
      displayBooks(data);
    })
    .catch((error) => {
      console.error("Erro:", error);
    });
});

function displayBooks(data) {
  data.items.forEach((i) => {
    const container = document.querySelector("#bookResults");
    const features = {
      titulo: i.volumeInfo.title,
      autor: i.volumeInfo.authors[0],
      pdfLink: i.volumeInfo.previewLink,
      capa: i.volumeInfo.imageLinks
        ? i.volumeInfo.imageLinks.smallThumbnail
        : "",
      resenha: i.searchInfo ? i.searchInfo.textSnippet : "",
      idioma: i.volumeInfo.language,
    };

    const containerBook = `
    <div class="container">
          <img
            src=${features.capa}
          />
          <h2>${features.titulo}</h2>
          <p>
            ${features.resenha}
          </p>
          <span>
            <p>${features.autor}</p>
            <p>${features.idioma}</p>
          </span>
          <a
            href="${features.pdfLink}"
            >Ler</a
          >
        </div>
    `;

    container.innerHTML += containerBook;
    console.log(features);
  });
}
