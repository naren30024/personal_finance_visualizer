import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const category = searchParams.get('category');
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    const client = await clientPromise;
    const db = client.db('finance-tracker');

    if (id) {
      const transaction = await db.collection('transactions').findOne(
        { _id: new ObjectId(id) }
      );
      if (!transaction) {
        return NextResponse.json(
          { error: 'Transaction not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({
        ...transaction,
        id: transaction._id.toString(),
      });
    }

    let query = {};
    if (month) {
      const startDate = new Date(month);
      const endDate = new Date(new Date(month).setMonth(startDate.getMonth() + 1));
      query = {
        ...query,
        date: {
          $gte: startDate,
          $lt: endDate
        }
      };
    }
    if (category) query = { ...query, category };
    if (type) query = { ...query, type };

    const transactions = await db.collection('transactions')
      .find(query)
      .sort({ date: -1 })
      .toArray();

    // Transform _id to id for client-side compatibility
    const transformedTransactions = transactions.map(transaction => ({
      ...transaction,
      id: transaction._id.toString(),
      _id: undefined
    }));

    return NextResponse.json(transformedTransactions);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, date, description, category, type } = body;

    // Validate required fields
    if (!amount || !date || !description || !category || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('finance-tracker');

    // Ensure date is a Date object
    body.date = new Date(body.date);
    body.amount = parseFloat(body.amount);

    const result = await db.collection('transactions').insertOne(body);

    return NextResponse.json({
      ...body,
      id: result.insertedId.toString(),
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to add transaction' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Transaction ID is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('finance-tracker');

    // Ensure date is a Date object and amount is a number
    if (updateData.date) updateData.date = new Date(updateData.date);
    if (updateData.amount) updateData.amount = parseFloat(updateData.amount);

    const result = await db.collection('transactions').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ id, ...updateData });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to update transaction' },
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
        { error: 'Transaction ID is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('finance-tracker');

    const result = await db.collection('transactions').deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ id });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to delete transaction' },
      { status: 500 }
    );
  }
}
