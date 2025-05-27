
const apiUrl = 'http://52.44.178.183:8080/Controller?ACTION=PRODUCT.FIND_ALL';
const botonComboDelDia = document.getElementById("botonCombo");
const menuSections = document.querySelectorAll('.menu-items');
const finalPrice = document.getElementById('precioFinal');

//Click para recargar
botonComboDelDia.addEventListener('click', function () {
    maxiComboFunction();
});




function maxiComboFunction() {
    //Insertar aqui todas las funciones
    const firstProduct = getProductByIdAndCat(randomNum(0));
    const secondProduct = getProductByIdAndCat(randomNum(firstProduct.id));
    const thirdProduct = getProductByIdAndCat(randomNum(secondProduct.id));


    //Sacar los 3 productos
    renderProducts(firstProduct);
    renderProducts(secondProduct);
    renderProducts(thirdProduct);


    finalPrice.innerText = firstProduct.m_dblPrice + secondProduct.m_dblPrice + thirdProduct.m_dblPrice;

}




//Crear numeros random pasandole una excepcion
function randomNum(exceptions) {

    const response = fetch(apiUrl); //No me pilla bien el fetch
    const data = response.json;
    const num = 0;

    do {
        if (Array.isArray(data)) {
            num = data[Math.floor(Math.random() * data.length)];
        }
    } while (num != exceptions);

    return num;
}

function renderProducts(id) {
    console.log(`Rendering products for category: ${id}`);

    const idProducts = products.filter(p => p.id === m_iId);

    menuSection.innerHTML = `
                <div class="menu-item">
                    <div class="menu-item-content">
                        <div>
                            <h3>${idProducts.name}</h3>
                            <span class="price">$${idProducts.price.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            `;
}

