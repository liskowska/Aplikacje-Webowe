const searchInput = document.querySelector("[data-search]");
const sortSelect = document.getElementById("sort");
const filterButton = document.getElementById("filterButton");

let products = [];
let originalOrder = [];

searchInput.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase();

    products.forEach(product => {
        const isVisible =
            product.title.toLowerCase().includes(value) ||
            product.description.toLowerCase().includes(value) ||
            product.price.toString().includes(value) ||
            product.rating.toString().includes(value);

        product.element.classList.toggle("hide", !isVisible);
    });
});

filterButton.addEventListener("click", () => {
    const option = sortSelect.value;

    if (option === "asc") sortByName(true);
    else if (option === "desc") sortByName(false);
    else restoreOriginalOrder();
});

function sortByName(ascending) {
    products.sort((a, b) =>
        ascending
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title)
    );

    const tbody = document.querySelector("#productTable tbody");
    tbody.innerHTML = "";
    products.forEach(p => tbody.appendChild(p.element));
}

function restoreOriginalOrder() {
    const tbody = document.querySelector("#productTable tbody");
    tbody.innerHTML = "";

    originalOrder.forEach(p => tbody.appendChild(p.element));

    products = [...originalOrder];
}


fetch("https://dummyjson.com/products")
    .then(response => {
        if (!response.ok) throw new Error("Could not fetch resource");
        return response.json();
    })
    .then(data => {
        const tableBody = document.querySelector('#productTable tbody');

        products = data.products.map(product => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>
                    <strong>${product.title}</strong><br>
                    ${product.description}<br>
                    Cena: ${product.price}$<br>
                    Ocena: ⭐ ${product.rating}
                </td>
                <td>
                    <img src="${product.thumbnail}" alt="${product.title}">
                </td>
            `;

            tableBody.appendChild(tr);

            return {
                title: product.title,
                description: product.description,
                price: product.price,
                rating: product.rating,
                element: tr
            };
        });

        originalOrder = [...products];
    })
    .catch(error => console.error(error));
