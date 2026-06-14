const searchQuery = new URLSearchParams(window.location.search).get("q");

fetch(chrome.runtime.getURL("GoogleItem.html"))
  .then(response => response.text())
  .then(html => {
    const populatedHtml = html.replaceAll("__SEARCH_QUERY__", encodeURIComponent(searchQuery));
    const TopStuff = document.querySelector("#topstuff")
    TopStuff.style = "background-color: #87FF65; border-radius: 20px; padding: 20px; border: 2px solid black; margin-bottom: 20px;";
    TopStuff.innerHTML = populatedHtml;
  });
