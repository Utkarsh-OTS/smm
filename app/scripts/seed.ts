
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Create demo user
  const demoUser = await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: {},
    create: {
      email: 'john@doe.com',
      name: 'John Doe',
      twitterUsername: 'johndoe_demo',
      twitterId: 'demo_twitter_id_123',
      image: 'https://i.pinimg.com/originals/21/76/78/217678f7eb0ebcae251430dda3529ff0.jpg',
    },
  });

  console.log('Created demo user:', demoUser.email);

  // Create user settings for demo user
  await prisma.userSettings.upsert({
    where: { userId: demoUser.id },
    update: {},
    create: {
      userId: demoUser.id,
      twitterApiKey: 'your_twitter_api_key_here',
      twitterApiSecret: 'your_twitter_api_secret_here',
      twitterAccessToken: 'your_twitter_access_token_here',
      twitterTokenSecret: 'your_twitter_token_secret_here',
      geminiApiKey: 'your_gemini_api_key_here',
      defaultTweetStyle: 'professional',
      autoScheduleOptimal: true,
      notificationsEnabled: true,
      timezone: 'UTC',
    },
  });

  // Create some sample scheduled tweets
  const sampleTweets = [
    {
      content: "🚀 Just launched my new AI-powered social media strategy! The future of content creation is here. #AI #SocialMedia #Innovation",
      scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
      metadata: { hashtags: ['AI', 'SocialMedia', 'Innovation'], mentions: [] }
    },
    {
      content: "Coffee ☕ + Code 💻 = Perfect Monday motivation! What's fueling your productivity today? #MondayMotivation #TechLife",
      scheduledFor: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      metadata: { hashtags: ['MondayMotivation', 'TechLife'], mentions: [] }
    },
    {
      content: "Thread 🧵 about building better user experiences: 1/5\n\nUser experience isn't just about pretty interfaces...",
      scheduledFor: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      isThread: true,
      threadOrder: 1,
      metadata: { hashtags: ['UX', 'Design', 'Thread'], mentions: [] }
    }
  ];

  for (const tweet of sampleTweets) {
    await prisma.scheduledTweet.create({
      data: {
        ...tweet,
        userId: demoUser.id,
      },
    });
  }

  console.log('Created sample scheduled tweets');

  // Create sample tweet analysis
  await prisma.tweetAnalysis.create({
    data: {
      userId: demoUser.id,
      totalTweets: 127,
      avgEngagement: 4.2,
      commonHashtags: [
        { tag: 'AI', frequency: 15 },
        { tag: 'SocialMedia', frequency: 12 },
        { tag: 'TechLife', frequency: 8 },
        { tag: 'Innovation', frequency: 6 }
      ],
      writingStyle: {
        tone: 'professional',
        avgLength: 140,
        emojiUsage: 'moderate',
        hashtagPattern: '2-3 per tweet'
      },
      topicAnalysis: [
        { topic: 'Technology', percentage: 45 },
        { topic: 'Business', percentage: 30 },
        { topic: 'Personal', percentage: 25 }
      ],
      sentimentScore: 0.75,
      postingPattern: {
        bestTimes: ['9:00 AM', '2:00 PM', '7:00 PM'],
        frequency: 'daily',
        engagement: 'highest on weekdays'
      }
    },
  });

  console.log('Created sample tweet analysis');

  // Create sample profile optimization suggestions
  const suggestions = [
    {
      suggestionType: 'bio',
      title: 'Optimize Your Bio',
      description: 'Add keywords related to your expertise in AI and social media. Consider mentioning your location and adding a call-to-action.',
      priority: 5
    },
    {
      suggestionType: 'posting_strategy',
      title: 'Improve Posting Schedule',
      description: 'Your analysis shows 40% higher engagement when posting between 2-4 PM on weekdays. Consider scheduling more content during these peak hours.',
      priority: 4
    },
    {
      suggestionType: 'engagement_tips',
      title: 'Increase Thread Usage',
      description: 'Threads get 3x more engagement than single tweets. Try breaking complex topics into thread format for better reach.',
      priority: 3
    }
  ];

  for (const suggestion of suggestions) {
    await prisma.profileOptimization.create({
      data: {
        ...suggestion,
        userId: demoUser.id,
      },
    });
  }

  console.log('Created profile optimization suggestions');
  console.log('Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
