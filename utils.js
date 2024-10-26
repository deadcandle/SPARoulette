function wait(duration) {
    return new Promise((resolve) => {
        setTimeout(resolve, duration*1000);
    });
}

async function startCountdown(duration, io) {
    for (let i = duration; i > 0; i--) {
        io.emit("notify", `Starting in ${i}`);
        await wait(1);
    }
}

module.exports = { wait, startCountdown };