document.addEventListener("DOMContentLoaded", function () {

    const registerForm = document.getElementById("registerForm");
    const loginForm = document.getElementById("loginForm");

    // Προκαθορισμένος Admin
    const adminUsername = "admin";
    const adminPassword = "Admin123!";

    // Δημιουργία του Admin αν δεν υπάρχει ήδη
    if (!localStorage.getItem("adminCreated")) {
        localStorage.setItem("adminUsername", adminUsername);
        localStorage.setItem("adminPassword", adminPassword);
        localStorage.setItem("adminCreated", "true");
        console.log("Admin δημιουργήθηκε!");
    }

    // Διαχείριση Σύνδεσης
    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const username = document.getElementById("loginUsername").value.trim();
            const password = document.getElementById("loginPassword").value.trim();
           
            const users = JSON.parse(localStorage.getItem("users")) || [];
            const user = users.find(u => u.username === username);

            let blockedUsers = JSON.parse(localStorage.getItem("blockedUsers")) || [];
            if (blockedUsers.includes(username)) {     
                alert("Ο διαχειριστής απέρριψε την πρόσβασή σας. Δεν μπορείτε να συνδεθείτε.");
                return;
            }

            // Έλεγχος για την αναγνώριση του admin
            if (username === adminUsername && password === adminPassword) {
                // Αν είναι admin, μεταφέρεται στο admin panel
                localStorage.setItem("currentUser", username);
                setTimeout(() => {
                    window.location.href = "admin.html";
                }, 100);
            } else if (user && user.password === password) {
                localStorage.setItem("currentUser", username);
                setTimeout(() => {
                    window.location.href = "instructions.html";
                }, 100);
            } else{
                alert("Λάθος όνομα χρήστη ή κωδικός πρόσβασης!");
            }
        });
    }

    // Διαχείριση Εγγραφής
    if (registerForm) {
        registerForm.addEventListener("submit", function (event) {
            let valid = true;
            const inputs = registerForm.querySelectorAll("input, select");
            const errorMessages = registerForm.querySelectorAll(".error");

            const usernameField = registerForm.querySelector("input[name='username']");
            if (usernameField && isUsernameTaken(usernameField.value.trim())) {
                valid = false;
                showError(usernameField, "Το όνομα χρήστη υπάρχει ήδη. Παρακαλώ επιλέξτε ένα άλλο.");
            }

            // Καθαρισμός προηγούμενων μηνυμάτων
            errorMessages.forEach(msg => msg.remove());

            // Έλεγχος για κενά πεδία
            inputs.forEach(input => {
                if (input.value.trim() === "") {
                    valid = false;
                    showError(input, "Αυτό το πεδίο είναι υποχρεωτικό.");
                }
            });

            // Έλεγχος εγκυρότητας email
            const emailField = registerForm.querySelector("input[type='email']");
            if (emailField && !validateEmail(emailField.value)) {
                valid = false;
                showError(emailField, "Παρακαλώ εισάγετε ένα έγκυρο email.");
            }

            // Έλεγχος ισχυρότητας κωδικού πρόσβασης
            const passwordField = registerForm.querySelector("input[type='password']");
            if (passwordField && !validatePassword(passwordField.value)) {
                valid = false;
                showError(passwordField, "Ο κωδικός πρέπει να έχει τουλάχιστον 8 χαρακτήρες, ένα κεφαλαίο γράμμα, έναν αριθμό και ένα ειδικό σύμβολο.");
            }

            // Αν όλα είναι έγκυρα, καταχωρήστε τα δεδομένα
            if (!valid) {
                event.preventDefault();
            } else {
                const user = {
                    username: document.getElementById('username').value.trim(),
                    email: document.getElementById('email').value.trim(),
                    password: document.getElementById('password').value.trim(),
                    gender: document.getElementById('gender').value,
                    age: document.getElementById('age').value,
                    education: document.getElementById('education').value,
                    experience: document.getElementById('experience').value,
                    organizationName: document.getElementById('organizationName').value.trim(),
                    organizationType: document.getElementById('organizationType').value,
                    location: document.getElementById('location').value,
                    role: document.getElementById('role').value,
                    usageYears: document.getElementById('usageYears').value,
                    serviceName: document.getElementById('serviceName').value.trim(),
                    
                    // Προσθήκη του πεδίου "status" με τιμή "Σε αναμονή"
                    status: "Σε αναμονή"  // Νέο σημείο: Ορίζουμε την αρχική κατάσταση ως "Pending"
                };

                // Αποθήκευση του χρήστη στον localStorage 
                const users = JSON.parse(localStorage.getItem("users")) || [];
                users.push(user);
                localStorage.setItem("users", JSON.stringify(users));  // Αποθήκευση της εγγραφής στο localStorage
 
                // Αποθήκευση του τρέχοντος χρήστη στο localStorage
                localStorage.setItem("currentUser", username)               
                // Ειδοποίηση στον χρήστη
                alert("Η εγγραφή σας καταχωρήθηκε! Περιμένετε έγκριση από τον διαχειριστή.");
                registerForm.reset();  // Καθαρίζουμε τη φόρμα
            }
        });
    }

    // Συνάρτηση για εμφάνιση σφαλμάτων
    function showError(element, message) {
        const error = document.createElement("div");
        error.className = "error";
        error.style.color = "red";
        error.style.fontSize = "14px";
        error.style.marginTop = "5px";
        error.innerText = message;
        element.parentNode.appendChild(error);
    }

    // Συνάρτηση για έλεγχο εγκυρότητας email
    function validateEmail(email) {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(email);
    }

    // Συνάρτηση για έλεγχο ισχυρού κωδικού πρόσβασης
    function validatePassword(password) {
        const re = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        return re.test(password);
    }

    // Συνάρτηση για έλεγχο αν το όνομα χρήστη είναι ήδη καταχωρημένο
    function isUsernameTaken(username) {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        return users.some(user => user.username === username);
    }

    const logoutButton = document.getElementById("logoutButton");

    // Διαχείριση Αποσύνδεσης
    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            // Καθαρισμός των στοιχείων σύνδεσης (μπορεί να γίνει με sessionStorage ή localStorage)
            sessionStorage.removeItem("loggedIn"); // Αν αποθηκεύεις κατάσταση στο sessionStorage
            localStorage.removeItem("loggedIn"); // Αν αποθηκεύεις στο localStorage

            // Ανακατεύθυνση στην αρχική σελίδα ή σελίδα σύνδεσης
            window.location.href = "index.html"; // Εδώ μπορείς να βάλλεις την σελίδα που θέλεις
        });
    }

    // Φόρτωμα χρηστών στο Admin Panel
    function loadUsers() {
        const users = JSON.parse(localStorage.getItem("users")) || [];

        const userListContainer = document.getElementById("users");  // Υποθέτουμε ότι υπάρχει στοιχείο με id "users"

        userListContainer.innerHTML = "";  // Καθαρίζουμε τα προηγούμενα δεδομένα

        if (users.length === 0) {
            userListContainer.innerHTML = "<tr><td colspan='4'>Δεν υπάρχουν χρήστες προς έγκριση.</td></tr>";
        }

        users.forEach((user, index) => {
            const isDisabled = user.status === "approved" || user.status === "rejected";
            const row = document.createElement("tr");  // Δημιουργία γραμμής για τον πίνακα
            row.innerHTML = `
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.status || "Σε αναμονή"}</td>
                <td>
                    <button class="approve" id="approve-${index}" onclick="approveUser(${index})" ${isDisabled ? "disabled" : ""}>Έγκριση</button>
                    <button class="reject" id="reject-${index}" onclick="rejectUser(${index})" ${isDisabled ? "disabled" : ""}>Απόρριψη</button>
                </td>
            `;
            userListContainer.appendChild(row);  // Προσθήκη γραμμής στον πίνακα
        });
    }

    loadUsers();

    // Έγκριση χρήστη
    function approveUser(index) {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        users[index].status = "approved";  // Αλλαγή κατάστασης σε approved
        localStorage.setItem("users", JSON.stringify(users));
        
        alert("Ο χρήστης εγκρίθηκε!");
        loadUsers();  // Επαναφόρτωση της λίστας χρηστών
    }

    // Απόρριψη χρήστη
    function rejectUser(index) {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        users[index].status = "rejected";  // Αλλαγή κατάστασης σε rejected
        localStorage.setItem("users", JSON.stringify(users));

        let blockedUsers = JSON.parse(localStorage.getItem("blockedUsers")) || [];
        blockedUsers.push(users[index].username);
        localStorage.setItem("blockedUsers", JSON.stringify(blockedUsers));
        alert("Ο χρήστης απορρίφθηκε!");
        loadUsers();  // Επαναφόρτωση της λίστας χρηστών
    }
    window.approveUser = approveUser;
    window.rejectUser = rejectUser;
    // Συνάρτηση εξαγωγής σε CSV
    function exportToCSV() {
        const resultsTable = document.getElementById('resultsTable');
        if (!resultsTable) {
            alert("Ο πίνακας αποτελεσμάτων δεν βρέθηκε!");
            return;
        }       

        let csvContent = "data:text/csv;charset=utf-8,";
    
        // Προσθήκη των επικεφαλίδων του πίνακα
        csvContent += "ΧΡΗΣΤΗΣ,ΑΝΘΡΩΠΟΚΕΝΤΡΙΚΟΤΗΤΑ,ΚΛΙΝΙΚΗ ΑΠΟΤΕΛΕΣΜΑΤΙΚΟΤΗΤΑ,ΑΣΦΑΛΕΙΑ - ΑΠΟΡΡΗΤΟ,ΣΥΝΟΛΟ\n";
    
        // Προσθήκη των δεδομένων κάθε χρήστη
        const rows = resultsTable.querySelectorAll('tr');
        rows.forEach(row => {
            const cols = row.querySelectorAll('td');
            let rowData = [];
            cols.forEach(col => rowData.push(col.innerText));
            csvContent += rowData.join(",") + "\n";
        });

        // Δημιουργία του link για κατέβασμα του CSV
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "results.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function exportToPDF() {
        if (typeof jsPDF === 'undefined') {
            alert("Το jsPDF δεν φορτώθηκε σωστά!");
            return;
        }
    
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
    
        let yOffset = 10; // Για την τοποθέτηση του κειμένου σε κάθετη θέση
    
        // Εγγραφή του τίτλου
        doc.text('Αποτελέσματα Χρηστών', 10, yOffset);
        yOffset += 10;
    
        // Ελέγχουμε αν υπάρχει ο πίνακας αποτελεσμάτων
        const table = document.querySelector('#resultsTable');
        if (!table) {
            alert("Δεν βρέθηκε ο πίνακας αποτελεσμάτων!");
            return;
        }
    
        // Εγγραφή των αποτελεσμάτων χρηστών
        const rows = table.querySelectorAll('tr');
        if (rows.length === 0) {
            alert("Δεν υπάρχουν δεδομένα στον πίνακα!");
            return;
        }
    
        rows.forEach(row => {
            const cols = row.querySelectorAll('td');
            let rowText = '';
            cols.forEach(col => {
                rowText += col.innerText + " | "; // Χώρισε τα κελιά με " | "
            });
    
            // Σπάσιμο του κειμένου αν είναι πολύ μεγάλο για το πλάτος
            doc.text(rowText, 10, yOffset);
            yOffset += 10;
    
            // Αν χρειαστείς να σπάσεις σε πολλές σελίδες ή κεντρική στοίχιση
            if (yOffset > 280) {  // αν το κείμενο ξεπεράσει το 280px από την κορυφή, πάμε σε νέα σελίδα
                doc.addPage();
                yOffset = 10; // Επαναφορά της κάθετης θέσης για νέα σελίδα
            }
        });
    
        // Δημιουργία του αρχείου PDF
        doc.save('results.pdf');
    }
});

