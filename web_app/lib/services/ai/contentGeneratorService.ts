import { Product, CertifiedProvider, TrainingProgram, Review, BeforeAfter, BrandQuestionnaire } from '@/lib/pages/brand/types';
import { FEATURE_FLAGS, shouldUseOpenAI } from '@/lib/config/features';

export interface BrainstormIdea {
  id: string;
  title: string;
  description: string;
  category: 'product' | 'certification' | 'marketing' | 'expansion' | 'innovation';
  actionItems: string[];
  estimatedTimeframe: string;
  estimatedInvestment: string;
  potentialROI: string;
  difficulty: 'easy' | 'medium' | 'hard';
  resources: string[];
  createdAt: string;
}

interface GenerationContext {
  brandName: string;
  brandTagline?: string;
  brandMission?: string;
  existingProducts?: Product[];
  customPrompt?: string;
  generateImages?: boolean;
  questionnaire?: BrandQuestionnaire;
  preferences?: {
    priceRange?: { min: number; max: number };
    categories?: string[];
    style?: string;
  };
}

interface ProductGenerationOptions {
  count: number;
  category?: string;
  priceRange?: { min: number; max: number };
  includeIngredients?: boolean;
}

interface GeneratedContent {
  products: Product[];
  providers: CertifiedProvider[];
  trainingPrograms: TrainingProgram[];
  beforeAfters: BeforeAfter[];
}

