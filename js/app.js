    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const winAlert = $('.winAlert');
    const loseAlert = $('.loseAlert');
    const newGameBtn = $('.newGameButton');
    const instruction = $('.instruction-container');
    const gameBoard = $('.game-container');

    let size = 3
    let width = 400 / 3 - 13;
    let boxes = [];

    let highScore = parseInt(localStorage.getItem('highScore')) || 0;
    const highScoreDisplay = $('#highscore');

    let score = 0;
    const scoreDisplay = $('#score');

    let end = false;

    function startGame() {
        end = false
        score = 0
        scoreDisplay.text(score)
        highScoreDisplay.text(highScore)
        document.getElementById('music').play()

        winAlert.slideUp()
        loseAlert.slideUp()
        newGameBtn.slideUp()

        instruction.slideUp()
        gameBoard.slideDown()
        createbox()
        drawAllBox()
        pasteNewBox()
    }

    function box(baris, kolom) {
        this.value = 0;
        this.x = kolom * width + 10 * (kolom + 1);
        this.y = baris * width + 10 * (baris + 1);
    }

    function createbox() {
        for (let i = 0; i < size; i++) {
            boxes[i] = []
            for (let j = 0; j < size; j++) {
                boxes[i][j] = new box(i, j)
            }
        }
    }

    function drawBox(box) {
        ctx.beginPath()

        ctx.rect(box.x, box.y, width, width)
        switch (box.value) {
            case 0:
                ctx.fillStyle = '#CEC1B5';
                break;
            case 2:
                ctx.fillStyle = '#EFE5DB';
                break;
            case 4:
                ctx.fillStyle = '#EEE1C8';
                break;
            case 8:
                ctx.fillStyle = '#F3B279';
                break;
            case 16:
                ctx.fillStyle = '#F59563';
                break;
            case 32:
                ctx.fillStyle = '#F77B5E';
                break;
            case 64:
                ctx.fillStyle = '#ffd900';
                break;
            case 128:
                ctx.fillStyle = '#a338a3';
                break;
        }

        ctx.fill()

        if (box.value) {
            ctx.font = `${width/2}px Arial`;
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'center';
            if (box.value == 2 || box.value == 4) {
                ctx.fillStyle = '#776E64';
            }
            ctx.fillText(box.value, box.x + width / 2, box.y + width / 2 + width / 7);
        }
    }

    function drawAllBox() {
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                drawBox(boxes[i][j]);
            }
        }
    }

    function pasteNewBox() {
        let kosong = 0;

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (boxes[i][j].value == 128) {
                    finishGame();
                    winAlert.slideDown()
                } else if (!boxes[i][j].value) {
                    kosong++
                }
            }
        }

        if (!kosong) {
            finishGame()
            loseAlert.html(`Game over!! <br> Your score is ${score}`)
            loseAlert.slideDown()
            return;
        }

        while (true) {
            let baris = Math.floor(Math.random() * size);
            let kolom = Math.floor(Math.random() * size);
            if (!boxes[baris][kolom].value) {
                boxes[baris][kolom].value = 2
                drawAllBox()
                return;
            }
        }
    }

    document.onkeydown = (keyboard) => {
        if (!end) {
            if (keyboard.key == 'ArrowUp' || keyboard.key == 'w') moveUp()
            else if (keyboard.key == 'ArrowRight' || keyboard.key == 'd') moveRight()
            else if (keyboard.key == 'ArrowDown' || keyboard.key == 's') moveDown()
            else if (keyboard.key == 'ArrowLeft' || keyboard.key == 'a') moveLeft()
            scoreDisplay.text(score)

            if (score > highScore) {
                highScore = score;
                localStorage.setItem('highScore', highScore)
                highScoreDisplay.text(highScore)
            }
        }
    }

    function moveRight() {
        for (let i = 0; i < size; i++) {
            for (let j = size - (size - 1); j >= 0; j--) {
                if (boxes[i][j].value) {
                    kolom = j

                    while (kolom + 1 < size) {
                        if (!boxes[i][kolom + 1].value) {
                            boxes[i][kolom + 1].value = boxes[i][kolom].value
                            boxes[i][kolom].value = 0
                            kolom++
                        } else if (boxes[i][kolom].value == boxes[i][kolom + 1].value) {
                            boxes[i][kolom + 1].value *= 2
                            boxes[i][kolom].value = 0
                            score += boxes[i][kolom + 1].value
                            break;
                        } else if (boxes[i][kolom + 1].value && boxes[i][kolom].value != boxes[i][kolom + 1]) {
                            kolom++
                        } else break;
                    }
                }
            }
        }

        pasteNewBox()
    }

    function moveLeft() {
        for (let i = 0; i < size; i++) {
            for (let j = size - (size - 1); j < size; j++) {
                if (boxes[i][j].value) {
                    kolom = j

                    while (kolom - 1 >= 0) {
                        if (!boxes[i][kolom - 1].value) {
                            boxes[i][kolom - 1].value = boxes[i][kolom].value
                            boxes[i][kolom].value = 0
                            kolom--
                        } else if (boxes[i][kolom].value == boxes[i][kolom - 1].value) {
                            boxes[i][kolom - 1].value *= 2
                            boxes[i][kolom].value = 0
                            score += boxes[i][kolom - 1].value
                            break;
                        } else break;
                    }
                }
            }
        }

        pasteNewBox()
    }

    function moveUp() {
        for (let j = 0; j < size; j++) {
            for (let i = size - (size - 1); i < size; i++) {
                if (boxes[i][j].value) {
                    baris = i

                    while (baris - 1 >= 0) {
                        if (!boxes[baris - 1][j].value) {
                            boxes[baris - 1][j].value = boxes[baris][j].value
                            boxes[baris][j].value = 0
                            baris--
                        } else if (boxes[baris][j].value == boxes[baris - 1][j].value) {
                            boxes[baris - 1][j].value *= 2
                            score += boxes[baris - 1][j].value
                            boxes[baris][j].value = 0
                            break
                        } else break
                    }
                }
            }
        }

        pasteNewBox()
    }

    function moveDown() {
        for (let j = 0; j < size; j++) {
            for (let i = size - (size - 1); i >= 0; i--) {
                if (boxes[i][j].value) {
                    baris = i

                    while (baris + 1 < size) {
                        if (!boxes[baris + 1][j].value) {
                            boxes[baris + 1][j].value = boxes[baris][j].value
                            boxes[baris][j].value = 0
                            baris++
                        } else if (boxes[baris][j].value == boxes[baris + 1][j].value) {
                            boxes[baris + 1][j].value *= 2
                            score += boxes[baris + 1][j].value
                            boxes[baris][j].value = 0
                            break
                        } else break
                    }
                }
            }
        }

        pasteNewBox()
    }

    function finishGame() {
        gameBoard.slideUp()
        end = true
        newGameBtn.slideDown()
    }