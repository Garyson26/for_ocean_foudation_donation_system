const express = require("express");
const router = express.Router();
const Donation = require("../models/Donation");
const adminAuth = require("../middleware/adminAuth");
const authMiddleware = require("../middleware/authMiddleware");

// Optional auth middleware - allows both authenticated and guest users
const optionalAuth = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    // No token, continue as guest
    return next();
  }

  // Token exists, try to authenticate
  authMiddleware(req, res, next);
};

// Create Donation (with optional authentication)
router.post("/", optionalAuth, async (req, res) => {
  try {
    const { item, category, quantity } = req.body;

    if (!item || !category) {
      return res.status(400).json({ error: "Item and category are required" });
    }

    const donationData = {
      donorName: req.user?.name || "Guest Donor",
      item,
      category,
      quantity: quantity || 1
    };

    // Only add userId if user is authenticated
    if (req.user && req.user.id) {
      donationData.userId = req.user.id;
    }

    const donation = new Donation(donationData);

    await donation.save();
    res.json({
      message: req.user ? "Donation added successfully" : "Donation submitted successfully. Thank you for your contribution!",
      donation
    });
  } catch (err) {
    console.error("Create donation error:", err);
    // Mongoose validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message).join(', ');
      return res.status(400).json({ error: `Donation validation failed: ${messages}` });
    }
    res.status(500).json({ error: err.message });
  }
});

