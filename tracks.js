// --- TRACKS DATABASE ---
// This file contains all the data for songs, videos, and metadata.
// It is loaded before the main app logic.

const allTracks = [
    // 1
    { 
        title: "DJ Intro: Welcome", 
        src: "dj-01-intro.mp3",
        image_src: "cover.png",
        type: 'dj'
    },
    { 
        title: "Intro", 
        src: "01-intro.mp3",
        image_src: "01-intro-art.png",
        lyrics: [
            { time: 26, text: "They say a light can't be contained..." },
            { time: 33, text: "And a fire can't be tamed." },
            { time: 40, text: "Well, this one's got red hair." },
            { time: 44, text: "Let's start the story there..." }
        ],
        type: 'song'
    },
    // 2
    { 
        title: "DJ Intro: The Crimson Tide", 
        src: "dj-02-the-crimson-tide.mp3",
        image_src: "cover.png",
        type: 'dj'
    },
    { 
        title: "The Crimson Tide", 
        src: "02-the-crimson-tide.mp3",
        image_src: "02-the-crimson-tide-art.png",
        srt: "The Crimson Tide.srt",
        type: 'song'
    },
    // 3
    { 
        title: "DJ Intro: Real Women", 
        src: "dj-03-real-women.mp3",
        image_src: "cover.png",
        type: 'dj'
    },
    { 
        title: "Real Women", 
        src: "03-real-women.mp3",
        image_src: "03-real-women-art.png",
        srt: "Real Women.srt",
        type: 'song'
    },
    // 4
    { 
        title: "DJ Intro: Red-Headed Hallelujah", 
        src: "dj-04-red-headed-hallelujah.mp3",
        image_src: "cover.png",
        type: 'dj'
    },
    { 
        title: "Red-Headed Hallelujah", 
        src: "04-red-headed-hallelujah.mp3",
        image_src: "04-red-headed-hallelujah-art.png",
        srt: "Red-Headed Hallelujah.srt",
        type: 'song'
    },
    // 5
    { 
        title: "DJ Intro: The Good Stuff", 
        src: "dj-05-the-good-stuff.mp3",
        image_src: "cover.png",
        type: 'dj'
    },
    { 
        title: "The Good Stuff", 
        src: "05-the_good_stuff.mp3",
        image_src: "05-the_good_stuff-art.png",
        srt: "The Good Stuff.srt",
        type: 'song'
    },
    // 6
    { 
        title: "DJ Intro: Zero Degree Beach", 
        src: "dj-06-zero-degree-beach.mp3",
        image_src: "cover.png",
        type: 'dj'
    },
    { 
        title: "Zero Degree Beach", 
        src: "06-zero-degree-beach.mp3",
        image_src: "06-zero-degree-beach-art.png",
        srt: "Zero-Degree Beach.srt",
        type: 'song'
    },
    // 7
    { 
        title: "DJ Intro: Caps", 
        src: "dj-07-caps.mp3",
        image_src: "cover.png",
        type: 'dj'
    },
    { 
        title: "Caps", 
        src: "07-caps.mp3",
        image_src: "07-caps-art.png",
        srt: "Caps.srt",
        type: 'song'
    },
    // 8
    { 
        title: "DJ Intro: Red Paddle Queen", 
        src: "dj-08-red-paddle-queen.mp3",
        image_src: "cover.png",
        type: 'dj'
    },
    { 
        title: "Red Paddle Queen", 
        src: "08-red-paddle-queen.mp3",
        image_src: "08-red-paddle-queen.png",
        srt: "Red Paddle Queen.srt",
        type: 'song'
    },
    // 9
    { 
        title: "DJ Intro: Interrupted", 
        src: "dj-09-interrupted.mp3",
        image_src: "cover.png",
        type: 'dj'
    },
    { 
        title: "Interrupted", 
        src: "09-interrupted.mp3",
        image_src: "09-interrupted-art.png",
        srt: "Interrupted.srt",
        type: 'song'
    },
    // 10
    { 
        title: "DJ Intro: Cinnamon Serenade", 
        src: "dj-10-cinnamon-serenade.mp3",
        image_src: "cover.png",
        type: 'dj'
    },
    { 
        title: "Cinnamon Serenade", 
        src: "10-cinnamon-serenade.mp3",
        image_src: "10-cinnamon-serenade-art.png",
        srt: "Cinnamon Serenade.srt",
        type: 'song'
    },
    // 11
    { 
        title: "DJ Intro: Basement Stereo Glow", 
        src: "dj-11-basement-stereo-glow.mp3",
        image_src: "cover.png",
        type: 'dj'
    },
    { 
        title: "Basement Stereo Glow", 
        src: "11-basement-stereo-glow.mp3",
        image_src: "11-basement-stereo-glow.png",
        srt: "Basement Stereo Glow.srt",
        type: 'song'
    },
    // 12
    { 
        title: "DJ Intro: Golden Devotion", 
        src: "dj-12-golden-devotion.mp3",
        image_src: "cover.png",
        type: 'dj'
    },
    { 
        title: "Golden Devotion", 
        src: "12-golden-devotion.mp3",
        image_src: "12-golden-devotion-art.png",
        srt: "Golden Devotion.srt",
        type: 'song'
    },
    // 13
    { 
        title: "DJ Intro: Natural Magic", 
        src: "dj-13-natural-magic.mp3",
        image_src: "cover.png",
        type: 'dj'
    },
    { 
        title: "Natural Magic", 
        src: "13-natural-magic.mp3",
        image_src: "13-natural-magic-art.png",
        srt: "Natural Magic.srt",
        type: 'song'
    },
    // 14
    { 
        title: "DJ Intro: Outro", 
        src: "dj-14-outro.mp3",
        image_src: "cover.png",
        type: 'dj'
    },
    { 
        title: "Outro", 
        src: "14-outro.mp3",
        image_src: "14-outro-art.png",
        srt: "Outro.srt",
        type: 'song'
    },
    // Bonus Tracks (no DJ tracks)
    { 
        title: "[Bonus Track] Red-Headed Hallelujah (Guitar Cover)", 
        src: "15-red-headed-hallelujah-guitar.mp3",
        image_src: "04-red-headed-hallelujah-art.png",
        srt: "Red-Headed Hallelujah (Guitar).srt",
        type: 'song'
    },
    { 
        title: "[Bonus Track] Natural Magic (Acoustic)", 
        src: "16-natural-magic-acoustic.mp3",
        image_src: "13-natural-magic-art.png",
        srt: "Natural Magic (Acoustic).srt",
        type: 'song'
    }
];

const videos = [
    { 
        title: "The Crimson Tide", 
        src: "https://www.youtube.com/embed/eLi96mi1hXI", 
        image_src: "02-the-crimson-tide-art.png" 
    },
    { 
        title: "Real Women", 
        src: "https://www.youtube.com/embed/VXiXI-mZvL4", 
        image_src: "03-real-women-art.png" 
    },
    { 
        title: "Red-Headed Hallelujah", 
        src: "https://www.youtube.com/embed/0WVY004pOng", 
        image_src: "04-red-headed-hallelujah-art.png" 
    },
    { 
        title: "Natural Magic", 
        src: "https://www.youtube.com/embed/usGSmvYKI5c", 
        image_src: "13-natural-magic-art.png" 
    }
];

const artistName = "A mstonge01 Project";
const djArtistName = "DJ Mode";
const albumName = "Red-Headed Hallelujah";
