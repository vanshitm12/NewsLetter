document.addEventListener("DOMContentLoaded", () => {
    const API_KEY = 'pub_643842c1f659d74bf15115fd9a5599853c948';
    const BASE_URL = 'https://newsdata.io/api/1/news';
    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("search-input");
    const newsContainer = document.getElementById("news-container");
    const bookmarksContainer = document.getElementById("bookmarks-container");
    let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

    function updateBookmarksDisplay() {
        bookmarksContainer.innerHTML = "";
        if (bookmarks.length === 0) {
            bookmarksContainer.innerHTML = "<p>No bookmarks yet.</p>";
            return;
        }
        bookmarks.forEach(bookmark => {
            const bookmarkItem = document.createElement("div");
            bookmarkItem.className = "bookmark-item";

            bookmarkItem.innerHTML = `
                <h2>${bookmark.title || "No Title"}</h2>
                <img src="${article.image_url || 'https://via.placeholder.com/150'}" alt="${article.title || 'No Title'}" style="width: 100%; max-height: 200px; object-fit: cover; margin-bottom: 10px;" />
                <p>${bookmark.description || "No description available."}</p>
                <a href="${bookmark.link}" target="_blank">Read more</a>
            `;

            bookmarksContainer.appendChild(bookmarkItem);
        });
    }

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
                <button class="bookmark-btn">Bookmark</button>
            `;

            const bookmarkBtn = newsItem.querySelector(".bookmark-btn");
            bookmarkBtn.addEventListener("click", () => {
                addBookmark(article);
            });

            newsContainer.appendChild(newsItem);
        });
    }

    function addBookmark(article) {
        if (bookmarks.some(bookmark => bookmark.link === article.link)) {
            alert("This article is already bookmarked.");
            return;
        }
        bookmarks.push(article);
        localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
        updateBookmarksDisplay();
    }

    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            fetchNews(query);
        } else {
            newsContainer.innerHTML = "<p>Please enter a topic to search.</p>";
        }
    });

    updateBookmarksDisplay(); 
});
