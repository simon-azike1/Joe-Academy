const mongoose = require('mongoose');
require('dotenv').config();
const Course = require('./models/Course');
const User = require('./models/User');

const seedCourses = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    let instructor = await User.findOne({ role: 'instructor' });
    
    if (!instructor) {
      instructor = await User.create({
        name: 'Joe Smith',
        email: 'joe@joeacademy.com',
        password: 'password123',
        role: 'instructor',
        title: 'Expert Instructor',
        bio: 'Passionate educator with years of experience in teaching various subjects'
      });
      console.log('Created instructor:', instructor.email);
    }

    const courses = [
      {
        title: 'Complete Chemistry Masterclass',
        slug: 'complete-chemistry-masterclass',
        description: 'Master the fundamentals of chemistry including atomic structure, chemical bonding, reactions, thermodynamics, and organic chemistry. This comprehensive course covers everything from basic concepts to advanced topics suitable for students preparing for exams.',
        shortDescription: 'Master chemistry from atoms to organic compounds',
        thumbnail: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800',
        price: 79.99,
        originalPrice: 149.99,
        type: 'internal',
        instructor: instructor._id,
        category: 'Chemistry',
        level: 'beginner',
        duration: 3000,
        language: 'English',
        rating: 4.8,
        reviewCount: 156,
        enrollmentCount: 1234,
        isPublished: true,
        isFeatured: true,
        requirements: ['Basic high school mathematics', 'Curiosity for science'],
        objectives: ['Understand atomic structure', 'Master chemical bonding', 'Balance chemical equations', 'Understand organic chemistry basics'],
        tags: ['chemistry', 'science', 'atoms', 'organic chemistry', 'chemical reactions']
      },
      {
        title: 'Advanced Mathematics Bootcamp',
        slug: 'advanced-mathematics-bootcamp',
        description: 'A comprehensive mathematics course covering algebra, calculus, trigonometry, and statistics. Perfect for students looking to strengthen their math skills or prepare for competitive exams. Includes practical examples and problem-solving techniques.',
        shortDescription: 'From algebra to calculus - master all levels of math',
        thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800',
        price: 89.99,
        originalPrice: 179.99,
        type: 'internal',
        instructor: instructor._id,
        category: 'Mathematics',
        level: 'intermediate',
        duration: 3600,
        language: 'English',
        rating: 4.9,
        reviewCount: 203,
        enrollmentCount: 2156,
        isPublished: true,
        isFeatured: true,
        requirements: ['Basic arithmetic knowledge', 'Willingness to practice'],
        objectives: ['Master algebra and functions', 'Understand calculus concepts', 'Learn trigonometry', 'Apply statistical analysis'],
        tags: ['mathematics', 'algebra', 'calculus', 'statistics', 'trigonometry']
      },
      {
        title: 'Biology Fundamentals',
        slug: 'biology-fundamentals',
        description: 'Explore the wonders of life with our comprehensive biology course. Learn about cell structure, genetics, evolution, ecology, and human anatomy. This course is designed to build a strong foundation in biological sciences.',
        shortDescription: 'Discover the science of life',
        thumbnail: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800',
        price: 69.99,
        originalPrice: 139.99,
        type: 'internal',
        instructor: instructor._id,
        category: 'Biology',
        level: 'beginner',
        duration: 2400,
        language: 'English',
        rating: 4.7,
        reviewCount: 178,
        enrollmentCount: 1567,
        isPublished: true,
        isFeatured: true,
        requirements: ['Basic science knowledge', 'Interest in living organisms'],
        objectives: ['Understand cell structure', 'Learn genetics basics', 'Study evolution and biodiversity', 'Explore human anatomy'],
        tags: ['biology', 'science', 'cells', 'genetics', 'anatomy']
      },
      {
        title: 'Physics for Everyone',
        slug: 'physics-for-everyone',
        description: 'Dive into the fascinating world of physics! This course covers mechanics, electricity, magnetism, waves, and modern physics. Learn through engaging examples and practical experiments designed for learners at all levels.',
        shortDescription: 'Understand the laws that govern the universe',
        thumbnail: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800',
        price: 84.99,
        originalPrice: 169.99,
        type: 'internal',
        instructor: instructor._id,
        category: 'Physics',
        level: 'beginner',
        duration: 3200,
        language: 'English',
        rating: 4.8,
        reviewCount: 145,
        enrollmentCount: 1345,
        isPublished: true,
        isFeatured: true,
        requirements: ['Basic algebra knowledge', 'Interest in how things work'],
        objectives: ['Master Newtonian mechanics', 'Understand electricity and magnetism', 'Learn about waves and optics', 'Explore modern physics'],
        tags: ['physics', 'science', 'mechanics', 'electricity', 'waves']
      },
      {
        title: 'French Language Complete Course',
        slug: 'french-language-complete-course',
        description: 'Learn French from scratch or improve your existing skills! This comprehensive course covers grammar, vocabulary, pronunciation, conversation, and cultural context. By the end, you will be able to communicate confidently in French.',
        shortDescription: 'Learn to speak French like a native',
        thumbnail: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
        price: 59.99,
        originalPrice: 119.99,
        type: 'internal',
        instructor: instructor._id,
        category: 'French',
        level: 'beginner',
        duration: 2100,
        language: 'English',
        rating: 4.9,
        reviewCount: 267,
        enrollmentCount: 2345,
        isPublished: true,
        isFeatured: true,
        requirements: ['No prior French knowledge needed', 'Dedication to practice'],
        objectives: ['Learn basic to advanced grammar', 'Build vocabulary', 'Practice conversation', 'Understand French culture'],
        tags: ['french', 'language', 'languages', 'conversation', 'culture']
      },
      {
        title: 'English Language Essentials',
        slug: 'english-language-essentials',
        description: 'Master the English language with our comprehensive course covering grammar, vocabulary, writing skills, and communication. Perfect for non-native speakers looking to improve their English for work, study, or travel.',
        shortDescription: 'Build confidence in English communication',
        thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800',
        price: 49.99,
        originalPrice: 99.99,
        type: 'internal',
        instructor: instructor._id,
        category: 'English',
        level: 'beginner',
        duration: 1800,
        language: 'English',
        rating: 4.8,
        reviewCount: 312,
        enrollmentCount: 2890,
        isPublished: true,
        isFeatured: true,
        requirements: ['Basic English understanding', 'Desire to improve'],
        objectives: ['Improve grammar skills', 'Expand vocabulary', 'Enhance writing', 'Build speaking confidence'],
        tags: ['english', 'language', 'grammar', 'writing', 'communication']
      },
      {
        title: 'GIS Fundamentals and Applications',
        slug: 'gis-fundamentals-applications',
        description: 'Learn Geographic Information Systems from the ground up! This course covers GIS concepts, spatial analysis, mapping techniques, and practical applications using industry-standard software. Perfect for students, researchers, and professionals.',
        shortDescription: 'Master mapping and spatial analysis technology',
        thumbnail: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800',
        price: 94.99,
        originalPrice: 189.99,
        type: 'internal',
        instructor: instructor._id,
        category: 'GIS',
        level: 'intermediate',
        duration: 2800,
        language: 'English',
        rating: 4.7,
        reviewCount: 89,
        enrollmentCount: 678,
        isPublished: true,
        isFeatured: true,
        requirements: ['Basic computer skills', 'Interest in maps and geography'],
        objectives: ['Understand GIS concepts', 'Learn spatial analysis', 'Create professional maps', 'Use GIS software effectively'],
        tags: ['gis', 'geography', 'mapping', 'spatial analysis', 'cartography']
      },
      {
        title: 'Remote Sensing Technologies',
        slug: 'remote-sensing-technologies',
        description: 'Explore the world of remote sensing! Learn about satellite imagery, aerial photography, sensor technologies, and their applications in environmental monitoring, agriculture, and urban planning. This course combines theory with hands-on exercises.',
        shortDescription: 'Learn to analyze Earth from above',
        thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
        price: 99.99,
        originalPrice: 199.99,
        type: 'internal',
        instructor: instructor._id,
        category: 'Remote Sensing',
        level: 'intermediate',
        duration: 3000,
        language: 'English',
        rating: 4.6,
        reviewCount: 56,
        enrollmentCount: 432,
        isPublished: true,
        isFeatured: false,
        requirements: ['Basic understanding of geography', 'Interest in satellite technology'],
        objectives: ['Understand remote sensing principles', 'Analyze satellite imagery', 'Apply remote sensing in various fields', 'Use industry-standard tools'],
        tags: ['remote sensing', 'satellite', 'imagery', 'environment', 'technology']
      }
    ];

    await Course.deleteMany({});
    console.log('Cleared existing courses');

    await Course.insertMany(courses);
    console.log(`Seeded ${courses.length} courses`);

    console.log('Seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedCourses();
