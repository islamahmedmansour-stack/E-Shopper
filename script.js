// get Elements >>
let homeButton = document.getElementById('homeButton');
let favoriteButton = document.getElementById('favoriteButton');
let favoritesCount = document.getElementById("favoritesCount");
let homePage = document.getElementById('homePage');
let favoritePage = document.getElementById('favoritePage');
let categoriesShow = document.getElementById('categoriesShow');
let itemsShow = document.getElementById('itemsShow');
let itemFullDetails = document.getElementById('itemFullDetails');
// ================================== <<
// general variables >>
let collectData = {};
let favoriteItemsIdList = [];
let favoriteList = [];
let clickedCategoryIndex = 0 ;
// ================================== <<
// collect data from local storage >>
if (localStorage.getItem("favoriteItemsIdList") != null) {
    favoriteItemsIdList = JSON.parse(localStorage.getItem("favoriteItemsIdList"));
}
if (localStorage.getItem("favoriteList") != null) {
    favoriteList = JSON.parse(localStorage.getItem("favoriteList"));
    favoritesCount.innerText = favoriteList.length;
}
// updateLocalStorageACounter function >>
function updateLocalStorageACounter(){
    localStorage.setItem('favoriteList', JSON.stringify(favoriteList)); // save favorites to local storage
    localStorage.setItem("favoriteItemsIdList", JSON.stringify(favoriteItemsIdList)); // save favoriteIdList as valid JSON
    favoritesCount.innerText = favoriteList.length; //update FavoriteCounter
}
// ================================== <<
// collect data from server >>
let myRequest = new XMLHttpRequest();
myRequest.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        collectData = JSON.parse(this.responseText);
        showCategories();
    }
};
myRequest.open('GET', 'data.json', true);
myRequest.send();

