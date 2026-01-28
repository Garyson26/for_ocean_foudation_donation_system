const cron = require('node-cron');
const Donation = require('../models/Donation');
const User = require('../models/User');
const PendingSignup = require('../models/PendingSignup');

/**
 * Data Cleanup Service
 * Automatically removes old records from the database
 * 
 * Retention Policy:
 * - Donations: 10 years
 * - Inactive Users: 10 years (users who haven't made donations)
 * - Pending Signups: 7 days
 */

/**
 * Delete donations older than 10 years
 */
const cleanupOldDonations = async () => {
  try {
    const tenYearsAgo = new Date();
    tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);

    const result = await Donation.deleteMany({
      createdAt: { $lt: tenYearsAgo }
    });

    if (result.deletedCount > 0) {
      console.log(`[Data Cleanup] Deleted ${result.deletedCount} donation(s) older than 10 years`);
    } else {
      console.log(`[Data Cleanup] No donations older than 10 years found`);
    }

    return result.deletedCount;
  } catch (error) {
    console.error('[Data Cleanup] Error cleaning up old donations:', error);
    return 0;
  }
};

/**
 * Delete inactive users older than 10 years
 * Only deletes users who have no associated donations
 */
const cleanupInactiveUsers = async () => {
  try {
    const tenYearsAgo = new Date();
    tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);

    // Find users older than 10 years
    const oldUsers = await User.find({
      createdAt: { $lt: tenYearsAgo },
      role: 'user' // Don't delete admin accounts
    });

    let deletedCount = 0;

    for (const user of oldUsers) {
      // Check if user has any donations
      const donationCount = await Donation.countDocuments({ userId: user._id });
      
      // Only delete if user has no donations
      if (donationCount === 0) {
        await User.deleteOne({ _id: user._id });
        deletedCount++;
      }
    }

    if (deletedCount > 0) {
      console.log(`[Data Cleanup] Deleted ${deletedCount} inactive user(s) older than 10 years`);
    } else {
      console.log(`[Data Cleanup] No inactive users older than 10 years found`);
    }

    return deletedCount;
  } catch (error) {
    console.error('[Data Cleanup] Error cleaning up inactive users:', error);
    return 0;
  }
};

/**
 * Delete expired pending signups (older than 7 days)
 */
const cleanupExpiredPendingSignups = async () => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const result = await PendingSignup.deleteMany({
      createdAt: { $lt: sevenDaysAgo }
    });

    if (result.deletedCount > 0) {
      console.log(`[Data Cleanup] Deleted ${result.deletedCount} expired pending signup(s)`);
    }

    return result.deletedCount;
  } catch (error) {
    console.error('[Data Cleanup] Error cleaning up expired pending signups:', error);
    return 0;
  }
};

/**
 * Run all cleanup tasks
 */
const runCleanup = async () => {
  console.log('[Data Cleanup] Starting scheduled cleanup...');
  const startTime = Date.now();

  const donationsDeleted = await cleanupOldDonations();
  const usersDeleted = await cleanupInactiveUsers();
  const pendingSignupsDeleted = await cleanupExpiredPendingSignups();

  const duration = Date.now() - startTime;
  console.log(`[Data Cleanup] Cleanup completed in ${duration}ms`);
  console.log(`[Data Cleanup] Summary: ${donationsDeleted} donations, ${usersDeleted} users, ${pendingSignupsDeleted} pending signups removed`);
};

/**
 * Initialize scheduled cleanup jobs
 */
const initializeCleanupScheduler = () => {
  console.log('test1');
    // Run cleanup daily at 2:00 AM
  cron.schedule('0 2 * * *', async () => {
    console.log('test');
    await runCleanup();
  }, {
    scheduled: true,
    timezone: "Asia/Kolkata" // Indian Standard Time
  });

  console.log('[Data Cleanup] Scheduler initialized - cleanup runs daily at 2:00 AM IST');

  // Optional: Run cleanup on startup (commented out by default)
  // Uncomment the line below to run cleanup immediately when server starts
  // runCleanup();
};

/**
 * Manual cleanup trigger (for admin use)
 */
const triggerManualCleanup = async () => {
  console.log('[Data Cleanup] Manual cleanup triggered');
  await runCleanup();
};

module.exports = {
  initializeCleanupScheduler,
  triggerManualCleanup,
  cleanupOldDonations,
  cleanupInactiveUsers,
  cleanupExpiredPendingSignups
};
