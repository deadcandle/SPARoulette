const progBar = document.getElementById("progbar");
let isCancelled = false;

function wait(duration) {
    return new Promise((resolve) => {
        setTimeout(resolve, duration*1000);
    });
}

export async function startBar(duration) {
    isCancelled = false;
    progBar.value = 1;
    for (let i = duration; i >= 0; i--) {
        if (isCancelled) break;
        progBar.value = i / duration;
        await wait(1);
    }
}

export async function cancelBar() {
    isCancelled = true;
    progBar.value = 0;
}