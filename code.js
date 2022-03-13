let width = Math.round(document.querySelector('body').clientWidth / 16 / 2) - 1;
let height = Math.round(document.querySelector('body').clientHeight / 16 / 2) - 1;
console.log(width, height);
setTimeout(() => {
    let maze = new MazeBuilder(width, height);
    //maze.placeKey();
    maze.display("maze_container");

    // place ball at entrance
    document.querySelector('#ball').style.top = document.querySelector('.entrance').offsetTop + "px";
    document.querySelector('#ball').style.left = document.querySelector('.entrance').offsetLeft + "px";
    window.BALL.x = document.querySelector('.entrance').offsetLeft;
    window.BALL.y = document.querySelector('.entrance').offsetTop;

    window.BLOCKS = document.querySelectorAll('div#maze > div > div')

}, 500)

window.BALL = {
    x: 0,
    y: 0,
    speed: 2
}

window.INCREMENT = 2;
window.ACCELLERATION = 2;
window.MAXSPEED = 10;

window.LASTVISITED = false;

window.DIRECTION = 'u';

window.isInWall = (x, y, wall) => {
    if (
        x > wall.offsetLeft &&
        x < wall.offsetLeft + 16 &&
        y > wall.offsetTop &&
        y < wall.offsetTop + 16
    ) {
        console.log('inside a wall');
        return true;
    }
    return false;
}

window.moveToPosition = (x, y) => {
    document.querySelector('#ball').style.top = y + "px";
    document.querySelector('#ball').style.left = x + "px";
    window.BALL.x = x;
    window.BALL.y = y;
}

window.getSurroundingBlocks = () => {
    let neighbors = [];
    // console.log(neighbors);
    window.BLOCKS.forEach((element, index) => {

        if (
            window.isInWall(window.BALL.x, window.BALL.y, element) ||
            window.isInWall(window.BALL.x, window.BALL.y + 10, element) ||
            window.isInWall(window.BALL.x + 10, window.BALL.y, element) ||
            window.isInWall(window.BALL.x + 10, window.BALL.y + 10, element)
        ) {
            let index = [...element.parentElement.children].indexOf(element);
            //[...element.parentElement.children].forEach((el, i) => {
            //    if (element == el) {
            //        index = i;
            //    }
            //})
            // same row
            //console.log(element);
            //console.log(element.previousElementSibling);
            //qconsole.log(element.nextElementSibling);

            if (element.previousElementSibling) {
                neighbors[3] = element.previousElementSibling;
            }
            if (element.nextElementSibling) {
                neighbors[4] = element.nextElementSibling;
            }

            // prev row
            if (element.parentElement.previousElementSibling) {
                //qconsole.log(element.parentElement.previousElementSibling.children[index]);
                //qconsole.log(element.parentElement.previousElementSibling.children[index - 1]);
                //qconsole.log(element.parentElement.previousElementSibling.children[index + 1]);

                if (element.parentElement.previousElementSibling.children[index]) {
                    neighbors[1] = element.parentElement.previousElementSibling.children[index];
                }
                //if (element.parentElement.previousElementSibling.children[index - 1]) {
                //    //neighbors[0] = element.parentElement.previousElementSibling.children[index-1];
                //}
                //if (element.parentElement.previousElementSibling.children[index + 1]) {
                //    //neighbors[2] = element.parentElement.previousElementSibling.children[index+1];
                //}

            }
            // next row
            if (element.parentElement.nextElementSibling) {
                //qconsole.log(element.parentElement.nextElementSibling.children[index]);
                //qconsole.log(element.parentElement.nextElementSibling.children[index - 1]);
                //qconsole.log(element.parentElement.nextElementSibling.children[index + 1]);

                if (element.parentElement.nextElementSibling.children[index]) {
                    neighbors[6] = element.parentElement.nextElementSibling.children[index];
                }
                //if (element.parentElement.nextElementSibling.children[index - 1]) {
                //    //neighbors[5] = element.parentElement.nextElementSibling.children[index-1];
                //}
                //if (element.parentElement.nextElementSibling.children[index + 1]) {
                //    //neighbors[7] = element.parentElement.nextElementSibling.children[index+1];
                //}
            }
        }
    })
    return neighbors;
}

window.convertPrio = (prio) => {
    if (window.DIRECTION == 'u') {
        return prio;
    } else if (window.DIRECTION == 'l') {
        // 1 = 3
        // 3 = 6
        // 6 = 4
        // 4 = 1
        switch (prio) {
            case 1:
                return 3;
                break;
            case 3:
                return 6;
                break;
            case 6:
                return 4;
                break;
            case 4:
                return 1;
                break;
        }
    } else if (window.DIRECTION == 'r') {
        switch (prio) {
            case 1:
                return 4;
                break;
            case 3:
                return 1;
                break;
            case 6:
                return 3;
                break;
            case 4:
                return 6;
                break;
        }
    } else {
        switch (prio) {
            case 1:
                return 6;
                break;
            case 3:
                return 4;
                break;
            case 6:
                return 1;
                break;
            case 4:
                return 3;
                break;
        }
    }
}

