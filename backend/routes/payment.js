const express = require('express');
const crypto = require('crypto');
const querystring = require('querystring');
const paypal = require('paypal-rest-sdk');
const { protect } = require('../middleware/auth');

const router = express.Router();

// PayPal configuration
paypal.configure({
  mode: 'sandbox', // Change to 'live' for production
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
});

// @desc    Create PayPal payment
// @route   POST /api/payment/paypal
// @access  Private
router.post('/paypal', protect, async (req, res) => {
  try {
    const { amount, currency = 'USD' } = req.body;

    const create_payment_json = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal',
      },
      redirect_urls: {
        return_url: 'http://localhost:3000/payment/success',
        cancel_url: 'http://localhost:3000/payment/cancel',
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: 'E-commerce Purchase',
                sku: 'item',
                price: amount,
                currency: currency,
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: currency,
            total: amount,
          },
          description: 'Payment for e-commerce purchase',
        },
      ],
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
        res.status(500).json({ message: error.message });
      } else {
        res.json({ paymentID: payment.id, approval_url: payment.links[1].href });
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Execute PayPal payment
// @route   POST /api/payment/paypal/execute
// @access  Private
router.post('/paypal/execute', protect, async (req, res) => {
  try {
    const { paymentID, payerID } = req.body;

    const execute_payment_json = {
      payer_id: payerID,
    };

    paypal.payment.execute(paymentID, execute_payment_json, function (error, payment) {
      if (error) {
        res.status(500).json({ message: error.message });
      } else {
        res.json({ success: true, payment });
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create VNPay payment URL
// @route   POST /api/payment/vnpay
// @access  Private
router.post('/vnpay', protect, async (req, res) => {
  try {
    const { amount, orderId } = req.body;

    const vnp_TmnCode = process.env.VNPAY_TMN_CODE;
    const vnp_HashSecret = process.env.VNPAY_HASH_SECRET;
    const vnp_Url = process.env.VNPAY_URL;
    const vnp_ReturnUrl = 'http://localhost:3000/payment/vnpay-return';

    const date = new Date();
    const createDate = date.toISOString().slice(0, 19).replace(/[:-]/g, '').replace('T', '');
    const orderId_vnp = orderId + '_' + createDate;

    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = vnp_TmnCode;
    vnp_Params['vnp_Locale'] = 'vn';
    vnp_Params['vnp_CurrCode'] = 'VND';
    vnp_Params['vnp_TxnRef'] = orderId_vnp;
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan don hang ' + orderId;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount * 100; // VNPay expects amount in smallest unit
    vnp_Params['vnp_ReturnUrl'] = vnp_ReturnUrl;
    vnp_Params['vnp_IpAddr'] = req.ip || '127.0.0.1';
    vnp_Params['vnp_CreateDate'] = createDate;

    vnp_Params = sortObject(vnp_Params);

    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac('sha512', vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    vnp_Params['vnp_SecureHash'] = signed;

    const paymentUrl = vnp_Url + '?' + querystring.stringify(vnp_Params, { encode: false });

    res.json({ paymentUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Helper function to sort object
function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
  }
  return sorted;
}

module.exports = router;
