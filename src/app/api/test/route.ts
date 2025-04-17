import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('Testing MongoDB connection...');
    const client = await clientPromise;
    console.log('Connected to MongoDB successfully');
    
    const db = client.db('finance-tracker');
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    // Test query to transactions collection
    const transactionCount = await db.collection('transactions').countDocuments();
    
    return NextResponse.json({
      status: 'Connected',
      database: 'finance-tracker',
      collections: collectionNames,
      transactionCount,
    });
  } catch (error) {
    console.error('MongoDB connection test failed:', error);
    return NextResponse.json(
      { 
        status: 'Error',
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error
      },
      { status: 500 }
    );
  }
}
