# Database Seeding Script

## Overview
This script generates **1000 dummy users** with authentic Indian names and creates **multiple donation records** for each user, totaling thousands of donation entries with proper user-donation relationships.

## Features

### 👥 User Generation (1000 users)
- **Indian Names**: Realistic first and last names from various Indian regions
- **Mobile Numbers**: Valid Indian format (+91 XXXXXXXXXX)
- **Email Addresses**: Gmail, Yahoo, Outlook, Rediffmail, Hotmail
- **Cities**: 50+ major Indian cities
- **Addresses**: Realistic Indian street addresses
- **Registration Dates**: Random dates from the last 2 years
- **Default Password**: `Password@123` for all users

### 💰 Donation Generation (2-8 donations per user)
- **Random Dates**: Donations spread across last 2 years with random timestamps
- **Payment Methods**: UPI, Card, NetBanking (randomly distributed)
- **Payment Status Distribution**:
  - 90% Paid (Successful)
  - 8% Pending
  - 2% Failed

### 📊 Donation Categories & Amounts

1. **Education Support** - Base: ₹300
   - Books and stationery
   - School uniforms
   - Educational materials
   - Online learning resources

2. **Medical Aid** - Base: ₹2,000
   - Medical supplies
   - Hospital bills
   - Medicine
   - Health checkups

3. **Community Development** - Base: ₹50,000
   - Infrastructure development
   - Clean water projects
   - Sanitation facilities
   - Community centers

**Extra Amount**: Each donation includes an extra amount (0-50% of base amount) randomly added

## Usage

### Method 1: Using npm script (Recommended)
```bash
cd Backend
npm run seed
```

### Method 2: Direct execution
```bash
cd Backend
node scripts/seedDatabase.js
```

## Output Example

```
🔌 Connecting to MongoDB...
✅ Connected to MongoDB

🗑️  Clearing existing data...
✅ Cleared existing data

📦 Checking categories...
✅ Found 3 existing categories

👥 Generating 1000 users with Indian names...
   Generated 100/1000 users...
   Generated 200/1000 users...
   ...
   Generated 1000/1000 users...
💾 Inserting users into database...
✅ Created 1000 users

💰 Generating donation records...
   Generated donations for 100/1000 users... (450 donations so far)
   Generated donations for 200/1000 users... (900 donations so far)
   ...
💾 Inserting donation records into database...
   Inserted 1000/5000 donations...
   Inserted 2000/5000 donations...
   ...
✅ Created 5000 donation records

📊 Database Statistics:
   👥 Total Users: 1000
   💰 Total Donations: 5000
   ✅ Paid Donations: 4500 (90.0%)
   ⏳ Pending Donations: 400 (8.0%)
   ❌ Failed Donations: 100 (2.0%)
   💵 Total Amount Collected: ₹45,00,00,000

🎉 Database seeding completed successfully!

📝 Sample User Credentials:
   Email: (any generated email)
   Password: Password@123

🔌 Database connection closed
```

## Sample Generated Data

### Sample User
```json
{
  "name": "Aarav Sharma",
  "email": "aarav.sharma@gmail.com",
  "phone": "+91 9876543210",
  "address": "123, MG Road, Mumbai",
  "role": "user",
  "isActive": true,
  "createdAt": "2024-06-15T10:30:45.000Z"
}
```

### Sample Donation
```json
{
  "userId": "ObjectId('...')",
  "donorName": "Aarav Sharma",
  "donorEmail": "aarav.sharma@gmail.com",
  "donorPhone": "+91 9876543210",
  "category": "ObjectId('...')",
  "item": "Education Support",
  "quantity": 1,
  "baseAmount": 300,
  "extraAmount": 150,
  "amount": 450,
  "paymentStatus": "Paid",
  "paymentMethod": "UPI",
  "transactionId": "TXN1705401234567",
  "date": "2024-08-20T14:22:10.000Z",
  "createdAt": "2024-08-20T14:22:10.000Z"
}
```

## Data Characteristics

### Indian Names Distribution
- **100 First Names**: Mix of traditional and modern Indian names
- **100 Last Names**: From various Indian states and communities
- **Realistic Combinations**: Authentic Indian naming patterns

