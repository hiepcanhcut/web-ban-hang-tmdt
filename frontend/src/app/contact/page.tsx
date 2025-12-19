export default function ContactPage() {
  return (
    <div className="min-h-screen bg-bg">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-text-primary mb-4">Contact Us</h1>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Get in touch with us. We're here to help with any questions about our products or services.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-text-primary mb-6">Get In Touch</h2>
                <p className="text-text-secondary mb-8 leading-relaxed">
                  Have a question about our products, need help with an order, or want to learn more
                  about our services? We'd love to hear from you. Send us a message and we'll respond
                  as soon as possible.
                </p>
              </div>

              {/* Contact Details */}
              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-text-primary text-xl flex-shrink-0">
                    📧
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary mb-1">Email</h3>
                    <p className="text-text-secondary">hiepl3252@gmail.com</p>
                    <p className="text-text-secondary">support@eshop.com</p>
                    <p className="text-sm text-text-secondary/70 mt-1">We respond within 24 hours</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center text-text-primary text-xl flex-shrink-0">
                    📞
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary mb-1">Phone</h3>
                    <p className="text-text-secondary">0919 169 005</p>
                    <p className="text-text-secondary">Lê Đăng Hiệp</p>
                    <p className="text-sm text-text-secondary/70 mt-1">Available 24/7 for support</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-success rounded-lg flex items-center justify-center text-text-primary text-xl flex-shrink-0">
                    📍
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary mb-1">Location</h3>
                    <p className="text-text-secondary">
                      PTIT - Posts and Telecommunications Institute of Technology<br />
                      Hanoi, Vietnam
                    </p>
                    <p className="text-sm text-text-secondary/70 mt-1">Student & Developer</p>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-warning rounded-lg flex items-center justify-center text-text-primary text-xl flex-shrink-0">
                    🕐
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary mb-1">Business Hours</h3>
                    <div className="text-text-secondary space-y-1">
                      <p><span className="font-medium">Monday - Friday:</span> 9:00 AM - 6:00 PM EST</p>
                      <p><span className="font-medium">Saturday:</span> 10:00 AM - 4:00 PM EST</p>
                      <p><span className="font-medium">Sunday:</span> Closed</p>
                    </div>
                    <p className="text-sm text-text-secondary/70 mt-1">Emergency support available 24/7</p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-surface rounded-lg shadow-soft p-6">
                <h3 className="font-semibold text-text-primary mb-4">Follow Us</h3>
                <p className="text-text-secondary mb-4">
                  Stay connected and get the latest updates on new products and special offers.
                </p>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-text-primary hover:bg-primary/80 transition-colors"
                    aria-label="Facebook"
                  >
                    📘
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center text-text-primary hover:bg-accent/80 transition-colors"
                    aria-label="Twitter"
                  >
                    🐦
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center text-text-primary hover:bg-pink-600 transition-colors"
                    aria-label="Instagram"
                  >
                    📷
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center text-text-primary hover:bg-red-600 transition-colors"
                    aria-label="YouTube"
                  >
                    📺
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-text-primary hover:bg-blue-700 transition-colors"
                    aria-label="LinkedIn"
                  >
                    💼
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-surface rounded-lg shadow-soft p-8">
              <h2 className="text-2xl font-bold text-text-primary mb-6">Send us a Message</h2>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-bg border border-text-secondary/30 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary"
                      placeholder="Your first name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-bg border border-text-secondary/30 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary"
                      placeholder="Your last name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 bg-bg border border-text-secondary/30 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Subject *
                  </label>
                  <select
                    className="w-full px-3 py-2 bg-bg border border-text-secondary/30 rounded-lg text-text-primary focus:outline-none focus:border-primary"
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="order">Order Inquiry</option>
                    <option value="product">Product Information</option>
                    <option value="support">Technical Support</option>
                    <option value="returns">Returns & Exchanges</option>
                    <option value="business">Business Partnership</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Order Number (if applicable)
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-bg border border-text-secondary/30 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary"
                    placeholder="e.g., order_1234567890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Message *
                  </label>
                  <textarea
                    rows={6}
                    className="w-full px-3 py-2 bg-bg border border-text-secondary/30 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary resize-none"
                    placeholder="Tell us how we can help you..."
                    required
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="newsletter"
                    className="mr-3 text-primary focus:ring-primary"
                  />
                  <label htmlFor="newsletter" className="text-sm text-text-secondary">
                    Subscribe to our newsletter for updates and special offers
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-text-primary py-3 rounded-lg font-semibold hover:bg-primary/80 transition-colors"
                >
                  Send Message
                </button>
              </form>

              {/* Response Time Notice */}
              <div className="mt-6 p-4 bg-bg rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="text-blue-500 text-xl">ℹ️</div>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-1">Response Time</h4>
                    <p className="text-sm text-text-secondary">
                      We typically respond to all inquiries within 24 hours during business days.
                      For urgent technical issues, our support team is available 24/7.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16 bg-surface rounded-lg shadow-soft p-8">
            <h2 className="text-2xl font-bold text-text-primary mb-8 text-center">Frequently Asked Questions</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-text-primary mb-2">How long does shipping take?</h3>
                  <p className="text-text-secondary text-sm">
                    Standard shipping takes 3-5 business days. Express shipping is available for 1-2 business days.
                    Free shipping on orders over $50.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-text-primary mb-2">What is your return policy?</h3>
                  <p className="text-text-secondary text-sm">
                    We offer a 30-day return policy for most items. Products must be in original condition with all
                    accessories and packaging.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-text-primary mb-2">Do you offer warranty?</h3>
                  <p className="text-text-secondary text-sm">
                    All products come with manufacturer warranties. Additional extended warranty options are available
                    for select products.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-text-primary mb-2">How can I track my order?</h3>
                  <p className="text-text-secondary text-sm">
                    You'll receive a tracking number via email once your order ships. You can also track your order
                    status in your account dashboard.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-text-primary mb-2">Do you ship internationally?</h3>
                  <p className="text-text-secondary text-sm">
                    Currently, we ship within the United States. International shipping options will be available soon.
                    Contact us for more information.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-text-primary mb-2">How do I contact customer service?</h3>
                  <p className="text-text-secondary text-sm">
                    You can reach us via email at support@eshop.com, phone at +1 (555) 123-4567, or through the contact
                    form above. We're here to help!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
