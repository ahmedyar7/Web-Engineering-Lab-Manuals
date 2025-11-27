const apiKey = "a4fbc1d974734ee19698bebe82453133";
const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;

const newsContainer = document.getElementById("news-container");

// 2. Function to Fetch Data
async function fetchNews() {
    try {
        const response = await fetch(url);
        const data = await response.json();

        // Check if articles exist
        if (data.articles) {
            displayNews(data.articles);
        } else {
            newsContainer.innerHTML =
                "<p>No news found or API Key invalid.</p>";
        }
    } catch (error) {
        console.error("Error fetching news:", error);
        newsContainer.innerHTML =
            "<p>Error loading news. Check console for details.</p>";
    }
}

// 3. Function to Display Data on HTML
function displayNews(articles) {
    newsContainer.innerHTML = ""; // Clear loading text

    articles.forEach((article) => {
        // Only show articles that have an image and description
        if (!article.urlToImage) return;

        const card = document.createElement("div");
        card.className = "news-card";

        card.innerHTML = `
            <img src="${article.urlToImage}" alt="News Image">
            <div class="news-content">
                <h3>${article.title}</h3>
                <p>${
                    article.description
                        ? article.description.substring(0, 100) + "..."
                        : "No description available."
                }</p>
                <a href="${article.url}" target="_blank">Read More</a>
            </div>
        `;

        newsContainer.appendChild(card);
    });
}

// 4. Initialize
fetchNews();
