let currentPage = 1;
let totalPageCount = 1;
let repositoriesPerPage = 10;

const myBioLoader = document.getElementById("load1");
const reposLoader = document.getElementById("load2");

const fetchData = () => {

  // Show loaders
  myBioLoader.style.display = "block";
  reposLoader.style.display = "block";

  let userNameInput = document.getElementById("userName");
  const myBio = document.getElementById("myBio");
  let range = document.getElementById("range");

  repositoriesPerPage = range.value;
  console.log(repositoriesPerPage)
  const userName = userNameInput.value;

  const pages = document.getElementById('pages');
  pages.innerHTML = '';

  // Clear the input field
  userNameInput.value = "";


  totalPageCount = 1;

  let myApi = fetch(`https://api.github.com/users/${userName}`)
  myApi.then((response)=>{
    return response.json();
  }).then((repo)=>{
    
    myBio.innerHTML = '';

    const myData = document.createElement("div");
    myData.className = "upper";

    myData.innerHTML = `
    <div id="left">
        <img src=${repo.avatar_url} alt="">
        <p>${repo.url}</p>
      </div>
      <div id="right">
        <h1 class="spaceY">${repo.login}</h1>
        <p class="spaceY">${repo.bio || "no bio"}</p>
        <h3 class="spaceY">${repo.location || 'NA'}</h3>
        <h3 class="spaceY">Twitter: ${repo.twitter_username ? `https://twitter.com/${repo.twitter_username}` : 'NA'}</h3>
      </div>
    `

    myBio.appendChild(myData)

    range.value = 10
  }).catch((err)=>{
    console.log(err)
  }).finally(() => {
    // Hide myBio loader
    myBioLoader.style.display = "none";
  });

  // Fetch the total page count
  fetch(`https://api.github.com/users/${userName}/repos?per_page=${repositoriesPerPage}`)
    .then(res => {
      const linkHeader = res.headers.get('Link');
      if (linkHeader) {
        const pageCountMatch = linkHeader.match(/&page=(\d+)>; rel="last"/);
        if (pageCountMatch) {
          totalPageCount = parseInt(pageCountMatch[1], 10);
        }
      }
      fetchRepo(userName, currentPage);
    })
    .catch(error => {
      console.error('Error fetching total page count:', error);
    });


}


const fetchRepo = (userName, page) => {

  // Show repos loader
  reposLoader.style.display = "block";

  const repos = document.getElementById("repos");

  const pages = document.getElementById('pages');
  pages.innerHTML = '';

  fetch(`https://api.github.com/users/${userName}/repos?page=${page}&per_page=${repositoriesPerPage}`)
  .then((res)=>{return res.json()})
  .then((res)=>{

    repos.innerHTML = "";

    res.forEach((repo)=>{
      const repoElement = document.createElement("div");
      repoElement.className = "repo";
      repoElement.innerHTML=`
      <h1 class="spaceX spaceY">${repo.name}</h1>
      <h3 class="spaceX spaceY">${repo.description}</h3>
      <h4 class="spaceX spaceY">${repo.language}</h4>
      `
      repos.appendChild(repoElement);
    })

    addPaginationControls(userName);

  }).catch((err)=>{
    console.log(err)
  }).finally(() => {
    // Hide myBio loader
    reposLoader.style.display = "none";
  });
}


const addPaginationControls = (userName) => {
  const pages = document.getElementById('pages');
  pages.innerHTML = '';

  const paginationContainer = document.createElement('div');
  paginationContainer.className = 'pagination';

  // Create "Previous" button
  const prevButton = document.createElement('button');
  prevButton.innerText = 'Previous';
  prevButton.disabled = currentPage === 1;
  prevButton.addEventListener('click', () => {
  repos.innerHTML = '';
  pages.innerHTML = '';

  document.body.scrollIntoView({ behavior: 'smooth' });

    if (currentPage > 1) {
      currentPage--;
      fetchRepo(userName, currentPage);
    }
  });
  paginationContainer.appendChild(prevButton);

  // Create "Next" button
  const nextButton = document.createElement('button');
  nextButton.innerText = 'Next';
  nextButton.disabled = currentPage === totalPageCount;
  nextButton.addEventListener('click', () => {
  repos.innerHTML = '';
  pages.innerHTML = '';


  document.body.scrollIntoView({ behavior: 'smooth' });

    if (currentPage < totalPageCount) {
      currentPage++;
      fetchRepo(userName, currentPage);
    }
  });
  paginationContainer.appendChild(nextButton);

  // Append pagination container to repositories container
  pages.appendChild(paginationContainer);
}
const submitButton = document.querySelector('button');
submitButton.addEventListener('click', fetchData);