const CLIENT_ID = "94597b959a054486b5d1cee164c4f796";
const CLIENT_SECRET = "f6ac005922a8450e961c2732c0f87e70";
const AUTH_URL = "https://accounts.spotify.com/api/token";
const SEARCH_URL = "https://api.spotify.com/v1/search";
const TYPE = "track";

let auth_token;
let previousTracks = [];

async function getAuthToken() {
  const response = await fetch(AUTH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(CLIENT_ID + ":" + CLIENT_SECRET)}`,
    },
    body: "grant_type=client_credentials",
  });
  const data = await response.json();
  auth_token = data.access_token;
}

getAuthToken();

async function getRandomTrack(year) {
  const query = encodeURIComponent(`year:${year}`); // modify this query to search for the tracks you want
  const url = `${SEARCH_URL}?q=${query}&type=${TYPE}&limit=50`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${auth_token}`,
    },
  });
  const data = await response.json();
  const tracks = data.tracks.items.filter(track => !previousTracks.includes(track.id));
  if (tracks.length === 0) {
    previousTracks = [];
    return getRandomTrack();
  }
  const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
  previousTracks.push(randomTrack.id);
  return randomTrack;
}

const btn = document.querySelector(".btn");
const trackEl = document.querySelector(".track");
const audioEl = document.querySelector("#audio");

btn.addEventListener("click", async () => {
  const year = document.querySelector("#year").value;
  const track = await getRandomTrack(year);
  const { name, preview_url, external_urls } = track;
  if (preview_url) {
    trackEl.innerHTML = `Track Name: <a href="${external_urls.spotify}" target="_blank">${name}</a>`;
    audioEl.src = preview_url;
    audioEl.play();
    trackEl.style.backgroundColor = "#1DB954";
    trackEl.style.color = "#FFFFFF";
    trackEl.style.padding = "10px 20px";
    trackEl.style.fontSize = "16px";
    trackEl.style.border = "none";
    trackEl.style.borderRadius = "4px";
    trackEl.style.marginBottom = "20px";

    const albumCoverUrl = track.album.images[0].url;
    document.getElementById("bg-image").src = albumCoverUrl;
  } else {
    trackEl.innerHTML = `Sorry, this track <a href="${external_urls.spotify}" target="_blank">${name}</a> does not have a preview available, please click again!`;
    trackEl.style.backgroundColor = "red";
  }
});


const select = document.querySelector("#year");

// Loop from 1920 to 2023 and create an option for each year
for (let i = 1900; i <= 2023; i++) {
  const option = document.createElement("option");
  option.value = i;
  option.text = i;
  if (i === 2023) {
    option.selected = true;
  }
  select.appendChild(option);
}

