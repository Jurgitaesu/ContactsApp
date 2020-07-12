(function () {

    /************
    Setting date of birth input field's max date to today
    *************/

    newContactDateOfBirth.max = new Date().toISOString().split("T")[0];

    /************
    Contacts Table
    *************/

    const contactsTableKey = 'contacts';

    let contactsTable = {};

    let refreshDOMTable = () => {
        let contactsTableKeys = Object.keys(contactsTable);
        let tableContainer = document.getElementById('contactsTableContainer');
        let oldTableBody = document.getElementById('tableBody');
        tableContainer.removeChild(oldTableBody);
        let newTableBody = document.createElement('span');
        newTableBody.id = 'tableBody';
        tableContainer.appendChild(newTableBody);

        for (let i = 0; i < contactsTableKeys.length; i++) {
            let currentRow = document.createElement('div');
            let currentFirstNameCol = document.createElement('div');
            let currentLastNameCol = document.createElement('div');
            let currentDateOfBirthCol = document.createElement('div');
            let currentPhoneCol = document.createElement('div');
            let currentEmailCol = document.createElement('div');
            let currentAddressCol = document.createElement('div');
            let currentEditBtn = document.createElement('div');
            let currentDeleteBtn = document.createElement('div');

            currentRow.className = 'table-row';
            currentFirstNameCol.className = 'table-column first-name';
            currentLastNameCol.className = 'table-column last-name';
            currentDateOfBirthCol.className = 'table-column date-of-birth';
            currentPhoneCol.className = 'table-column phone';
            currentEmailCol.className = 'table-column email';
            currentAddressCol.className = 'table-column address';
            currentEditBtn.className = 'table-column edit';
            currentDeleteBtn.className = 'table-column delete';

            currentFirstNameCol.innerHTML = contactsTableKeys[i];
            currentLastNameCol.innerHTML = contactsTable[contactsTableKeys[i]].lastName;
            currentDateOfBirthCol.innerHTML = contactsTable[contactsTableKeys[i]].dateOfBirth;
            currentPhoneCol.innerHTML = contactsTable[contactsTableKeys[i]].phone;
            currentEmailCol.innerHTML = contactsTable[contactsTableKeys[i]].email;
            currentAddressCol.innerHTML = contactsTable[contactsTableKeys[i]].address;

            currentEditBtn.innerHTML = 'Edit';
            currentDeleteBtn.innerHTML = 'Delete';

            currentRow.appendChild(currentFirstNameCol);
            currentRow.appendChild(currentLastNameCol);
            currentRow.appendChild(currentDateOfBirthCol);
            currentRow.appendChild(currentPhoneCol);
            currentRow.appendChild(currentEmailCol);
            currentRow.appendChild(currentAddressCol);
            currentRow.appendChild(currentEditBtn);
            currentRow.appendChild(currentDeleteBtn);
            newTableBody.appendChild(currentRow);
        }

        let enableDisableNewUserModal = (option) => {
            let newContactFirstName = document.getElementById('newContactFirstName');
            let newContactLastName = document.getElementById('newContactLastName');
            let newContactDateOfBirth = document.getElementById('newContactDateOfBirth');
            let newContactPhone = document.getElementById('newContactPhone');
            let newContactEmail = document.getElementById('newContactEmail');
            let newContactAddress = document.getElementById('newContactAddress');
            newContactFirstName.value = '';
            newContactLastName.value = '';
            newContactDateOfBirth.value = '';
            newContactPhone.value = '';
            newContactEmail.value = '';
            newContactAddress.value = '';

            let newContactModal = document.getElementById('newContactModal');
            let backdrop = document.getElementById('backdrop');

            newContactModal.className = `${option}-modal`;
            backdrop.className = `${option}-modal`;
        }

        let addNewEntryBtn = document.getElementById('addNewEntry');
        let editBtns = document.getElementsByClassName('edit');
        let deleteBtns = document.getElementsByClassName('delete');

        let newContactSubmitBtn = document.getElementById('newContactSubmitBtn');
        let newContactCancelBtn = document.getElementById('newContactCancelBtn');

        newContactSubmitBtn.addEventListener('click', () => {
            let newContactFirstName = document.getElementById('newContactFirstName').value.trim();
            let newContactLastName = document.getElementById('newContactLastName').value.trim();
            let newContactDateOfBirth = document.getElementById('newContactDateOfBirth').value.trim();
            let newContactPhone = document.getElementById('newContactPhone').value.trim();
            let newContactEmail = document.getElementById('newContactEmail').value.trim();
            let newContactAddress = document.getElementById('newContactAddress').value.trim();

            if (newContactFirstName !== '' && newContactLastName !== '' && newContactDateOfBirth !== '' && newContactPhone !== '' && newContactEmail !== '') {
                let newContact = {};
                contactsTable[newContactFirstName] = {
                    'firstName': newContactFirstName,
                    'lastName': newContactLastName,
                    'dateOfBirth': newContactDateOfBirth,
                    'phone': newContactPhone,
                    'email': newContactEmail,
                    'address': newContactAddress
                }
                localStorage.setItem(contactsTableKey, JSON.stringify(contactsTable));
                enableDisableNewUserModal('disable');
                refreshDOMTable();
            }
        });

        newContactCancelBtn.addEventListener('click', () => {
            enableDisableNewUserModal('disable');
        })

        addNewEntryBtn.addEventListener('click', () => {
            enableDisableNewUserModal('enable');
        });

        for (let i = 0; i < editBtns.length; i++) {
            editBtns[i].addEventListener('click', ($event) => {
                let nameToEdit = $event.target.parentElement.children[0].innerText;
                let contactToEdit = contactsTable[nameToEdit];
                enableDisableNewUserModal('enable');
                let newContactFirstName = document.getElementById('newContactFirstName');
                let newContactLastName = document.getElementById('newContactLastName');
                let newContactDateOfBirth = document.getElementById('newContactDateOfBirth');
                let newContactPhone = document.getElementById('newContactPhone');
                let newContactEmail = document.getElementById('newContactEmail');
                let newContactAddress = document.getElementById('newContactAddress');
                newContactFirstName.value = nameToEdit;
                newContactLastName.value = contactToEdit.lastName;
                newContactDateOfBirth.value = contactToEdit.dateOfBirth;
                newContactPhone.value = contactToEdit.phone;
                newContactEmail.value = contactToEdit.email;
                newContactAddress.value = contactToEdit.address;

            })
        }

        for (let i = 0; i < deleteBtns.length; i++) {
            deleteBtns[i].addEventListener('click', ($event) => {
                let nameToDelete = $event.target.parentElement.children[0].innerText;
                let isSure = window.confirm('Are you sure you want to delete ' + nameToDelete + '?');
                if (isSure)
                    deleteUserFromTable(nameToDelete);
            })
        }
    }

    let deleteUserFromTable = (userName) => {
        let tempTable = {};
        let contactsTableKeys = Object.keys(contactsTable);
        for (let i = 0; i < contactsTableKeys.length; i++) {
            if (userName !== contactsTableKeys[i]) {
                tempTable[contactsTableKeys[i]] = contactsTable[contactsTableKeys[i]];
            }
        }
        contactsTable = tempTable;
        localStorage.setItem(contactsTableKey, JSON.stringify(contactsTable));
        refreshDOMTable();
    }

    let init = () => {
        if (localStorage.getItem(contactsTableKey)) {
            contactsTable = JSON.parse(localStorage.getItem(contactsTableKey));
        } else {
            localStorage.setItem(contactsTableKey, JSON.stringify(contactsTable));
        }
        refreshDOMTable();
    }

    init();

})();
