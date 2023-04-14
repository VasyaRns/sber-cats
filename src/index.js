const urlCats = 'https://cats.petiteweb.dev/api/single/vasyarns/'
// let store = window.localStorage;
let openForm = document.querySelector('#add-cat');
let popupForm = document.querySelector('#popup-form');
let closeForm = document.querySelector('#close-form');

async function getAllCats() {
    try {
        let response = await fetch(`${urlCats}show`);
        let cats = await response.json();
        return cats

    } catch (error) {
        console.log("У меня лапки");
    }
}

async function getIdsOfCat (){
    try {
        let response = await fetch(`${urlCats}ids`);
        let catIds = await response.json();
        return catIds
    } catch (error) {
        console.log("У меня лапки");
    }
    

    
};
async function getCatById(catId) {
    try {
        let response = await fetch(`${urlCats}show/${catId}`);
        let cat = await response.json();
        return cat
    } catch (error) {
        console.log("У меня лапки");
    }
}

async function deleteCat(id){
    try {
        let response = await fetch(`${urlCats}delete/${id}`,{
            method: 'DELETE'
        });
        let cat = await response.json();
        return cat
    } catch (error) {
        console.log('У меня лапки!');
    }
}

async function addCat(catos){
    try {
        let res = await fetch(`${urlCats}add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(catos)})
        let cat = await res.json();
        return cat
    } catch (error) {
        console.log(error);
    }
}

async function updateCat(newCat){
    try {
        let res = await fetch(`${urlCats}update/${newCat.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newCat),
        })
        let nCat = await res.json()
        return nCat
    } catch (error) {
        console.log(error);
    }
};




const generateCard = (cat) => {
    return `<div class="card flex flex-col items-center justify-center bg-emerald-300 rounded-md py-1 px-3">
    <span class="text-xl">${cat.name}</span>
    <img src="${cat.image}" alt="">
    <div class="btns flex w-full justify-between py-2">
      <button class="view-cat bg-slate-800 text-white rounded-md px-2 hover:text-rose-500" value=${cat.id}>Посмотреть</button>
      <button class="update-cat bg-slate-800 text-white rounded-md px-2 hover:text-rose-500 " value=${cat.id}>Изменить</button>
      <button class="delete-cat bg-slate-800 text-white rounded-md px-2 hover:text-rose-500 " value=${cat.id}>Удалить</button>
    </div>
</div>`
}
document
    .getElementsByClassName('content')[0]
    .addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') {
            switch (event.target.classList[0]) {
                case 'view-cat':
                    getCatById(event.target.value).then((res) => {
                        openModalCat(res)
                    })
                    break;
                    case 'update-cat':
                        getCatById(event.target.value).then((cat) => {
            
                            document.querySelector('#cat-name').value = cat.name;
                            document.querySelector('#cat-age').value = cat.age;
                            document.querySelector('#cat-rate').value = cat.rate;
                            document.querySelector('#cat-description').value = cat.description;
                            document.querySelector('#cat-image').value = cat.image;
                            
                            document.forms[0].addEventListener('submit', (event) => {
                                event.preventDefault();
                                const formData = new FormData(event.target);
                                const body = Object.fromEntries(formData.entries());
                    
                                body.id = cat.id; 
                                updateCat(body).then(() => {
                                    refreshCatsAndContent(); 
                                    popupForm.classList.remove('active'); 
                                    popupForm.parentElement.classList.remove('active');
                                });
                            });
                            if (!popupForm.classList.contains('active')) {
                                popupForm.classList.add('active');
                                popupForm.parentElement.classList.add('active');
                            }
                        });

                        break;
                    
                case 'delete-cat':
                    deleteCat(event.target.value).then((res)=>{
                        refreshCatsAndContent()
                    })
                default:
                    break;
            }
        }
    });

const openModalCat = (cat) =>{
    const content = document.getElementsByClassName('content')[0];
	content.insertAdjacentHTML('afterbegin', generateModalCat(cat));
    let catModal = document.querySelector('.modal')
    let closeCatModal = document.querySelector('.close-modal')
    closeCatModal.addEventListener('click', () => {
		catModal.remove();
	});
}


const generateModalCat = (cat) => {
    return `<div class="modal z-10 fixed top-1/4 right-1/4 left-1/4 py-5 px-5 bg-slate-800 flex flex-col text-white rounded-md">
    <button class="close-modal absolute right-0 top-0 py-1 px-1"><i class="fa-solid fa-xmark text-3xl hover:text-rose-500"></i></button>
    <div class="flex flex-col">
        <span class="text-5xl text-center">${cat.name}</span>
        <img src="${cat.image}" alt="">
    </div>
    <div class="flex flex-col text-xl">
        <span>Рейтинг:${cat.rate}</span>
        <span>Возраст:${cat.age}</span>
        <p>Описание:<br>${cat.description}</p>
    </div>
</div>
    `
}

const refreshCatsAndContent = () => {
    const content = document.getElementsByClassName('content')[0];
    content.innerHTML = '';
    getAllCats().then((res) => {
        const cards = res.reduce((acc, el) => (acc += generateCard(el)), '');
        content.insertAdjacentHTML('afterbegin', cards);
    });
};

const getNewIdOfCat = () => {
	return getIdsOfCat().then((res) => {
		if (res.length) {
			return Math.max(...res) + 1;
		} else {
			return 1;
		}
	});
};

document.forms[0].addEventListener('submit', (event) => {
	event.preventDefault();
	const formData = new FormData(event.target);
	const body = Object.fromEntries(formData.entries());
    getNewIdOfCat().then((res) => {
        	body.id = res;
        	addCat(body).then(() => {
        		refreshCatsAndContent();
                popupForm.classList.remove('active'); 
                popupForm.parentElement.classList.remove('active');
        	});
        });
});


document.querySelector('#reload').addEventListener('click',refreshCatsAndContent)






openForm.addEventListener('click', (e)=>{
    e.preventDefault();
    if (!popupForm.classList.contains('active')) {
		popupForm.classList.add('active');
		popupForm.parentElement.classList.add('active');
	}
})
closeForm.addEventListener('click', () => {
	popupForm.classList.remove('active');
	popupForm.parentElement.classList.remove('active');
});

refreshCatsAndContent();
