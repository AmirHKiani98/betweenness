function makeCircle(x, y, g_id, circle_id, radius = 0.1, stroke = 0.1, color = "yellow", customClass = "circle") {
    g = document.getElementById(g_id);
    var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", radius);
    circle.setAttribute("stroke", "green");
    circle.setAttribute("stroke-width", "" + stroke);
    circle.setAttribute("fill", color);
    circle.setAttribute("class", customClass);
    circle.setAttribute("id", "circle_" + circle_id);
    g.appendChild(circle);
}
module.exports = makeCircle;