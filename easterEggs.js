document.querySelector('#secret-caller-ca').addEventListener('click', (e) => {
    const height = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
    spawnHanf(12, height);
    window.requestAnimationFrame(animateHanf);
});

function spawnHanf(rows, height) {
    for (let i = 0; i < rows; i++) {
        for (let i = 0; i < Math.floor(window.innerWidth / 128); i++) {
            const span = document.createElement('span');
            span.id = 'hanf-animate';
            span.style.left = (i) + 'px';
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
    console.log('called');
    [...document.querySelectorAll('#hanf-animate')].forEach(element => {
        if (Number(element.style.top.split('px')[0]) >= 0) {
            element.remove();
        }
        const top = `${Number(element.style.top.split('px')[0]) + Math.floor(Math.random() * 25)}px`;
        element.style.top = top;
    });
    if (next)
        window.requestAnimationFrame(animateHanf);
}