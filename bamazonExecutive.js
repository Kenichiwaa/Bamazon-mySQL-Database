// ### Challenge #3: Executive View (Final Level)
//
// 1. Create a new MySQL table called `departments`.
// 	 Your table should include the following columns:
// 		* department_id
// 		* department_name
// 		* over_ head_costs (A dummy number you set for each department)
// 		* total_sales
//
// 2. Modify your `bamazonCustomer.js` app so that when a customer purchases anything from the store,
// 	 the program will calculate the total sales from each transaction.
// 		* Add the revenue from each transaction to the `total_sales` column for the related department.
// 		* Make sure your app still updates the inventory listed in the `products` column.
//
// 3. Create another Node app called `bamazonExecutive.js`.
// 	 Running this application will list a set of menu options:
// 		* View Product Sales by Department
// 		* Create New Department
//
// 4. When an executive selects `View Product Sales by Department`,
// 	the app should display a summarized table in their terminal/bash window.
// 	Use the table below as a guide.
//
// 	| department_id | department_name | over_head_costs | product_sales | total_profit |
// 	|---------------|-----------------|-----------------|---------------|--------------|
// 	| 01            | Electronics     | 10000           | 20000         | 10000        |
// 	| 02            | Clothing        | 60000           | 100000        | 40000        |
//
//
// 5. The `total_profit` should be calculated on the fly using the difference between
// 	 `over_head_costs` and `product_sales`. `total_profit` should not be stored in any database.
// 	 You should use a custom alias.
//
// 6. If you can't get the table to display properly after a few hours,
// 		then feel free to go back and just add `total_profit` to the `departments` table.
// 		* Hint: You will need to use joins to make this work.
// 		* Hint: You may need to look into grouping in MySQL.
//
// 	* **HINT**: There may be an NPM package that can log the table to the console.
// 							What's is it? Good question :)
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