/*async*/ function getProductByIdAndCat(id) {
    try {
        console.log('Fetching All products', apiUrl);

        const response =  fetch(apiUrl);
        const data = /*await*/ response.json();
        /*[
            {
              "m_iId": 1,
              "m_strName": "RAMchos",
              "m_strDescription": "Crispy corn nachos topped with melted cheese, homemade guacamole, pico de gallo, jalapeños, sour cream, and chili con carne.",
              "m_dblPrice": 9.75,
              "m_bAvailable": true,
              "m_strImageURL": "ramchos.jpg",
              "m_fkCategory": 1
            },
            {
              "m_iId": 2,
              "m_strName": "CPU Sticks",
              "m_strDescription": "Breaded chicken breast strips with a mix of \"Programmed Spices\", served with honey mustard sauce.",
              "m_dblPrice": 8.25,
              "m_bAvailable": true,
              "m_strImageURL": "cpu-sticks.jpg",
              "m_fkCategory": 1
            },
            {
              "m_iId": 3,
              "m_strName": "Cheesobyte",
              "m_strDescription": "Delicious cheese sticks wrapped in a crispy golden crust.",
              "m_dblPrice": 7.5,
              "m_bAvailable": true,
              "m_strImageURL": "cheesobyte.jpg",
              "m_fkCategory": 1
            },
            {
              "m_iId": 4,
              "m_strName": "The Motherboard",
              "m_strDescription": "Juicy 180g beef patty, fresh lettuce, tomato, red onion, pickles, and our \"Operating System\" sauce on brioche bun.",
              "m_dblPrice": 9.5,
              "m_bAvailable": true,
              "m_strImageURL": "motherboard-burger.jpg",
              "m_fkCategory": 2
            },
            {
              "m_iId": 5,
              "m_strName": "Crunchy Firewall",
              "m_strDescription": "200g beef patty, crispy bacon, melted cheddar, breaded onion rings, BBQ \"Source Code\" sauce, and chipotle mayo on rustic bun.",
              "m_dblPrice": 12.95,
              "m_bAvailable": true,
              "m_strImageURL": "firewall-burger.jpg",
              "m_fkCategory": 2
            },
            {
              "m_iId": 6,
              "m_strName": "The Python",
              "m_strDescription": "Chicken burger marinated in herbs, goat cheese, arugula, sun-dried tomatoes, caramelized onion, and aioli on olive bread.",
              "m_dblPrice": 11.75,
              "m_bAvailable": true,
              "m_strImageURL": "python-burger.jpg",
              "m_fkCategory": 2
            },
            {
              "m_iId": 7,
              "m_strName": "Binary Veggie 01",
              "m_strDescription": "Vegetarian burger made with chickpeas and beetroot, avocado, mixed greens, tomato, vegan cheese, and beetroot hummus on whole-grain bun.",
              "m_dblPrice": 10.95,
              "m_bAvailable": true,
              "m_strImageURL": "binary-veggie-burger.jpg",
              "m_fkCategory": 2
            },
            {
              "m_iId": 8,
              "m_strName": "Double Core Processor",
              "m_strDescription": "Double beef patties (360g), triple cheese (cheddar, gouda, provolone), grilled onion, pickles, and \"Cache\" sauce on brioche bun.",
              "m_dblPrice": 14.5,
              "m_bAvailable": true,
              "m_strImageURL": "double-core-burger.jpg",
              "m_fkCategory": 2
            },
            {
              "m_iId": 9,
              "m_strName": "Java HotSpot",
              "m_strDescription": "Spiced beef patty, jalapeños, fresh guacamole, pepper jack cheese, pico de gallo, lettuce, and sour cream on corn bun.",
              "m_dblPrice": 12.5,
              "m_bAvailable": true,
              "m_strImageURL": "java-hotspot-burger.jpg",
              "m_fkCategory": 2
            },
            {
              "m_iId": 10,
              "m_strName": "The Gourmet Algorithm",
              "m_strDescription": "200g Black Angus beef patty, sautéed mushrooms, brie cheese, arugula, caramelized onions, and truffle mayo on rustic bun.",
              "m_dblPrice": 14.95,
              "m_bAvailable": true,
              "m_strImageURL": "algoritmo-burger.jpg",
              "m_fkCategory": 2
            },
            {
              "m_iId": 11,
              "m_strName": "RGB Blue Cheese",
              "m_strDescription": "180g beef patty, blue cheese, bacon jam, arugula, caramelized walnuts, and mustard-honey mayo on seeded bun.",
              "m_dblPrice": 13.5,
              "m_bAvailable": true,
              "m_strImageURL": "rgb-blue-burger.jpg",
              "m_fkCategory": 2
            },
            {
              "m_iId": 12,
              "m_strName": "The Kernel Crunch",
              "m_strDescription": "Crispy chicken breast, homemade coleslaw, pickles, \"Honey Mustard Server\" sauce, and cheddar cheese on brioche bun.",
              "m_dblPrice": 11.95,
              "m_bAvailable": true,
              "m_strImageURL": "kernel-crunch-burger.jpg",
              "m_fkCategory": 2
            },
            {
              "m_iId": 13,
              "m_strName": "The Stack Overflow",
              "m_strDescription": "Triple beef patties (540g), fried egg, bacon, cheddar cheese, onion rings, pickles, lettuce, tomato, and \"Root Access\" sauce on XXL bun.",
              "m_dblPrice": 18.95,
              "m_bAvailable": true,
              "m_strImageURL": "stack-overflow-burger.jpg",
              "m_fkCategory": 2
            },
            {
              "m_iId": 14,
              "m_strName": "USB Rings",
              "m_strDescription": "Onion rings battered in crispy tempura, served with BBQ sauce and ranch dressing \"Compatible with All Systems\".",
              "m_dblPrice": 6.5,
              "m_bAvailable": true,
              "m_strImageURL": "usb-rings.jpg",
              "m_fkCategory": 3
            },
            {
              "m_iId": 15,
              "m_strName": "Fry Bytes",
              "m_strDescription": "Classic french fries, perfectly seasoned with the ideal balance of crispiness outside and softness inside. An unbeatable side!",
              "m_dblPrice": 5.5,
              "m_bAvailable": true,
              "m_strImageURL": "fry-bytes.jpg",
              "m_fkCategory": 3
            },
            {
              "m_iId": 16,
              "m_strName": "Wedge Debug",
              "m_strDescription": "Potato wedges with golden skins and a touch of spices. A slightly different, flavor-packed option.",
              "m_dblPrice": 5.5,
              "m_bAvailable": true,
              "m_strImageURL": "wedge-debug.jpg",
              "m_fkCategory": 3
            },
            {
              "m_iId": 17,
              "m_strName": "Menu Debug Delight",
              "m_strDescription": "La Motherboard + Fry Bytes + Strawberry Debug Smoothie",
              "m_dblPrice": 17.95,
              "m_bAvailable": true,
              "m_strImageURL": "menu-debug-delight.jpg",
              "m_fkCategory": 4
            },
            {
              "m_iId": 18,
              "m_strName": "Firewall Feast",
              "m_strDescription": "Firewall Crujiente + USB Rings + Brownie Overflow",
              "m_dblPrice": 23.95,
              "m_bAvailable": true,
              "m_strImageURL": "firewall-feast.jpg",
              "m_fkCategory": 4
            },
            {
              "m_iId": 19,
              "m_strName": "Binary Veggie Pack",
              "m_strDescription": "Binary Veggie 01 + Wedge Debug + Binary Brownie Shake",
              "m_dblPrice": 19.95,
              "m_bAvailable": true,
              "m_strImageURL": "binary-veggie-pack.jpg",
              "m_fkCategory": 4
            },
            {
              "m_iId": 20,
              "m_strName": "Kernel Gourmet Menu",
              "m_strDescription": "La Kernel Crunch + Fry Bytes + Cookie Cache",
              "m_dblPrice": 21.95,
              "m_bAvailable": true,
              "m_strImageURL": "kernel-gourmet-menu.jpg",
              "m_fkCategory": 4
            },
            {
              "m_iId": 21,
              "m_strName": "Water",
              "m_strDescription": "Natural mineral water, refreshing and pure.",
              "m_dblPrice": 1.5,
              "m_bAvailable": true,
              "m_strImageURL": "water.jpg",
              "m_fkCategory": 5
            },
            {
              "m_iId": 22,
              "m_strName": "Coca-Cola",
              "m_strDescription": "Classic soda with the unmistakable Coca-Cola flavor.",
              "m_dblPrice": 2.0,
              "m_bAvailable": true,
              "m_strImageURL": "coca-cola.jpg",
              "m_fkCategory": 5
            },
            {
              "m_iId": 23,
              "m_strName": "Nestea",
              "m_strDescription": "Iced tea drink with a hint of lemon.",
              "m_dblPrice": 2.0,
              "m_bAvailable": true,
              "m_strImageURL": "nestea.jpg",
              "m_fkCategory": 5
            },
            {
              "m_iId": 24,
              "m_strName": "Fanta Orange",
              "m_strDescription": "Soda with bubbles and a refreshing orange flavor.",
              "m_dblPrice": 2.0,
              "m_bAvailable": true,
              "m_strImageURL": "fanta-orange.jpg",
              "m_fkCategory": 5
            },
            {
              "m_iId": 25,
              "m_strName": "Fanta Lemon",
              "m_strDescription": "Soda with bubbles and a zesty lemon flavor.",
              "m_dblPrice": 2.0,
              "m_bAvailable": true,
              "m_strImageURL": "fanta-lemon.jpg",
              "m_fkCategory": 5
            },
            {
              "m_iId": 26,
              "m_strName": "Beer",
              "m_strDescription": "Cold and frothy beer, perfect to pair with your meals.",
              "m_dblPrice": 2.5,
              "m_bAvailable": true,
              "m_strImageURL": "beer.jpg",
              "m_fkCategory": 5
            },
            {
              "m_iId": 27,
              "m_strName": "CookieCache",
              "m_strDescription": "Galleta con chips de chocolate",
              "m_dblPrice": 3.0,
              "m_bAvailable": true,
              "m_strImageURL": "cookie.jpg",
              "m_fkCategory": 6
            },
            {
              "m_iId": 28,
              "m_strName": "Brownie Overflow",
              "m_strDescription": "Homemade chocolate brownie served warm with vanilla ice cream, \"Digital Ink\" chocolate sauce, whipped cream, and caramelized walnuts.",
              "m_dblPrice": 7.25,
              "m_bAvailable": true,
              "m_strImageURL": "brownie-overflow-dessert.jpg",
              "m_fkCategory": 6
            },
            {
              "m_iId": 29,
              "m_strName": "Strawberry Debug Smoothie",
              "m_strDescription": "A perfect blend of fresh strawberries, cream cheese, Greek yogurt, and milk. Finished with whipped cream and cookie crumbs to remove any \"bugs\" in your day.",
              "m_dblPrice": 5.5,
              "m_bAvailable": true,
              "m_strImageURL": "Strawberry-Debug-Smoothie.jpg",
              "m_fkCategory": 6
            },
            {
              "m_iId": 30,
              "m_strName": "Binary Brownie Shake",
              "m_strDescription": "A mix of brownie chunks, chocolate ice cream, and a hint of coffee in a \"bit\"-perfect dessert. Decorated with whipped cream and brownie bits for a complete finish.",
              "m_dblPrice": 6.0,
              "m_bAvailable": true,
              "m_strImageURL": "Binary-Brownie-Shake.jpg",
              "m_fkCategory": 6
            },
            {
              "m_iId": 59,
              "m_strName": "sdasda",
              "m_strDescription": "sadsdada",
              "m_dblPrice": 50.0,
              "m_bAvailable": true,
              "m_fkCategory": 4
            },
            {
              "m_iId": 60,
              "m_strName": "sdasda",
              "m_strDescription": "sadsdada",
              "m_dblPrice": 50.0,
              "m_bAvailable": true,
              "m_fkCategory": 4
            }
          ];*/

        console.log('Response status:', data);

        if (!response.ok) {
            throw new Error(`Product not found: ${response.status}`);
        }

        //const data = response.json();
        console.log('Product data received:', data);

        if (Array.isArray(data)) {

            const product = data.find(p => p.m_iId === id);

            if (!product) {
                throw new Error(`Product with ID ${id} not found`);
            }

            console.log('Raw product data found:', product);

            const categoryName = this.mapCategory(product.m_iCategory || product.m_fkCategory);


            return {
                id: product.m_iId,
                name: product.m_strName,
                description: product.m_strDescription,
                price: product.m_dblPrice,
                category: categoryName,
                imageUrl: imageUrl,
                available: product.m_bAvailable
            };
        }
        throw new Error('Invalid API response');
    } catch (error) {
        console.error('Error in getProductById:', error);
        throw error;
    }
}


document.addEventListener('DOMContentLoaded', maxiComboFunction());

