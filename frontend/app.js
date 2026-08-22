/* =========================
   TAB SWITCHING
========================= */

function showSignIn() {

    document
        .getElementById("signInPage")
        .classList.add("active");

    document
        .getElementById("signUpPage")
        .classList.remove("active");

    document
        .getElementById("signInTab")
        .classList.add("active");

    document
        .getElementById("signUpTab")
        .classList.remove("active");
}


function showSignUp() {

    document
        .getElementById("signUpPage")
        .classList.add("active");

    document
        .getElementById("signInPage")
        .classList.remove("active");

    document
        .getElementById("signUpTab")
        .classList.add("active");

    document
        .getElementById("signInTab")
        .classList.remove("active");
}


/* =========================
   PASSWORD VISIBILITY
========================= */

function togglePassword(id) {

    const input =
        document.getElementById(id);

    if (input.type === "password") {

        input.type = "text";

    } else {

        input.type = "password";
    }
}


/* =========================
   SERIAL NUMBER
========================= */

function getNextSerial(year) {

    const key =
        "dayflow_serial_" + year;

    let current =
        parseInt(
            localStorage.getItem(key) || "0"
        );

    current++;

    localStorage.setItem(
        key,
        current
    );

    return String(current)
        .padStart(4, "0");
}


/* =========================
   LOGIN ID
=========================

   Example:

   Rahul Das
   2026

   RADA20260001
========================= */

function generateLoginId(name, year) {

    const parts =
        name
            .trim()
            .toUpperCase()
            .split(/\s+/);

    if (parts.length < 2) {
        return "";
    }

    const firstTwo =
        parts[0].substring(0, 2);

    const lastTwo =
        parts[parts.length - 1]
            .substring(0, 2);

    const serial =
        getNextSerial(year);

    return (
        firstTwo +
        lastTwo +
        year +
        serial
    );
}


/* =========================
   PASSWORD GENERATION
========================= */

function generatePassword() {

    const characters =
        "ABCDEFGHJKLMNPQRSTUVWXYZ" +
        "abcdefghijkmnopqrstuvwxyz" +
        "23456789@#$";

    let password = "";

    for (let i = 0; i < 10; i++) {

        const randomIndex =
            Math.floor(
                Math.random() *
                characters.length
            );

        password +=
            characters[randomIndex];
    }

    return password;
}


/* =========================
   GENERATE CREDENTIALS
========================= */

function generateCredentials() {

    const name =
        document
            .getElementById("employeeName")
            .value;

    const year =
        document
            .getElementById("joiningYear")
            .value;

    if (!name || !year) {

        showToast(
            "Enter employee name and joining year first."
        );

        return;
    }

    const parts =
        name
            .trim()
            .split(/\s+/);

    if (parts.length < 2) {

        showToast(
            "Enter first and last name."
        );

        return;
    }

    const loginId =
        generateLoginId(
            name,
            year
        );

    const password =
        generatePassword();

    document
        .getElementById("generatedLoginId")
        .value = loginId;

    document
        .getElementById("generatedPassword")
        .value = password;

    document
        .getElementById("confirmPassword")
        .value = password;

    showToast(
        "Login ID and password generated."
    );
}


/* =========================
   SIGN UP
========================= */

document
    .getElementById("signupForm")
    .addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const generatedId =
                document
                    .getElementById(
                        "generatedLoginId"
                    )
                    .value;

            const generatedPassword =
                document
                    .getElementById(
                        "generatedPassword"
                    )
                    .value;

            const confirmPassword =
                document
                    .getElementById(
                        "confirmPassword"
                    )
                    .value;

            if (
                !generatedId ||
                !generatedPassword
            ) {

                showToast(
                    "Generate the Login ID and password first."
                );

                return;
            }

            if (
                generatedPassword !==
                confirmPassword
            ) {

                showToast(
                    "Passwords do not match."
                );

                return;
            }

            showToast(
                "Employee account created successfully."
            );

            setTimeout(
                function () {

                    showSignIn();

                    document
                        .getElementById("loginId")
                        .value =
                        generatedId;

                },
                1200
            );
        }
    );


/* =========================
   LOGIN
========================= */

document
    .getElementById("loginForm")
    .addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const loginId =
                document
                    .getElementById("loginId")
                    .value;

            const password =
                document
                    .getElementById(
                        "loginPassword"
                    )
                    .value;

            if (!loginId || !password) {

                showToast(
                    "Please enter Login ID and password."
                );

                return;
            }

            showToast(
                "Demo login successful."
            );
        }
    );


/* =========================
   FORGOT PASSWORD
========================= */

function forgotPassword() {

    showToast(
        "Password reset will be connected to the backend."
    );
}


/* =========================
   TOAST
========================= */

function showToast(message) {

    const toast =
        document.getElementById("toast");

    toast.textContent =
        message;

    toast.classList.add("show");

    clearTimeout(
        window.toastTimer
    );

    window.toastTimer =
        setTimeout(
            function () {

                toast.classList.remove(
                    "show"
                );

            },
            3000
        );
}