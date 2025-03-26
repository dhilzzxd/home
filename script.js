const firebaseConfig = {
    databaseURL: "https://nexxpay-ff625-default-rtdb.asia-southeast1.firebasedatabase.app"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Registrasi user
function register() {
    let username = document.getElementById("username").value;
    let nama = document.getElementById("nama").value;
    let email = document.getElementById("email").value;

    if (!username || !nama || !email) {
        alert("Semua field harus diisi!");
        return;
    }

    // Cek apakah username sudah ada
    database.ref("users/" + username).once("value", snapshot => {
        if (snapshot.exists()) {
            alert("Username sudah terdaftar!");
        } else {
            // Simpan data user ke Firebase
            database.ref("users/" + username).set({
                nama: nama,
                email: email,
                saldo: 0
            });

            // Simpan username ke localStorage buat session
            localStorage.setItem("username", username);
            alert("Registrasi berhasil!");
            window.location.href = "dashboard.html";
        }
    });
}

// Login user
function login() {
    let username = document.getElementById("loginUsername").value;

    database.ref("users/" + username).once("value", snapshot => {
        if (snapshot.exists()) {
            localStorage.setItem("username", username);
            window.location.href = "dashboard.html";
        } else {
            alert("Username tidak ditemukan!");
        }
    });
}

// Cek status login di dashboard
if (window.location.pathname.includes("dashboard.html")) {
    let username = localStorage.getItem("username");

    if (!username) {
        window.location.href = "index.html";
    } else {
        database.ref("users/" + username).once("value", snapshot => {
            let data = snapshot.val();
            document.getElementById("userUsername").innerText = username;
            document.getElementById("userNama").innerText = data.nama;
            document.getElementById("userEmail").innerText = data.email;
            document.getElementById("userSaldo").innerText = data.saldo;
        });
    }
}

// Logout user
function logout() {
    localStorage.removeItem("username");
    window.location.href = "index.html";
}
