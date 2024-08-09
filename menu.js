const id = '1DPy-hF64iL1Mm0KlMws66ZdJmJGSCLtROq37mdrzvCM';
const gid = '0';
const url = `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:json&tq&gid=${gid}`;
async function loadMenu() {
    try {
        const response = await fetch(url);
        const data = await response.text();
        const jsonString = data.substring(47).slice(0, -2);
        const json = JSON.parse(jsonString);
        const menuData = processData(json);
        displayMenu(menuData);
    } catch (error) {
        console.error('Error loading menu:', error);
    }
}

function processData(json) {
    const menuItems = json.table.rows.map(row => ({
        productName: row.c[0] ? row.c[0].v : '',
        productDescription: row.c[1] ? row.c[1].v : '',
        productPrice: row.c[2] ? row.c[2].v : '',
        productImage: row.c[3] ? row.c[3].v : '',
        category: row.c[4] ? row.c[4].v : ''
    }));
    return { menu: menuItems };
}

function displayMenu(menuData) {
    const menuContainer = document.getElementById('menu');
    const categories = [...new Set(menuData.menu.map(item => item.category))];

    categories.forEach(category => {
        const categorySection = document.createElement('div');
        categorySection.className = 'mb-6';

        const categoryTitle = document.createElement('h2');
        categoryTitle.className = 'text-2xl font-bold mb-4';
        categoryTitle.textContent = category;

        const itemsGrid = document.createElement('div');
        itemsGrid.className = 'grid grid-cols-1 md:grid-cols-2 gap-4';

        menuData.menu
            .filter(item => item.category === category)
            .forEach(item => {
                const menuItem = document.createElement('div');
                menuItem.className = 'bg-white rounded-lg shadow-lg overflow-hidden';

                menuItem.innerHTML = `
        <div class="flex gap-4 p-4">
            <img src="${item.productImage}" alt="${item.productName}" class="w-24 h-24 object-cover rounded-lg">
            <div class="flex flex-col items-between w-full">
                <div class="menu-content flex justify-between items-center">
                    <a class="text-lg font-semibold">${item.productName}</a>
                    <span class="text-gray-900 font-bold">${item.productPrice} ₺</span>
                </div>
                <div class="menu-ingredients text-xs text-gray-600 mt-2">
                    ${item.productDescription}
                </div>
            </div>
        </div>
    `;
                itemsGrid.appendChild(menuItem);
            });

        categorySection.appendChild(categoryTitle);
        categorySection.appendChild(itemsGrid);
        menuContainer.appendChild(categorySection);
    });
}

loadMenu();