class ContentGeneratorService {
  private apiKey: string | undefined;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
  }

  private async callOpenAI(prompt: string): Promise<any> {
    // Check feature flag first
    if (!shouldUseOpenAI()) {
      if (FEATURE_FLAGS.DEBUG_MODE) {
        // OpenAI API disabled by feature flag, using mock data
      }
      return this.getMockResponse(prompt);
    }

    if (!this.apiKey) {
      // OpenAI API key not configured, returning mock data
      return this.getMockResponse(prompt);
    }

    try {
      // Making OpenAI API call
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a professional beauty industry consultant helping create content for beauty brands. Always provide realistic, professional, and appropriate content for the beauty industry. Never make medical claims.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.8,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      // OpenAI API call successful
      return JSON.parse(content);
    } catch (error) {
      // OpenAI API error
      return this.getMockResponse(prompt);
    }
  }

  private generateProductImages(productName: string, category: string, generateImages: boolean): {
    image: string;
    thumbnailImage: string;
    images: string[];
    imageAlt: string;
    imagesAlt: string[];
  } {
    if (generateImages) {
      // In a real implementation, this would call DALL-E 3 API
      // For now, using high-quality placeholder images
      const baseUrl = 'https://source.unsplash.com';
      const keywords = `${category},beauty,product,${productName.split(' ')[0]}`;
      
      return {
        image: `${baseUrl}/400x400/?${keywords}`,
        thumbnailImage: `${baseUrl}/300x300/?${keywords}`,
        images: [
          `${baseUrl}/400x400/?${keywords},angle1`,
          `${baseUrl}/400x400/?${keywords},angle2`,
          `${baseUrl}/400x400/?${keywords},closeup`
        ],
        imageAlt: `${productName} - main product image`,
        imagesAlt: [
          `${productName} - side view`,
          `${productName} - back view`,
          `${productName} - detail shot`
        ]
      };
    }
    
    // Default placeholder images
    return {
      image: `https://via.placeholder.com/400x400?text=${encodeURIComponent(productName)}`,
      thumbnailImage: `https://via.placeholder.com/300x300?text=${encodeURIComponent(productName)}`,
      images: [],
      imageAlt: `${productName} product image`,
      imagesAlt: []
    };
  }

  private generateProviderImages(providerName: string, specialty: string, generateImages: boolean): {
    profileImage?: string;
    images?: string[];
    imageAlt?: string;
    imagesAlt?: string[];
  } {
    if (generateImages) {
      const baseUrl = 'https://source.unsplash.com';
      const keywords = `portrait,professional,beauty,${specialty.split(' ')[0]}`;
      
      return {
        profileImage: `${baseUrl}/300x300/?${keywords}`,
        images: [
          `${baseUrl}/400x400/?beauty,salon,workspace`,
          `${baseUrl}/400x400/?beauty,treatment,client`,
          `${baseUrl}/400x400/?beauty,results,portfolio`
        ],
        imageAlt: `${providerName} - professional beauty provider`,
        imagesAlt: [
          `${providerName}'s workspace`,
          `${providerName} treating a client`,
          `Portfolio work by ${providerName}`
        ]
      };
    }
    
    return {};
  }

  private generateTrainingImages(programName: string, level: string, generateImages: boolean): {
    image?: string;
    thumbnailImage?: string;
    images?: string[];
    imageAlt?: string;
    imagesAlt?: string[];
  } {
    if (generateImages) {
      const baseUrl = 'https://source.unsplash.com';
      const keywords = `beauty,training,education,${level}`;
      
      return {
        image: `${baseUrl}/400x300/?${keywords}`,
        thumbnailImage: `${baseUrl}/300x200/?${keywords}`,
        images: [
          `${baseUrl}/400x300/?beauty,classroom,training`,
          `${baseUrl}/400x300/?beauty,practice,students`,
          `${baseUrl}/400x300/?beauty,certificate,graduation`
        ],
        imageAlt: `${programName} - beauty training program`,
        imagesAlt: [
          `${programName} classroom setting`,
          `Students practicing in ${programName}`,
          `${programName} certification ceremony`
        ]
      };
    }
    
    return {};
  }

  private generateBeforeAfterImages(treatmentType: string, generateImages: boolean): {
    beforeImage?: string;
    afterImage?: string;
    beforeImages?: string[];
    afterImages?: string[];
    beforeImageAlt?: string;
    afterImageAlt?: string;
    beforeImagesAlt?: string[];
    afterImagesAlt?: string[];
  } {
    if (generateImages) {
      const baseUrl = 'https://source.unsplash.com';
      const treatmentKeyword = treatmentType ? treatmentType.split(' ')[0].toLowerCase() : 'treatment';
      
      return {
        beforeImage: `${baseUrl}/400x400/?face,skin,natural`,
        afterImage: `${baseUrl}/400x400/?face,glowing,beauty`,
        beforeImages: [
          `${baseUrl}/400x400/?face,closeup,before`,
          `${baseUrl}/400x400/?skin,texture,natural`,
          `${baseUrl}/400x400/?face,profile,before`
        ],
        afterImages: [
          `${baseUrl}/400x400/?face,radiant,after`,
          `${baseUrl}/400x400/?skin,smooth,glowing`,
          `${baseUrl}/400x400/?face,happy,results`
        ],
        beforeImageAlt: `Before ${treatmentType} treatment`,
        afterImageAlt: `After ${treatmentType} treatment - showing results`,
        beforeImagesAlt: [
          `Before ${treatmentType} - front view`,
          `Before ${treatmentType} - skin texture detail`,
          `Before ${treatmentType} - profile view`
        ],
        afterImagesAlt: [
          `After ${treatmentType} - radiant results`,
          `After ${treatmentType} - improved skin texture`,
          `After ${treatmentType} - happy client`
        ]
      };
    }
    
    return {};
  }

  async generateProducts(
    context: GenerationContext,
    options: ProductGenerationOptions
  ): Promise<Product[]> {
    const userDescription = context.customPrompt || '';
    const prompt = `
    Generate ${options.count} beauty products for a brand with the following details:
    Brand Name: ${context.brandName}
    ${context.brandTagline ? `Tagline: ${context.brandTagline}` : ''}
    ${context.brandMission ? `Mission: ${context.brandMission}` : ''}
    ${options.category ? `Category: ${options.category}` : 'Categories: skincare, makeup, haircare, tools, supplements'}
    Price Range: $${options.priceRange?.min || 20} - $${options.priceRange?.max || 200}
    
    User's specific request: ${userDescription}

    Return a JSON array of products with this exact structure:
    [
      {
        "id": "prod_[unique_id]",
        "name": "Product Name",
        "price": 00,
        "originalPrice": 00 (optional, higher than price for sales),
        "image": "https://source.unsplash.com/300x300/?[relevant-keywords]",
        "category": "skincare|makeup|haircare|tools|supplements",
        "skinType": ["oily", "dry", "combination", "sensitive", "normal", "all"],
        "description": "Professional product description",
        "ingredients": ["ingredient1", "ingredient2", ...] (if includeIngredients is true),
        "benefits": ["benefit1", "benefit2", "benefit3", "benefit4"],
        "usage": "How to use instructions",
        "isSpotlight": true/false (make 1-2 products spotlight),
        "inStock": true,
        "rating": 4.0-5.0,
        "reviewCount": 50-2000,
        "createdAt": "${new Date().toISOString()}"
      }
    ]

    Make products realistic, professional, and appropriate for the beauty industry.
    Ensure variety in categories and price points.
    Use descriptive, SEO-friendly product names.
    `;

    const products = await this.callOpenAI(prompt);
    const productsArray = Array.isArray(products) ? products : [];
    
    // Add image fields if generateImages is enabled
    return productsArray.map(product => ({
      ...product,
      ...(context.generateImages ? this.generateProductImages(product.name, product.category, true) : {})
    }));
  }

  async generateProviders(
    context: GenerationContext,
    count: number = 4
  ): Promise<CertifiedProvider[]> {
    const userDescription = context.customPrompt || '';
    const prompt = `
    Generate ${count} certified beauty providers for a brand:
    Brand Name: ${context.brandName}
    ${context.brandTagline ? `Tagline: ${context.brandTagline}` : ''}
    ${context.brandMission ? `Mission: ${context.brandMission}` : ''}
    
    User's specific request: ${userDescription}

    Return a JSON array of providers with this exact structure:
    [
      {
        "id": "prov_[unique_id]",
        "name": "Full Name",
        "profileImage": "https://picsum.photos/200/200?random=[number]",
        "specialty": "Specific beauty specialty",
        "location": "City, State",
        "rating": 4.5-5.0,
        "reviewCount": 50-300,
        "certificationDate": "YYYY-MM-DD",
        "certificationLevel": "bronze|silver|gold|platinum",
        "isVerified": true/false,
        "bio": "Professional bio about the provider",
        "yearsExperience": 1-20,
        "services": ["Service 1", "Service 2", ...],
        "phone": "(XXX) XXX-XXXX",
        "email": "provider@example.com"
      }
    ]

    Create diverse, realistic provider profiles with various specialties like:
    - Advanced Skincare & Anti-Aging
    - Bridal Makeup & Hair
    - Corrective Skincare
    - Natural Beauty Enhancement
    - Medical Aesthetics
    - Lash Extensions & Brow Design

    Distribute certification levels realistically (fewer platinum than bronze).
    `;

    const providers = await this.callOpenAI(prompt);
    const providersArray = Array.isArray(providers) ? providers : [];
    
    // Add image fields if generateImages is enabled
    return providersArray.map(provider => ({
      ...provider,
      ...(context.generateImages ? this.generateProviderImages(provider.name, provider.specialty, true) : {})
    }));
  }

  async generateTrainingPrograms(
    context: GenerationContext,
    count: number = 2
  ): Promise<TrainingProgram[]> {
    const userDescription = context.customPrompt || '';
    const prompt = `
    Generate ${count} professional training programs for a beauty brand:
    Brand Name: ${context.brandName}
    ${context.brandTagline ? `Tagline: ${context.brandTagline}` : ''}
    ${context.brandMission ? `Mission: ${context.brandMission}` : ''}
    
    User's specific request: ${userDescription}

    Return a JSON array with this structure:
    [
      {
        "id": "train_[unique_id]",
        "name": "Program Name",
        "description": "Comprehensive program description",
        "duration": "X weeks/months",
        "level": "beginner|intermediate|advanced",
        "certificationOffered": true/false,
        "price": 500-3000,
        "enrollmentCount": 20-100,
        "nextSessionDate": "YYYY-MM-DD",
        "image": "https://source.unsplash.com/400x300/?beauty,training",
        "topics": ["Topic 1", "Topic 2", ...],
        "createdAt": "${new Date().toISOString()}"
      }
    ]

    Create professional certification programs like:
    - Professional Skincare Certification
    - Makeup Artistry Masterclass
    - Advanced Chemical Peel Training
    - Microblading Certification
    - Business Development for Beauty Professionals
    `;

    const programs = await this.callOpenAI(prompt);
    const programsArray = Array.isArray(programs) ? programs : [];
    
    // Add image fields if generateImages is enabled
    return programsArray.map(program => ({
      ...program,
      ...(context.generateImages ? this.generateTrainingImages(program.name, program.level, true) : {})
    }));
  }

  async generateReviews(
    context: GenerationContext,
    productId?: string,
    count: number = 3
  ): Promise<Review[]> {
    const prompt = `
    Generate ${count} customer reviews for a beauty brand:
    Brand Name: ${context.brandName}
    ${productId ? `For product ID: ${productId}` : 'General brand reviews'}

    Return a JSON array with this structure:
    [
      {
        "id": "rev_[unique_id]",
        "userId": "user_[unique_id]",
        "userName": "Customer Name",
        "userImage": "https://picsum.photos/50/50?random=[number]",
        "rating": 4-5,
        "title": "Review Title (optional)",
        "comment": "Detailed review comment",
        "helpfulCount": 0-200,
        "verifiedPurchase": true/false,
        ${productId ? `"productId": "${productId}",` : ''}
        "createdAt": "recent date"
      }
    ]

    Create authentic, varied reviews that mention specific benefits, results, and experiences.
    Mix ratings (mostly 4-5 stars with occasional 3).
    Make reviews helpful and specific to beauty products.
    `;

    const reviews = await this.callOpenAI(prompt);
    return Array.isArray(reviews) ? reviews : [];
  }

  async generateBeforeAfters(
    context: GenerationContext,
    count: number = 2
  ): Promise<BeforeAfter[]> {
    const userDescription = context.customPrompt || '';
    const prompt = `
    Generate ${count} before/after transformation examples for a beauty brand:
    Brand Name: ${context.brandName}
    ${context.brandTagline ? `Tagline: ${context.brandTagline}` : ''}
    ${context.brandMission ? `Mission: ${context.brandMission}` : ''}
    
    User's specific request: ${userDescription}

    Return a JSON array with this structure:
    [
      {
        "id": "ba_[unique_id]",
        "beforeImage": "https://source.unsplash.com/400x400/?face,before",
        "afterImage": "https://source.unsplash.com/400x400/?face,glowing",
        "treatmentType": "Treatment Name",
        "duration": "X weeks/months",
        "description": "Transformation description",
        "productsUsed": ["Product 1", "Product 2", ...],
        "providerName": "Provider name (optional)",
        "testimonial": "Client testimonial about the results",
        "createdAt": "${new Date().toISOString()}"
      }
    ]

    Create realistic transformation examples like:
    - Acne Clear Protocol
    - Anti-Aging Transformation  
    - Brightening Treatment
    - Hydration Boost Program
    - Scar Reduction Treatment
    `;

    const beforeAfters = await this.callOpenAI(prompt);
    const beforeAftersArray = Array.isArray(beforeAfters) ? beforeAfters : [];
    
    // Add image fields if generateImages is enabled
    return beforeAftersArray.map(transformation => ({
      ...transformation,
      ...(context.generateImages && transformation.treatmentType ? this.generateBeforeAfterImages(transformation.treatmentType, true) : {})
    }));
  }

  async generateBrainstormIdeas(
    context: GenerationContext,
    focus?: 'product' | 'certification' | 'marketing' | 'expansion' | 'innovation',
    count: number = 5
  ): Promise<BrainstormIdea[]> {
    const prompt = `
    Generate ${count} innovative brainstorming ideas for a beauty brand:
    Brand Name: ${context.brandName}
    ${context.brandTagline ? `Tagline: ${context.brandTagline}` : ''}
    ${context.brandMission ? `Mission: ${context.brandMission}` : ''}
    ${focus ? `Focus Area: ${focus}` : 'All categories'}

    Return a JSON array with this structure:
    [
      {
        "id": "idea_[unique_id]",
        "title": "Clear, actionable idea title",
        "description": "Detailed description of the idea and its benefits",
        "category": "product|certification|marketing|expansion|innovation",
        "actionItems": ["Step 1", "Step 2", "Step 3"],
        "estimatedTimeframe": "X weeks/months",
        "estimatedInvestment": "$X,XXX - $XX,XXX",
        "potentialROI": "High/Medium/Low with explanation",
        "difficulty": "easy|medium|hard",
        "resources": ["Resource 1", "Resource 2"],
        "createdAt": "${new Date().toISOString()}"
      }
    ]

    Generate creative, practical ideas that could help grow the beauty brand. Include:
    - New product development ideas
    - Professional certification opportunities
    - Marketing and branding strategies
    - Business expansion possibilities
    - Innovative service offerings

    Make ideas specific to the beauty industry and achievable for a growing brand.
    `;

    const ideas = await this.callOpenAI(prompt);
    return Array.isArray(ideas) ? ideas : [];
  }

  async researchTopic(
    topic: string,
    context: GenerationContext
  ): Promise<{
    summary: string;
    keyPoints: string[];
    opportunities: string[];
    challenges: string[];
    nextSteps: string[];
    resources: Array<{ title: string; description: string; url?: string }>;
  }> {
    const prompt = `
    Research the following topic for a beauty brand:
    Topic: ${topic}
    Brand Name: ${context.brandName}
    ${context.brandTagline ? `Tagline: ${context.brandTagline}` : ''}

    Return a JSON object with this structure:
    {
      "summary": "Comprehensive summary of the topic",
      "keyPoints": ["Key point 1", "Key point 2", ...],
      "opportunities": ["Opportunity 1", "Opportunity 2", ...],
      "challenges": ["Challenge 1", "Challenge 2", ...],
      "nextSteps": ["Action 1", "Action 2", ...],
      "resources": [
        {
          "title": "Resource name",
          "description": "What this resource offers",
          "url": "https://example.com (optional)"
        }
      ]
    }

    Provide practical, beauty industry-specific insights that can help the brand make informed decisions.
    `;

    const research = await this.callOpenAI(prompt);
    return research || this.getMockResearch(topic);
  }

  private getMockResponse(prompt: string): any {
    // Extract what type of content is being requested from the prompt
    if (prompt.includes('products')) {
      return this.getMockProducts();
    } else if (prompt.includes('providers')) {
      return this.getMockProviders();
    } else if (prompt.includes('training programs')) {
      return this.getMockTrainingPrograms();
    } else if (prompt.includes('reviews')) {
      return this.getMockReviews();
    } else if (prompt.includes('before/after')) {
      return this.getMockBeforeAfters();
    } else if (prompt.includes('brainstorming ideas')) {
      return this.getMockBrainstormIdeas();
    } else if (prompt.includes('Research')) {
      return this.getMockResearch('General beauty industry trends');
    }
    return [];
  }

  private getMockProducts(): Product[] {
    return [
      {
        id: `prod_${Date.now()}_1`,
        name: "Radiance Renewal Serum",
        price: 78,
        originalPrice: 95,
        image: "https://source.unsplash.com/300x300/?serum,skincare",
        category: "skincare",
        skinType: ["all"],
        description: "Advanced brightening serum with vitamin C and peptides for radiant, youthful skin.",
        ingredients: ["Vitamin C (15%)", "Peptides", "Hyaluronic Acid", "Niacinamide"],
        benefits: ["Brightens skin tone", "Reduces fine lines", "Improves texture", "Hydrates deeply"],
        usage: "Apply 2-3 drops to clean face morning and evening. Follow with moisturizer.",
        isSpotlight: true,
        inStock: true,
        rating: 4.8,
        reviewCount: 234,
        createdAt: new Date().toISOString()
      },
      {
        id: `prod_${Date.now()}_2`,
        name: "Flawless Finish Foundation",
        price: 45,
        image: "https://source.unsplash.com/300x300/?foundation,makeup",
        category: "makeup",
        description: "Buildable coverage foundation with a natural, dewy finish. Available in 24 shades.",
        benefits: ["Natural finish", "All-day wear", "Buildable coverage", "SPF 20 protection"],
        usage: "Apply with brush or sponge, building coverage as desired.",
        isSpotlight: false,
        inStock: true,
        rating: 4.6,
        reviewCount: 567,
        createdAt: new Date().toISOString()
      }
    ];
  }

  private getMockProviders(): CertifiedProvider[] {
    return [
      {
        id: `prov_${Date.now()}_1`,
        name: "Sarah Johnson",
        profileImage: "https://picsum.photos/200/200?random=1",
        specialty: "Advanced Skincare & Anti-Aging",
        location: "Los Angeles, CA",
        rating: 4.9,
        reviewCount: 156,
        certificationDate: "2022-03-15",
        certificationLevel: "platinum",
        isVerified: true
      },
      {
        id: `prov_${Date.now()}_2`,
        name: "Maria Garcia",
        profileImage: "https://picsum.photos/200/200?random=2",
        specialty: "Bridal Makeup & Hair",
        location: "Miami, FL",
        rating: 4.8,
        reviewCount: 203,
        certificationDate: "2021-11-20",
        certificationLevel: "gold",
        isVerified: true
      }
    ];
  }

  private getMockTrainingPrograms(): TrainingProgram[] {
    return [
      {
        id: `train_${Date.now()}_1`,
        name: "Professional Skincare Certification",
        description: "Comprehensive training on advanced skincare techniques, product knowledge, and client consultation.",
        duration: "6 weeks",
        level: "intermediate",
        certificationOffered: true,
        price: 1200,
        enrollmentCount: 45,
        nextSessionDate: "2024-02-01",
        image: "https://source.unsplash.com/400x300/?training,skincare"
      }
    ];
  }

  private getMockReviews(): Review[] {
    return [
      {
        id: `rev_${Date.now()}_1`,
        userId: "user_123",
        userName: "Emma Wilson",
        userImage: "https://picsum.photos/50/50?random=5",
        rating: 5,
        title: "Amazing results!",
        comment: "I've been using this serum for 3 weeks and my skin has never looked better. The dark spots are fading and my complexion is so much brighter!",
        helpfulCount: 124,
        verifiedPurchase: true,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
  }

  private getMockBeforeAfters(): BeforeAfter[] {
    return [
      {
        id: `ba_${Date.now()}_1`,
        beforeImage: "https://source.unsplash.com/400x400/?face,skincare",
        afterImage: "https://source.unsplash.com/400x400/?face,glowing",
        treatmentType: "Brightening Treatment Protocol",
        duration: "8 weeks",
        description: "Dramatic improvement in skin tone and texture using our vitamin C serum and professional treatments.",
        createdAt: new Date().toISOString()
      }
    ];
  }

  private getMockBrainstormIdeas(): BrainstormIdea[] {
    return [
      {
        id: `idea_${Date.now()}_1`,
        title: "Launch a Subscription Box Service",
        description: "Create a monthly beauty box featuring curated products from your brand, providing customers with a convenient way to discover new items while generating recurring revenue.",
        category: "expansion",
        actionItems: [
          "Research subscription box logistics and fulfillment",
          "Design packaging and unboxing experience",
          "Create themed boxes for different skin types",
          "Set up subscription management system",
          "Plan launch marketing campaign"
        ],
        estimatedTimeframe: "3-4 months",
        estimatedInvestment: "$15,000 - $30,000",
        potentialROI: "High - Recurring revenue model with 70% profit margins after initial setup",
        difficulty: "medium",
        resources: ["Subscription platform (ReCharge, Bold)", "Fulfillment partner", "Packaging designer"],
        createdAt: new Date().toISOString()
      },
      {
        id: `idea_${Date.now()}_2`,
        title: "Develop a Signature Anti-Aging Line",
        description: "Create a comprehensive anti-aging product line featuring peptides, retinol alternatives, and innovative ingredients to target mature skin concerns.",
        category: "product",
        actionItems: [
          "Research trending anti-aging ingredients",
          "Partner with cosmetic chemist for formulation",
          "Conduct clinical trials for efficacy claims",
          "Design premium packaging",
          "Create educational content about ingredients"
        ],
        estimatedTimeframe: "6-8 months",
        estimatedInvestment: "$50,000 - $100,000",
        potentialROI: "High - Anti-aging products command premium prices with loyal customer base",
        difficulty: "hard",
        resources: ["Cosmetic chemist", "Clinical testing lab", "Regulatory consultant"],
        createdAt: new Date().toISOString()
      },
      {
        id: `idea_${Date.now()}_3`,
        title: "Get Certified in Microblading",
        description: "Expand your service offerings by obtaining professional microblading certification, allowing you to offer semi-permanent eyebrow treatments.",
        category: "certification",
        actionItems: [
          "Research accredited microblading programs",
          "Complete 100-hour training course",
          "Purchase professional equipment",
          "Get liability insurance",
          "Build portfolio with practice models"
        ],
        estimatedTimeframe: "2-3 months",
        estimatedInvestment: "$3,000 - $7,000",
        potentialROI: "High - $300-800 per treatment with high demand",
        difficulty: "medium",
        resources: ["Training academy", "Equipment supplier", "Insurance provider"],
        createdAt: new Date().toISOString()
      },
      {
        id: `idea_${Date.now()}_4`,
        title: "Launch TikTok Beauty Education Series",
        description: "Create viral beauty education content on TikTok showcasing quick tips, product demos, and transformation videos to build brand awareness among Gen Z.",
        category: "marketing",
        actionItems: [
          "Develop content calendar with trending topics",
          "Invest in ring light and filming equipment",
          "Study TikTok algorithm and best practices",
          "Collaborate with micro-influencers",
          "Create signature beauty challenges"
        ],
        estimatedTimeframe: "1-2 months",
        estimatedInvestment: "$1,000 - $5,000",
        potentialROI: "Medium to High - Viral potential can drive massive brand awareness",
        difficulty: "easy",
        resources: ["Content creation tools", "TikTok analytics", "Influencer platforms"],
        createdAt: new Date().toISOString()
      },
      {
        id: `idea_${Date.now()}_5`,
        title: "Implement AI Skin Analysis Technology",
        description: "Integrate AI-powered skin analysis tools that provide personalized product recommendations based on selfie analysis, enhancing customer experience.",
        category: "innovation",
        actionItems: [
          "Research AI skin analysis APIs",
          "Integrate technology into website",
          "Train AI with diverse skin types",
          "Create personalized product bundles",
          "Develop privacy and data policies"
        ],
        estimatedTimeframe: "4-6 months",
        estimatedInvestment: "$20,000 - $40,000",
        potentialROI: "High - Increased conversion rates and customer satisfaction",
        difficulty: "hard",
        resources: ["AI technology provider", "Web developer", "Data privacy consultant"],
        createdAt: new Date().toISOString()
      }
    ];
  }

  private getMockResearch(topic: string): any {
    return {
      summary: `Research on "${topic}" reveals significant opportunities in the beauty industry. The market is evolving rapidly with consumers seeking personalized, sustainable, and tech-enabled beauty solutions.`,
      keyPoints: [
        "Clean beauty market is growing at 12% annually",
        "Personalization increases customer retention by 40%",
        "Social commerce drives 30% of beauty purchases for Gen Z",
        "Sustainability claims influence 65% of purchase decisions",
        "AI and AR technologies are becoming standard in beauty retail"
      ],
      opportunities: [
        "Develop eco-friendly packaging solutions",
        "Create personalized product formulations",
        "Leverage social media for authentic brand storytelling",
        "Partner with technology providers for virtual try-on",
        "Expand into wellness and holistic beauty"
      ],
      challenges: [
        "Increasing competition from DTC brands",
        "Rising customer acquisition costs",
        "Regulatory compliance for international expansion",
        "Supply chain disruptions affecting ingredients",
        "Maintaining authenticity while scaling"
      ],
      nextSteps: [
        "Conduct customer surveys to identify unmet needs",
        "Analyze competitor strategies and positioning",
        "Develop a 3-year strategic growth plan",
        "Invest in sustainable packaging research",
        "Build partnerships with complementary brands"
      ],
      resources: [
        {
          title: "Beauty Industry Report 2024",
          description: "Comprehensive analysis of beauty market trends and forecasts",
          url: "https://www.beautybusiness.com/reports"
        },
        {
          title: "Sustainable Beauty Coalition",
          description: "Resources for implementing sustainable practices in beauty",
          url: "https://sustainablebeautycoalition.org"
        },
        {
          title: "Beauty Tech Summit",
          description: "Annual conference on technology innovation in beauty",
          url: "https://beautytechsummit.com"
        }
      ]
    };
  }

  async generateFromQuestionnaire(context: GenerationContext): Promise<GeneratedContent> {
    if (!context.questionnaire) {
      throw new Error('Questionnaire data is required');
    }

    const { questionnaire } = context;

    // Generate products based on questionnaire
    const products = await this.generateProducts(
      {
        ...context,
        customPrompt: `Create products based on this description: ${questionnaire.products.description}. 
        Categories: ${questionnaire.products.categories.join(', ')}. 
        Ingredients focus: ${questionnaire.products.ingredients || 'natural and effective ingredients'}. 
        Benefits: ${questionnaire.products.benefits || 'based on brand vision'}.
        Target audience: ${questionnaire.brandOverview.targetAudience}`,
        generateImages: false,
      },
      {
        count: 12,
        priceRange: questionnaire.products.priceRange,
        includeIngredients: true,
      }
    );

    // Generate providers based on questionnaire
    const providers = await this.generateProviders(
      {
        ...context,
        customPrompt: `Create certified providers with these specialties: ${questionnaire.providers.specialtiesNeeded.join(', ')}. 
        Certification levels: ${questionnaire.providers.certificationLevels.join(', ')}. 
        Locations: ${questionnaire.providers.locationPreferences}. 
        Experience: ${questionnaire.providers.experienceLevel || 'varied experience levels'}.`,
        generateImages: false,
      },
      10
    );

    // Generate training programs based on questionnaire
    const trainingPrograms = await this.generateTrainingPrograms(
      {
        ...context,
        customPrompt: `Create training programs with these goals: ${questionnaire.training.goals}. 
        Target learners: ${questionnaire.training.targetLearners}. 
        Certification types: ${questionnaire.training.certificationTypes.join(', ')}. 
        Duration: ${questionnaire.training.duration || 'varied durations'}.`,
        generateImages: false,
      },
      4
    );

    // Note: BeforeAfter transformations are now part of products
    // No separate generation needed

    return {
      products,
      providers,
      trainingPrograms,
      beforeAfters: [], // Empty array since these are now part of products
    };
  }

  async updateGeneratedSection(params: {
    brandName: string;
    brandTagline?: string;
    brandMission?: string;
    contentType: 'products' | 'providers' | 'training' | 'beforeAfter';
    currentContent: any;
    feedback: string;
    questionnaire?: BrandQuestionnaire;
  }): Promise<any> {
    const { contentType, currentContent, feedback, questionnaire } = params;

    const updatePrompt = `
    Current ${contentType}: ${JSON.stringify(currentContent, null, 2)}
    
    User feedback: ${feedback}
    
    Please update the ${contentType} based on the user's feedback while maintaining the same structure and format.
    ${questionnaire ? `Keep in mind the original questionnaire context: ${JSON.stringify(questionnaire, null, 2)}` : ''}
    `;

    switch (contentType) {
      case 'products':
        return this.generateProducts(
          {
            ...params,
            customPrompt: updatePrompt,
            generateImages: true,
          },
          {
            count: Array.isArray(currentContent) ? currentContent.length : 1,
            includeIngredients: true,
          }
        );

      case 'providers':
        return this.generateProviders(
          {
            ...params,
            customPrompt: updatePrompt,
            generateImages: true,
          },
          Array.isArray(currentContent) ? currentContent.length : 1
        );

      case 'training':
        return this.generateTrainingPrograms(
          {
            ...params,
            customPrompt: updatePrompt,
            generateImages: true,
          },
          Array.isArray(currentContent) ? currentContent.length : 1
        );

      case 'beforeAfter':
        return this.generateBeforeAfters(
          {
            ...params,
            customPrompt: updatePrompt,
            generateImages: true,
          },
          Array.isArray(currentContent) ? currentContent.length : 1
        );

      default:
        throw new Error(`Unknown content type: ${contentType}`);
    }
  }
}

export default new ContentGeneratorService();