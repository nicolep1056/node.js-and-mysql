var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "123Repeater",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Welcome to Bamazon! Connected as id " + connection.threadId);
    /*     connection.end(); */
    /*     bTable(); */

    /*     function bTable() { */
    /*         var products = new Table({
                head: ["Item ID", "Product Name", "Price"],
                colWidths: [10, 60, 10]
            }); */


    connection.query("select * from products", function (err, res) {
        if (err) throw err;
        console.log("AVAILABLE PRODUCTS");
        console.table(res);
        /*      for (var i = 0; i < res.lenth; i++) {
                 var itemId = res[i].item_id;
                 var pName = res[i].product_name;
                 var price = res[i].price;
                 bTable.push(
                     [itemId, pName, price]
                 );
             }
 
             console.log(bTable.toString());
  */
        purchaseItem();
    });
    /*     } */


    function purchaseItem() {
        inquirer.prompt([{
            name: "item_id",
            message: "enter the item ID of the product you wish to buy.",
            type: "input"
        },
        {
            name: "quantity",
            message: "How many of the selected item would you like to purchase?"
        }
        ]).then(function (answers) {
            var newQty;
            var selectedItem;
            var total;
            console.log(answers.item_id);
            connection.query("select stock_quantity from products where item_id = " + answers.item_id, function (err, res) {
                if (err) throw err;
                if (answers.quantity > res[0].stock_quantity) {
                    console.log("Sorry, insufficient quantity.");
                    purchaseItem();
                } else {
                    newQty = res[0].stock_quantity - answers.quantity;
                    connection.query("select * from products where item_id = ?"), [answers.item_id], function (err, res) {
                        selectedItem = res[0].product_name;
                        var price = res[0].price;
                        var department = res[0].department_name;

                        total = parseFloat(price * answers.quantity);
                        
                        connection.query("update products set ? where ?", [{
                            stock_quantity: newQty,
                        }, {
                            item_id: answers.item_id
                        }], function (err, res) {
                            if (err) throw err;
        
                            console.log("/nCongrats! You've purchased " + answers.quantity + " " + selectedItem + ". Your total cost is $" + total + "./n");
                            /*             bTable(); */
                        });
                    }
                }


               
            });

        });
    }
});