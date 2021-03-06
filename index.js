const stats_API_URL = 'https://github-stats.jodu555.de/api/lastCommit/Jodu555'
const projectStore = document.querySelector('#projectStore');
const bsOffcanvas = new bootstrap.Offcanvas(document.querySelector('#offcanvasScrolling'));

//              !!!!!!!!      Format: MONTH.DAY.YEAR HOUR:MINUTE      !!!!!!!!
const comingDate = new Date(Date.parse('12.11.2021 17:50'));
const coming_SOON = comingDate.getTime() - Date.now() > 0;

let quotes;
let quouteIdx;
let projects;
let projectIdx;

let lastUpdatedInfo;

if (coming_SOON) {
    document.querySelector('#normal').style.display = 'none';
} else {
    document.querySelector('#comingSoon').style.display = 'none';
}

setInterval(() => {
    renderStats();
}, 1000);

setInterval(() => {
    loadLastUpdateData();
}, 250000);

function renderStats() {
    if (coming_SOON) {
        if (comingDate.getTime() - Date.now() < 0) {
            window.location.reload();
            return;
        }
        animateCountDown('coming-soon-', comingDate.getTime(), true);
    } else {
        animateCountDown('first-repo-', new Date('6 Jun 2019 19:17').getTime());
        animateCountDown('last-commit-', lastUpdatedInfo ? lastUpdatedInfo.lastUpdated : new Date(-1).getTime());
    }
}

function animateCountDown(prefix, till, inverse) {
    const now = Date.now();
    let diff;
    if (inverse) {
        diff = till - now;
    } else {
        diff = now - till;
    }

    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    document.querySelector('#' + prefix + 'day').innerText = Math.floor(diff / day);
    document.querySelector('#' + prefix + 'hour').innerText = Math.floor((diff % day) / hour);
    document.querySelector('#' + prefix + 'minute').innerText = Math.floor((diff % hour) / minute);
    document.querySelector('#' + prefix + 'second').innerText = Math.floor((diff % minute) / second);

    document.querySelector('#' + prefix + 'day-show').innerText = Math.floor(diff / day) !== 1 ? 'Days' : 'Day';
    document.querySelector('#' + prefix + 'hour-show').innerText = Math.floor((diff % day) / hour) !== 1 ? 'Hours' : 'Hour';
    document.querySelector('#' + prefix + 'minute-show').innerText = Math.floor((diff % hour) / minute) !== 1 ? 'Minutes' : 'Minute';
    document.querySelector('#' + prefix + 'second-show').innerText = Math.floor((diff % minute) / second) !== 1 ? 'Seconds' : 'Second';

}
if (!coming_SOON)
    window.addEventListener('scroll', (e) => {
        var x = window.matchMedia("(max-width: 930px)");
        if (!x.matches) {
            const selector = '#about';
            if (isUnder(selector)) {
                bsOffcanvas.hide();
            }
            if (isOver(selector)) {
                bsOffcanvas.show();
            }
        } else {
            bsOffcanvas.hide();
        }
    });

function isOver(sel) {
    const rect = document.querySelector(sel).getBoundingClientRect();
    return rect.bottom < window.innerHeight;
}

function isUnder(sel) {
    const rect = document.querySelector(sel).getBoundingClientRect();
    return rect.top > window.innerHeight;
}

async function loadLastUpdateData() {
    const response = await fetch(stats_API_URL);
    const data = await response.json();
    lastUpdatedInfo = data.data.info;
}

if (!coming_SOON)
    //Load JSON Projects
    (async () => {
        loadLastUpdateData();

        const response = await fetch('projects.json');
        const data = await response.json();
        quotes = data.quotes;
        quouteIdx = 0;
        projectIdx = 0;

        data.projects.map(project => {
            let languages = [];
            const docElem = new DOMParser().parseFromString(project.description, 'text/html').documentElement;
            docElem.querySelectorAll('*').forEach(element => {
                if (element.nodeName == 'SPAN')
                    languages = languages.concat([...element.classList])
            });
            project.languages = languages;
        })

        projects = data.projects.chunkIt(4);


        loadMoreProjects();
    })();

function loadMoreProjects() {
    document.querySelector('#loadmoreBtn') && document.querySelector('#loadmoreBtn').remove();
    let currentRow;
    let i = 0;
    if (projectIdx >= projects.length)
        projectIdx = 0;
    projects[projectIdx].forEach((project) => {
        i++;
        if ((!currentRow) || i % 2 !== 0 && i != 1) {
            currentRow = document.createElement('div');
            currentRow.classList.add('row');
            projectStore.appendChild(currentRow);
        }

        if (i == projects[projectIdx].length)
            insertQuote(projectStore);

        appendProject(currentRow, project, i);
    });
    if (!(projects.length <= projectIdx + 1))
        addLoadMoreProjectsButton(projectStore);

}

function addLoadMoreProjectsButton(element) {
    const div = document.createElement('div');
    div.classList.add('text-center');
    div.style.marginTop = '10vh';
    div.setAttribute('data-aos', 'fade-down');
    const button = document.createElement('button');
    button.id = 'loadmoreBtn';
    button.classList.add('btn')
    button.classList.add('btn-outline-primary')
    button.innerText = 'Load More';
    div.appendChild(button);
    element.appendChild(div)
    button.addEventListener('click', () => {
        projectIdx++;
        loadMoreProjects();
    })
}

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

manageHash();

function manageHash() {
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
        history.pushState("", document.title, loc.pathname + loc.search + loc.hash);
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

function cleanup() {
    localStorage.setItem('specialDays', JSON.stringify([]));
}