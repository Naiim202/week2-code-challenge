document.addEventListener('DOMContentLoaded', () => {  // Wait until the DOM is fully loaded before running the script
    const itemInput = document.getElementById('newItem'); // Get the input element where users can type new items
    const addButton = document.getElementById('addButton'); // Get the button element for adding items
    const clearButton = document.getElementById('clearList');// Get the button element for clearing the list
    const checkoutButton = document.getElementById('checkoutButton');// Get the button element for proceeding to checkout
    const listContainer = document.getElementById('shoppingList');  // Get the container element where the shopping list will be displayed

 // Retrieve the shopping list from local storage, or initialize it as an empty array if not found
    let shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];

     // Function to render the shopping 
    const renderList = () => {
        listContainer.innerHTML = ''; // Clear the list container
        shoppingList.forEach((item, index) => { // Iterate over each item in the shopping list
            const listItem = document.createElement('li');
            listItem.textContent = item.name;
            listItem.classList.toggle('purchased', item.purchased);
            listItem.addEventListener('click', () => togglePurchased(index));   // Adds an event listener to toggle the purchased state when the item is clicked
            listItem.addEventListener('dblclick', () => editItem(index)); // Add an event listener to edit the item when it is double-clicked
            listContainer.appendChild(listItem);  // Append the list item to the list container
        });
    };
// Function to add a new item to the shopping list
    const addItem = () => {
        const itemName = itemInput.value.trim();
        if (itemName) { // If the item name is not empty
            const existingItemIndex = shoppingList.findIndex(item => item.name === itemName); // Check if the item already exists in the shopping list
            if (existingItemIndex > -1) { // If the item already exists
                const confirmAdd = confirm(`"${itemName}" is already in the cart. Do you want to add it again?`); // Ask the user for confirmation to add the item again
                if (!confirmAdd) {  // If the user does not confirm
                    itemInput.value = '';  // Clear the input field
                    return;
                }
            }
            shoppingList.push({ name: itemName, purchased: false });   // Add the new item to the shopping list with 'purchased' set to false
            itemInput.value = '';
            updateLocalStorage();
            renderList();
        }
    };

    const togglePurchased = (index) => {
        shoppingList[index].purchased = !shoppingList[index].purchased;
        updateLocalStorage();
        renderList();
    };

    const editItem = (index) => {
        const newItemName = prompt('Edit item:', shoppingList[index].name);
        if (newItemName && newItemName.trim()) {
            shoppingList[index].name = newItemName.trim();
            updateLocalStorage();
            renderList();
        }
    };

    const clearList = () => {
        shoppingList = [];
        updateLocalStorage();
        renderList();
    };

    const proceedToCheckout = () => {
        let itemsToRemove = [];
        shoppingList.forEach((item, index) => {
            const removeItem = confirm(`Do you want to remove "${item.name}" from the cart?`);
            if (removeItem) {
                itemsToRemove.push(index);
            }
        });

        itemsToRemove.reverse().forEach(index => {
            shoppingList.splice(index, 1);
        });

        shoppingList = shoppingList.map(item => ({ ...item, purchased: true }));
        updateLocalStorage();
        renderList();
        alert("All items marked as purchased. You can continue adding new items.");
    };

    const updateLocalStorage = () => {
        localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
    };

    addButton.addEventListener('click', addItem);
    clearButton.addEventListener('click', clearList);
    checkoutButton.addEventListener('click', proceedToCheckout);

    renderList();
});