function map(value, in_min, in_max, out_min, out_max) {
    const calc = (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    return calc;
}

document.querySelector('#secret-caller-ca').addEventListener('click', (e) => {
    const height = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
    spawnHanf(10, height);
    window.requestAnimationFrame(animateHanf);
});

document.querySelector('#secret-caller-lig').addEventListener('click', (e) => {
    const height = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
    spawnLightsaber(height);
    window.requestAnimationFrame(animateLightsaber);
});

function spawnLightsaber(height) {
    const img = document.createElement('img');
    img.src = '/images/lightsaber.png';
    img.width = window.innerWidth * 0.9;
    img.height = window.innerHeight;
    img.style.top = `-${height + (img.height / 4)}px`;
    img.style.left = (window.innerWidth - (img.width - img.width / 2)) + 'px';
    img.style.position = 'relative';
    img.style.transform = `rotateZ(270deg)`;
    img.id = 'lightsaber-animate';
    document.body.appendChild(img);
}

function animateLightsaber() {
    let next = true;
    if ([...document.querySelectorAll('#lightsaber-animate')].length == 0)
        next = false;

    [...document.querySelectorAll('#lightsaber-animate')].forEach(element => {
        if (Number(element.style.left.split('px')[0]) <= -(element.width * 4)) {
            element.remove();
        }
        const left = `${Number(element.style.left.split('px')[0]) - Math.floor(Math.random() * 150) + 10}px`;
        element.style.left = left;
        const rotate = `rotateZ(${Number(element.style.left.split('px')[0]) / (4 * 4)}deg)`;
        // console.log(rotate);
        element.style.transform = rotate;

        //TODO: let the lightsaber drop down and rotate it like it would hit

        // let deg = element.getAttribute('data-rotation') || 0;
        // deg > 360 && (deg = 0);
        // Math.floor(Math.random() * 4) == 2 && (deg += 1);
        // element.style.transform = `rotateZ(${deg}deg)`;
        // element.removeAttribute('data-rotation');
        // element.setAttribute('data-rotation', deg);
        // const top = `${Number(element.style.top.split('px')[0]) + Math.floor(Math.random() * 55)}px`;
        // element.style.top = top;
    });
    if (next)
        window.requestAnimationFrame(animateLightsaber);
}

function spawnHanf(rows, height) {
    for (let i = 0; i < rows; i++) {
        for (let i = 0; i < Math.floor(window.innerWidth / 128); i++) {
            const span = document.createElement('span');
            span.id = 'hanf-animate';
            const left = map(Math.floor(Math.random() * 15) + 128, 0, 200, 0, (window.innerWidth / 128));
            span.style.left = (left) + 'px';
            span.style.top = `-${height + (rows * 128)}px`;
            span.style.position = 'relative';

            const img = document.createElement('img');
            img.src = '/images/canna.svg';
            img.width = '128';
            img.height = '128';

            span.appendChild(img);
            document.body.appendChild(span);
        }
    }
}

function animateHanf() {
    let next = true;
    if ([...document.querySelectorAll('#hanf-animate')].length == 0)
        next = false;
    [...document.querySelectorAll('#hanf-animate')].forEach(element => {
        if (Number(element.style.top.split('px')[0]) >= 0) {
            element.remove();
        }
        const top = `${Number(element.style.top.split('px')[0]) + Math.floor(Math.random() * 55)}px`;
        element.style.top = top;
    });
    if (next)
        window.requestAnimationFrame(animateHanf);
}


const emojis = ['💙', '💚', '💜', '🎇', '🎉', '🚀', '🎶', '💖'];

function appendEmoji(setEmoji) {
    const emoji = document.createElement('div');
    emoji.classList.add('emoji');
    emoji.style.left = Math.random() * 100 + 'vw';
    emoji.style.animationDuration = Math.random() * 2 + 1 + 's';
    emoji.style.fontSize = Math.floor(Math.random() * 20) + 20 + 'px';
    if (setEmoji) {
        if (!Array.isArray(setEmoji)) {
            emoji.innerText = setEmoji;
        } else {
            emoji.innerText = setEmoji[Math.floor(Math.random() * setEmoji.length)]
        }

    } else {
        emoji.innerText = emojis[Math.floor(Math.random() * emojis.length)];
    }

    document.body.appendChild(emoji);
    setTimeout(() => {
        emoji.remove();
    }, 5000);
}

const specialList = [
    {
        title: 'New Year',
        swalEmojis: '🎇✨🎈🧨',
        emojis: ['🚀', '🎇', '⏳', '🧨', '🎆', '⌛', '👑', '🎈'],
        is: () => isNewYear(),
    },
    {
        title: 'Birthday',
        swalEmojis: '🎉🎂🎁💙',
        concatText: 'me',
        emojis: ['🎉', '🎇', '💖', '🎶', '🍰', '💙', '🎂', '✨', '🎁', '🎄', '👑', '🎈'],
        is: () => isBirthday(),
    }
]

//TODO: Store the seen in a cookie so it dont comes every time the page gots loaded

let time;
let iterations = 0;

handleSpecialDays();

function handleSpecialDays() {
    if (!localStorage.getItem('specialDays'))
        localStorage.setItem('specialDays', JSON.stringify([]));

    // Handle Remove
    const storageArray = JSON.parse(localStorage.getItem('specialDays'));
    storageArray.forEach(itemTitle => {
        const item = specialList.find(e => e.title == itemTitle);
        if (!item.is())
            localStorage.setItem('specialDays', JSON.stringify(storageArray.filter(e => e.title == itemTitle)));
        console.log(item);
    });

    const item = specialList.filter(e => e.is())[0];
    if (!item) return;

    //Handle Already seen
    if (storageArray.includes(item.title))
        return;

    Swal.fire({
        title: `<h1 style="font-size: 4rem;" class="diary">Its ${item.title}!</h1>`,
        icon: 'success',
        html: `<h1 style="font-size: 5rem;">${item.swalEmojis}</h1>`,
        showCloseButton: true,
        focusConfirm: false,
        confirmButtonText: `<i class="fa fa-thumbs-up"></i> well < better < ${item.concatText ? item.concatText : item.title} !`,
    }).then((result) => {
        console.log(result);
        localStorage.setItem('specialDays', JSON.stringify([...storageArray, item.title]));
        window.requestAnimationFrame(() => render(item));
    });
}

function render(item) {
    iterations++;
    if (time) {
        const delta = Date.now() - time;
        const iter = Math.floor(delta / 10);
        for (let i = 0; i < iter; i++) {
            appendEmoji(item.emojis);
        }
    }
    time = Date.now();
    // console.log(iterations);
    if (iterations > (item.stop || 100)) return;
    window.requestAnimationFrame(() => render(item));
}


function isBirthday() {
    // return true;
    const current = new Date(Date.now());
    return current.getMonth() == 11 && current.getDate() == 25;
}

function isNewYear() {
    // return true;
    const current = new Date(Date.now());
    return current.getMonth() == 0 && current.getDate() == 1 || current.getMonth() == 11 && current.getDate() == 31;
}