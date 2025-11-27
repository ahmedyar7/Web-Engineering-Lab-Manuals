let currentStep = 1;

const formData = {
    name: "",
    email: "",
    username: "",
    password: "",
};

function showStep(stepIndex) {
    document.getElementById("step-1").classList.add("hidden");
    document.getElementById("step-2").classList.add("hidden");
    document.getElementById("step-3").classList.add("hidden");
    document.getElementById(`step-${stepIndex}`).classList.remove("hidden");
    updateIndicators(stepIndex);
}

function updateIndicators(step) {
    for (let i = 1; i <= 3; i++) {
        const el = document.getElementById(`indicator-${i}`);
        if (i === step) {
            el.classList.add("active");
        } else {
            el.classList.remove("active");
        }
    }
}

// Name: Ahmed Yar
// CMS-ID: 480756
// Course: Web Engineering

function validateStep(step) {
    let valid = true;

    if (step === 1) {
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        document.getElementById("error-name").textContent = "";
        document.getElementById("error-email").textContent = "";
        if (!name) {
            document.getElementById("error-name").textContent =
                "Name cannot be empty";
            valid = false;
        }
        if (!email.includes("@") || !email.includes(".")) {
            document.getElementById("error-email").textContent =
                "Invalid email";
            valid = false;
        }
    }

    if (step === 2) {
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();
        document.getElementById("error-username").textContent = "";
        document.getElementById("error-password").textContent = "";
        if (username.length < 5) {
            document.getElementById("error-username").textContent =
                "Min 5 characters";
            valid = false;
        }
        if (password.length < 8) {
            document.getElementById("error-password").textContent =
                "Min 8 characters";
            valid = false;
        }
    }

    return valid;
}

document.getElementById("next-1").onclick = () => {
    if (validateStep(1)) {
        currentStep = 2;
        showStep(currentStep);
    }
};

document.getElementById("prev-2").onclick = () => {
    currentStep = 1;
    showStep(currentStep);
};

document.getElementById("next-2").onclick = () => {
    if (validateStep(2)) {
        formData.name = document.getElementById("name").value.trim();
        formData.email = document.getElementById("email").value.trim();
        formData.username = document.getElementById("username").value.trim();
        formData.password = document.getElementById("password").value.trim();
        document.getElementById("review-name").textContent = formData.name;
        document.getElementById("review-email").textContent = formData.email;
        document.getElementById("review-username").textContent =
            formData.username;
        currentStep = 3;
        showStep(currentStep);
    }
};

// Name: Ahmed Yar
// CMS-ID: 480756
// Course: Web Engineering

document.getElementById("prev-3").onclick = () => {
    currentStep = 2;
    showStep(currentStep);
};

function submitApplication(data) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                id: Math.random().toString(36).substring(2, 9),
            });
        }, 2000);
    });
}

document.getElementById("submit").onclick = async () => {
    document.getElementById("submit").disabled = true;
    document.getElementById("submit").textContent = "Submitting...";
    const result = await submitApplication(formData);
    if (result.success) {
        const msg = document.getElementById("success-message");
        msg.classList.remove("hidden");
        msg.innerHTML = "Application submitted. ID: " + result.id;
        document
            .querySelectorAll("input, button")
            .forEach((e) => (e.disabled = true));
    }
};

showStep(1);
