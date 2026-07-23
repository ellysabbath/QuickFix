// src/utils/seo.ts

export interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  author?: string;
}

export const defaultSEO: SEOProps = {
  title: 'Fundi Fasta - Motor Vehicle Solutions Platform',
  description: 'Find trusted mechanics and garages near you. Book services, track repairs, and solve motor vehicle problems anywhere in Africa.',
  keywords: 'mechanic, garage, car repair, vehicle service, auto repair, fundi fasta',
  image: 'https://garagenea.com/logo.png',
  url: 'https://garagenea.com',
  type: 'website',
};

export const routeSEO: Record<string, SEOProps> = {
  '/': {
    title: 'Fundi Fasta - Find Trusted Mechanics & Garages Near You',
    description: 'Connect with verified mechanics and garages. Book car repairs, maintenance, and emergency vehicle services instantly.',
    keywords: 'mechanic, garage, car repair, vehicle service, auto repair, roadside assistance',
  },
  '/signup': {
    title: 'Sign Up - Fundi Fasta | Join the Vehicle Repair Platform',
    description: 'Create your account to book mechanics, manage repairs, and track your vehicle service history.',
  },
  '/login': {
    title: 'Login - Fundi Fasta | Access Your Vehicle Services',
    description: 'Log in to your Fundi Fasta account to manage bookings, track repairs, and connect with mechanics.',
  },
  '/verify-otp': {
    title: 'Verify OTP - Fundi Fasta | Secure Account Verification',
    description: 'Verify your account to access all Fundi Fasta features and services.',
  },
  '/dashboard': {
    title: 'Dashboard - Fundi Fasta | Manage Your Vehicle Services',
    description: 'View your active bookings, service history, and manage your vehicle repair needs.',
  },
  '/bookings': {
    title: 'My Bookings - Fundi Fasta | Track Your Repairs',
    description: 'View and manage all your vehicle repair bookings with trusted mechanics.',
  },
  '/list': {
    title: 'Mechanics List - Fundi Fasta | Find Verified Auto Experts',
    description: 'Browse our list of verified mechanics and garages near you. Book services instantly.',
  },
  '/garages': {
    title: 'Garages Near You - Fundi Fasta | Auto Repair Shops',
    description: 'Find the best garages and auto repair shops near your location. Compare prices and services.',
  },
  '/my-location': {
    title: 'Find Nearby Services - Fundi Fasta | Location-Based Mechanics',
    description: 'Find mechanics and garages based on your current location for quick vehicle repairs.',
  },
  '/payments': {
    title: 'Payment - Fundi Fasta | Secure Service Payments',
    description: 'Make secure payments for your vehicle repair services on Fundi Fasta.',
  },
  '/profile': {
    title: 'My Profile - Fundi Fasta | Manage Your Account',
    description: 'Update your profile, manage your vehicles, and view your service history.',
  },
  '/requests': {
    title: 'Service Requests - Fundi Fasta | Track Your Repairs',
    description: 'Track the status of your vehicle service requests and repair progress.',
  },
  '/myrequest': {
    title: 'My Service Requests - Fundi Fasta | Repair History',
    description: 'View your complete vehicle repair history and service requests.',
  },
  '/map': {
    title: 'Find Mechanics on Map - Fundi Fasta | Location-Based Search',
    description: 'Find and locate mechanics and garages on the map for emergency repairs.',
  },
  '/contacts': {
    title: 'Contact Us - Fundi Fasta | Get Support',
    description: 'Contact Fundi Fasta support for help with bookings, payments, or technical issues.',
  },
  '/settings': {
    title: 'Settings - Fundi Fasta | Manage Preferences',
    description: 'Manage your account settings, notifications, and preferences.',
  },
  '/help': {
    title: 'Help Center - Fundi Fasta | FAQs & Support',
    description: 'Find answers to common questions about using Fundi Fasta platform.',
  },
  // Admin routes - not for SEO but we set them anyway
  '/admin/services': {
    title: 'Admin - Manage Services | Fundi Fasta',
    description: 'Admin panel for managing vehicle services.',
  },
  '/who-fixed': {
    title: 'Who Fixed My Car? - Fundi Fasta | Service History',
    description: 'Track which mechanic fixed your vehicle and service details.',
  },
  '/mechanic/bookings': {
    title: 'Mechanic Bookings - Fundi Fasta | Service Management',
    description: 'Manage your mechanic bookings and service requests.',
  },
  '/admin/garages': {
    title: 'Admin - Manage Garages | Fundi Fasta',
    description: 'Admin panel for managing garages and workshops.',
  },
  '/admin/manage': {
    title: 'Admin - Manage Users | Fundi Fasta',
    description: 'Admin panel for managing platform users.',
  },
  '/admin/mechanics': {
    title: 'Admin - Manage Mechanics | Fundi Fasta',
    description: 'Admin panel for managing mechanics on the platform.',
  },
  '/admin/approve': {
    title: 'Admin - Approve Requests | Fundi Fasta',
    description: 'Admin panel for approving mechanic and garage requests.',
  },
  '/admin/bookings': {
    title: 'Admin - All Bookings | Fundi Fasta',
    description: 'Admin panel for viewing all platform bookings.',
  },
  '/admin/users': {
    title: 'Admin - User Management | Fundi Fasta',
    description: 'Admin panel for managing platform users.',
  },
};