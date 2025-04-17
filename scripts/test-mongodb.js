const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://narendrakarri2314:Finance@financial.2fbuk0l.mongodb.net/?retryWrites=true&w=majority&appName=Financial";

async function testConnection() {
    const client = new MongoClient(uri, {
        maxPoolSize: 10,
        serverApi: {
            version: '1',
            strict: true,
            deprecationErrors: true,
        }
    });

    try {
        console.log('Attempting to connect to MongoDB...');
        await client.connect();
        console.log('Successfully connected to MongoDB!');

        const db = client.db('finance-tracker');
        console.log('Accessing database: finance-tracker');

        // Test database connection with ping
        await db.command({ ping: 1 });
        console.log('Successfully pinged database');

        // Test collections
        const collections = await db.listCollections().toArray();
        console.log('\nAvailable collections:');
        collections.forEach(collection => {
            console.log(`- ${collection.name}`);
        });

        // Test transactions collection
        const transactionsCount = await db.collection('transactions').countDocuments();
        console.log(`\nNumber of transactions: ${transactionsCount}`);

        // Test budgets collection
        const budgetsCount = await db.collection('budgets').countDocuments();
        console.log(`Number of budgets: ${budgetsCount}`);

    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        if (error.code === 8000) {
            console.error('\nAuthentication failed. Please check:');
            console.error('1. Username is correct');
            console.error('2. Password is correct');
            console.error('3. IP address is whitelisted in MongoDB Atlas');
            console.error('4. Database user has the correct permissions');
        }
        process.exit(1);
    } finally {
        await client.close();
        console.log('\nConnection closed');
    }
}

testConnection();
