const d = document,
    $form = d.getElementById("search-form"),
    $mediaContainer = d.querySelector(".media-container"),
    $media = d.querySelector(".media-info"),
    $artist = d.querySelector(".artist-info"),
        $artistName = $artist.querySelector(".artist-name"),
        $artistImg = $artist.querySelector("img"),
        $artistBio = $artist.querySelector(".artist-bio"),
        $artistGenre = $artist.querySelector(".artist-genre"),
    $lyric = d.querySelector(".song-lyric");

    d.addEventListener("submit",  async (e) => {
        if (e.target === $form) {
            e.preventDefault();
            const artist = d.getElementById("artist").value.toLowerCase(),
                  song = d.getElementById("song").value.toLowerCase();
            
            try {
                let artistResp =  fetch(`https://theaudiodb.com/api/v1/json/1/search.php?s=${artist}`)
                let lyricResp =  fetch(`https://api.lyrics.ovh/v1/${artist}/${song}`);
                let albumResp =  fetch(`https://api.lyrics.ovh/v1/${artist}/${song}`);
                [artistResp, lyricResp] = await Promise.all([artistResp, lyricResp])
                let artistJson = await artistResp.json();
                let lyricJson =  await lyricResp.json();
                let artistInfo = artistJson.artists;

                console.log(artistJson, lyricJson)
                $mediaContainer.classList.remove("hide");

                if (artistInfo === null) {
                    $artist.textContent = `No Info of ${artist}`
                } else {
                    $artistName.textContent = artistInfo.map(info =>info.strArtist);
                    $artistImg.setAttribute("src", artistInfo.map(info =>info.strArtistClearart ? info.strArtistClearart : info.strArtistFanart));
                    $artistGenre.textContent = artistInfo.map(info =>info.strGenre);
                    $artistBio.textContent = artistInfo.map(info =>info.strBiographyEN);
                    $artist.querySelector(".year-formed").textContent = artistInfo.map(info =>`Formed Year: ${info.intFormedYear}` || `Formed Year: -`);
                    $artist.querySelector(".born-death").textContent = artistInfo.map(info => `Born: ${info.intBornYear || "no info"} - Died: ${info.intDiedYear || "Presente"}`);
                    $artist.querySelector("a").setAttribute("href", `http://${artistInfo.map(info => info.strWebsite)}`)
                    $artist.querySelector("a").setAttribute("target", "_blank")
                }

                if (lyricJson.error) {
                    $lyric.querySelector("p").textContent = `No lyric found of "${song}"`;
                } else {
                    $lyric.querySelector("p").textContent = lyricJson.lyrics;
                    $lyric.querySelector("h3").textContent = song;
                }


               

            
                 
           
            } catch (err) {
                console.log(err)
            } 
        }
    })

// artistInfo.map(info => console.log(info.intFormedYear))