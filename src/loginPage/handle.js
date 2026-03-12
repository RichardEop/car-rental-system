


const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "1:58"
};


firebase.initializeApp(firebaseConfig);

const db = firebase.firestore(); 
const auth = firebase.auth();    









async function signup() {
    const username = document.getElementById("signupUser").value;
    const password = document.getElementById("signupPass").value;
    const confirmPassword = document.getElementById("signupPassConfirm").value;

    if (!username || !password) {
        alert("Please enter username and password");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    const email = username.includes("@") ? username : username + "@example.com";

    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        alert("User created successfully in Firebase!");
        console.log("Firebase user:", userCredential.user);

        await db.collection("users").doc(userCredential.user.uid).set({
            username: username,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        window.location.href = "success.html";
        
    } catch (error) {
        alert(error.message);
    }
}


async function login() {

    const username = document.getElementById("loginUser").value;
    const password = document.getElementById("loginPass").value;

    if (!username || !password) {
        alert("Please enter username and password");
        return;
    }

    try {
        if (username.includes("@")) {
            const userCredential = await auth.signInWithEmailAndPassword(username, password);
            alert("Login successful!");
            console.log("Logged in user:", userCredential.user);
        } else {
            const userDoc = await db.collection("users").where("username", "==", username).get();

            if (userDoc.empty) {
                alert("Username not found");
                return;
            }

            const email = userDoc.docs[0].data().username + "@example.com";  

            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            alert("Login successful!");
            console.log("Logged in user:", userCredential.user);


            window.location.href = "success.html";
        }
    } catch (error) {

        let errorMessage;

        switch (error.code) {
            case 'auth/user-not-found':
                errorMessage = "user not found with this username. Re-enter username or sign up.";
                break;
            case 'auth/wrong-password':
                errorMessage = "Incorrect password. Please try again.";
                break;
            case 'auth/invalid-email':
                errorMessage = "Please enter a valid email.";
                break;
            case 'auth/too-many-requests':
                errorMessage = "Number of failed attempts exceeded. Wait and try again at a later time.";
                break;
            default:
                errorMessage = "An unknown error occurred. Please try again.";
        }

        alert(errorMessage);
    }

    }





//will use local salt and hash when migrating to sql

/** 
const users = {};

async function signup() {
    const username = document.getElementById("signupUser").value;
    const password = document.getElementById("signupPass").value;

    if (users[username]) {
        alert("User already exists");
        return;
    }

    //salted and hashed will be commented out until
    //sql is implementd firebase currently handling security


    
    //const salt = bcrypt.genSaltSync(10);
    //const hashedPassword = bcrypt.hashSync(password, salt);

    users[username] = hashedPassword;

    alert("User created successfully!");
    console.log("Users database:", users);
}

function login() {
    const username = document.getElementById("loginUser").value;
    const password = document.getElementById("loginPass").value;

    const storedHash = users[username];
    if (!storedHash) {
        alert("User not found");
        return;
    }

    const isMatch = bcrypt.compareSync(password, storedHash);

    if (isMatch) {
        alert("Login successful!");
    } else {
        alert("Invalid password");
    }
}
**/