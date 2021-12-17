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
    emoji.style.animationDuration = Math.random() * 2 + 2 + 's';
    emoji.style.fontSize = Math.floor(Math.random() * 20) + 20 + 'px';
    if (!setEmoji) emoji.innerText = emojis[Math.floor(Math.random() * emojis.length)];
    if (setEmoji) emoji.innerText = setEmoji;

    document.body.appendChild(emoji);
    setTimeout(() => {
        emoji.remove();
    }, 5000);
}



let time;

let emoji = null; '🚀'

// window.requestAnimationFrame(render);


function render() {
    if (time) {
        const delta = Date.now() - time;

        const iter = Math.floor(delta / 10);
        for (let i = 0; i < iter; i++) {
            appendEmoji(emoji);
        }
    }
    time = Date.now();
    window.requestAnimationFrame(render);
}

console.log(isBirthday());

function isBirthday() {
    const current = new Date(Date.now());
    return current.getMonth() == 11 && current.getDate() == 25;
}

function isNewYear() {
    const current = new Date(Date.now());
    return current.getMonth() == 0 && current.getDate() == 1 || current.getMonth() == 11 && current.getDate() == 31;
}