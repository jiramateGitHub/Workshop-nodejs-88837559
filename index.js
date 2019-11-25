require('dotenv').config()
const express = require('express')
const app = express()
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

var mysql = require('mysql');
var db = mysql.createConnection({
  host: process.env.DB_SERVER,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE
});
db.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

app.get('/', (req, res) => {
    let sql = 'SELECT * FROM products;' 
    let query = db.query(sql,(err,results) => { 
        if(err) throw err  
        res.json(results)   
    })
})

app.get('/:id', (req, res) => {
    let sql = 'SELECT * FROM products WHERE productCode = '+req.params.id+';' 
    let query = db.query(sql,(err,results) => { 
        if(err) throw err  
        res.json(results)   
    })
})
   

app.post('/post', (req, res) => {
    let sql = "INSERT INTO products (productCode,productName,productLine,productScale,productVendor,productDescription,quantityInStock,buyPrice,MSRP) VALUES ?";
    var values = [
      [req.body.productCode, req.body.productName, req.body.productLine, req.body.productScale, req.body.productVendor,req.body.productDescription, req.body.quantityInStock, req.body.buyPrice, req.body.MSRP ]
    ];
    let query = db.query(sql, [values],function (err,results) { 
        if(err) throw err  
        res.json(results)   
        console.log("Number of records inserted: " + result.affectedRows);
    })
})

app.put('/put', (req, res) => {
    let sql = "UPDATE products SET productName = '"+req.body.productName+"' WHERE productCode = '"+req.body.productCode+"'";
    let query = db.query(sql, (err,results) => { 
        if(err) throw err  
        res.json(results)   
        console.log(res.affectedRows + " record(s) updated");
    })
   
})  

app.delete('/delete', (req, res) => {
    let sql = "DELETE FROM products WHERE productCode = '"+req.body.productCode+"'";
    let query = db.query(sql, (err,results) => { 
        if(err) throw err  
        res.json(results)   
        console.log("Number of records deleted: " + result.affectedRows);
    })
})

app.listen(3000, () => {
    console.log('Start server at port 3000.')
})
