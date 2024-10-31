const apiKey = "AIzaSyB2E6EkpX2h3DXZfJvje7ShkEFEHYkgsw4";

async function searchBooks() {
  const query = document.getElementById("search-input").value;
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${apiKey}`
  );
  const data = await response.json();
  displayResults(data.items);
}

function displayResults(books) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  books.forEach((book) => {
    const bookItem = document.createElement("div");
    bookItem.classList.add("book-item");

    const title = book.volumeInfo.title || "Título indisponível";
    const authors = book.volumeInfo.authors
      ? book.volumeInfo.authors.join(", ")
      : "Autor(es) indisponível";
    const downloadUrl = book.accessInfo.pdf?.acsTokenLink;

    bookItem.innerHTML = `
            <h3>${title}</h3>
            <p>${authors}</p>
            ${
              downloadUrl
                ? `<button onclick="downloadBook('${downloadUrl}', '${title}')">Baixar</button>`
                : "<p>Download indisponível</p>"
            }
        `;

    resultsDiv.appendChild(bookItem);
  });
}

async function downloadBook(downloadUrl, fileName) {
  const response = await fetch(
    `/download?downloadUrl=${encodeURIComponent(
      downloadUrl
    )}&fileName=${encodeURIComponent(fileName)}`
  );
  const message = await response.text();
  alert(message);
}
