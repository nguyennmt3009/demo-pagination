var total = 0;
var currentPage = 1;
var pageCount = 5;
var offset = 0;
var limit = 5;
var searchBox = document.getElementById("search-text");

// Back end send data
function getData (o, l, s) {
    return new Promise((resolve, reject) => {
        let settings = {
            "url": "https://jsonplaceholder.typicode.com/todos",
            "method": "GET",
            "timeout": 0,
        };

        $.ajax(settings).done(function (response) {
            // searching
            response = response.filter((e) => e.title.includes(s));
            
            // pagination
            let start = l * o;
            let end = start + l;
            
            let result = response.slice(start, end);

            resolve({
                "data": result,
                "total": response.length
            });
        });
    });
}

// Front end receive data
async function reloadData (goToPage = offset) {
    offset = goToPage;
    currentPage = offset + 1;
    await getData(offset, limit, searchBox.value)
        .then(result => {
            document.getElementById("json").textContent = JSON.stringify(result.data, undefined, 2);
            total = result.total;

            createPaginationHTML();
        });
}

function search() {
    reloadData(0);
}

function createPaginationHTML() {
    let start = 0;
    let end = pageCount;

    let halfPage = Math.round(pageCount / 2);
    let totalPage = Math.ceil(total / limit);

    if (currentPage >= totalPage - halfPage) {
        start = totalPage - pageCount;
        end = totalPage;
    } else if (currentPage > halfPage) {
        start = currentPage - halfPage;
        end = start + pageCount;
    }

    const element = document.getElementById("page-list");

    // reset pagination
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }

    // ...
    if (start > 0) {
        let tag = document.createElement("input");
        tag.setAttribute("type", "button");
        tag.setAttribute("value", "...");
        tag.disabled = true;
        tag.style = "border: none;background-color: transparent;"
        element.appendChild(tag);
    }

    // render pagination
    for (let i = start < 0 ? 0 : start; i < end; i++) {
        let tag = document.createElement("input");
        tag.setAttribute("type", "button");
        tag.setAttribute("value", i + 1);
        tag.onclick = () => {
            reloadData(i);
        };
        if (currentPage == i + 1) {
            tag.disabled = true;
        }
        element.appendChild(tag);

    }

    // ...

    if (end != totalPage) {
        let tag = document.createElement("input");
        tag.setAttribute("type", "button");
        tag.setAttribute("value", "...");
        tag.disabled = true;
        tag.style = "border: none;background-color: transparent;"
        element.appendChild(tag);
    }
}

$("document").ready(async () => {
    await reloadData();
});