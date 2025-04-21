const { ipcRenderer } = require("electron");

document.addEventListener("DOMContentLoaded", () => {
    loadSongs(); // Load stored songs when the page is opened

    // 🔥 Check for updates when the app loads
    ipcRenderer.send("check-for-updates");
});

document.getElementById("importSong").addEventListener("click", async () => {
    const filePath = await ipcRenderer.invoke("open-file-dialog");

    if (filePath) {
        const fileName = filePath.split(/[\\/]/).pop();
        addSongToUI(fileName, filePath);
        saveSong(fileName, filePath);
    }
});

function addSongToUI(name, path) {
    const songList = document.getElementById("songList");

    const listItem = document.createElement("li");
    listItem.className = "song-container";
    listItem.innerHTML = `
        <span>${name}</span>
        <button class="play-button">▶️ Play</button>
    `;

    songList.appendChild(listItem);

    const audioPlayer = new Audio(path);
    listItem.querySelector(".play-button").addEventListener("click", () => {
        audioPlayer.play();
    });
}

// 🔥 Store song in localStorage
function saveSong(name, path) {
    let songs = JSON.parse(localStorage.getItem("songs")) || [];
    songs.push({ name, path });
    localStorage.setItem("songs", JSON.stringify(songs));
}

// 🔄 Load songs when returning to the tab
function loadSongs() {
    let songs = JSON.parse(localStorage.getItem("songs")) || [];
    songs.forEach(song => addSongToUI(song.name, song.path));
}

// 🔥 Handle update notifications
ipcRenderer.on("update-available", () => {
    alert("A new version is available! The update will be downloaded.");
});

ipcRenderer.on("update-downloaded", () => {
    const confirmUpdate = confirm("Update is ready! Restart the app to install?");
    if (confirmUpdate) {
        ipcRenderer.send("install-update");
    }
});
