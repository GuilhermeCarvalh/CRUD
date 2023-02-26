'use strict'


const openModal = () => {
    return document.getElementById('modal').classList.add('active')
}

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
    
}



const getLocalStorage = () =>  JSON.parse(localStorage.getItem('db_client')) ?? [];

const setLocalStorage = (dbClient) => localStorage.setItem("db_client", JSON.stringify(dbClient));

//Crud - create read update delete 
const deleteClient = (index) => {
    const dbClient = readCliente();
    dbClient.splice(index,1);
    setLocalStorage(dbClient);
}

const updateClient = (index,client) => {
    const dbClient = readCliente();
    dbClient[index] = client;
    setLocalStorage(dbClient);
}

const readCliente = () => getLocalStorage();



const createCliente = (client) => {
    const dbClient = getLocalStorage();
    console.log(dbClient);
    dbClient.push(client);
    setLocalStorage(dbClient);
}

const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}


 const clearFields = () => {
     const fields = document.querySelectorAll('.modal-field');
     fields.forEach(field => field.value = '')
 }


//interação com o layout
const saveClient = () => {
    if(isValidFields()){
        const client = {
            nome: document.getElementById('nome').value,
            email:document.getElementById('email').value,
            celular: document.getElementById('celular').value,
            cidade: document.getElementById('cidade').value
        }
        const index = document.getElementById('nome').dataset.index
        if(index == 'new'){
            createCliente(client);
            updateTable();
            closeModal();
        }else{
            updateClient(index,client);
            updateTable();
            closeModal();
        }
    }
}

const createRow = (client,index) => {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
    <td>${client.nome}</td>
    <td>${client.email}</td>
    <td>${client.celular}</td>
    <td>${client.cidade}</td>
     <td>
        <button type="button" class="button green" id ="edit-${index}">Editar</button>
        <button type="button" class="button red"   id ="delete-${index}">Excluir</button>
     </td>`

     document.querySelector('#tableClient > tbody').appendChild(newRow);



}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableClient > tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
   const dbClient = readCliente();
   clearTable();
   dbClient.forEach(createRow)
}

const fillFields = (client) => {
   document.getElementById('nome').value = client.nome
   document.getElementById('email').value = client.email
   document.getElementById('celular').value = client.celular
   document.getElementById('cidade').value = client.cidade
   document.getElementById('nome').dataset.index = client.index
}

const editCliente = (index) => {
    const client = readCliente()[index];
    client.index = index
    fillFields(client);
    openModal();
}

const editDelete = (event) => {
    if(event.target.type == 'button'){
    const [action, index] = event.target.id.split('-');

     if(action == 'edit'){
         editCliente(index);
     }else{
         const client = readCliente()[index]
         const response = confirm (`Deseja realmente excluir o cliente ${client.nome}`)
        if(response == true){
            deleteClient(index);
            updateTable();
        }
        
     }
    }
   
}

updateTable()

// Eventos
document.getElementById('cadastrarCliente').addEventListener('click', openModal)
document.getElementById('modalClose').addEventListener('click', closeModal)


document.getElementById('salvar').addEventListener('click',saveClient);

document.querySelector('#tableClient > tbody').addEventListener('click', editDelete)




