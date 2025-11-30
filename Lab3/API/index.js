const searchInput = document.querySelector("[data-search]")
let products = []

searchInput.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase()

    products.forEach(product => {
        const isVisible = 
            product.title.toLowerCase().includes(value) || 
            product.description.toLowerCase().includes(value) ||
            product.price.toString().includes(value) || 
            product.rating.toString().includes(value)

        product.element.classList.toggle("hide", !isVisible)
    })

})

fetch("https://dummyjson.com/products")
    .then(response => {
        if (!response.ok) throw new Error("Could not fetch resource")
        return response.json()
    })
    .then(data => {
        const tableBody = document.getElementById('productTable').querySelector('tbody')

        products = data.products.map(product => {
            const tr = document.createElement("tr")

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
            `

            tableBody.appendChild(tr)

            return {
                title: product.title,
                description: product.description,
                price: product.price,
                rating: product.rating,
                element: tr    // zapisywanie referencji~~ do wiersza
            }
        })
    })
    .catch(error => console.error(error))


