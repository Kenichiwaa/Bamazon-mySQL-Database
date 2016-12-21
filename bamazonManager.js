// ### Challenge #2: Manager View (Next Level)
//
// * Create a new Node application called `bamazonManager.js`.
// Running this application will:
//
// 	* List a set of menu options:
// 		* View Products for Sale
// 		* View Low Inventory
// 		* Add to Inventory
// 		* Add New Product
//
// 	* If a manager selects `View Products for Sale`, the app should list every
// 	available item: the item IDs, names, prices, and quantities.
//
// 	* If a manager selects `View Low Inventory`, then it should list all items
// 	with a inventory count lower than five.
//
// 	* If a manager selects `Add to Inventory`, your app should display a prompt
// 	that will let the manager "add more" of any item currently in the store.
//
// 	* If a manager selects `Add New Product`, it should allow the manager to add
// 	a completely new product to the store.
//
//____________________________________________________________________________________
//____________________________________________________________________________________
// Notes
//
// function addNewProduct() {
//     inquirer.prompt([ // ask user the information needed to add a product
//     { name: "productName", message: "What is the product name?" },
//     { name: "productDepartment", message: "Which department?" },
//     { name: "price", message: "Enter the price",
//             validate: function(value) {
//               if (isNaN(value) === false) {         //   TODO  What does this mean?
//                 return true;
//               }                                   //   TODO  What does this mean?
//               return false;
//             } }
//     ])}
//
//
// mySQL: CREATE TABLE products ( item_id, product_name, department_name, price, stock_quantity )


//____________________________________________________________________________________
//____________________________________________________________________________________
// Globals

// add mysql parts
var mysql = require("mysql");
// adds the prompt feature to terminal
var inquirer = require("inquirer");
// makes data look nice with tables and color
var Table = require('cli-table');

var connection = mysql.createConnection({ //connect to mySQL
    host: "localhost",
    port: 3306,
    user: "root", // your userName
    password: "password", // your password
    database: "Bamazon_db"
});
// if there's an error witht the mySQL connection, throw it..
connection.connect(function(err) {
    if (err) throw err;
});
// console.log("connected as id " + connection.threadId);     // TODO shows undefined. What is this again?

var itemId; // item ID that user selects
var numOfItems; // # of items user wants

//____________________________________________________________________________________
//____________________________________________________________________________________
// The Functions

// Asks the manager what they would like to do.
function helloManager() {
  inquirer.prompt({
    name: "action",
    type: "list",
    message: "Hello, what would you like to do?",
    choices: ["View Inventory", "View Low Inventory",
      "Change Inventory Amount", "Add New Product"]
  }).then(function(answer) {

    switch (answer.action) {
      case "View Inventory":
        viewInventory();
        break;

      case "View Low Inventory":
        viewLowInventory();
        break;

      case "Change Inventory Amount":
        changeQuantity();
        break;

      case "Add New Product":
        addNewProduct();
        break;
    }
  });
}

//+++++++++++++++++++++++++++++++++++++++

// Display all items by ID, product name, price, and quantity
var viewInventory = function() {
    // select all from products var
    var query = "SELECT * FROM products";
    // make connection to mySQL
    connection.query(query, function(err, res) {
            // Create fancy table
            var table = new Table({ head: ["", "#", "Product Name", "Price", "Stock Quantity", "Department"] });
            for (var i = 0; i < res.length; i++) { // for the length of all items in products, for each one...
                // push info of that item to the table
                table.push( { '' : [ res[i].item_id, res[i].product_name, res[i].price, res[i].stock_quantity, res[i].department_name] });
            }

        console.log("\n" + table.toString() + "\n");
        helloManager();
    });
};

//+++++++++++++++++++++++++++++++++++++++

// Display low inventory
function viewLowInventory() {
    inquirer.prompt([{ // ask user
        type: "input",
        message: "Enter minimum number of inventory to search",
        name: "number"
    }]).then(function(value) {

        var numOfLowInventory = parseInt(value.number);
        var counter = 0;
        var table = new Table({
            head: ["", "#", "Product Name", "Price", "Stock", "Department"]
        }); // table to make data look nice

        var query = "SELECT * FROM products";
        connection.query(query, function(err, res) {

            for (var i = 0; i < res.length; i++) {
                if (res[i].stock_quantity <= value.number) {
                    //console.log(res[i].item_id + "|" + res[i].product_name + "|" + res[i].price + "|" + res[i].stock_quantity);
                    counter++; // keep count of loop
                    table.push({
                        '': [res[i].item_id, res[i].product_name, res[i].price, res[i].stock_quantity, res[i].department_name]
                    }); // push to table var that will make it look pretty
                }
            }
            if (numOfLowInventory === 0) {
                console.log("\nNo low inventory\n");
                helloManager();
            }
            if (numOfLowInventory > 0) {
                  console.log(table.toString());
                  console.log("\n");
                  console.log("\nNumber of Items: " + counter + "\n");
                  helloManager();
            }else{
              console.log("error!\n");
              helloManager();
            }
        });
    });
}

