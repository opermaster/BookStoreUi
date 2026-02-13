let localhost = "https://localhost:7211/api/";
async function check_if_logged(){
    let token = localStorage.getItem("jwt");
    if(token){
        const url = localhost+"auth/me";
        try {
            const response = await fetch(url,{
                method:"GET",
                headers: {
                      "Authorization": "Bearer " + token
                    }
            });
            const result = await response.json();
            console.log("logged: "+ result.username)
            let elem = document.getElementById("login-text");
            elem.innerText = result.username;
            elem.href ="../User/User.html"
        } catch (error) {
            console.error(error.message);
        }
    }else{
        console.log("Not logged")
    }
}
async function load_books() {
    const url = localhost+"books/all-books";
    try {
        const response = await fetch(url,{
            method:"GET",
        });
        const result = await response.json();
        document.getElementById("content").innerHTML="";
        result.forEach(book => {
            add_book(book);
        });
    } catch (error) {
        console.error(error.message);
    }
}
function add_book(book) {
    const container = document.getElementById("content");

    const bookDiv = document.createElement("div");
    bookDiv.className = "book-card";

    bookDiv.innerHTML = `
        <h3>${book.title}</h3>
        <p><strong>Author:</strong> ${book.authorName}</p>
        <p>${book.synapsis}</p>
        <p><strong>Price:</strong> $${book.cost}</p>
        <p><strong>Count:</strong> ${book.count}</p>
        <img src="${book.img}">
    `;
    const buyBtn = document.createElement("button");
    buyBtn.textContent = "Buy";

    buyBtn.addEventListener("click", () => {
        add_order(book);
    });

    bookDiv.appendChild(buyBtn);
    
    container.appendChild(bookDiv);
}
async function add_order(book) {
    const url = localhost + "orders/new-order";

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                bookId: book.id,
                creationDate: new Date().toISOString(),
                done: false,
                soldDate: null
            })
        });

        if (!response.ok) {
            const text = await response.text();
            console.error("Order error:", text);
            alert("Failed to create order");
            return;
        }

        alert("Order created successfully!");
    } catch (error) {
        console.error("Network error:", error);
    }
}
async function load_books_by_search() {
    let name = document.getElementById("book_name_input").value;
    const url = localhost+`books/search/${name}`;
    try {
        const response = await fetch(url,{
            method:"GET",
        });
        const result = await response.json();
        document.getElementById("content").innerHTML="";
         result.forEach(book => {
            add_book(book);
        });
    } catch (error) {
        console.error(error.message);
    }
}
document.addEventListener("DOMContentLoaded", () => {
    check_if_logged();
    load_books();
});