const container = document.getElementById("news-container");
const loading = document.getElementById("loading");

// Your API Key
const API_KEY = "a4fbc1d974734ee19698bebe82453133";
const API_URL = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`;

async function fetchNews() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        // FIX 1: Check if the API returned an error
        if (data.status === "error") {
            throw new Error(data.message);
        }

        const articles = data.articles.slice(0, 12);

        loading.style.display = "none";

        articles.forEach((article) => {
            // Skip articles that were removed/invalid
            if (article.title === "[Removed]") return;

            const card = document.createElement("div");
            card.classList.add("news-card");

            const imageUrl = article.urlToImage
                ? article.urlToImage
                : "https://via.placeholder.com/400x200?text=No+Image";

            // FIX 4: Format the date
            const date = new Date(article.publishedAt).toLocaleDateString(
                "en-US",
                {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                }
            );

            const description =
                article.description ||
                "No description available for this news.";

            card.innerHTML = `
                        <img src="${imageUrl}" alt="News Image" class="news-image" onerror="this.src='https://via.placeholder.com/400x200?text=Image+Error'">
                        <div class="news-content">
                            <h3 class="news-title">${article.title}</h3>
                            <p class="news-description">${description}</p>
                            <div class="news-footer">
                                <span class="date">${date}</span>
                                <a href="${article.url}" target="_blank" class="read-more">Read More</a>
                            </div>
                        </div>
                    `;

            container.appendChild(card);
        });
    } catch (error) {
        loading.textContent = "Failed to load news. " + error.message;
        console.error("Error fetching news:", error);
    }
}

fetchNews();
