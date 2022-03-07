const express = require('express')
const { insertToDB, getAll, deleteObject, getDocumentById, updateDocument, dosearch, category, getDatabase } = require('./databaseHandler')

const app = express();
const {MongoClient,ObjectId} = require('mongodb')
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))

app.get('/', async (req, res) => {
    var result = await getAll("Products")
    res.render('home.hbs', { products: result })
})
//insert product
app.post('/insert', async (req, res) => {
    const name = req.body.txtName
    const price = req.body.txtPrice
    const url = req.body.txtImage
    const category = req.body.txtCategory
    if (name.trim().length == 0) {
        res.render('insert', { nameError: "Please enter Name!" })
    }
    else if (price.trim().length == 0) {
        res.render('insert', { nameError: null, priceError: "Please enter Price!" })
    }
    //check if its not number
    else if (isNaN(price)) {
        res.render('insert', { nameError: null, priceError: "Only enter Number" });
        return false;
    };
    //check if input negative numbers
    if (price < 1) {
        res.render('insert', { nameError: null, priceError: "Price must be greater than 0" });
        return false;
    }
    else if (category.trim().length == 0) {
        res.render('insert', { categoryError: "Please enter a category" })
    }
    else if (url.length == 0) {
        var result = await getAll("Products")
        res.render('insert', { products: result, urlError: 'Please enter Image URL!' })
    }
    else {
        //build the object to be inserted
        const obj = { name: name, price: price, category: category, image: url }
        //call the function to insert into DB
        await insertToDB(obj, "Products")
        res.redirect('/')
    }
})
// search 
app.post('/search', async (req, res) => {
    const searchText = req.body.txtName;
    const result = await dosearch(searchText, "Products")
    res.render('home', { products: result })
})
//delete one product (id)
app.get('/delete/:id', async (req, res) => {
    const idValue = req.params.id
    const products = await getDocumentById(idValue, "Products")
    console.log(products.price)
    var showErr = "Product can not be deleted when price is greater than 100$"
    if (products.price >100){
        res.render('home',{showErr: showErr})
        return
    } else{
        await deleteObject(idValue, "Products")
        res.redirect('/')
    }
   
})
//category
app.post('/category', async (req, res) => {
    const categorya = req.body.txtName;
    const result = await category(categorya, "Products")
    res.render('home', { products: result })
})

app.get('/edit/:id', async (req, res) => {
    const idValue = req.params.id
    const productToEdit = await getDocumentById(idValue, "Products")
    res.render("edit", { product: productToEdit })
})

app.get('/addproduct', (req, res) => {
    res.render('insert')
})
//update product
app.post('/update', async (req, res) => {
    const id = req.body.txtId
    const name = req.body.txtName
    const price = req.body.txtPrice
    const image = req.body.txtImage
    const category = req.body.txtCategory
    let updateValues = { $set: { name: name, price: price, category: category, image: image } };

    if (name.trim().length == 0) {
        res.render('edit', { nameError: "Please enter Name!" })
    }
    else if (price.trim().length == 0) {
        res.render('edit', { nameError: null, priceError: "Please enter Number!" })
    }
    else if (isNaN(price)) {
        res.render('edit', { nameError: null, priceError: "Only enter Number" })
        return false;
    }
    else if (price < 1) {
        res.render('edit', { nameError: null, priceError: "Price must be greater than 0" })
        return false;
    }
    else if (category.trim().length == 0) {
        res.render('edit', { nameError: null, priceError: null, categoryError: "Please enter a category" })
    }
    else {
        await updateDocument(id, updateValues, "Products")
        res.redirect('/')
    }
})
//server connecting
const PORT = process.env.PORT || 5000;
app.listen(PORT);