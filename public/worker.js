let array = [];

self.addEventListener("message", event => {
    console.log(event.data)

    if (event.data === "download") {
        console.log("array", array);
        const blob = new Blob(array);

        console.log("blob: ", blob);
        self.postMessage(blob);

        array = [];
    }
    else {
        console.log("else: ", event.data);
        array.push(event.data);
    }
});