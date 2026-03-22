import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsSession } from '@/utils/analytics';

// In production, this would store sessions in a database
const sessions: AnalyticsSession[] = [];

export async function POST(request: NextRequest) {
  try {
    const session: AnalyticsSession = await request.json();

    // Validate session structure
    if (!session.sessionId || !session.startTime) {
      return NextResponse.json(
        { error: 'Invalid session structure' },
        { status: 400 }
      );
    }

    // Store session (in production, use your database)
    sessions.push(session);

    // Log for development
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Session:', {
        sessionId: session.sessionId,
        duration: session.duration,
        pageViews: session.pageViews,
        events: session.events.length,
        performanceEvents: session.performanceEvents.length,
      });
    }

    // In production, you would:
    // 1. Store in database with proper indexing
    // 2. Process for user behavior analytics
    // 3. Generate insights and reports
    // 4. Update user profiles

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics session error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return session analytics for debugging (development only)
  if (process.env.NODE_ENV === 'development') {
    const totalSessions = sessions.length;
    const avgDuration =
      sessions.reduce((sum, s) => sum + (s.duration || 0), 0) / totalSessions ||
      0;
    const totalPageViews = sessions.reduce((sum, s) => sum + s.pageViews, 0);
    const avgPageViews = totalPageViews / totalSessions || 0;

    return NextResponse.json({
      totalSessions,
      avgDuration: Math.round(avgDuration),
      totalPageViews,
      avgPageViews: Math.round(avgPageViews * 10) / 10,
      recentSessions: sessions.slice(-10).map(s => ({
        sessionId: s.sessionId,
        duration: s.duration,
        pageViews: s.pageViews,
        device: s.deviceInfo.browser,
      })),
    });
  }

  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
