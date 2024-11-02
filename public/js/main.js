async function fetchSavedBooks() {
  const response = await fetch("/saved-books");
  const books = await response.json();

  const savedBooksDiv = document.querySelector(".books-grid");
  savedBooksDiv.innerHTML = ""; // Limpa a lista existente

  // Cria um iframe para exibir o PDF selecionado
  const pdfIframe = document.createElement("iframe");
  pdfIframe.width = "100%";
  pdfIframe.height = "600px";
  savedBooksDiv.appendChild(pdfIframe); // Adiciona o iframe ao contêiner

  books.forEach((book) => {
    const bookItem = document.createElement("div");
    bookItem.classList.add("book-item");

    bookItem.innerHTML = `
      <p>${book}</p>
      <a href="#" class="open-pdf" data-file-name="${encodeURIComponent(
        book
      )}">Abrir PDF</a>
    `;

    // Adiciona um evento de clique para abrir o PDF no iframe
    bookItem.querySelector(".open-pdf").addEventListener("click", (event) => {
      event.preventDefault(); // Previne o comportamento padrão do link
      const fileName = event.target.dataset.fileName;
      pdfIframe.src = `/ler-livro?fileName=${fileName}`; // Atualiza a src do iframe
    });

    savedBooksDiv.appendChild(bookItem);
  });
}

fetchSavedBooks();
