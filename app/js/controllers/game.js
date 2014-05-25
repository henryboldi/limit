'use strict';

function Game(data) {
  if (data) {
    this.data = data;
  } else {
    this.data = {
      winner: null,
      whoseTurn: null,
      player1: null,
      player2: null,
      player3: null,
      player4: null,
      disconnected: {},
      title: "Awaiting players ...",
      board: [['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ], ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ], ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ], ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ], ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ], ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ], ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ], ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ], ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ], ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ], ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ], ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ], ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ], ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ], ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ], ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ], ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ], ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ], ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ], ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ]]
    };
  }
}

Game.prototype = {
  addPlayer: function(player) {
    if (this.data.player1 != null && this.data.player2 != null && this.data.player3 != null && this.data.player4 != null) return;
    if (this.data.player1 == null) {
      this.data.player1 = player;
      this.data.whoseTurn = this.data.player1;
    } else if (this.data.player2 == null) {
      this.data.player2 = player;
    } else if (this.data.player3 == null) {
      this.data.player3 = player;
    } else if (this.data.player3 == null) {
      this.data.player3 = player;
    }
  },
  title: function() {
    if ( this.isTie() ) {
      this.data.title = "It's a tie!"
    } else if (this.data.winner) {
      this.data.title = this.data.winner + " won!";
    } else {
      if (this.data.player1 != null) {
        this.data.title = this.data.player1 + " vs. ";
        if (this.data.player2 != null) {
          this.data.title = this.data.title + this.data.player2;
        } else {
          this.data.title = this.data.title + "(awaiting 2nd player)";
        }
        if (this.data.player3 != null) {
          this.data.title = this.data.title + this.data.player3;
        } else {
          this.data.title = this.data.title + "(awaiting 3nd player)";
        }
        if (this.data.player4 != null) {
          this.data.title = this.data.title + this.data.player4;
        } else {
          this.data.title = this.data.title + "(awaiting 4th player)";
        }
      }
    }
    return this.data.title;
  },
  board: function() {
    return this.data.board;
  },
  setConnected: function(player) {
    if (!this.data.disconnected) {
      this.data.disconnected = {};
    }
    this.data.disconnected[player] = false;
  },
  isAbandoned: function() {
    if (!this.data.disconnected) return false;
    var numPlayers = 0;
    if (this.data.player1) numPlayers++;
    if (this.data.player2) numPlayers++;
    if (this.data.player3) numPlayers++;
    if (this.data.player4) numPlayers++;
    var numDisconnected = 0;
    for (var k in this.data.disconnected) {
      if (this.data.disconnected[k]) numDisconnected++;
    }
    return (numDisconnected == numPlayers);
  },
  isTie: function() {
    for (var row in [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]) {
      for (var col in [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]) {
        if (this.data.board[row][col] === '') return false;
      }
    }
    return true;
  },
  isOver: function() {
    return (this.isTie() || this.data.winner != null);
  },
  isPlayersTurn: function(player) {
    return this.data.whoseTurn === player;
  },
  playerForMark: function(mark) {
    if (mark === 'A') {
      return this.data.player1;
    } else if (mark === 'B') {
      return this.data.player2;
    }
    else if (mark === 'C'){
      return this.data.player3;
    } else if (mark === 'D') {
      return this.data.player4;
    }
  },
  markForPlayer: function(player) {
    if (player == this.data.player1) {
      return 'A';
    } else if (player == this.data.player2) {
      return 'B';
    } else if (player == this.data.player3) {
      return 'C';
    } else if (player == this.data.player4) {
      return 'D';
    }
  },
  nextPlayerToMove: function(player) {
    if (player == this.data.player1) {
      return this.data.player2;
    } else if (player == this.data.player2) {
      return this.data.player3;
    }
     else if (player == this.data.player3) {
      return this.data.player4;
    
    } else if (player == this.data.player4) {
      return this.data.player1;
    }
    
  },
  move: function(player, row, col) {
    if ( this.isOver() ) return;
    if ( !this.isPlayersTurn(player) ) return;
    if (row < 0 || row > 2 || col < 0 || col > 2) return;
    if (this.data.board[row][col] != '') return;

    this.data.board[row][col] = this.markForPlayer(player);
    this.data.whoseTurn = this.nextPlayerToMove(player);
    this.data.winner = this.checkForWinner();
  },
  checkForWinner: function() {
    var b = this.data.board;
    //--------------
    // ROW WINS:
    //--------------
    // 0,0  0,1  0,2
    // 1,0  1,1  1,2
    // 2,0  2,1  2,2
    //--------------


    var name = "";
    var ocurrences = new Array(3);
    var letters = "ABCD"; 

    firstForLoop: for(var i = 0;i < b.length;i++){
      for(var j = 0;j < b[0].length;j++){
        //Left to Right
        if (i>=(b.length-3) || j>=(b.length-3)) {break firstForLoop;};
        for (var k = 0; i < 3; i++) {
           name+=b[i+k][j];   
        };

        for (var n = 0; n <= name.length; n++) {
          if (name.length != 4) {
            name = "";
            break;
          }
          else {
            if (name.charAt(n) === 'A') {
              ocurrences[0]++; 
            }
            if (name.charAt(n) === 'B') {
              ocurrences[1]++; 
            }
            if (name.charAt(n) === 'C') {
              ocurrences[2]++; 
            }
            if (name.charAt(n) === 'D') {
              ocurrences[3]++; 
            }
          }
          for (var g = 0; g < ocurrences.length;g++) {
            if(ocurrences[g] == 4){
             return playerForMark(letters.charAt(g));
            }
          };
        }

        //Up to Down
        for (var k = 0; i < 3; i++) {
           name+=b[i][j+k];
        }


        for (var n = 0; n <= name.length; n++) {
          if (name.length != 4) {
            name = "";
            break;
          }
          else {
            if (name.charAt(n) === 'A') {
              ocurrences[0]++; 
            }
            if (name.charAt(n) === 'B') {
              ocurrences[1]++; 
            }
            if (name.charAt(n) === 'C') {
              ocurrences[2]++; 
            }
            if (name.charAt(n) === 'D') {
              ocurrences[3]++; 
            }
          }
          for (var g = 0; g < ocurrences.length;g++) {
            if(ocurrences[g] == 4){
             return playerForMark(letters.charAt(g));
            }
          };
        }

        
        //Diagonal
        for (var k = 0; i < 3; i++) {
           name+=b[i+k][j+k]; 
        }

        for (var n = 0; n <= name.length; n++) {
          if (name.length != 4) {
            name = "";
            break;
          }
          else {
            if (name.charAt(n) === 'A') {
              ocurrences[0]++; 
            }
            if (name.charAt(n) === 'B') {
              ocurrences[1]++; 
            }
            if (name.charAt(n) === 'C') {
              ocurrences[2]++; 
            }
            if (name.charAt(n) === 'D') {
              ocurrences[3]++; 
            }
          }
          for (var g = 0; g < ocurrences.length;g++) {
            if(ocurrences[g] == 4){
             return playerForMark(letters.charAt(g));
            }
          };
        }
      }
    }

    
    // if (b[0][0] != '' && b[0][0] === b[0][1] && b[0][1] === b[0][2]) {
    //   return this.playerForMark(b[0][0]);
    // } else if (b[1][0] != '' && b[1][0] === b[1][1] && b[1][1] === b[1][2]) {
    //   return this.playerForMark(b[1][0]);
    // } else if (b[2][0] != '' && b[2][0] === b[2][1] && b[2][1] === b[2][2]) {
    //   return this.playerForMark(b[2][0]);
    // }

    // //--------------
    // // COL WINS:
    // //--------------
    // // 0,0  1,0  2,0
    // // 0,1  1,1  2,1
    // // 0,2  1,2  2,2
    // //--------------
    // if (b[0][0] != '' && b[0][0] === b[1][0] && b[1][0] === b[2][0]) {
    //   return this.playerForMark(b[0][0]);
    // } else if (b[0][1] != '' && b[0][1] === b[1][1] && b[1][1] === b[2][1]) {
    //   return this.playerForMark(b[0][1]);
    // } else if (b[0][2] != '' && b[0][2] === b[1][2] && b[1][2] === b[2][2]) {
    //   return this.playerForMark(b[0][2]);
    // }

    // //--------------
    // // DIAG WINS:
    // //--------------
    // // 0,0  1,1  2,2
    // // 0,2  1,1  2,0
    // //--------------
    // if (b[0][0] != '' && b[0][0] === b[1][1] && b[1][1] === b[2][2]) {
    //   return this.playerForMark(b[0][0]);
    // } else if (b[0][2] != '' && b[0][2] === b[1][1] && b[1][1] === b[2][0]) {
    //   return this.playerForMark(d);
    // } else {
    //   // NO WINNER
    //   return null;
    // }    
  }
}


angular.module('ticTacToe.controllers.game', ['firebase', 'ngCookies'])  
  .controller('GameCtrl',
    ['$scope', '$routeParams', '$location', '$cookies', 'angularFire', 'angularFireCollection',
    function($scope, $routeParams, $location, $cookies, angularFire, angularFireCollection) {
      $scope.username = $cookies.username;

      var gameUrl = 'https://radiant-fire-7849.firebaseio.com/games/' + $routeParams.gameId;
      var disconnectedRef = new Firebase(gameUrl + "/disconnected/" + $scope.username);
      disconnectedRef.onDisconnect().set(true);
      var promise = angularFire(gameUrl, $scope, 'gameData', {});
      promise.then(function(game) {
        watchGame($scope, $routeParams, angularFire, angularFireCollection);
      });
    }]
  );

function watchGame($scope, $routeParams, angularFire, angularFireCollection) {
  $scope.$watch('gameData', function() {
    $scope.game = new Game($scope.gameData);
    $scope.game.setConnected($scope.username);
  });

  $scope.mouseOver = function(player, row, col, $event) {
    if (! $scope.game.isPlayersTurn(player) ) return;

    if ($scope.game.board()[row][col] == '') {
      $event.target.style.cursor = 'pointer';
    }
  };

  $scope.mouseOut = function($event) {
    $event.target.style.cursor = 'default';
  };
}
