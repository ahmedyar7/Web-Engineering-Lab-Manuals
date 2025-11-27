function generateCustomBio(firstName) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const bio = `Welcome, ${firstName}! We've created your personalized profile. Our system indicates you are a highly engaged user, eager to explore new technologies.`;
            resolve(bio);
        }, 1500);
    });
}

// Name: Ahmed Yar
// CMS-ID: 480756
// Course: Web Engineering


async function loadUserProfile() {
    document.getElementById("status").innerText = "Loading user data...";
    document.getElementById("user-name").innerText = "";
    document.getElementById("user-email").innerText = "";
    document.getElementById("user-bio").innerText = "";

    try {
        const response = await fetch("https://randomuser.me/api/");
        const data = await response.json();

        const user = data.results[0];
        const firstName = user.name.first;
        const lastName = user.name.last;
        const email = user.email;

        document.getElementById(
            "user-name"
        ).innerText = `${firstName} ${lastName}`;
        document.getElementById("user-email").innerText = email;
        document.getElementById("status").innerText =
            "Generating custom bio...";

        const bioResult = await generateCustomBio(firstName);

        document.getElementById("user-bio").innerText = bioResult;
        document.getElementById("status").innerText =
            "Profile loaded successfully!";
    } catch (error) {
        console.error("Error loading profile:", error);

        document.getElementById("user-name").innerText =
            "--- Data Load Failed ---";
        document.getElementById("user-email").innerText =
            "--- Data Load Failed ---";
        document.getElementById("user-bio").innerText =
            "--- Data Load Failed ---";
        document.getElementById("status").innerText =
            "⚠️ An error occurred while loading data.";
    }
}
