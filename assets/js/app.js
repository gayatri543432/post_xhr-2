const cl=console.log;

const formContainer=document.getElementById('formContainer')
const titleControl=document.getElementById('title')
const bodyControl=document.getElementById('body')
const userIDControl=document.getElementById('userID')
const addBtn=document.getElementById('addBtn')
const updateBtn=document.getElementById('updateBtn')
const postContainer=document.getElementById('postContainer')
const spinner=document.getElementById('spinner')

let BASE_URL='https://jsonplaceholder.typicode.com/';
let POST_URL=`${BASE_URL}/posts`

let postArr=[]
let updateId=null

function snackBar(msg,i){
    Swal.fire({
        title:msg,
        icon:i,
        timer:3000
    })
}

function toolTips(){
  
  $('[data-toggle="tooltip"]').tooltip()

}

function templating(arr){
    let res='';
    arr.forEach((p)=>{
        res+=` <div class="col-md-3 mb-3" id="${p.id}">
                <div class="card h-100">
                    <div class="card-header" data-toggle="tooltip" data-placement="top" title="${p.title}">
                        <h3>${p.title}</h3>
                    </div>
                    <div class="card-body">
                        <p>${p.body}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <i onclick="onEdit(this)" class="fa-solid fa-pen-to-square fa-2x text-primary"
                        data-toggle="tooltip" data-placement="top" title="Edit Post"></i>
                        <i onclick="onRmove(this)" class="fa-solid fa-trash-can fa-2x text-danger"
                        data-toggle="tooltip" data-placement="top" title="Remove Post"></i>

                    </div>
                </div>
            </div>`
    })
    postContainer.innerHTML=res;
    toolTips()
}

function onSubmitPost(eve){
    spinner.classList.remove('d-none')
    eve.preventDefault();
    let POST_OBJ={
        title:titleControl.value,
        body:bodyControl.value,
        userId:userIDControl.value
    }
    let xhr=new XMLHttpRequest();
    xhr.open('POST',POST_URL);
    xhr.send(JSON.stringify(POST_OBJ));
    xhr.onload=function(){
        if(xhr.status>=200 && xhr.status<=299){
            let res=JSON.parse(xhr.response);
            formContainer.reset() 
            let col=document.createElement('div')
            col.className='col-md-3  mb-3'
            col.id=res.id
            col.innerHTML=`<div class="card h-100">
                                <div class="card-header"  data-toggle="tooltip" data-placement="top" title="${POST_OBJ.title}">
                                    <h3>${POST_OBJ.title}</h3>
                                </div>
                                <div class="card-body">
                                    <p>${POST_OBJ.body}</p>
                                </div>
                                <div class="card-footer d-flex justify-content-between">
                                    <i onclick="onEdit(this)" class="fa-solid fa-pen-to-square fa-2x text-primary"
                                    data-toggle="tooltip" data-placement="top" title="Edit Post"></i>
                                    <i onclick="onRmove(this)" class="fa-solid fa-trash-can fa-2x text-danger"
                                    data-toggle="tooltip" data-placement="top" title="Remove Post"></i>

                                </div>
                            </div>`
            postContainer.prepend(col);
            
            spinner.classList.add('d-none')
            toolTips()
            snackBar(`New Post with Id ${res.id} Created successfully..`,'success')
        }
    }
}

function fetchPost(){
  
    let xhr=new XMLHttpRequest();
    xhr.open('GET',POST_URL)
    xhr.send(null)
    xhr.onload=function(){
        if(xhr.status >=200 && xhr.status<=299){
            let data=JSON.parse(xhr.response)
            postArr=[...data]
            templating(data.reverse())
            
        }else{
            
            snackBar('something went wrong','error')
        }
    }
}
fetchPost()

function onEdit(ele){
    updateId=ele.closest('.col-md-3').id
    let EDIT_URL=`${BASE_URL}/posts/${updateId}`
    let xhr=new XMLHttpRequest()
    xhr.open('GET',EDIT_URL);
    xhr.send(null)
    xhr.onload=function(){
        if(xhr.status>=200 && xhr.status<=299){
            let res=JSON.parse(xhr.response)
            titleControl.value=res.title;
            bodyControl.value=res.body;
            userIDControl.value=res.userId

            formContainer.scrollIntoView({
                behavior:'smooth',
                block:'center'
            })
            addBtn.classList.add('d-none')
            updateBtn.classList.remove('d-none')
        }
    }
}

function onPostUpdate(){
    let updated_obj={
        title:titleControl.value,
        body:bodyControl.value,
        userId:userIDControl.value
    }
    spinner.classList.remove('d-none')
    let UPDATE_URL=`${BASE_URL}/posts/${updateId}`
    let xhr=new XMLHttpRequest()
    xhr.open('PATCH',UPDATE_URL)
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

    xhr.send(JSON.stringify(updated_obj))
    xhr.onload=function(){
        if(xhr.status>=200 && xhr.status <=299){
            let card=document.getElementById(updateId);
            card.querySelector('h3').innerHTML=updated_obj.title
            card.querySelector('p').innerHTML=updated_obj.body

            card.querySelector('.card-header')
            .setAttribute('title', updated_obj.title);

            $(card.querySelector('.card-header')).tooltip('dispose');
            $(card.querySelector('.card-header')).tooltip();

            formContainer.reset()
            addBtn.classList.remove('d-none');
            updateBtn.classList.add('d-none');
            spinner.classList.add('d-none')


            let updatedPost=document.getElementById(updateId)
            updatedPost.classList.add('updated-card')
            updatedPost.scrollIntoView({
                behavior:'smooth',
                block:'center'
            })

            setTimeout(() => {
            updatedPost.classList.remove('updated-card')
                
            }, 3000);
            snackBar('Post updated successfilly..','success')
        }else{
            spinner.classList.add('d-none')
            snackBar('something went wrong..','error')
        }
    }
}

function onRmove(ele){
   let remove_id= ele.closest('.col-md-3').id;
   Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
}).then((result) => {
  if (result.isConfirmed) {
    spinner.classList.remove('d-none');
    let REMOVE_URL=`${BASE_URL}/posts/${remove_id}`
    let xhr=new XMLHttpRequest()
    xhr.open('DELETE',REMOVE_URL)
    xhr.send(null)
    xhr.onload=function(){
        if(xhr.status>=200 && xhr.status<=299){
            let card=document.getElementById(remove_id);
            card.remove();
            spinner.classList.add('d-none');
            snackBar(`Post ${remove_id} is Deleted successfully..`,'success')
        }else{
            spinner.classList.add('d-none');
            snackBar('something went wrong..','error')
        }
    }
  }
});
}

formContainer.addEventListener('submit',onSubmitPost)
updateBtn.addEventListener('click',onPostUpdate)

