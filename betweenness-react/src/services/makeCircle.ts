export function makeCircle(
    x: string,
    y: string,
    g_id: string,
    circle_id: string,
    radius: number = 0.1,
    stroke: number = 0.1,
    color: string = "yellow",
    customClass: string = "circle"
) {
    const g = document.getElementById(g_id);
    if (!g) {
        throw new Error(`Element with id ${g_id} not found`);
    }
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", radius.toString());
    circle.setAttribute("stroke", "green");
    circle.setAttribute("stroke-width", stroke.toString());
    circle.setAttribute("fill", color);
    circle.setAttribute("class", customClass);
    circle.setAttribute("id", "circle_" + circle_id);
    g.appendChild(circle);
}
