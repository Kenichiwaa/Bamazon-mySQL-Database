
// Notes

//require('events').EventEmitter.defaultMaxListeners = Infinity;   solution to CLI error message below ? what is this
// "Possible EventEmitter memory leak detected. 11 exit listeners added. Use emitter.setMaxListeners() to increase limit"

// mySQL: CREATE TABLE products ( item_id, product_name, department_name, price, stock_quantity )

//____________________________________________________________________________________
//____________________________________________________________________________________
//Global

var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({ //connect to mySQL
    host: "localhost",
    port: 3306,
    user: "root", // your userName
    password: "password", // your password
    database: "Bamazon_db"
});

// console.log("connected as id " + connection.threadId);

var itemId; // item id that user selected
var numOfItems; // number of items the user wants

//____________________________________________________________________________________
//____________________________________________________________________________________
// Ze Functions

// if there's an error, throw it..
connection.connect(function(err) {
    if (err) throw err;
});

// Display all items by ID, product name, price, and quantity
var displayAll = function() {
    var query = "SELECT * FROM products"; // select all from products var
    connection.query(query, function(err, res) {
        console.log("\n");
        for (var i = 0; i < res.length; i++) { // for loop
            console.log(res[i].item_id + "|" + res[i].product_name + "|" + res[i].price + "|" + res[i].stock_quantity );
        }
        console.log("\n");
        itemToBuy(); // Start prompt that asks what to buy
    });
};

// Asks user what they want to buy
function itemToBuy(){
    inquirer.prompt([
    { name: "id", message: "Enter ID number of product to purchase" }, // display message
    { name: "numOfUnits", message: "How many?" } // display message
    ]).then(function(data) {
        console.log("ID: " + data.id + " | " + "Quantity: " + data.numOfUnits + "\n");

            inquirer.prompt([ // confirm user is cool with it
              {
                type: "confirm",
                name: "siOrNo",
                message: "Is this correct?"
              }
            ]).then(function(confirm) {
                if(confirm.siOrNo){ //if yes to confirm...
                  itemId = data.id; // send info to global var
                  numOfItems = data.numOfUnits;
                  searchForItem(); // start function to search and add in mySQL
                }else{
                  itemToBuy(); // if no, then start function over
                }
            });
    });
}

// Searches for item in database and updates the quantity
var searchForItem = function() {
    var query = "SELECT * FROM products"; // select all from products databse
    connection.query(query, function(err, res) { // connect to mySQL
        for (var i = 0; i < res.length; i++) { // for the results length
            if( res[i].item_id == itemId && (res[i].stock_quantity - numOfItems >= 0) ){ // if id = id && quantity left >=0

                  var itemInfo = res[i]; // set item info to global var
                  var itemsRemain = (res[i].stock_quantity - numOfItems); // send number if items left to global var

                  connection.query("UPDATE products SET ? WHERE ?", [{ // set quantity remaining at item id
                    stock_quantity: itemsRemain}, {item_id: res[i].item_id
                  }], function(err, res) {
                    console.log("\nTotal Due: $" + (numOfItems * itemInfo.price) + "\nThank You!\n" );
                  displayAll();
                  });

            }else if( res[i].item_id == itemId && (res[i].stock_quantity - numOfItems < 0) ){
              console.log("Insufficient Quantity!\n");
              itemToBuy();
            }
        }
    });
};

//____________________________________________________________________________________
//____________________________________________________________________________________
// The Main Process
displayAll();