### Cities Covered (50+)
Mumbai, Delhi, Bangalore, Hyderabad, Chennai, Kolkata, Pune, Ahmedabad, Jaipur, Lucknow, and 40+ more major Indian cities

### Mobile Numbers
- Format: +91 XXXXXXXXXX
- Valid Indian prefixes: 98, 99, 97, 96, 95, 94, 93, 92, 91, 90, 89, 88, 87, 86, 85, 84, 83, 82, 81, 80

### Email Domains
- gmail.com
- yahoo.com
- outlook.com
- rediffmail.com
- hotmail.com

## Database Impact

**Before Running:**
- Clears ALL existing users with email domains matching the generated ones
- Clears ALL existing donations
- Creates default categories if they don't exist

**After Running:**
- 1000 new users
- 4000-8000 donation records (average: 5000)
- Proper user-donation relationships maintained
- Transaction IDs for successful payments

## Testing & Verification

### Login as Generated User
```bash
Email: (any generated email from database)
Password: Password@123
```

### Verify Data in MongoDB
```bash
# Connect to MongoDB
mongosh

# Switch to database
use ocean-foundation

# Count users
db.users.countDocuments()

# Count donations
db.donations.countDocuments()

# Check payment status distribution
db.donations.aggregate([
  { $group: { _id: "$paymentStatus", count: { $sum: 1 } } }
])

# Check total amount by category
db.donations.aggregate([
  { $match: { paymentStatus: "Paid" } },
  { $lookup: { from: "categories", localField: "category", foreignField: "_id", as: "cat" } },
  { $unwind: "$cat" },
  { $group: { _id: "$cat.name", total: { $sum: "$amount" }, count: { $sum: 1 } } }
])
```

## Performance

- **Execution Time**: ~30-60 seconds (depending on system)
- **Memory Usage**: ~200-300 MB
- **Database Size**: ~50-100 MB additional storage

## Notes

⚠️ **Warning**: This script will DELETE existing users and donations before seeding!

✅ **Safe to run multiple times**: Script clears data before inserting new records

🔒 **All users have same password**: `Password@123` (hash: bcrypt with 10 rounds)

📅 **Date Range**: Last 2 years from current date

💳 **Transaction IDs**: Only generated for "Paid" donations

## Troubleshooting

### Error: Cannot connect to MongoDB
**Solution**: Check your `.env` file and ensure MongoDB is running
```bash
# Check MongoDB connection string in .env
MONGO_URI=mongodb://localhost:27017/ocean-foundation
```

### Error: Categories not found
**Solution**: Script will automatically create default categories

### Script hangs
**Solution**: 
1. Check MongoDB connection
2. Ensure sufficient memory (at least 1GB available)
3. Check for database locks

### Duplicate key error
**Solution**: Script clears data first, but if error persists:
```bash
# Manually clear collections
mongosh
use donation-system
db.users.deleteMany({})
db.donations.deleteMany({})
```

## Customization

To modify the seed data, edit `scripts/seedDatabase.js`:

```javascript
// Change number of users
const NUM_USERS = 1000; // Change this

// Change donations per user
const numDonations = randomInt(2, 8); // Modify range

// Change payment success rate
if (rand < 0.90) paymentStatus = 'Paid'; // Modify percentage

// Add more cities
const indianCities = [...]; // Add cities

// Add more names
const indianFirstNames = [...]; // Add names
```

## Statistics Expected

With 1000 users and 2-8 donations each:

- **Total Donations**: ~4,000 - 8,000
- **Average per User**: ~5 donations
- **Paid Donations**: ~4,500 (90%)
- **Total Amount**: ₹30-80 Crore (approximate)

## Related Files

- **Seed Script**: `Backend/scripts/seedDatabase.js`
- **User Model**: `Backend/models/User.js`
- **Donation Model**: `Backend/models/Donation.js`
- **Category Model**: `Backend/models/Category.js`

---

**Created**: January 11, 2026  
**Version**: 1.0  
**Author**: Smart Donation System

