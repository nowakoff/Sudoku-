$(document).ready(function() {
  $("#message").hide();
  $('.grid').on('submit', function(event){
    event.preventDefault();
    $("#message").hide();
    var input = $('.grid').serialize().split("&");
    var parsedInput = input.map(function(inputSquare){
      return inputSquare.replace(/\d*=/, "")
    }).map(function(inputSquare) {
      return inputSquare.replace(/^$/, "0");
    }).join("");

    if (new Sudoku(parsedInput).solveGame() == false) {
      $("input").val("");
      $("input[type='submit']").val("Solve!");
      $("#message").show();
    }

  });
  $('#clear').on('click',function() {
    $("#message").hide();
    $("input").val("");
    $("input[type='submit']").val("Solve!");
  });
});

function Sudoku(board) {
  this.board = board.split("");
  this.rows = this.prepareRows();
  this.columns = this.prepareColumns();
  this.boxes = this.prepareBoxes();
}

Sudoku.prototype.display = function() {
  var board = this.board;
  var counter;
  for (counter = 0; counter < board.length; counter++) {
    $('[name="' + counter + '"]').val(board[counter])
  }
};

Sudoku.prototype.solveGame = function() {

  if (this.board.join("").match(/\D/) != null) {
    return false;
  }

  this.rows = this.prepareRows();
  this.columns = this.prepareColumns();
  this.boxes = this.prepareBoxes();

  var solution;
  var that = this;
  that.display();

  if (!that.validGame()) {
    return false
  }

  if (that.solved()) {
    return that.board;
  }

  var digits = ['1','2','3','4','5','6','7','8','9']
  var zeroIndex = that.board.indexOf('0')

  for (var d = 0; d < digits.length; d++) {
    that.board[zeroIndex] = digits[d];

    solution = that.solveGame();

    if (solution) {
      return solution;
    }

    that.board[zeroIndex] = "0";
  }

  return false;
};

Sudoku.prototype.validGame = function() {
  return (!this.hasDuplicates(this.rows) && !this.hasDuplicates(this.columns) && !this.hasDuplicates(this.boxes));
};


function onlyUnique(value, index, self) {
    return value === "0" || self.indexOf(value) === index;
}


Sudoku.prototype.hasDuplicates = function(structure) {
  for(var i = 0; i < structure.length; i++) {
    if(JSON.stringify(structure[i]) != JSON.stringify(structure[i].filter(onlyUnique))) {
      return true;
    }
  }
  return false;
};

Sudoku.prototype.prepareRows = function() {
  var rows = [];
  var counter;
  for (counter = 0; counter < this.board.length; counter += 9) {
    rows.push(this.board.slice(counter, counter + 9));
  }

  return rows;
};

Sudoku.prototype.prepareColumns = function() {
  var callback = function(col, i) {
    return this.rows.map(function(row) {
      return row[i];
    });
  }.bind(this)

  var columns = this.rows[0].map(callback);
  return columns;
};

Sudoku.prototype.prepareBoxes = function() {
  var boxes = [];

  var rowIndex;
  var colIndex;

  for (rowIndex = 0; rowIndex <= 6; rowIndex += 3) {
    for (colIndex = 0; colIndex <= 6; colIndex += 3) {
      boxes.push(this.rows[rowIndex].slice(colIndex, colIndex + 3).concat(this.rows[rowIndex + 1].slice(colIndex, colIndex + 3)).concat(this.rows[rowIndex + 2].slice(colIndex, colIndex + 3)));
    }
  }

  return boxes;
};

Sudoku.prototype.solved = function() {
  return this.board.indexOf('0') < 0;
};
