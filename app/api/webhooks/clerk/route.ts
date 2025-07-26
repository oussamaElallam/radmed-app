import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { createUser } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('svix-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    // Verify webhook signature
    const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET || 'your-webhook-secret');
    let event: any;

    try {
      event = webhook.verify(body, {
        'svix-id': request.headers.get('svix-id')!,
        'svix-timestamp': request.headers.get('svix-timestamp')!,
        'svix-signature': signature,
      });
    } catch (error) {
      console.error('Webhook verification failed:', error);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Handle different event types
    switch (event.type) {
      case 'user.created':
        await handleUserCreated(event.data);
        break;
      case 'user.updated':
        await handleUserUpdated(event.data);
        break;
      case 'user.deleted':
        await handleUserDeleted(event.data);
        break;
      default:
        console.log('Unhandled webhook event type:', event.type);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed', details: (error as Error).message },
      { status: 500 }
    );
  }
}

async function handleUserCreated(userData: any) {
  try {
    await createUser(
      userData.id,
      userData.email_addresses[0]?.email_address || '',
      userData.first_name,
      userData.last_name
    );
    console.log('User created in database:', userData.id);
  } catch (error) {
    console.error('Failed to create user in database:', error);
  }
}

async function handleUserUpdated(userData: any) {
  try {
    await createUser(
      userData.id,
      userData.email_addresses[0]?.email_address || '',
      userData.first_name,
      userData.last_name
    );
    console.log('User updated in database:', userData.id);
  } catch (error) {
    console.error('Failed to update user in database:', error);
  }
}

async function handleUserDeleted(userData: any) {
  try {
    // In a real application, you might want to soft delete or archive user data
    console.log('User deleted from Clerk:', userData.id);
    // Implement user deletion logic here if needed
  } catch (error) {
    console.error('Failed to handle user deletion:', error);
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
