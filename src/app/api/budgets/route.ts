import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const category = searchParams.get('category');

    console.log('Connecting to MongoDB...');
    const client = await clientPromise;
    console.log('Connected to MongoDB successfully');
    
    const db = client.db('finance-tracker');
    console.log('Accessing database: finance-tracker');
    
    let query = {};
    if (month) {
      query = { ...query, month };
    }
    if (category) query = { ...query, category };

    console.log('Executing query:', JSON.stringify(query));
    const budgets = await db.collection('budgets')
      .find(query)
      .sort({ month: -1 })
      .toArray();
    
    console.log(`Found ${budgets.length} budgets`);
    return NextResponse.json(budgets);
  } catch (error) {
    console.error('Detailed error in GET /api/budgets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch budgets', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log('Connecting to MongoDB...');
    const client = await clientPromise;
    console.log('Connected to MongoDB successfully');
    
    const db = client.db('finance-tracker');
    const budget = await request.json();
    
    console.log('Creating new budget:', budget);
    const result = await db.collection('budgets').insertOne(budget);
    console.log('Budget created successfully:', result.insertedId);
    
    const newBudget = { ...budget, _id: result.insertedId };
    return NextResponse.json(newBudget);
  } catch (error) {
    console.error('Detailed error in POST /api/budgets:', error);
    return NextResponse.json(
      { error: 'Failed to add budget', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    console.log('Connecting to MongoDB...');
    const client = await clientPromise;
    console.log('Connected to MongoDB successfully');
    
    const db = client.db('finance-tracker');
    const { id, ...updateData } = await request.json();
    
    console.log('Updating budget:', id, updateData);
    const result = await db.collection('budgets').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Budget not found' },
        { status: 404 }
      );
    }
    
    console.log('Budget updated successfully:', result);
    const updatedBudget = await db.collection('budgets').findOne({ _id: new ObjectId(id) });
    return NextResponse.json(updatedBudget);
  } catch (error) {
    console.error('Detailed error in PUT /api/budgets:', error);
    return NextResponse.json(
      { error: 'Failed to update budget', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Budget ID is required' },
        { status: 400 }
      );
    }

    console.log('Connecting to MongoDB...');
    const client = await clientPromise;
    console.log('Connected to MongoDB successfully');
    
    const db = client.db('finance-tracker');
    
    console.log('Deleting budget:', id);
    const result = await db.collection('budgets').deleteOne({
      _id: new ObjectId(id)
    });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Budget not found' },
        { status: 404 }
      );
    }
    
    console.log('Budget deleted successfully:', result);
    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Detailed error in DELETE /api/budgets:', error);
    return NextResponse.json(
      { error: 'Failed to delete budget', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
