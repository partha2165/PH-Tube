function getTimeString(time){
    const hour = parseInt( time / 3600);
    let remainingSecond = time % 3600;
    const minute = parseInt(remainingSecond / 60);
    remainingSecond = remainingSecond % 60;
    return `${hour} hour ${minute} minute ${remainingSecond} second ago`;
}

const removeActiveClass = () =>{
    const buttons = document.getElementsByClassName("category-btn");
    for(let btn of buttons){
        btn.classList.remove("active");
    }
}


//create loadcatagories
const loadCatagories = () => {
    fetch('https://openapi.programming-hero.com/api/phero-tube/categories')
    .then(res => res.json())
    .then(data => displayCatagories(data.categories))
    .catch(error => console.log(error))
    
};

const loadVideos = (searchText = "") => {
    fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`)
    .then(res => res.json())
    .then(data => displayVideos(data.videos))
    .catch(error => console.log(error))
    
};
const loadCatagoryVideos = (id)=>{
   
   
    fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
    .then(res => res.json())
    .then(data => {
        removeActiveClass();

        const activeBtn = document.getElementById(`${id}`)
        // console.log(activeBtn);
        activeBtn.classList.add("active");  
     
        // console.log(activeBtn);
        displayVideos(data.category)
    })
    .catch(error => console.log(error))
    
}
const loadDetails = async(videoId) =>{
    console.log(videoId);
    const url = `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`;
    const res = await fetch(url);
    const data = await res.json();
    displayDetails(data.video);
};
const displayDetails =(video) =>{
    console.log(video);
    const detailContainer = document.getElementById('modal-content');
    detailContainer.innerHTML = `
    <img src=${video.thumbnail}/>
    <p>${video.description}</p>
    `
    //way - 1
    // document.getElementById('showModal').click();
    //way-2
    document.getElementById('customModal').showModal();
}

const displayVideos = (videos) =>{
    const vedioContainer = document.getElementById('videos')
    vedioContainer.innerHTML = "";
    if(videos.length == 0){
        vedioContainer.classList.remove("grid");
        vedioContainer.innerHTML = `
        <div class="min-h-[200px] w-full flex flex-col gap-5 justify-center items-center">
        <img src="assets/icon.png"/>
        <h2 class="text-xl text-center font-bold">No Content Here in this Category</h2>
        </div>
        `;
        return;
    }
    else{
        vedioContainer.classList.add("grid");
    }
    videos.forEach(vedio =>{
        // console.log(vedio)
        const card = document.createElement('div');
        card.classList = "card card-compact"
        card.innerHTML = `
        <figure class="h-[200px] relative">
    <img class="w-full h-full object-cover" 
      src="${vedio.thumbnail}"
      alt="Shoes"/>
  </figure>
  <div class="px-0 py-2 flex gap-2">
        <div>
        <img class="w-10 h-10 rounded-full object-cover" src=${vedio.authors[0].profile_picture} />
        ${vedio.others.posted_date ?.length == 0 ? "" : ` <span class="absolute bg-black p-1 rounded text-xs text-white right-2 bottom-28">${getTimeString(vedio.others.posted_date)}</span>
            `

        }
       
        </div>
        <div>
        <h2 class="font-bold">${vedio.title}</h2>
       <div class="flex items-center gap-2">
        <p class="text-gray-400">${vedio.authors[0].profile_name}</p>
        ${vedio.authors[0].verified == true ? ` <img class="w-5 object-cover" src="https://img.icons8.com/?size=48&id=D9RtvkuOe31p&format=png"/>` : ""}
       
       </div>
        <p> <button onclick="loadDetails('${vedio.video_id}')" class="btn btn-sm btn-error">Details</button></p>
        </div>
   
  </div>
 
   
  
        `
        vedioContainer.append(card);
    })
}
//create displayCatagories 
const displayCatagories = (categories) =>{
    const categoryContainer = document.getElementById('categories')
    categories.forEach(item => {
        // console.log(item)
        //create a button
        const buttonContainer = document.createElement('div') 
       buttonContainer.innerHTML = `
        <button id="${item.category_id}" onclick="loadCatagoryVideos(${item.category_id})" class=" btn category-btn">
        ${item.category}
        </button>
       `
       
        categoryContainer.append(buttonContainer)
    })
}
document.getElementById('search-input').addEventListener('keyup', (e)=>{
    loadVideos(e.target.value);
});

loadCatagories();

loadVideos();