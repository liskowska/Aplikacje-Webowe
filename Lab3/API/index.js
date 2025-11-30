// const searchInput = document.querySelector("[data-search]")
// let products = []

// searchInput.addEventListener("input", (e)=>{
//     const value = e.target.value.toLowerCase()
//     products.forEach(product => {
//         const isVisible = product.title.toLowerCase().includes(value) || 
//                           product.description.toLowerCase().includes(value) ||
//                           product.price.toLowerCase().includes(value) || 
//                           product.rating.toLowerCase.includes(value)
//         product.classList.toggle("hide", !isVisible)
//     })

// })

// fetch("https://dummyjson.com/products")
//     .then(response => {
//         if (!response.ok) {
//             throw new Error("Could not fetch resource");
//         }
//         return response.json();
//     })
//     .then(data => {
//         const tableBody = document.getElementById('productTable').querySelector('tbody');

//         products = data.products.map(product => {
//             const row = `
//                 <tr>
//                     <td>
//                         <strong>${product.title}</strong><br>
//                         ${product.description}<br>
//                         Cena: ${product.price}$<br>
//                         Ocena: ⭐ ${product.rating}
//                     </td>
//                     <td>
//                         <img src="${product.thumbnail}" alt="${product.title}">
//                     </td>
//                 </tr>
//             `;
//             tableBody.insertAdjacentHTML('beforeend', row);
//             return {title : product.title, description: product.description, price: product.price,
//                 rating: product.rating
//             }
//         });
//     })
//     .catch(error => console.error(error));

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
            // tworzymy TR ręcznie
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
                element: tr    // zapisujemy referencję do wiersza
            }
        })
    })
    .catch(error => console.error(error))


