function shortestPathString(pathResult: { id: string }[]): string {
    let resultString = "";
    for (let index = 0; index < pathResult.length; index++) {
        const element = pathResult[index];
        if (index !== pathResult.length - 1) {
            resultString += element.id + "<-";
        } else {
            resultString += element.id;
        }
    }
    return resultString;
}

// Example usage to ensure the function is used
const examplePath = [{ id: "A" }, { id: "B" }, { id: "C" }];
console.log(shortestPathString(examplePath));