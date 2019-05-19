/*
 * TODO
 * * 頂点座標の移動を行えるようにする
 * * 多角形を移動できるようにする
 * * 既存のpolygon内をクリックしたときに座標がズレる
 *   -> 座標の計算方法に問題がある
 */
let inEditing = false;
let polygon = null;
let svg = document.querySelector("svg");

svg.addEventListener("dblclick", (ev) => {
    let {x, y} = getRelativeCoordinate(ev);
    startPolygon(x, y);
    svg.appendChild(polygon);
});
svg.addEventListener("click", (ev) => {
    let {x, y} = getRelativeCoordinate(ev);
    addPoint(polygon, x, y);
});
svg.addEventListener("contextmenu", (ev) => {
    ev.preventDefault();
});
svg.addEventListener("mousedown", (ev) => {
    if (ev.button != 2) {
        return;
    }
    removeLastAddedPoint(polygon);
});
document.addEventListener("keydown", (ev) => {
    if (ev.keyCode !== 27) {
        return;
    }
    endPolygon(polygon);
});

function getRelativeCoordinate(ev) {
    let rect = ev.target.getBoundingClientRect();
    // NOTE SVGの大きさをviewBoxで指定した場合に、下記ではSVG内に収まるような座標に調整できていない
    // TODO 座標の計算方法の修正
    //      SVG内での相対座標を求めたい
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

function addPoint(polygon, x, y) {
    if (!inEditing) {
        return;
    }

    let points = polygon.getAttribute("points");
    polygon.setAttribute("points", points + " " + x + "," + y);
}

function getPoints(polygon) {
    return polygon.getAttribute("points").split(" ");
}

function removeLastAddedPoint(polygon) {
    if (!inEditing) {
        return;
    }

    let points = getPoints(polygon);
    polygon.setAttribute("points", points.slice(0, points.length - 1).join(" "));

    if (points.length < 2) {
        endEditing();
        return;
    }
}

function endPolygon(polygon) {
    if (!inEditing) {
        return;
    }
    // remove the polygon when the one with less than 3 vertices
    if (getPoints(polygon).length < 3) {
        polygon.parentNode.removeChild(polygon);
    }
    endEditing();
}

function endEditing() {
    polygon = null;
    inEditing = false;
}
