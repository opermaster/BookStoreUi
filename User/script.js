let localhost = "https://localhost:7211/api/";
const popup = document.getElementById("pop-up");
const popupText = document.getElementById("pop-up-text");

function showPopup(text, type = "neg", timeout = 3000) {
    popupText.textContent = text;

    popup.classList.remove("pos", "neg", "active");
    popup.classList.add(type);
    requestAnimationFrame(() => {
        popup.classList.add("active");
    });
    setTimeout(() => {
        popup.classList.remove("active");
    }, timeout);
}
function add_book(container, book) {
    const bookDiv = document.createElement("div");
    bookDiv.className = "section-content";

    bookDiv.innerHTML = `
        <h3>${book.title}</h3>
        <p><strong>Author:</strong> ${book.authorName}</p>
        <p><strong>Synapsis:</strong> ${book.synapsis}</p>
        <p><strong>Price:</strong> $${book.cost}</p>
        <p><strong>Count:</strong> ${book.count}</p>
        <img src="${book.img}">
    `;

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";

    editBtn.addEventListener("click", () => {
        open_form_edit(book);
    });

    bookDiv.appendChild(editBtn);
    container.appendChild(bookDiv);
}

async function load_books() {
    const url = localhost + "books/by-user";
    const token = localStorage.getItem("jwt");

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            console.log(response.status)
        }

        const result = await response.json();
        const container = document.getElementById("book-list");
        clear_container("book-list");
        result.forEach(book => {
            add_book(container,book);
        });

    } catch (error) {
        console.error("ERROR: "+ error.message);
    }
}
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
function close_form(){
    document.querySelector(".modal-overlay").classList.remove("active");
    document.getElementById("add-form").classList.remove("active");
    localStorage.removeItem("currentBookId");
}
function open_form(edit){
    title_elem = document.getElementById("title").value = "";
    synapsis_elem = document.getElementById("synapsis").value = "";
    publishDate_elem = document.getElementById("publishDate").value = "";
    cost_elem = document.getElementById("cost").value = "";
    count_elem = document.getElementById("count").value = "";
    img_elem = document.getElementById("img").value = "";

    document.getElementById("form-btn").value = edit?"Edit":"Add";
    document.querySelector(".modal-overlay").classList.add("active");
    document.getElementById("add-form").classList.add("active");

}
function open_form_edit(book){
    open_form(true);
    localStorage.setItem("currentBookId",book.id);
    const title_elem = document.getElementById("title");
    const synapsis_elem = document.getElementById("synapsis");
    const publishDate_elem = document.getElementById("publishDate");
    const cost_elem = document.getElementById("cost");
    const count_elem = document.getElementById("count");
    const img_elem = document.getElementById("img");
    const authorRaw_elem = document.getElementById("authors");

    title_elem.value = book.title;
    synapsis_elem.value = book.synapsis;
    publishDate_elem.value = book.publishDate;
    cost_elem.value = book.cost;
    count_elem.value = book.count;
    img_elem.value = book.img;
    authorRaw_elem.value = book.authorId;
}
function close_author_form() {
    document.querySelector(".modal-overlay").classList.remove("active");
    document.getElementById("add-author-form").classList.remove("active");

    localStorage.removeItem("currentAuthorId");
}
function open_author_form(edit) {
    const elem = document.getElementById("add-author-form");

    document.getElementById("author-secondname").value = "";
    document.getElementById("author-firstname").value = "";
    document.getElementById("author-birthdate").value = "";

    document.querySelector(".modal-overlay").classList.add("active");
    document.getElementById("add-author-form").classList.add("active");

    document.getElementById("author-form-btn").value = edit ? "Edit" : "Add";
}
async function author_form_btn_click() {
    let token= localStorage.getItem("jwt");
    let secondname  = document.getElementById("author-secondname").value;
    let firstname = document.getElementById("author-firstname").value;
    let birthdate = document.getElementById("author-birthdate").value;
    const url = localhost+"authors/new-author";
    const author = {
        Secondname: secondname,
        Firstname: firstname,
        PublishDate: birthdate,
    };
    try {
        const response = await fetch(url,{
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(author)
        });
        if(response.status === 201) {
            alert("New author added!");
            load_authors();
        }
    } catch (error) {
        console.error("ERROR: "+ error.message);
    }

}
async function load_authors(){
    const url = localhost+"authors/all-authors";
    try {
        const response = await fetch(url,{
            method:"GET",
        });
        const result = await response.json();
        clear_container("authors");
        let elem = document.getElementById("authors");
        result.forEach(author => {
            let option = document.createElement("option");
            option.value = author.id;
            option.innerText = author.firstName + " " + author.secondName;
            elem.appendChild(option);

        });
    } catch (error) {
        console.error(error.message);
    }

}
async function edit_book() {
    const token = localStorage.getItem("jwt");

    const title = document.getElementById("title").value;
    const synapsis = document.getElementById("synapsis").value;
    const publishDate = document.getElementById("publishDate").value;
    const cost = document.getElementById("cost").value;
    const count = document.getElementById("count").value;
    const img = document.getElementById("img").value;

    const authorId = document.getElementById("authors").value;
    console.log(img);
    const book = {
        Id: localStorage.getItem("currentBookId"),
        Title: title,
        Synapsis: synapsis,
        PublishDate: publishDate,
        Cost: parseFloat(cost),
        Count: parseInt(count),
        Img: img,
        AuthorId: parseInt(authorId)
    };

    try {
        const response = await fetch(localhost + `books/by-bookid/${book.Id}`, {
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(book)
        });

        if (!response.ok) {
            console.log(response.text());
        }

        load_books();
        close_form();            

    } catch (error) {
        console.error(error.message);
        alert("Error creating book");
    }
}
function form_btn_click(){
    document.getElementById("form-btn").value=="Edit"?edit_book():add_new_book();
}
function toggle_section(id) {
    document.getElementById(id).classList.toggle("open");
}
async function add_new_book() {
    const token = localStorage.getItem("jwt");

    const title = document.getElementById("title").value;
    const synapsis = document.getElementById("synapsis").value;
    const publishDate = document.getElementById("publishDate").value;
    const cost = document.getElementById("cost").value;
    const count = document.getElementById("count").value;
    const img = document.getElementById("img").value;

    const authorId = document.getElementById("authors").value;

    const book = {
        Title: title,
        Synapsis: synapsis,
        PublishDate: publishDate,
        Cost: parseFloat(cost),
        Count: parseInt(count),
        Img: img,
        AuthorId: parseInt(authorId)
    };

    try {
        const response = await fetch(localhost + "books/new-book", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(book)
        });

        if (!response.ok) {
            console.log(response.text());
        }

        load_books();
        close_form();            // закрываем форму

    } catch (error) {
        console.error(error.message);
        alert("Error creating book");
    }
}
function clear_container(id) {
    const container = document.getElementById(id);
    while (container.children.length > 1) {
        container.removeChild(container.lastChild);
    }
}
function render_order_item(order) {
    const div = document.createElement("div");
    div.className = "section-content";
    div.id = "order-card";

    const status = order.done ? "Done" : "Pending";

    div.innerHTML = `
        <img src="${order.book.img}" width="120">
        <h3>${order.book.title}</h3>
        <p><strong>Author:</strong> ${order.book.authorName}</p>
        <p><strong>Price:</strong> $${order.book.cost}</p>
        <p><strong>Status:</strong> ${status}</p>
        <p><strong>Created:</strong> ${new Date(order.creationDate).toLocaleString()}</p>
        ${order.soldDate ? `<p><strong>Sold:</strong> ${new Date(order.soldDate).toLocaleString()}</p>` : ""}
    `;

    return div;
}
function render_list(containerId, data) {
    clear_container(containerId);

    const container = document.getElementById(containerId);

    if (data.length === 0) {
        const empty = document.createElement("p");
        empty.innerText = "No items";
        container.appendChild(empty);
        return;
    }

    data.forEach(order => {
        container.appendChild(render_order_item(order));
    });
}
async function load_purchases() {
    try {
        const response = await fetch(localhost + "orders/purchases/by-user", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        });

        const result = await response.json();
        render_list("purchases-list", result);

    } catch (error) {
        console.error("ERROR:", error.message);
    }
}
async function load_orders() {
    try {
        const response = await fetch(localhost + "orders/by-user", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        });

        const result = await response.json();
        render_list("orders-list", result);

    } catch (error) {
        console.error("ERROR:", error.message);
    }
}
function close_all_forms() {
    document.querySelector(".modal-overlay").classList.remove("active");
    document.getElementById("add-form").classList.remove("active");
    document.getElementById("add-author-form").classList.remove("active");
}
document.addEventListener("DOMContentLoaded", () => {
    check_if_logged();
    load_books();
    load_authors();
    load_orders();
    load_purchases();
});
