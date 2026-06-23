const profilePostsList = document.getElementById("profilePostsList");
const profilePostsSentinel = document.getElementById("profilePostsSentinel");

let currentPostsPage = 1;
let postsLoading = false;
let postsHasNext = true;

async function loadNextPostsPage() {
  postsLoading = true;
  currentPostsPage++;

  const response = await fetch(`?page=${currentPostsPage}`, {
    headers: { "X-Requested-With": "XMLHttpRequest" },
  });
  const data = await response.json();

  if (!data.success) {
    postsHasNext = false;
    postsLoading = false;
    return;
  }

  profilePostsList.insertAdjacentHTML("beforeend", data.html);
  postsLoading = false;
}

if (profilePostsSentinel) {
  const postsObserver = new IntersectionObserver(
    async (entries) => {
      if (entries[0].isIntersecting && postsHasNext && !postsLoading) {
        await loadNextPostsPage();
      }
    },
    { rootMargin: "150px" }
  );
  postsObserver.observe(profilePostsSentinel);
}