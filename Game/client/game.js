//constants
const FIRST_PLAYER = 0;
const SECOND_PLAYER = 1;
const INITIAL_SCORE = 0;

//variables
var noOfBoxGame = 0;
var boxIndexes = [];
var noOfClick = 0;
var clickImages = [];
var timeOutRestore = 800;
var player1Name = "";
var player2Name = "";
var player1Score = INITIAL_SCORE;
var player2Score = INITIAL_SCORE;
var player1GamesWon = 0;
var player2GamesWon = 0;
var boardSize = 0;
var turn = 0;
var details;

//page load
$(function() {
    $.getJSON("config.json", function(data) {
        alert(data.size);
    })

    $("#canvas-game, #game-statistic, #players-names, #btnEnd").hide();

    $("#btnRestart").on("click", function() {
        Game.renderGameLayout();
    });
    $("#btnStart").on("click", function() {

        if ($('#boardSize').val() == 4) {
            $('#canvas-game').css('maxWidth', '700px');
            $('#canvas-game').css('maxHeight', '400px');
        }
        if ($('#boardSize').val() == 6) {
            $('#canvas-game').css('maxWidth', '1080px');
            $('#canvas-game').css('maxHeight', '520px');

        }
        saveNames();
    });

    $("#btnEnd").on("click", function() {
        player1GamesWon = 0;
        player2GamesWon = 0;
        player1Score = 0;
        player2Score = 0;
        $("#score1").text(player1GamesWon);
        $("#score2").text(player2GamesWon);
        location.reload();
    });

    $("#btnEndResult").on("click", function() {
        player1Score = 0;
        player2Score = 0;
        $("#score1").text(player1GamesWon);
        $("#score2").text(player2GamesWon);
        location.reload();
    });
});



function saveNames() {
    player1Name = document.getElementById("player1Name").value;
    player2Name = document.getElementById("player2Name").value;
    boardSize = parseInt(document.getElementById("boardSize").value);



    if (player1Name != "" && player2Name != "") {
        $("#error").text("")
        details = { player1: player1Name, player2: player2Name, size: boardSize };
        //render the game

        Game.renderGameLayout();
    } else {
        $("#error").text("** Please fill all the elements");
    }
}

//game class
Game = {

    //This will load the default game array and perform a shuffle
    initData: function() {

        for (var x = 0; x <= 1; x++) {
            for (var i = 0; i <= (noOfBoxGame / 2) - 1; i++) {
                boxIndexes.push(i);
            }
        }
        this.shuffleArray(boxIndexes);
    },

    //function to shuffle array
    shuffleArray: function(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    },


    buildGameBox: function() {
        var boxes = "";
        var boxCover = "";

        //load the images and image cover
        for (var i = 1; i <= noOfBoxGame; i++) {
            boxes += "<div id='box-" + i + "' class='box-picture'><img src='images/" + (parseInt(boxIndexes[i - 1]) + 1) + ".jpg'/></div>";
            boxCover += "<div id='box-cover-" + i + "' class='box-cover' data-id='" + (parseInt(boxIndexes[i - 1]) + 1) + "'></div>";
        }
        boxCover = "<div class='box-cover-wrapper'>" + boxCover + "</div>";

        $("#game-content").html(boxes + boxCover);
        $(".box-picture").show();


        //add event to click the box cover image
        $(".box-cover").off("click");
        $(".box-cover").on("click", function() {
            var name;
            var score;
            if (turn == FIRST_PLAYER) {
                name = player1Name;
                score = player1Score;
            } else {
                name = player2Name;
                score = player2Score;
            }



            if (noOfClick <= 1) {
                noOfClick++;
                $(this).addClass('animated flipOutX');

                var clickCover = {
                    ImageID: $(this).attr("data-id"),
                    CoverID: $(this).attr("id").replace("box-cover-", "")
                };
                clickImages.push(clickCover);

                if (noOfClick >= 2) {
                    //check if the revealed images are correct
                    var turnRewardCheck = new Promise((resolve, reject) => {
                        if (clickImages[0].ImageID == clickImages[1].ImageID && clickImages[0].CoverID !== clickImages[1].CoverID)
                            resolve(1);
                        else
                            reject(0);
                    });

                    turnRewardCheck.then((reward) => {
                        //	Increase score
                        $("#correct-guess").text(++score);
                        if (turn == FIRST_PLAYER)
                            player1Score++;
                        else
                            player2Score++;

                        //reset the variables
                        noOfClick = 0;
                        clickImages = [];

                        //if the game is completed then perform a reset
                        //	Winner is the first to find more than half of the pairs

                        var scoreToWin = (noOfBoxGame / 2) / 2;
                        if (score > scoreToWin) {
                            if (turn == 0)
                                $("#score1").text(++player1GamesWon);
                            else
                                $("#score2").text(++player2GamesWon);
                            $("#btnEnd").hide();
                            $("#canvas-game, #game-statistic").fadeOut(1000);
                            $("#game-message").addClass('animated bounceInDown').css('animation-delay', '1s').show();
                            $("#congrats").text(name + " won with " + score + " points!");
                            player1Score = INITIAL_SCORE;
                            player2Score = INITIAL_SCORE;
                            turn = 0;
                        }
                    }).catch((message) => {
                        //if not the same then close the image cover again.
                        setTimeout(function() {
                            clickImages.forEach(function(item, index) {
                                $("#box-cover-" + item.CoverID).removeClass("flipOutX").addClass('animated flipInX');
                            });
                            //reset
                            noOfClick = 0;
                            clickImages = [];

                            // Set next turn
                            turn = turn == FIRST_PLAYER ? SECOND_PLAYER : FIRST_PLAYER;
                            if (turn == FIRST_PLAYER) {
                                name = player1Name;
                                score = player1Score;
                            } else {
                                name = player2Name;
                                score = player2Score;
                            }
                            $("#player").text(name);
                            $("#correct-guess").text(score);

                        }, timeOutRestore);
                    })

                }
            }
        });
    },

    //function to call main functions to render the game
    renderGameLayout: function() {
        $("#game-message").hide();
        $("#game-form").hide();
        $("#canvas-game, #game-statistic, #players-names, #btnEnd").show();
        $("#name1").text(details.player1);
        $("#name2").text(details.player2);
        $("#player").text(player1Name);
        $("#correct-guess").text(player1Score);
        noOfBoxGame = details.size * details.size;

        this.initData();
        this.buildGameBox();
    }
}