window.move = () => {
    let neighbors = window.getSurroundingBlocks()
    neighbors.forEach(item => {
        if ([...item.classList].includes('exit')) {
            // clearInterval(window.startMovement)
            window.started = false
            alert("you won")
        }
    })

    console.log('prevDir:', window.DIRECTION);

    if (![...neighbors[window.convertPrio(4)].classList].includes('wall') && window.LASTVISITED != neighbors[window.convertPrio(4)]) {
        window.moveToPosition(neighbors[window.convertPrio(4)].offsetLeft, neighbors[window.convertPrio(4)].offsetTop)
        window.LASTVISITED = neighbors[window.convertPrio(4)]
        // go right
        switch (window.DIRECTION) {
            case 'u':
                window.DIRECTION = 'r'
                break;
            case 'r':
                window.DIRECTION = 'd'
                break;
            case 'd':
                window.DIRECTION = 'l'
                break;
            case 'l':
                window.DIRECTION = 'u'
                break;
        }
        console.log('move right');
    } else if (![...neighbors[window.convertPrio(1)].classList].includes('wall') && window.LASTVISITED != neighbors[window.convertPrio(1)]) {
        window.moveToPosition(neighbors[window.convertPrio(1)].offsetLeft, neighbors[window.convertPrio(1)].offsetTop)
        window.LASTVISITED = neighbors[window.convertPrio(1)]

        // window.DIRECTION = 'u' stays the same
        console.log('move up');

    } else if (![...neighbors[window.convertPrio(3)].classList].includes('wall') && window.LASTVISITED != neighbors[window.convertPrio(3)]) {
        window.moveToPosition(neighbors[window.convertPrio(3)].offsetLeft, neighbors[window.convertPrio(3)].offsetTop)
        window.LASTVISITED = neighbors[window.convertPrio(3)]

        switch (window.DIRECTION) {
            case 'u':
                window.DIRECTION = 'l'
                break;
            case 'r':
                window.DIRECTION = 'u'
                break;
            case 'd':
                window.DIRECTION = 'r'
                break;
            case 'l':
                window.DIRECTION = 'd'
                break;
        }
        console.log('move left');

        //window.DIRECTION = 'l'

    } else {
        window.moveToPosition(neighbors[window.convertPrio(6)].offsetLeft, neighbors[window.convertPrio(6)].offsetTop)
        window.LASTVISITED = neighbors[window.convertPrio(6)]


        switch (window.DIRECTION) {
            case 'u':
                window.DIRECTION = 'd'
                break;
            case 'r':
                window.DIRECTION = 'l'
                break;
            case 'd':
                window.DIRECTION = 'u'
                break;
            case 'l':
                window.DIRECTION = 'r'
                break;
        }
        console.log('move down');

        //window.DIRECTION = 'd'

    }

    console.log('afterDir:', window.DIRECTION);
    if (window.started) {
        window.requestAnimationFrame(window.move);
    }
}

document.addEventListener('keypress', event => {
    //console.log(event);
    let ball = document.querySelector('#ball');

    let newX = window.BALL.x;
    let newY = window.BALL.y;
    let speed = window.BALL.speed;

    switch (event.key) {
        //case 'w':
        //case 'ArrowUp':
        //    // move up
        //    newY -= speed;
        //    break;
        //case 's':
        //case 'ArrowDown':
        //    // move down
        //    newY += speed;
        //    break;
        //case 'a':
        //case 'ArrowLeft':
        //    // move left
        //    newX -= speed;
        //    break;
        //case 'd':
        //case 'ArrowRight':
        //    // move right
        //    newX += speed;
        //    break;
        case 'q':
            // always go right
            if (window.started) {
                //clearInterval(window.startMovement)
                window.started = false
            } else {
                window.started = true;
                window.requestAnimationFrame(window.move);
                //window.startMovement = setInterval(() => {
                //    window.started = true;
                //    window.move()
                //}, 25)
            }

            break;
    }

    //let canMove = true;
    //
    //document.querySelectorAll('.wall').forEach((element, index) => {
    //
    //    if (
    //        window.isInWall(newX, newY, element) ||
    //        window.isInWall(newX, newY + 10, element) ||
    //        window.isInWall(newX + 10, newY, element) ||
    //        window.isInWall(newX + 10, newY + 10, element)
    //    ) {
    //        canMove = false;
    //    }
    //})
    //
    //// check for key
    //let key = document.querySelector('.key');
    //if (key) {
    //    if (
    //        window.isInWall(newX, newY, key) ||
    //        window.isInWall(newX, newY + 10, key) ||
    //        window.isInWall(newX + 10, newY, key) ||
    //        window.isInWall(newX + 10, newY + 10, key)
    //    ) {
    //        alert('you got the key, now get to the end!')
    //        key.classList.remove('key');
    //    }
    //}
    //
    //// check for door
    //let door = document.querySelector('.exit');
    //
    //if (
    //    window.isInWall(newX, newY, door) ||
    //    window.isInWall(newX, newY + 10, door) ||
    //    window.isInWall(newX + 10, newY, door) ||
    //    window.isInWall(newX + 10, newY + 10, door)
    //) {
    //    if (key == null) {
    //        alert('you made it to the end, congratulations!')
    //    } else {
    //        alert('you need the key to escape!')
    //    }
    //}
    //
    //
    //
    //if (canMove) {
    //    window.BALL.x = newX;
    //    window.BALL.y = newY;
    //    ball.style.top = newY + "px";
    //    ball.style.left = newX + "px";
    //    if (window.MAXSPEED > window.BALL.speed * window.ACCELLERATION) {
    //        // window.BALL.speed *= window.ACCELLERATION
    //    }
    //
    //}

})

document.addEventListener('mousemove', event => {
    //console.log(event.clientX, event.clientY);
    document.querySelectorAll('.wall').forEach((element, index) => {

        window.isInWall(event.clientX, event.clientY, element)



    })


})

document.addEventListener('mousedown', (event) => {
    //console.log(event.clientX, event.clientY);
    //console.log(document.querySelectorAll('.wall')[0].offsetLeft, document.querySelectorAll('.wall')[0].offsetTop);
    //console.log(event);
    if (event.button == 2) {
        window.moveToPosition(event.clientX, event.clientY);
    }
})