export default function AboutPage() {
  return (
    <div className="min-h-screen bg-bg">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-text-primary mb-4">About Us</h1>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Learn more about our passion for technology and commitment to delivering exceptional products and experiences.
            </p>
          </div>



          {/* Personal Information */}
          <div className="bg-surface rounded-lg shadow-soft p-8 mb-12">
            <h2 className="text-2xl font-bold text-text-primary mb-6">Meet the Founder</h2>
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              {/* Profile Image Placeholder */}
              <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center text-4xl text-text-primary font-bold flex-shrink-0">
                Y
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-semibold text-text-primary mb-2">Lê Đăng Hiệp</h3>
                <p className="text-primary font-medium mb-4">Founder & CEO</p>
                <p className="text-text-secondary leading-relaxed mb-4">
                  With a passion for technology and e-commerce, I founded this store to create a trusted
                  online destination where customers can find genuine, high-quality products at fair prices.
                  My background in software development and digital solutions has helped me build a platform
                  that combines technical excellence with outstanding customer service.
                </p>
                <p className="text-text-secondary leading-relaxed">
                  As a student at PTIT (Posts and Telecommunications Institute of Technology) in Hanoi,
                  I'm constantly learning and applying new technologies to improve our services.
                  When I'm not working on the store, you can find me exploring new technologies,
                  developing innovative solutions, or helping fellow students with their projects.
                  I believe in the power of technology to improve lives, and I'm committed to making
                  that vision a reality through our products and services.
                </p>
              </div>
            </div>
          </div>

          {/* Experience & Skills */}
          <div className="bg-surface rounded-lg shadow-soft p-8 mb-12">
            <h2 className="text-2xl font-bold text-text-primary mb-6">Experience & Expertise</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-4">Technical Skills</h3>
                <ul className="space-y-2 text-text-secondary">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Full-Stack Web Development
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    E-commerce Platform Development
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Database Management & Optimization
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Payment Integration & Security
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Mobile App Development
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-4">Business Expertise</h3>
                <ul className="space-y-2 text-text-secondary">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-accent rounded-full mr-3"></span>
                    Digital Marketing & SEO
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-accent rounded-full mr-3"></span>
                    Customer Relationship Management
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-accent rounded-full mr-3"></span>
                    Supply Chain & Inventory Management
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-accent rounded-full mr-3"></span>
                    E-commerce Analytics & Optimization
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-accent rounded-full mr-3"></span>
                    Team Leadership & Management
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="bg-surface rounded-lg shadow-soft p-8 mb-12">
            <h2 className="text-2xl font-bold text-text-primary mb-6">Why Choose Our Store?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center text-text-primary font-bold text-sm flex-shrink-0 mt-1">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary">Genuine Products</h4>
                    <p className="text-sm text-text-secondary">All products are 100% authentic with manufacturer warranties</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center text-text-primary font-bold text-sm flex-shrink-0 mt-1">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary">Fast Shipping</h4>
                    <p className="text-sm text-text-secondary">Free shipping on orders over $50, delivered within 3-5 days</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center text-text-primary font-bold text-sm flex-shrink-0 mt-1">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary">30-Day Returns</h4>
                    <p className="text-sm text-text-secondary">Easy returns and refunds within 30 days of purchase</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center text-text-primary font-bold text-sm flex-shrink-0 mt-1">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary">Expert Support</h4>
                    <p className="text-sm text-text-secondary">24/7 customer support from technology experts</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center text-text-primary font-bold text-sm flex-shrink-0 mt-1">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary">Best Prices</h4>
                    <p className="text-sm text-text-secondary">Competitive pricing with regular sales and discounts</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center text-text-primary font-bold text-sm flex-shrink-0 mt-1">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary">Secure Shopping</h4>
                    <p className="text-sm text-text-secondary">SSL encryption and secure payment processing</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-surface rounded-lg shadow-soft p-8">
            <h2 className="text-2xl font-bold text-text-primary mb-4">Ready to Shop?</h2>
            <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
              Discover our wide range of technology products and experience shopping with confidence.
              Join thousands of satisfied customers who trust us for their tech needs.
            </p>
            <a
              href="/products"
              className="inline-block bg-primary text-text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary/80 transition-colors"
            >
              Browse Products
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