// ================================== <<
// functions >>
// showCategoriesfunction >>
function showCategories() {
    let categoriesContainerJs = '';
    for (let i = 0; i < collectData.Categories.length; i++) {
        categoriesContainerJs += `<div class="col-lg-3 col-md-6">
        <div onclick="showItems(${i})" class="categoryType">
        <h3 class="text-center">${collectData.Categories[i]}</h3>
        </div>
        </div>`;
    }
    categoriesShow.innerHTML = categoriesContainerJs;
}
// ============================== <<
// showItemsfunction >>
function showItems(categoryIndex) {
    clickedCategoryIndex = categoryIndex;
    let currentCategory = collectData.Categories[categoryIndex];
    let currentCategoryItems = collectData[currentCategory];
    let itemsContainerJs = '';
    for (let i = 0; i < currentCategoryItems.length; i++) {
        let itemIdJs = `C${categoryIndex}I${i}`;
        let currentItem = currentCategoryItems[i];
        // ----- favoriteSign ----
        let favoriteSign = '';
        if (favoriteItemsIdList.includes(itemIdJs)) {
            favoriteSign = 'fa-solid';
        } else { favoriteSign = 'fa-regular'; }
        // ----------------------
        itemsContainerJs += ` <div class="col-lg-3 col-md-6 mx-auto">
                <div class="item">
                    <img src="${currentItem.itemImageSrc}" alt="${currentItem.itemTitle}">
                    <div class="itemContent p-3">
                        <h4>${currentItem.itemTitle}</h4>
                        <span class="cardPrice">&#36;${currentItem.itemPrice}</span>
                        <div class="d-flex justify-content-between mt-2">
                            <button onclick="itemView(${i},${categoryIndex})" class="viewBtn py-1 px-2 rounded-2">View</button>
                            <i onclick="addFavoritesFn(${i},${categoryIndex})" class="favoriteLike ${favoriteSign} fa-heart fa-2x"></i>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    // --------------
    itemsShow.innerHTML = `<h2 class="text-center py-3">${currentCategory}</h2>
    <div class="row g-4 pt-4">
    ${itemsContainerJs}
    </div>`;
}
// ============================== <<
// itemViewfunction >>
function itemView(itemIndex, categoryIndex) {
    let currentCategory = collectData.Categories[categoryIndex];
    let selectedItem = collectData[currentCategory][itemIndex];
    itemFullDetails.innerHTML = `<div onclick="closeFullScreen()" id="fullscreen">
            <div id="itemCard">
                <h3>${selectedItem.itemTitle}</h3>
                <div class="row g-3" >
                    <div class="col-lg-6"><img class="w-100 mx-auto" src="${selectedItem.itemImageSrc}" alt="${selectedItem.itemTitle}"></div>
                    <div class="col-lg-6">
                        <div class="p-4">
                            <p>${selectedItem.itemDescription}</p>
                            <p><span class="me-2">Brand :</span>${selectedItem.itemBrand}</p>
                            <p><span class="me-2">Category :</span>${collectData.Categories[categoryIndex]}</p>
                            <h4 class="cardPrice mt-4">&#36;${selectedItem.itemPrice}</h4>
                        </div>
                    </div>
                </div>
                <!-- ------ -->
            </div>
            <!-- ---(end)itemCard -->
        </div>`;
}
// ============================== <<
// addToFavorites function >>
function addFavoritesFn(itemIndex, categoryIndex) {
    let itemIdJs = `C${categoryIndex}I${itemIndex}`;
    let addedItem = {
        itemIndex: itemIndex,
        categoryIndex: categoryIndex
    };
    if (!favoriteItemsIdList.includes(itemIdJs)) {
        favoriteItemsIdList.push(itemIdJs);
        favoriteList.push(addedItem);
    }
    updateLocalStorageACounter(); // update Local storage and counter 
    showItems(categoryIndex); // show items after add to favorite
}
// ============================== <<
//  showFavorite function >>
function showFavorite() {
    let favoriteItemsContainerJs = '';
    for (let i = 0; i < favoriteList.length; i++) {
        let favItemCategory = collectData.Categories[favoriteList[i].categoryIndex];
        let favItem = collectData[favItemCategory][favoriteList[i].itemIndex];
        favoriteItemsContainerJs += `
       <div class="col-lg-3 col-md-6 mx-auto">
                <div class="item">
                    <img src="${favItem.itemImageSrc}" alt="${favItem.itemTitle}">
                    <div class="itemContent p-3">
                        <h4>${favItem.itemTitle}</h4>
                        <span class="cardPrice">&#36;${favItem.itemPrice}</span>
                        <div class="d-flex justify-content-between mt-2">
                            <button onclick="itemView(${favoriteList[i].itemIndex},${favoriteList[i].categoryIndex})" class="viewBtn py-1 px-2 rounded-2">View</button>
                            <i onclick="removeFromFavorite(${i})" class="favoriteLike fa-solid fa-heart-circle-minus fa-2x"></i>
                        </div>
                    </div>
                </div>
            </div>
       `
    }
    // --------------
    favoritePage.innerHTML = `<h2 class="text-center py-3">Your Favorites ❤️</h2>
    <div class="row g-4 pt-4">
    ${favoriteItemsContainerJs}
    </div>`;
}
// ================================== <<

function removeFromFavorite(indexInFavoriteList){
    favoriteList.splice(indexInFavoriteList,1);
    favoriteItemsIdList.splice(indexInFavoriteList,1);
    updateLocalStorageACounter(); // update Local storage and counter 
    showFavorite(); // show favorite update after remove item
    showItems(clickedCategoryIndex); // show items update after remove item
}
// =====(JS_style)=====( open close )================================
// toggleHome&Favorite function >>
function closeHomeOpenFavorite() {
    homePage.classList.add("display_none");
    favoritePage.classList.remove("display_none");
    showFavorite();
}
function closeFavoriteOpenHome() {
    homePage.classList.remove("display_none");
    favoritePage.classList.add("display_none");
}
// ============================== <<
// closeFullScreen function >>
function closeFullScreen() {
    itemFullDetails.innerHTML = ``;
}
// =====================================================================<<>>
// events >>
favoriteButton.addEventListener('click', function () { closeHomeOpenFavorite() });
homeButton.addEventListener('click', function () { closeFavoriteOpenHome() });
// =====================================================================<<>>
