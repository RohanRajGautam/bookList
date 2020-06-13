class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  addBookToList(book) {
    const list = document.getElementById("book-list");

    //create tr element
    const row = document.createElement("tr");

    //insert cols
    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href='#' class='delete'>X</td>`;

    list.appendChild(row);
  }

  clearField() {
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("isbn").value = "";
  }

  deleteBook(target) {
    if (target.className === "delete") {
      target.parentElement.parentElement.remove();
    }
  }

  showAlert(message, className) {
    //create div
    const div = document.createElement("div");

    //add classes
    div.className = `alert ${className}`;

    //add text
    div.appendChild(document.createTextNode(message));

    //get parent
    const container = document.querySelector(".container");

    //get form
    const form = document.querySelector("#book-form");

    //insert alert
    container.insertBefore(div, form);

    //timeout after 3 second
    setTimeout(function () {
      document.querySelector(".alert").remove();
    }, 3000);
  }
}

// Local Storage Class
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }

    return books;
  }

  static displayBooks() {
    const books = Store.getBooks();

    books.forEach(function (book) {
      const ui = new UI();

      // Add book to UI
      ui.addBookToList(book);
    });
  }

  static addBook(book) {
    const books = Store.getBooks();

    books.push(book);

    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();

    books.forEach(function (book, index) {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem("books", JSON.stringify(books));
  }
}

// DOM Load Event
document.addEventListener("DOMContentLoaded", Store.displayBooks);

//event listener for delete
document.getElementById("book-list").addEventListener("click", function (e) {
  //instantiate UI
  const ui = new UI();

  //delete book
  ui.deleteBook(e.target);

  //remove from local storage
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  //show message
  ui.showAlert("Book removed", "error");
  e.preventDefault();
});

// event listener to add books
document.getElementById("book-form").addEventListener("submit", function (e) {
  //get form value
  const title = document.getElementById("title").value,
    author = document.getElementById("author").value;
  isbn = document.getElementById("isbn").value;

  //instantiate book
  const book = new Book(title, author, isbn);

  //instantiate UI
  const ui = new UI();

  //validate
  if (title === "" || author === "" || isbn === "") {
    //error alert
    ui.showAlert("Please fill the book details", "error");
  } else {
    //add book to list
    ui.addBookToList(book);

    //add to LS
    Store.addBook(book);

    //clear field
    ui.clearField();

    ui.showAlert("Book added", "success");
  }
  console.log(ui);
  e.preventDefault();
});
