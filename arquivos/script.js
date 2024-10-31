// const apiKey = "AIzaSyB2E6EkpX2h3DXZfJvje7ShkEFEHYkgsw4"; // Substitua com sua chave de API

async function searchBooks() {
  const query = document.getElementById("searchInput").value;
  const bookResults = document.getElementById("bookResults");
  bookResults.innerHTML = ""; // Limpa resultados anteriores

  if (!query) {
    bookResults.innerHTML = "<p>Digite um título de livro para buscar.</p>";
    return;
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${apiKey}`
    );
    const data = await response.json();
    console.log("Data: ", data);
    if (data.totalItems === 0) {
      bookResults.innerHTML = "<p>Nenhum livro encontrado.</p>";
      return;
    }

    data.items.forEach((item) => {
      const bookInfo = item.volumeInfo;
      const bookElement = document.createElement("div");
      bookElement.classList.add("book");

      bookElement.innerHTML = `
                <img src="${
                  bookInfo.imageLinks?.thumbnail ||
                  "https://via.placeholder.com/100"
                }" alt="${bookInfo.title}">
                <h3>${bookInfo.title}</h3>
                <p>Autor: ${
                  bookInfo.authors
                    ? bookInfo.authors.join(", ")
                    : "Desconhecido"
                }</p>
                <a href="${bookInfo.previewLink}" target="_blank">Ler Online</a>
            `;

      bookResults.appendChild(bookElement);
    });
  } catch (error) {
    bookResults.innerHTML =
      "<p>Erro ao buscar livros. Tente novamente mais tarde.</p>";
    console.error("Erro na busca:", error);
  }
}
