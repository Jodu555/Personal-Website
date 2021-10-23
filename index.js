const projectStore = document.querySelector('#projectStore');
const bsOffcanvas = new bootstrap.Offcanvas(document.querySelector('#offcanvasScrolling'));

let quotes;
let quouteIdx;

window.addEventListener('scroll', (e) => {
    const selector = '#sidenav-trigger';
    if (isElementInView(selector)) {
        bsOffcanvas.hide();
    }
    if (isScrolledIntoView(selector)) {
        bsOffcanvas.show();
    }
})

function isScrolledIntoView(sel) {
    const rect = document.querySelector(sel).getBoundingClientRect();
    const isVisible = (rect.top >= 0) && (rect.bottom <= window.innerHeight);
    return isVisible;
}

function isElementInView(sel) {
    var rect = document.querySelector(sel).getBoundingClientRect();
    return rect.top > window.innerHeight;
}

(async () => {
    const response = await fetch('projects.json');
    const data = await response.json()
    quotes = data.quotes;
    quouteIdx = 0;
    const projects = data.projects;
    let i = 0;
    let currentRow;
    projects.forEach((project) => {
        i++;
        if ((!currentRow) || i % 2 !== 0 && i != 1) {
            currentRow = document.createElement('div');
            currentRow.classList.add('row');
            projectStore.appendChild(currentRow);
        }
        if (i % 4 == 0 && i != projects.length)
            insertQuote(projectStore);

        appendProject(currentRow, project, i);
    });

})();

function insertQuote(element) {
    const h3 = document.createElement('h3');
    h3.classList.add('text-center');
    h3.classList.add('diary');
    h3.style.marginTop = '3vh';
    h3.style.marginBottom = '4.5vh';
    h3.setAttribute('data-aos', 'fade-up');
    h3.innerHTML = quotes[quouteIdx];
    element.append(h3);
    quouteIdx++;
}

removeHash();

function removeHash() {
    const loc = window.location
    let scrollV, scrollH;
    if (loc.hash.includes('ext-')) {
        loc.hash = loc.hash.split('ext-')[1];
    } else {
        scrollV = document.body.scrollTop;
        scrollH = document.body.scrollLeft;
        loc.hash = '';
        document.body.scrollTop = scrollV;
        document.body.scrollLeft = scrollH;
    }
    if ("pushState" in history) {
        history.pushState("", document.title, loc.pathname + loc.search);
    }
}

function appendProject(row, project, i) {
    const col = document.createElement('div');
    col.classList.add('col');
    const pos = i % 2 !== 0 ? 'right' : 'left';
    col.setAttribute('data-aos', 'fade-' + pos);


    col.innerHTML = `
        <div class="card mb-3" style="max-width: 540px">
            <div class="row g-0">
                <div class="col-md-4">
                    ${project.icon ? `<div class="text-center"><img
                        src="${project.lText}"
                        style="width: 50%; transform: translateY(calc(100% - 30%))"
                        class="img-fluid rounded-start"
                        alt="..."
                        /></div>`
            : `<h1 class="text-center" ${project.lText.length > 8 ? '' : 'style="transform: translateY(calc(100% - -50%))"'}>${project.lText}</h1>`}
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">${project.title}</h5>
                        <p class="card-text">
                            ${project.description}
                        </p>
                        <a
                            href="${project.ghLink}"
                            target="_blank"
                            class="btn btn-outline-info"
                            >GitHub Page</a
                        >
                        ${project.pLink ? `<a
                        href="${project.pLink}"
                        target="_blank"
                        class="btn btn-outline-info"
                        >Project Page</a
                    >` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
    row.appendChild(col);
}