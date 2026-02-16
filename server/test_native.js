const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

console.log('Testing connection with native MongoDB driver...');
const client = new MongoClient(uri);

async function run() {
    try {
        await client.connect();
        console.log('✅ Successfully connected with native driver!');
        const db = client.db('admin');
        await db.command({ ping: 1 });
        console.log('✅ Pinged the database successfully.');
    } catch (err) {
        console.error('❌ Native driver connection failed:');
        console.error(err);
    } finally {
        await client.close();
    }
}

run();
