import { NextRequest, NextResponse } from 'next/server';
import { UserEvent } from '@/utils/analytics';

// In production, this would store events in a database
// For now, we'll just log them (you can integrate with your preferred analytics service)
const events: UserEvent[] = [];

export async function POST(request: NextRequest) {
  try {
    const event: UserEvent = await request.json();

    // Validate event structure
    if (!event.type || !event.category || !event.action) {
      return NextResponse.json(
        { error: 'Invalid event structure' },
        { status: 400 }
      );
    }

    // Store event (in production, use your database)
    events.push({
      ...event,
      timestamp: event.timestamp || Date.now(),
    });

    // Log for development
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', event);
    }

    // In production, you would:
    // 1. Store in database (PostgreSQL, MongoDB, etc.)
    // 2. Send to analytics service (Google Analytics, Mixpanel, etc.)
    // 3. Process for real-time insights

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics event error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return recent events for debugging (development only)
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.json({
      events: events.slice(-100), // Last 100 events
      total: events.length,
    });
  }

  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
