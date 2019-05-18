/*
 * TODO
 * * 頂点を追加する操作中に右クリックするとundoされるようにする
 * * 頂点座標の移動を行えるようにする
 * * 多角形を移動できるようにする
 */
let inEditing = false;
let polygon = null;
let svg = document.querySelector("svg");
svg.addEventListener("dblclick", (ev) => {
    console.log("dblclick");
    let {x, y} = getRelativeCoordinate(ev);
    console.log(x, y);
    startPolygon(x, y);
    svg.appendChild(polygon);
});
svg.addEventListener("click", (ev) => {
    console.log("click");
    let {x, y} = getRelativeCoordinate(ev);
    appendPointToPolygon(polygon, x, y);
});
document.addEventListener("keydown", (ev) => {
    console.log("keydown");
    if (ev.keyCode !== 27) {
        return;
    }
    console.log("esc");
    endPolygon(polygon);
});

function getRelativeCoordinate(ev) {
    let rect = ev.target.getBoundingClientRect();
    // NOTE SVGの大きさをviewBoxで指定した場合に、下記ではSVG内に収まるような座標に調整できていない
    let x = ev.layerX - rect.x,
        y = ev.layerY - rect.y;

    return {x, y};
}

function createSVGElement(elemType) {
    return document.createElementNS("http://www.w3.org/2000/svg", elemType);
}

function startPolygon(x, y) {
    if (inEditing) {
        return;
    }
    inEditing = true;

    let p = createSVGElement("polygon");
    p.setAttribute("fill", "#ff000030");
    p.setAttribute("stroke", "#ff0000");
    p.setAttribute("marker-start", "url(#marker)");
    p.setAttribute("marker-mid", "url(#marker)");
    p.setAttribute("points", x + "," + y);
    polygon = p;
}

function appendPointToPolygon(polygon, x, y) {
    if (!inEditing) {
        return;
    }

    let points = polygon.getAttribute("points");
    polygon.setAttribute("points", points + " " + x + "," + y);
}

function endPolygon(polygon) {
    if (!inEditing) {
        return;
    }
    polygon = null;
    inEditing = false;
}
