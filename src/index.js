// write your code here
let url = " http://localhost:3000/ramens"
let currentRamen = 1;
//See all ramen images in the `div` with the id of `ramen-menu`
function renderRamenMenu(){

    fetch(url)
    .then(response => response.json())
    .then(ramenArray => {

        //setDefault Info 
        renderSelectedRamen(ramenArray[0])
        // for each ramen make image and add event listener
        ramenArray.forEach(ramen => {
            const menuDiv = document.querySelector('#ramen-menu');
            const createDiv = document.createElement('div');
            const createImg = document.createElement('img');
            const createDltBtn = document.createElement('button');
            
            //create menu images
            menuDiv.appendChild(createDiv);

            createDiv.appendChild(createImg);
            createDiv.dataset.ramenId = ramen.id;
            createImg.src = ramen.image;
            createDiv.appendChild(createDltBtn);
            createDltBtn.innerText = "Delete";


            //listen for click on each ramen image to populate the Currentt
            createDiv.addEventListener('click', (e) => {
                renderSelectedRamen(ramen);
                //set current ramen to id of clicked ramen
                currentRamen = ramen.id;
            }) 

            //listen for click on delete btn
            createDltBtn.addEventListener('click', (e) =>{
                deleteRamen(ramen.id);
                createDiv.remove();
            })
        })
    })
    .catch(err => console.log(err));
}
//render the Selected Ramen Information
function renderSelectedRamen(ramen){
    const infoImg = document.querySelector(".detail-image");
    const infoName = document.querySelector(".name");
    const infoRest = document.querySelector(".restaurant");
    const getRating = document.querySelector('#rating-display');
    const getComment = document.querySelector('#comment-display');

    infoImg.src = ramen.image;
    infoName.textContent = ramen.name;
    infoRest.textContent = ramen.restaurant;
    getRating.textContent = ramen.rating;
    getComment.textContent = ramen.comment;
}
const getForm = document.querySelector('#new-ramen');
const nameInput = document.querySelector("#new-name");
const restInput = document.querySelector("#new-restaurant");
const imgInput = document.querySelector("#new-image");
const ratingInput = document.querySelector("#new-rating");
const commentInput = document.querySelector("#new-comment");

//handle new ramen submission
function postNewRamen() {
    getForm.addEventListener("submit", (e) => {
        e.preventDefault();

        let newRamen = {
            name: nameInput.value,
            restaurant: restInput.value,
            image: imgInput.value,
            rating: ratingInput.value,
            comment: commentInput.value
          }

        fetch(url, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(newRamen)
            })
            .then(response => response.json())
            .then(data => {
              renderRamenMenu();
            })
            .catch(err => console.log(err))

            getForm.reset();
    })
}
// handle fetch delete 
function deleteRamen(ramen) {
    fetch(`${url}/${ramen}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(obj => console.log(obj))
    .catch(err => console.log(err));
}
//handle fetch patch
function editRamen(ramen, ratingUpdate, commentUpdate) {
    let updateObj = {
        rating: ratingUpdate,
        comment: commentUpdate
    }

    fetch(`${url}/${ramen}`, {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateObj)
    })
    .then(response => response.json())
    .then(() => {
        console.log(updateObj)
    })
    .catch(err => console.log(err));
}

//grab edit form 
const getUpdateForm = document.querySelector("#edit-ramen")

//Once DOM has loaded
addEventListener("DOMContentLoaded", (e) => {
    renderRamenMenu();
    postNewRamen();

    getUpdateForm.addEventListener('submit',(e) => {
        e.preventDefault();
        //render pessimitically
        const getEditRating = getUpdateForm.querySelector("#new-rating")
        const getEditComment = getUpdateForm.querySelector("#new-comment")
    
        editRamen(currentRamen, getEditRating.value, getEditComment.value)
    
        //render optimistically
        const getRating = document.querySelector('#rating-display');
        const getComment = document.querySelector('#comment-display');
    
        getRating.innerText = getEditRating.value;
        getComment.innerText = getEditComment.value;

        getUpdateForm.reset();
        
    })
})