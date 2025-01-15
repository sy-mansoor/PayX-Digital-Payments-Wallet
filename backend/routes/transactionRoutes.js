  const express = require('express');
  const router = express.Router();
  const {check, validationResult} = require('express-validator');
  const authMiddleware = require('../middleware/authMiddleware');
  const User = require('../models/User');
  const Transaction = require('../models/Transaction');
  const Notification = require('../models/Notification');

  router.post('/send',
    [
      authMiddleware,
      check('recipientEmail', 'Recipient email is required').notEmpty(),
      check('recipientEmail', 'Please include a valid email').isEmail(),
      check('amount', 'Amount is required').notEmpty(),
      check('amount', 'Amount must be a positive number').isFloat({ gt: 0 }),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {

        const formattedErrors = errors.array().map(error => error.msg); // Extract error messages
        return res.status(400).json({ errors: formattedErrors });
      }

      const { recipientEmail, amount } = req.body;
      const parsedAmount = parseInt(amount);
      try {
        const sender = await User.findById(req.user.id);
        const recipient = await User.findOne({ email: recipientEmail });

        if (!recipient) {
          return res.status(400).json({ errors: ['Recipient not found'] });
        }
        if (sender.email === recipientEmail) {
          return res.status(400).json({ errors: ['Cannot send money to yourself'] });
        }

        if (sender.balance < amount) {
          return res.status(400).json({ errors: ['Insufficient balance'] });
        }

        // Create transaction for sender
        const senderTransaction = new Transaction({
          user: req.user.id,
          type: 'debit',
          amount: parsedAmount,
          description: `Sent money to ${recipientEmail}`,
        });
        await senderTransaction.save();

        // Create transaction for recipient
        const recipientTransaction = new Transaction({
          user: recipient.id,
          type: 'credit',
          amount: parsedAmount,
          description: `Received money from ${sender.email}`,
        });
        await recipientTransaction.save();

        sender.balance -= parsedAmount;
        recipient.balance += parsedAmount;

        await sender.save();
        await recipient.save();

        res.json({ msg: 'Transaction successful', senderBalance: sender.balance });
      } catch (err) {
        console.error(err.message);
        // Handle server errors
        res.status(500).json({ errors: ['Server Error'] });
      }
    }
  );


  router.post(
    '/request',
    [
      authMiddleware,
      check('recipientEmail', 'Recipient email is required').notEmpty(),
      check('recipientEmail', 'Please include a valid email').isEmail(),
      check('amount', 'Amount is required').notEmpty(),
      check('amount', 'Amount must be a positive number').isFloat({ gt: 0 }),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // Handle validation errors from express-validator
        const formattedErrors = errors.array().map(error => error.msg); // Extract error messages
        return res.status(400).json({ errors: formattedErrors });
      }

      const { recipientEmail, amount } = req.body;
      try {
        const sender = await User.findById(req.user.id);
        const recipient = await User.findOne({ email: recipientEmail });

        if (!recipient) {
          return res.status(400).json({ errors: ['Recipient not found'] });
        }
         if (sender.email === recipientEmail) {
          return res.status(400).json({ errors: ['Cannot request money from yourself'] });
        }

        // Create a notification for the recipient

        const notification = new Notification({
          user: recipient.id,
          type: 'request',
          message: `${sender.email} has requested $${amount} from you.`,
          relatedUser: sender.id, // Add related user here
          amount: amount,
          status:'pending',
        });
        await notification.save();

        res.json({ msg: 'Money request initiated', recipientEmail, amount });
      } catch (err) {
        console.error(err.message);
        // Handle server errors
        res.status(500).json({ errors: ['Server Error'] });
      }
    }
  );


  router.get('/notifications', authMiddleware, async (req, res) => {
    try {
      const notifications = await Notification.find({ user: req.user.id }).sort({ timestamp: -1 });
      res.json(notifications);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ errors: ['Server Error'] });
    }
  });


  router.post('/notifications/:notificationId/accept', authMiddleware, async (req, res) => {
    try {
      const notification = await Notification.findById(req.params.notificationId);

      if (!notification) {
        return res.status(404).json({ errors: ['Notification not found'] });
      }

      // Check if the notification belongs to the user
      if (notification.user.toString() !== req.user.id) {
        return res.status(403).json({ errors: ['Unauthorized action'] });
      }

      // Check if the notification is already processed
      if (notification.status !== 'pending') {
        return res.status(400).json({ errors: ['Notification already processed'] });
      }
      const recipient = await User.findById(req.user.id);
      const sender = await User.findById(notification.relatedUser);
      const parsedAmount
   = parseInt(notification.amount);

      if (!sender) {
          return res.status(400).json({ errors: ['Sender not found'] });
      }

      if (recipient.balance < parsedAmount) {
        return res.status(400).json({ errors: ['Insufficient balance'] });
      }
      // Create transaction for sender
        const senderTransaction = new Transaction({
          user: sender.id,
          type: 'credit',
          amount: parsedAmount,
          description: `Received money from ${recipient.email} for the request`,
        });
        await senderTransaction.save();

        // Create transaction for recipient
        const recipientTransaction = new Transaction({
          user: recipient.id,
          type: 'debit',
          amount: parsedAmount,
          description: `Sent money to ${sender.email} for the request`,
        });
        await recipientTransaction.save();
         // Update balances
        sender.balance += parsedAmount;
        recipient.balance -= parsedAmount;

        await sender.save();
        await recipient.save();

         // Update notification status
         notification.status = 'accepted';
         await notification.save();
         res.json({ msg: 'Request accepted successfully', recipientBalance: recipient.balance, senderBalance:sender.balance });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ errors: ['Server Error'] });
    }
  });



  router.post('/notifications/:notificationId/reject', authMiddleware, async (req, res) => {
    try {
      const notification = await Notification.findById(req.params.notificationId);

      if (!notification) {
        return res.status(404).json({ errors: ['Notification not found'] });
      }
      // Check if the notification belongs to the user
      if (notification.user.toString() !== req.user.id) {
        return res.status(403).json({ errors: ['Unauthorized action'] });
      }

      // Check if the notification is already processed
      if (notification.status !== 'pending') {
        return res.status(400).json({ errors: ['Notification already processed'] });
      }
       // Update notification status
       notification.status = 'rejected';
       await notification.save();
      res.json({ msg: 'Request rejected successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ errors: ['Server Error'] });
    }
  });



  router.get('/balance', authMiddleware, async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('balance');
      res.json({ balance: user.balance });
    } catch (err) {
      console.error(err.message);
      // Handle server errors
      res.status(500).json({ errors: ['Server Error'] });
    }
  });



  const getDateRange = (period) => {
    const now = new Date();
    const start = new Date(now);
    const end = new Date(now);

    switch (period) {
      case 'today':
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case 'week':
        start.setDate(now.getDate() - 7);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case 'month':
        start.setMonth(now.getMonth(), 1);
        start.setHours(0, 0, 0, 0);
        end.setMonth(now.getMonth() + 1, 0);
        end.setHours(23, 59, 59, 999);
        break;
      default:
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
    }

    return { start, end };
  };

  // Get user's transactions
  router.get('/', authMiddleware, async (req, res) => {
    try {
      const transactions = await Transaction.find({ user: req.user.id }).sort({ timestamp: -1 });
      res.json(transactions);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ errors: ['Server Error'] });
    }
  });

  // Get all transactions
  router.get('/transactions', authMiddleware, async (req, res) => {
    try {
      const transactions = await Transaction.find(); // Fetch all transactions from DB
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get transaction stats
  router.get('/stats', authMiddleware, async (req, res) => {
    try {
      const { period = 'today' } = req.query;
      const { start, end } = getDateRange(period);

      const transactions = await Transaction.find({
        user: req.user.id, // Use req.user.id instead of _id
        timestamp: { $gte: start, $lte: end },
        type: 'credit'
      }).sort('timestamp');

      let chartData;
      if (period === 'today') {
        chartData = Array.from({ length: 24 }, (_, hour) => {
          const hourTransactions = transactions.filter(t =>
              new Date(t.timestamp).getHours() === hour
          );
          return {
            time: `${hour.toString().padStart(2, '0')}:00`,
            amount: hourTransactions.reduce((sum, t) => sum + t.amount, 0)
          };
        });

      } else if (period === 'week') {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        chartData = Array.from({ length: 7 }, (_, i) => {
          const dayTransactions = transactions.filter(t =>
              new Date(t.timestamp).getDay() === i
          );
          return {
            time: days[i],
            amount: dayTransactions.reduce((sum, t) => sum + t.amount, 0)
          };
        });
      } else {
        const daysInMonth = new Date(end).getDate();
        chartData = Array.from({ length: daysInMonth }, (_, i) => {
          const date = new Date(start);
          date.setDate(date.getDate() + i);
          const dayTransactions = transactions.filter(t =>
              new Date(t.timestamp).toDateString() === date.toDateString()
          );
          return {
            time: (i + 1).toString(),
            amount: dayTransactions.reduce((sum, t) => sum + t.amount, 0)
          };
        });
      }

      const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);

      res.json({
        chartData,
        totalAmount,
        period
      });
    } catch (error) {
      console.error('Error fetching transactions:', error);
      res.status(500).json({
        message: 'Error fetching transactions.',
        error: error.message
      });
    }
  });
//  Gemini

  router.get('/dashboard/data', async (req, res) => {
    try {
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      const [todayTransactions, weeklyTransactions, monthlyTransactions] =
          await Promise.all([
            Transaction.find({
              date: {
                $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate())
              }
            }),
            Transaction.aggregate([
              {
                $match: {
                  date: {
                    $gte: startOfWeek,
                  },
                },
              },
              {
                $group: {
                  _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                  total: { $sum: "$amount" },
                },
              },
              {
                $sort: { _id: 1 },
              },
            ]),
            Transaction.aggregate([
              {
                $match: {
                  date: {
                    $gte: startOfMonth,
                  },
                },
              },
              {
                $group: {
                  _id: { $week: "$date" },
                  total: { $sum: "$amount" },
                },
              },
              {
                $sort: { _id: 1 },
              },
            ]),
          ]);

      // Format weeklyTransactions for the chart
      const formattedWeeklyTransactions = weeklyTransactions.map((week) => ({
        day: week._id,
        total: week.total,
      }));

      // Format monthlyTransactions for the chart
      const formattedMonthlyTransactions = monthlyTransactions.map((month) => ({
        week: `Week ${month._id}`,
        total: month.total,
      }));

      res.status(200).json({
        todayTransactions,
        weeklyTransactions: formattedWeeklyTransactions,
        monthlyTransactions: formattedMonthlyTransactions
      });

    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
    }
  });


  module.exports = router;
