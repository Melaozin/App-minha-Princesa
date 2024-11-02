const apiKey = "AIzaSyB2E6EkpX2h3DXZfJvje7ShkEFEHYkgsw4";

document.querySelector("#search-button").addEventListener("click", async () => {
  const query = document.getElementById("search-input").value;
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${apiKey}`
  );
  const data = await response.json();

  displayResults(data.items);
});

function displayResults(books) {
  const resultsDiv = document.querySelector(".books-grid");
  resultsDiv.innerHTML = "";

  books.forEach((book) => {
    const bookItem = document.createElement("div");
    bookItem.classList.add("book-card");

    const features = {
      title: book.volumeInfo.title || "Título indisponível",
      authors: book.volumeInfo.authors
        ? book.volumeInfo.authors.join(", ")
        : "Autor(es) indisponível",
      downloadUrl: book.accessInfo.pdf.acsTokenLink || "#",
      image: book.volumeInfo.imageLinks
        ? book.volumeInfo.imageLinks.thumbnail
        : "",
      description: book.searchInfo
        ? book.searchInfo.textSnippet
        : "Sem descrição",
    };

    bookItem.innerHTML = `
            <img
            src="${features.image}"
            class="book-cover"
            alt="${features.title}"
          />
          <div class="book-info">
            <h2 class="book-title">${features.title}</h2>
            <p class="book-author">${features.authors}</p>
            <p class="book-description">${features.description}</p>
            <a class="add-library-button" href="${features.downloadUrl}">
              Adicionar à minha biblioteca
            </a>
          </div>
        `;

    resultsDiv.appendChild(bookItem);
  });

  // Adiciona o event listener para todos os botões "Adicionar à minha biblioteca"
  document.querySelectorAll(".add-library-button").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault(); // Impede o redirecionamento padrão do link
      const downloadUrl = button.href;
      const fileName = button
        .closest(".book-card")
        .querySelector(".book-title").innerText;
      addToLibrary(downloadUrl, fileName);
    });
  });
}

// Função para adicionar livro à biblioteca
async function addToLibrary(downloadUrl, fileName) {
  document.querySelector(".add-library-button").innerHTML =
    "Livro adicionado à biblioteca";
}
