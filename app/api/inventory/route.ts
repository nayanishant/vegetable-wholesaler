import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Inventory from '@/models/Inventory';

export async function GET(req: NextRequest) {
  await dbConnect();
  const items = await Inventory.find({ isAvailable: true });
  return NextResponse.json(items);
}
