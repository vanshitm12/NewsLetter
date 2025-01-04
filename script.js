document.addEventListener("DOMContentLoaded", () => {
    const API_KEY = 'pub_643842c1f659d74bf15115fd9a5599853c948';
    const BASE_URL = 'https://newsdata.io/api/1/news';
    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("search-input");
    const newsContainer = document.getElementById("news-container");

    async function fetchNews(query) {
        const url = `${BASE_URL}?apikey=${API_KEY}&q=${encodeURIComponent(query)}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Failed to fetch news");
            }
            const data = await response.json();
            displayNews(data.results);
        } catch (error) {
            newsContainer.innerHTML = `<p>${error.message}</p>`;
        }
    }

    function displayNews(articles) {
        newsContainer.innerHTML = "";
        if (!articles || articles.length === 0) {
            newsContainer.innerHTML = "<p>No news found for this topic.</p>";
            return;
        }
        articles.forEach(article => {
            const newsItem = document.createElement("div");
            newsItem.className = "news-item";

            newsItem.innerHTML = `
                <img src="${article.image_url || 'https://via.placeholder.com/150'}" alt="${article.title || 'No Title'}" style="width: 100%; max-height: 200px; object-fit: cover; margin-bottom: 10px;" />
                <h2>${article.title || "No Title"}</h2>
                <p>${article.description || "No description available."}</p>
                <a href="${article.link}" target="_blank">Read more</a>
            `;

            newsContainer.appendChild(newsItem);
        });
    }

    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const query = searchInput.value.trim(); // Take input from the user
        if (query) {
            fetchNews(query); // Pass the input dynamically as the `q` parameter
        } else {
            newsContainer.innerHTML = "<p>Please enter a topic to search.</p>";
        }
    });
});
