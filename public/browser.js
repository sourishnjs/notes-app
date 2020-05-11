const itemTemplate = (item) => {
    return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
        <span class="item-text">${item.text}</span>
        <div>
          <button data-id= "${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
          <button data-id= "${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
        </div>
      </li>`
}

//INITIAL page load render
const ourHTML = items.map((item)=>{
    return itemTemplate(item)
}).join('')
document.getElementById("item-list").insertAdjacentHTML("beforeend", ourHTML)


//CREATE feature
const createField = document.getElementById("create-field")

document.getElementById("create-form").addEventListener('submit', (e)=>{
    e.preventDefault()
    axios.post('/create-item', {text: createField.value}).then((response)=>{
        document.getElementById("item-list").insertAdjacentHTML('beforeend', itemTemplate(response.data))
        createField.value = ''
        createField.focus()
    }).catch(()=>{
               console.log('please try again later')
           })
})

// this is the code that runs everytime a user clicks on the delete/edit button
document.addEventListener("click", (e)=>{
//DELETE feature
    if(e.target.classList.contains('delete-me')){
       if(confirm('do you really want to delete this item')){
        axios.post('/delete-item', {id: e.target.getAttribute("data-id")}).then(()=>{
            e.target.parentElement.parentElement.remove()
           }).catch(()=>{
                   console.log('please try again later')
               })
       }
    }

//UPDATE feature
    if(e.target.classList.contains('edit-me')){
        const userInput = prompt('Enter the new text', e.target.parentElement.parentElement.querySelector(".item-text").innerHTML)
    if(userInput){
        axios.post('/update-item', {text: userInput, id: e.target.getAttribute("data-id")}).then(()=>{
            e.target.parentElement.parentElement.querySelector(".item-text").innerHTML = userInput
           }).catch(()=>{
                   console.log('please try again later')
               })
    }
    }
})

//.then() function does not run until the action has a chance to complete
//axios.post(a, {b}) - to send an on the fly post request to the server
// a- is the URL and b- is the data thats going to get sent to the URL