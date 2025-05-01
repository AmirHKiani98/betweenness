
function randomString(length: number): string {
    console.log("hi");
    return Array.from({ length }, () => Math.random().toString(36)[2]).join('');
}


export {randomString};