//+++++++++++++++++++++++++++++++++++++++
// Change Quiantity of items
var itemId;
var numOfItems;
var itemInfo;
var itemsTotal;

// Asks user what they want to add and if they confirm, send info to searchForItem function
function changeQuantity() {
    inquirer.prompt([{
            name: "id",
            message: "Enter the ID number of product to change"
        }, // display message
        {
            name: "numOfUnits",
            message: "How many would you like to add or subtract?"
        } // display message
    ]).then(function(data) {
        console.log("ID: " + data.id + " | " + "Quantity: " + data.numOfUnits + "\n");

        inquirer.prompt([ // confirm user is cool with it
            {
                type: "confirm",
                name: "siOrNo",
                message: "Is this correct?"
            }
        ]).then(function(confirm) {
            if (confirm.siOrNo) { //if yes to confirm...
                itemId = data.id; // send info to global var
                numOfItems = data.numOfUnits;
                searchForItem(); // start function to search and add in mySQL
            } else {
                changeQuantity(); // if no, then start function over
            }
        });
    });
}

// Searches for item in database and updates the quantity
var searchForItem = function() {
    var query = "SELECT * FROM products"; // select all from products databse
    connection.query(query, function(err, res) { // connect to mySQL
        for (var i = 0; i < res.length; i++) { // for the results length
            if (res[i].item_id == itemId) { // if Item ID matches SQL database ID

                itemInfo = res[i]; // set item info
                itemsTotal = parseInt(res[i].stock_quantity) + parseInt(numOfItems); // set total number of items.
                changeItemInMySQL(); // start function that updates the info in mySQL

            } else { // if not, return
                //return;
            }
        }
    });
};

// Goes into mySQL database and changes quantity
var changeItemInMySQL = function() {
    var positiveOrNegative;
    var query = "UPDATE products SET ? WHERE ?";
    connection.query(query, [{
        stock_quantity: itemsTotal
    }, {
        item_id: itemId
    }], function(err, res) {
        if (err) throw err;
        if(numOfItems < 0){
           positiveOrNegative = "removed";
        }else{
           positiveOrNegative = 'added';
        }
        console.log(numOfItems + " units of " + itemInfo.product_name + "'s "+ positiveOrNegative +". Total items: " + itemsTotal + ".\n");
        helloManager();
    });
};

//+++++++++++++++++++++++++++++++++++++++

// Add a new product to database
function addNewProduct() {
    inquirer.prompt([ // ask user the information needed to add a product
        {
            name: "productName",
            message: "What is the product name?"
        }, {
            name: "productDepartment",
            message: "Which department?"
        }, {
            name: "price",
            message: "Enter the price",
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }, {
            name: "quantity",
            message: "Enter the quantity",
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }

    ]).then(function(data) {
        console.log("Product Name: " + data.productName + " | Department: " + data.productDepartment + " | Price: " + data.price + " | Quantity: " + data.quantity + "\n");

        inquirer.prompt([ // confirm user is cool with it
            {
                type: "confirm",
                name: "siOrNo",
                message: "Is this correct?"
            }
        ]).then(function(confirm) {
            if (confirm.siOrNo) { //if yes to confirm...
                addItem(data.productName, data.productDepartment, data.price, data.quantity); // start function to search and add in mySQL
            } else {
                addNewProduct(); // if no, then start function over
            }
        });
    });
}

// Add item into mySQL
function addItem(name, department, price, quantity) {
    connection.query("INSERT INTO products SET ?", {
        product_name: name,
        department_name: department,
        price: price,
        stock_quantity: quantity
    }, function(err, res) {
        if (err) throw err;
        console.log("Your item was added successfully!");
        helloManager();
    });
}

//____________________________________________________________________________________
//____________________________________________________________________________________
//____________________________________________________________________________________
// The Main Process

helloManager();