// Get All Donations with dynamic filtering and pagination
router.get("/", async (req, res) => {
  try {
    const {
      userType,        // 'all', 'registered', 'guest'
      paymentStatus,   // 'all', 'Paid', 'Pending', 'Failed', 'Cancelled'
      searchQuery,     // search in name or email
      dateFrom,        // YYYY-MM-DD
      dateTo,          // YYYY-MM-DD
      page = 1,        // Page number (default: 1)
      limit = 10       // Items per page (default: 10)
    } = req.query;

    // Build dynamic filter object
    let filter = {};

    // User Type Filter
    if (userType && userType !== 'all') {
      if (userType === 'registered') {
        filter.userId = { $ne: null };
      } else if (userType === 'guest') {
        filter.userId = null;
      }
    }

    // Payment Status Filter
    if (paymentStatus && paymentStatus !== 'all') {
      filter.paymentStatus = paymentStatus;
    }

    // Date Range Filter
    if (dateFrom || dateTo) {
      filter.date = {};
      if (dateFrom) {
        filter.date.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59, 999); // End of day
        filter.date.$lte = toDate;
      }
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute query with filters and sort by createdAt descending (newest first)
    let query = Donation.find(filter)
      .populate("category")
      .populate("userId", "name email")
      .sort({ createdAt: -1 }); // Sort by creation date, newest first

    // Search Query Filter (applied after population)
    let donations = await query;

    if (searchQuery && searchQuery.trim()) {
      const search = searchQuery.toLowerCase();
      donations = donations.filter(d => {
        const name = (d.userId?.name || d.donorName || '').toLowerCase();
        const email = (d.userId?.email || d.donorEmail || '').toLowerCase();
        return name.includes(search) || email.includes(search);
      });
    }

    // Get total count
    const total = donations.length;

    // Apply pagination to the filtered results
    const paginatedDonations = donations.slice(skip, skip + limitNum);

    // Return paginated response
    res.json({
      donations: paginatedDonations,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        limit: limitNum
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Filter Options - Returns unique values for filters
router.get("/filter-options", async (req, res) => {
  try {
    // Get all donations to extract unique values
    const donations = await Donation.find().sort({ createdAt: -1 });

    // Get unique payment statuses
    const paymentStatuses = [...new Set(
      donations
        .map(d => d.paymentStatus)
        .filter(status => status)
    )];

    // Check if we have registered and guest users
    const hasRegistered = donations.some(d => d.userId);
    const hasGuest = donations.some(d => !d.userId);
    const userTypes = [];
    if (hasRegistered) userTypes.push('registered');
    if (hasGuest) userTypes.push('guest');

    // Get date range
    const dates = donations
      .map(d => new Date(d.date))
      .filter(date => !isNaN(date.getTime()));

    const minDate = dates.length > 0 ? new Date(Math.min(...dates)) : null;
    const maxDate = dates.length > 0 ? new Date(Math.max(...dates)) : null;

    // Get counts for each option
    const registeredCount = donations.filter(d => d.userId).length;
    const guestCount = donations.filter(d => !d.userId).length;

    const statusCounts = {};
    paymentStatuses.forEach(status => {
      statusCounts[status] = donations.filter(d => d.paymentStatus === status).length;
    });

    res.json({
      paymentStatuses,
      userTypes,
      dateRange: {
        min: minDate ? minDate.toISOString().split('T')[0] : null,
        max: maxDate ? maxDate.toISOString().split('T')[0] : null
      },
      counts: {
        total: donations.length,
        registered: registeredCount,
        guest: guestCount,
        byStatus: statusCounts
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Donations by User with filtering and pagination
router.get("/user/:userId", authMiddleware, async (req, res) => {
  try {
    if (req.user.id !== req.params.userId && req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const {
      category,    // Category ID filter
      dateFrom,    // YYYY-MM-DD
      dateTo,      // YYYY-MM-DD
      page = 1,    // Page number (default: 1)
      limit = 10   // Items per page (default: 10)
    } = req.query;

    // Build filter object
    let filter = { userId: req.params.userId };

    // Category Filter
    if (category && category !== 'all') {
      filter.category = category;
    }

    // Date Range Filter
    if (dateFrom || dateTo) {
      filter.date = {};
      if (dateFrom) {
        filter.date.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59, 999); // End of day
        filter.date.$lte = toDate;
      }
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Get total count for pagination
    const total = await Donation.countDocuments(filter);

    // Execute query with filters, pagination, and sort by createdAt descending
    const donations = await Donation.find(filter)
      .populate("category")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      donations,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Donation Status
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json({ message: "Donation updated", donation });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Get Single Donation Details
router.get("/:id", async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate("category", "name description price")
      .populate("userId", "name email phone role");

    if (!donation) {
      return res.status(404).json({ error: "Donation not found" });
    }

    res.json(donation);
  } catch (err) {
    console.error("Error fetching donation details:", err);
    res.status(500).json({ error: err.message });
  }
});

// Admin: Approve/Reject donation
router.patch("/:id/status", adminAuth, async (req, res) => {
  const { status } = req.body; 
  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }
  try {
    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!donation) return res.status(404).json({ message: "Donation not found" });
    res.json(donation);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get Donation Statistics for Charts
router.get("/stats/charts", adminAuth, async (req, res) => {
  try {
    const {
      period,      // 'monthly', 'yearly', 'custom'
      dateFrom,    // For custom range
      dateTo,      // For custom range
      year,        // For yearly view
      month        // For monthly view (format: YYYY-MM)
    } = req.query;

    let startDate, endDate;
    const now = new Date();

    // Determine date range based on period
    if (period === 'monthly') {
      // Current month
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    } else if (period === 'yearly') {
      // Current year or specified year
      const targetYear = year ? parseInt(year) : now.getFullYear();
      startDate = new Date(targetYear, 0, 1);
      endDate = new Date(targetYear, 11, 31, 23, 59, 59, 999);
    } else if (period === 'custom' && dateFrom && dateTo) {
      startDate = new Date(dateFrom);
      endDate = new Date(dateTo);
      endDate.setHours(23, 59, 59, 999);
    } else {
      // Default to current month
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    }

    // Get donations within date range
    const donations = await Donation.find({
      date: { $gte: startDate, $lte: endDate }
    }).populate("category").sort({ date: -1 });

    // Calculate statistics
    const stats = {
      totalDonations: donations.length,
      totalAmount: donations.reduce((sum, d) => sum + (d.amount || 0), 0),
      paidAmount: donations.filter(d => d.paymentStatus === 'Paid').reduce((sum, d) => sum + (d.amount || 0), 0),
      pendingAmount: donations.filter(d => d.paymentStatus === 'Pending').reduce((sum, d) => sum + (d.amount || 0), 0),
      registeredUsers: donations.filter(d => d.userId).length,
      guestUsers: donations.filter(d => !d.userId).length,
      byStatus: {},
      byCategory: {},
      timeline: []
    };

    // Group by payment status
    donations.forEach(d => {
      const status = d.paymentStatus || 'Unknown';
      stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;
    });

    // Group by category
    donations.forEach(d => {
      const categoryName = d.category?.name || 'Uncategorized';
      if (!stats.byCategory[categoryName]) {
        stats.byCategory[categoryName] = {
          count: 0,
          amount: 0
        };
      }
      stats.byCategory[categoryName].count += 1;
      stats.byCategory[categoryName].amount += (d.amount || 0);
    });

    // Create timeline data based on period
    if (period === 'yearly' || (period === 'custom' && dateTo && dateFrom)) {
      // Group by month
      const monthlyData = {};
      donations.forEach(d => {
        const monthKey = new Date(d.date).toISOString().slice(0, 7); // YYYY-MM
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = {
            count: 0,
            amount: 0,
            paid: 0
          };
        }
        monthlyData[monthKey].count += 1;
        monthlyData[monthKey].amount += (d.amount || 0);
        if (d.paymentStatus === 'Paid') {
          monthlyData[monthKey].paid += (d.amount || 0);
        }
      });

      // Convert to array and sort
      stats.timeline = Object.keys(monthlyData).sort().map(month => ({
        period: month,
        count: monthlyData[month].count,
        amount: monthlyData[month].amount,
        paidAmount: monthlyData[month].paid
      }));
    } else if (period === 'monthly') {
      // Group by day
      const dailyData = {};
      donations.forEach(d => {
        const dayKey = new Date(d.date).toISOString().slice(0, 10); // YYYY-MM-DD
        if (!dailyData[dayKey]) {
          dailyData[dayKey] = {
            count: 0,
            amount: 0,
            paid: 0
          };
        }
        dailyData[dayKey].count += 1;
        dailyData[dayKey].amount += (d.amount || 0);
        if (d.paymentStatus === 'Paid') {
          dailyData[dayKey].paid += (d.amount || 0);
        }
      });

      // Convert to array and sort
      stats.timeline = Object.keys(dailyData).sort().map(day => ({
        period: day,
        count: dailyData[day].count,
        amount: dailyData[day].amount,
        paidAmount: dailyData[day].paid
      }));
    }

    res.json({
      stats,
      dateRange: {
        from: startDate.toISOString(),
        to: endDate.toISOString()
      },
      period
    });
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
