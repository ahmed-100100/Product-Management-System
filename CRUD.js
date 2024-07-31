var productName = document.getElementById("productName");
var productPrice = document.getElementById("productPrice");
var productStatus = document.getElementById("productStatus");
var productCategory = document.getElementById("productCategory");
var tableBody = document.getElementById("tableBody");
var addAndUpdateBtn = document.getElementById("addAndUpdateBtn");
var clearBtn = document.getElementById("clearBtn");
var deleteAllBtn = document.getElementById("deleteAllBtn");
addAndUpdateBtn.addEventListener('click', actionToProduct);
clearBtn.addEventListener('click', clearForm);
deleteAllBtn.addEventListener('click', deleteAll);
var products = [];
var filteredProducts = [];
var currentIndex;
var isFiltering = false;

if (localStorage.getItem("allProducts")) {
    products = JSON.parse(localStorage.getItem("allProducts"));
    displayProducts(products);
}

function validateProduct(name, price, status, category) {
    var nameRegex = /^[a-zA-Z0-9\- ]+$/;
    var priceRegex = /^\d{1,3}(,\d{3})*(\.\d{2})?$/;
    var statusRegex = /^(Accepted|Good|Very Good|Excellent)$/;
    var categoryRegex = /^[a-zA-Z]+$/;
    var isValid = true;
    if (!nameRegex.test(name.value)) {
        name.classList.add("is-invalid");
        name.classList.remove("is-valid");
        isValid = false;
    } else {
        name.classList.remove("is-invalid");
        name.classList.add("is-valid");
    }
    if (!priceRegex.test(price.value)) {
        price.classList.add("is-invalid");
        price.classList.remove("is-valid");
        isValid = false;
    } else {
        price.classList.remove("is-invalid");
        price.classList.add("is-valid");
    }
    if (!statusRegex.test(status.value)) {
        status.classList.add("is-invalid");
        status.classList.remove("is-valid");
        isValid = false;
    } else {
        status.classList.remove("is-invalid");
        status.classList.add("is-valid");
    }
    if (!categoryRegex.test(category.value)) {
        category.classList.add("is-invalid");
        category.classList.remove("is-valid");
        isValid = false;
    } else {
        category.classList.remove("is-invalid");
        category.classList.add("is-valid");
    }
    return isValid;
}

function validateOnInput() {
    validateProduct(productName, productPrice, productStatus, productCategory);
}

productName.addEventListener("input", validateOnInput);
productPrice.addEventListener("input", validateOnInput);
productStatus.addEventListener("input", validateOnInput);
productCategory.addEventListener("input", validateOnInput);

function actionToProduct() {
    if (validateProduct(productName, productPrice, productStatus, productCategory)) {
        if (addAndUpdateBtn.innerHTML == "Add Product") {
            addProduct();
        } else {
            updateProduct();
        }
    }
}

function addProduct() {
    var product = {
        name: productName.value,
        price: productPrice.value,
        status: productStatus.value,
        category: productCategory.value
    };
    products.push(product);
    localStorage.setItem("allProducts", JSON.stringify(products));
    clearForm();
    displayProducts(products);
}

function clearForm() {
    productName.value = "";
    productPrice.value = "";
    productStatus.value = "";
    productCategory.value = "";
    addAndUpdateBtn.innerHTML = "Add Product";
}

function displayProducts(productArray) {
    var cartona = ``;
    for (var i = 0; i < productArray.length; i++) {
        cartona += `<tr class="text-center">
                <td>${i + 1}</td>
                <td>${productArray[i].name}</td>
                <td>${productArray[i].price}</td>
                <td>${productArray[i].status}</td>
                <td>${productArray[i].category}</td>
                <td>
                    <button type="button" class="btn btn-primary mx-2" onclick="getObject(${i})">Update</button>
                    <button type="button" class="btn btn-danger mx-2" onclick="deleteProduct(${i})">Delete</button>
                </td>
              </tr>`;
    }
    tableBody.innerHTML = cartona;
}

function getObject(index) {
    currentIndex = index;
    var productArray = isFiltering ? filteredProducts : products;
    productName.value = productArray[index].name;
    productPrice.value = productArray[index].price;
    productStatus.value = productArray[index].status;
    productCategory.value = productArray[index].category;
    addAndUpdateBtn.innerHTML = "Update Product";
    validateProduct(productName, productPrice, productStatus, productCategory);
}

function updateProduct() {
    var product = {
        name: productName.value,
        price: productPrice.value,
        status: productStatus.value,
        category: productCategory.value
    };
    if (isFiltering) {
        var originalIndex = products.findIndex(p => p.name === filteredProducts[currentIndex].name);
        products[originalIndex] = product;
    }
    var productArray = isFiltering ? filteredProducts : products;
    productArray[currentIndex] = product;
    localStorage.setItem("allProducts", JSON.stringify(products));
    clearForm();
    displayProducts(isFiltering ? filteredProducts : products);
}

function deleteProduct(index) {
    var productArray = isFiltering ? filteredProducts : products;
    var deletedProduct = productArray.splice(index, 1)[0];
    if (isFiltering) {
        var originalIndex = products.findIndex(p => p.name === deletedProduct.name);
        products.splice(originalIndex, 1);
    }
    localStorage.setItem("allProducts", JSON.stringify(products));
    displayProducts(isFiltering ? filteredProducts : products);
}

function searchProducts(term) {
    isFiltering = term !== "";
    if (isFiltering) {
        filteredProducts = products.filter(product =>
            product.name.toUpperCase().includes(term.toUpperCase())
        );
        displayProducts(filteredProducts);
    } else {
        displayProducts(products);
    }
}

function deleteAll() {
    localStorage.removeItem("allProducts");
    products = [];
    displayProducts(products);
}