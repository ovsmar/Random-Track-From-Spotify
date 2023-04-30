const CLIENT_ID = "94597b959a054486b5d1cee164c4f796";
const CLIENT_SECRET = "f6ac005922a8450e961c2732c0f87e70";
const AUTH_URL = "https://accounts.spotify.com/api/token";
const PLAYLIST_ID = "1mB0DBalm5cTnkoi8yDFul";
const TRACKS_URL = `https://api.spotify.com/v1/playlists/${PLAYLIST_ID}/tracks`;

let auth_token;

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

async function getRandomTrack() {
  const response = await fetch(TRACKS_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${auth_token}`,
    },
  });
  const data = await response.json();
  const tracks = data.items;
  const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
  return randomTrack;
}

const btn = document.querySelector(".btn");
const trackEl = document.querySelector(".track");
const audioEl = document.querySelector("#audio");

btn.addEventListener("click", async () => {
  const track = await getRandomTrack();
  const { name, preview_url, external_urls } = track.track;
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

    const albumCoverUrl = track.track.album.images[0].url;
    document.getElementById("bg-image").src = albumCoverUrl;
  } else {
    trackEl.innerHTML = `Sorry, this track <a href="${track.track.external_urls.spotify}" target="_blank">${track.track.name}</a> does not have a preview available, please click again!`;
    trackEl.style.backgroundColor = "red";
  }
});
