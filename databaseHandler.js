const async = require('hbs/lib/async');
const {MongoClient,ObjectId} = require('mongodb')

const DATABASE_URL = "mongodb+srv://hlee4real:hoangdznka123@cluster0.mjkz3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
const DATABASE_NAME = 'Asm'
async function getDatabase() {
    const client = await MongoClient.connect(DATABASE_URL);
    const dbo = client.db(DATABASE_NAME);
    return dbo;
}
async function getDocumentById(id,collectionName){
    const dbo = await getDatabase()
    const result = await dbo.collection(collectionName).findOne({_id:ObjectId(id)})
    return result;
}
async function getAll(collectionName){
    const dbo = await getDatabase()
    const result = await dbo.collection(collectionName).find({}).toArray()
    return result
}
async function insertToDB(obj,collectionName){
    const dbo = await getDatabase()
    const result = await dbo.collection(collectionName).insertOne(obj)
    console.log("id of the new toy that will be inserted: ", result.insertedId.toHexString());
}
async function deleteObject(id,collectionName){
    const dbo = await getDatabase()
    await dbo.collection(collectionName).deleteOne({_id:ObjectId(id)})
}
async function updateDocument(id, updateValues,collectionName){
    const dbo = await getDatabase();
    await dbo.collection(collectionName).updateOne({_id:ObjectId(id)},updateValues)
}
async function dosearch(condition,collectionName){
    const dbo = await getDatabase();
    const searchCondition = new RegExp(condition,'i')
    var results = await dbo.collection(collectionName).find({name:searchCondition}).toArray();
    return results;
}
async function category(condition,collectionName){
    const dbo = await getDatabase();
    const categoryCondition = new RegExp(condition,'i')
    var results = await dbo.collection(collectionName).find({category:categoryCondition}).toArray();
    return results;
}
module.exports = {insertToDB,getAll,deleteObject,getDocumentById,updateDocument,dosearch,category, getDatabase}