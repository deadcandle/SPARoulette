const progBar = document.getElementById("progbar");

function wait(duration) {
    return new Promise((resolve) => {
        setTimeout(resolve, duration*1000);
    });
}

export async function startBar(duration) {
    progBar.value = 1;
    for (let i = duration*2; i >= 0; i--) {
        progBar.value = i/duration;
        await wait(1)
    }
}