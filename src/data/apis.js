/**
 * APIdex — API Universe Explorer
 * Curated dataset of 60+ public APIs
 */

export const apis = [
  // AI / ML
  {
    name: "OpenAI API",
    provider: "OpenAI",
    category: "AI / ML",
    baseURL: "https://api.openai.com/v1",
    authType: "API Key",
    pricingTier: "Paid",
    shortDescription: "Access state-of-the-art language models including GPT-4o and DALL·E 3.",
    useCases: ["chatbots", "text generation", "image creation"],
    docsURL: "https://platform.openai.com/docs"
  },
  {
    name: "Claude API",
    provider: "Anthropic",
    category: "AI / ML",
    baseURL: "https://api.anthropic.com/v1",
    authType: "API Key",
    pricingTier: "Paid",
    shortDescription: "High-performance AI models for complex reasoning and long-context processing.",
    useCases: ["analysis", "coding assistants", "large document processing"],
    docsURL: "https://docs.anthropic.com"
  },
  {
    name: "Gemini API",
    provider: "Google",
    category: "AI / ML",
    baseURL: "https://generativelanguage.googleapis.com/v1beta",
    authType: "API Key",
    pricingTier: "Freemium",
    shortDescription: "Multimodal AI models for text, code, image, and video understanding.",
    useCases: ["multimodal apps", "summarization", "agentic workflows"],
    docsURL: "https://ai.google.dev/docs"
  },
  {
    name: "Hugging Face Inference API",
    provider: "Hugging Face",
    category: "AI / ML",
    baseURL: "https://api-inference.huggingface.co",
    authType: "API Key",
    pricingTier: "Freemium",
    shortDescription: "Deploy and access thousands of open-source models for NLP, vision, and audio.",
    useCases: ["sentiment analysis", "object detection", "stable diffusion"],
    docsURL: "https://huggingface.co/docs/api-inference"
  },
  {
    name: "Stability AI API",
    provider: "Stability AI",
    category: "AI / ML",
    baseURL: "https://api.stability.ai/v1",
    authType: "API Key",
    pricingTier: "Paid",
    shortDescription: "Cutting-edge image generation models including Stable Diffusion XL and Turbo.",
    useCases: ["asset generation", "creative tools", "image editing"],
    docsURL: "https://platform.stability.ai/docs"
  },

  // Weather
  {
    name: "OpenWeatherMap",
    provider: "OpenWeather",
    category: "Weather",
    baseURL: "https://api.openweathermap.org/data/2.5",
    authType: "API Key",
    pricingTier: "Freemium",
    shortDescription: "Global weather data including current, forecast, and historical conditions.",
    useCases: ["weather apps", "logistics", "travel planners"],
    docsURL: "https://openweathermap.org/api"
  },
  {
    name: "Open-Meteo",
    provider: "Open-Meteo",
    category: "Weather",
    baseURL: "https://api.open-meteo.com/v1",
    authType: "None",
    pricingTier: "Free",
    shortDescription: "Free weather API for non-commercial use with no API key required.",
    useCases: ["hobby projects", "dashboards", "outdoor planning"],
    docsURL: "https://open-meteo.com/en/docs"
  },
  {
    name: "Tomorrow.io API",
    provider: "Tomorrow.io",
    category: "Weather",
    baseURL: "https://api.tomorrow.io/v4",
    authType: "API Key",
    pricingTier: "Freemium",
    shortDescription: "Hyper-accurate, minute-by-minute weather forecasts and environmental data.",
    useCases: ["precision ag", "aviation", "energy management"],
    docsURL: "https://docs.tomorrow.io"
  },
  {
    name: "WeatherAPI",
    provider: "WeatherAPI.com",
    category: "Weather",
    baseURL: "https://api.weatherapi.com/v1",
    authType: "API Key",
    pricingTier: "Freemium",
    shortDescription: "Real-time, forecast, and historical weather data with astronomy and sports info.",
    useCases: ["e-commerce", "event planning", "content sites"],
    docsURL: "https://www.weatherapi.com/docs/"
  },
  {
    name: "Visual Crossing Weather",
    provider: "Visual Crossing",
    category: "Weather",
    baseURL: "https://weather.visualcrossing.com/VisualCrossingWebServices",
    authType: "API Key",
    pricingTier: "Freemium",
    shortDescription: "Historical weather records and advanced forecasting for business intelligence.",
    useCases: ["data science", "insurance", "retail modeling"],
    docsURL: "https://www.visualcrossing.com/weather-api"
  },

  // Maps
  {
    name: "Google Maps Platform",
    provider: "Google",
    category: "Maps",
    baseURL: "https://maps.googleapis.com/maps/api",
    authType: "API Key",
    pricingTier: "Freemium",
    shortDescription: "The world's most popular mapping, routing, and places data platform.",
    useCases: ["navigation", "geocoding", "place discovery"],
    docsURL: "https://developers.google.com/maps"
  },
  {
    name: "Mapbox Search/Maps",
    provider: "Mapbox",
    category: "Maps",
    baseURL: "https://api.mapbox.com",
    authType: "API Key",
    pricingTier: "Freemium",
    shortDescription: "Highly customizable maps and location services for mobile and web.",
    useCases: ["custom styling", "delivery tracking", "spatial analysis"],
    docsURL: "https://docs.mapbox.com/api"
  },
  {
    name: "IP Geolocation API",
    provider: "ipstack",
    category: "Maps",
    baseURL: "https://api.ipstack.com",
    authType: "API Key",
    pricingTier: "Freemium",
    shortDescription: "Locate website visitors based on IP address with high accuracy.",
    useCases: ["localization", "fraud prevention", "ads targeting"],
    docsURL: "https://ipstack.com/documentation"
  },
  {
    name: "OSM Nominatim",
    provider: "OpenStreetMap",
    category: "Maps",
    baseURL: "https://nominatim.openstreetmap.org",
    authType: "None",
    pricingTier: "Free",
    shortDescription: "Open-source geocoding and search engine based on OpenStreetMap data.",
    useCases: ["reverse geocoding", "address search", "GIS tools"],
    docsURL: "https://nominatim.org/release-docs/latest/api/Overview/"
  },
  {
    name: "HERE Maps API",
    provider: "HERE",
    category: "Maps",
    baseURL: "https://ls.hereapi.com/v2",
    authType: "API Key",
    pricingTier: "Freemium",
    shortDescription: "Enterprise-grade location data and routing for automotive and logistics.",
    useCases: ["fleet management", "supply chain", "urban mobility"],
    docsURL: "https://www.here.com/docs"
  },

  // Finance
  {
    name: "Stripe API",
    provider: "Stripe",
    category: "Finance",
    baseURL: "https://api.stripe.com/v1",
    authType: "API Key",
    pricingTier: "Paid",
    shortDescription: "The gold standard for online payment processing and recurring billing.",
    useCases: ["checkouts", "subscriptions", "marketplaces"],
    docsURL: "https://stripe.com/docs/api"
  },
  {
    name: "CoinGecko API",
    provider: "CoinGecko",
    category: "Finance",
    baseURL: "https://api.coingecko.com/api/v3",
    authType: "None",
    pricingTier: "Freemium",
    shortDescription: "Comprehensive cryptocurrency market data including price, volume, and supply.",
    useCases: ["crypto trackers", "wallets", "trading bots"],
    docsURL: "https://www.coingecko.com/en/api/documentation"
  },
  {
    name: "Plaid API",
    provider: "Plaid",
    category: "Finance",
    baseURL: "https://api.plaid.com",
    authType: "API Key",
    pricingTier: "Paid",
    shortDescription: "Securely connect user bank accounts to your app for transactions and balances.",
    useCases: ["personal finance", "lending", "neobanks"],
    docsURL: "https://plaid.com/docs/api/"
  },
  {
    name: "Alpha Vantage",
    provider: "Alpha Vantage",
    category: "Finance",
    baseURL: "https://www.alphavantage.co/query",
    authType: "API Key",
    pricingTier: "Freemium",
    shortDescription: "Real-time and historical stock, forex, and digital currency data.",
    useCases: ["stock dashboards", "algo-trading", "market analysis"],
    docsURL: "https://www.alphavantage.co/documentation/"
  },
  {
    name: "Frankfurter API",
    provider: "Frankfurter",
    category: "Finance",
    baseURL: "https://api.frankfurter.app",
    authType: "None",
    pricingTier: "Free",
    shortDescription: "Open-source currency exchange rates and historical data from the ECB.",
    useCases: ["currency converters", "tax tools", "invoice apps"],
    docsURL: "https://www.frankfurter.app/docs/"
  },

  // Auth
  {
    name: "Auth0 API",
    provider: "Okta",
    category: "Auth",
    baseURL: "https://YOUR_DOMAIN.auth0.com/api/v2",
    authType: "OAuth2",
    pricingTier: "Freemium",
    shortDescription: "Comprehensive identity platform for secure login, SSO, and MFA.",
    useCases: ["user auth", "enterprise login", "RBAC"],
    docsURL: "https://auth0.com/docs/api"
  },
  {
    name: "Firebase Auth",
    provider: "Google",
    category: "Auth",
    baseURL: "https://identitytoolkit.googleapis.com/v1",
    authType: "SDK",
    pricingTier: "Freemium",
    shortDescription: "Scalable authentication system supporting social logins and phone auth.",
    useCases: ["social login", "mobile apps", "serverless bhackend"],
    docsURL: "https://firebase.google.com/docs/auth"
  },
  {
    name: "Clerk API",
    provider: "Clerk",
    category: "Auth",
    baseURL: "https://api.clerk.com/v1",
    authType: "API Key",
    pricingTier: "Freemium",
    shortDescription: "Modern authentication and user management built specifically for React and Next.js.",
    useCases: ["modern web apps", "B2B SaaS", "customer portals"],
    docsURL: "https://clerk.com/docs"
  },
  {
    name: "Supabase Auth",
    provider: "Supabase",
    category: "Auth",
    baseURL: "https://YOUR_PROJECT.supabase.co/auth/v1",
    authType: "API Key",
    pricingTier: "Freemium",
    shortDescription: "Open-source Firebase alternative providing authentication and Postgres integration.",
    useCases: ["full-stack apps", "multi-tenant SaaS", "secure DB access"],
    docsURL: "https://supabase.com/docs/guides/auth"
  },
  {
    name: "Kinde API",
    provider: "KindeAuth",
    category: "Auth",
    baseURL: "https://YOUR_SUBDOMAIN.kinde.com/api/v1",
    authType: "OAuth2",
    pricingTier: "Freemium",
    shortDescription: "Developer-first authentication with feature flagging and release management.",
    useCases: ["feature rollout", "SaaS auth", "user segmentation"],
    docsURL: "https://kinde.com/docs"
  },

  // Media
  {
    name: "Unsplash API",
    provider: "Unsplash",
    category: "Media",
    baseURL: "https://api.unsplash.com",
    authType: "API Key",
    pricingTier: "Free",
    shortDescription: "The internet's library of freely-usable, high-resolution imagery.",
    useCases: ["landing pages", "stock photo search", "design tools"],
    docsURL: "https://unsplash.com/developers"
  },
  {
    name: "Spotify Web API",
    provider: "Spotify",
    category: "Media",
    baseURL: "https://api.spotify.com/v1",
    authType: "OAuth2",
    pricingTier: "Freemium",
    shortDescription: "Retrieve music meta-data, playlists, and user playback control.",
    useCases: ["music players", "recommender systems", "social sharing"],
    docsURL: "https://developer.spotify.com/documentation/web-api"
  },
  {
    name: "Pexels API",
    provider: "Pexels",
    category: "Media",
    baseURL: "https://api.pexels.com/v1",
    authType: "API Key",
    pricingTier: "Free",
    shortDescription: "Access thousands of high-quality free stock photos and videos.",
    useCases: ["video editing", "image galleries", "blogging platforms"],
    docsURL: "https://www.pexels.com/api/documentation/"
  },
  {
    name: "Cloudinary API",
    provider: "Cloudinary",
    category: "Media",
    baseURL: "https://api.cloudinary.com/v1_1",
    authType: "API Key",
    pricingTier: "Freemium",
    shortDescription: "Dynamic image and video manipulation, optimization, and storage.",
    useCases: ["media optimization", "UGC handling", "dynamic cropping"],
    docsURL: "https://cloudinary.com/documentation"
  },
  {
    name: "YouTube Data API",
    provider: "Google",
    category: "Media",
    baseURL: "https://www.googleapis.com/youtube/v3",
    authType: "API Key",
    pricingTier: "Freemium",
    shortDescription: "Search for videos, retrieve channel info, and manage playlists.",
    useCases: ["video analytics", "content curation", "creator tools"],
    docsURL: "https://developers.google.com/youtube/v3"
  },

  // Communication
  {
    name: "Twilio API",
    provider: "Twilio",
    category: "Communication",
    baseURL: "https://api.twilio.com/2010-04-01",
    authType: "API Key",
    pricingTier: "Paid",
    shortDescription: "Robust programmatic SMS, voice calls, and video communication APIs.",
    useCases: ["2FA", "customer notifications", "VOIP apps"],
    docsURL: "https://www.twilio.com/docs"
  },
  {
    name: "SendGrid API",
    provider: "Twilio",
    category: "Communication",
    baseURL: "https://api.sendgrid.com/v3",
    authType: "API Key",
    pricingTier: "Freemium",
    shortDescription: "Reliable transactional and marketing email delivery at scale.",
    useCases: ["order receipts", "newsletters", "reset passwords"],
    docsURL: "https://docs.sendgrid.com/api-reference"
  },
  {
    name: "Resend API",
    provider: "Resend",
    category: "Communication",
    baseURL: "https://api.resend.com",
    authType: "API Key",
    pricingTier: "Freemium",
    shortDescription: "Modern email API designed specifically for developers with React support.",
    useCases: ["react email templates", "developer-centric notifications", "fast integrations"],
    docsURL: "https://resend.com/docs"
  },
  {
    name: "Vonage Communication API",
    provider: "Vonage",
    category: "Communication",
    baseURL: "https://rest.nexmo.com",
    authType: "API Key",
    pricingTier: "Paid",
    shortDescription: "Global communication APIs for SMS, voice, and video with multi-channel support.",
    useCases: ["global SMS", "verify users", "video chat"],
    docsURL: "https://developer.vonage.com/"
  },
  {
    name: "Pusher Channels API",
    provider: "Pusher",
    category: "Communication",
    baseURL: "https://api.pusher.com",
    authType: "API Key",
    pricingTier: "Freemium",
    shortDescription: "Real-time pub/sub messaging and WebSockets for building interactive apps.",
    useCases: ["live chat", "multiplayer games", "live dashboards"],
    docsURL: "https://pusher.com/docs"
  },

  // Dev Tools
  {
    name: "GitHub REST API",
    provider: "GitHub",
    category: "Dev Tools",
    baseURL: "https://api.github.com",
    authType: "API Key",
    pricingTier: "Free",
    shortDescription: "Interact with repositories, issues, pull requests, and the wider GitHub ecosystem.",
    useCases: ["CI/CD pipelines", "repo analysis", "automation scripts"],
    docsURL: "https://docs.github.com/en/rest"
  },
  {
    name: "Cloudflare API",
    provider: "Cloudflare",
    category: "Dev Tools",
    baseURL: "https://api.cloudflare.com/client/v4",
    authType: "API Key",
    pricingTier: "Freemium",
    shortDescription: "Manage DNS, CDN, security rules, and serverless Workers at the edge.",
    useCases: ["DNS automation", "edge computing", "WAF management"],
    docsURL: "https://developers.cloudflare.com/api/"
  },
  {
    name: "Vercel API",
    provider: "Vercel",
    category: "Dev Tools",
    baseURL: "https://api.vercel.com",
    authType: "API Key",
    pricingTier: "Freemium",
    shortDescription: "Programmatically control deployments, domains, and team configurations.",
    useCases: ["custom deployment tools", "domain management", "hosting dashboards"],
    docsURL: "https://vercel.com/docs/rest-api"
  },
  {
    name: "Abstract Geolocation API",
    provider: "Abstract API",
    category: "Dev Tools",
    baseURL: "https://ipgeolocation.abstractapi.com/v1",
    authType: "API Key",
    pricingTier: "Freemium",
    shortDescription: "Highly reliable IP to location data for localization and security.",
    useCases: ["IP filtering", "local pricing", "security auditing"],
    docsURL: "https://app.abstractapi.com/api/ip-geolocation/documentation"
  },
  {
    name: "Octokit SDK",
    provider: "GitHub",
    category: "Dev Tools",
    baseURL: "https://api.github.com",
    authType: "SDK",
    pricingTier: "Free",
    shortDescription: "The official JavaScript SDK for interacting with the GitHub API.",
    useCases: ["GitHub Actions", "custom bots", "reporting tools"],
    docsURL: "https://github.com/octokit/octokit.js"
  },

  // Public Data
  {
    name: "NASA Open APIs",
    provider: "NASA",
    category: "Public Data",
    baseURL: "https://api.nasa.gov",
    authType: "API Key",
    pricingTier: "Free",
    shortDescription: "Access astronomical imagery and planetary data from the space agency.",
    useCases: ["educational apps", "space dashboards", "science blogs"],
    docsURL: "https://api.nasa.gov"
  },
  {
    name: "REST Countries",
    provider: "REST Countries",
    category: "Public Data",
    baseURL: "https://restcountries.com/v3.1",
    authType: "None",
    pricingTier: "Free",
    shortDescription: "Comprehensive data about world nations including population, flags, and regions.",
    useCases: ["country pickers", "geography quizzes", "demographic analysis"],
    docsURL: "https://restcountries.com/"
  },
  {
    name: "NewsAPI",
    provider: "NewsAPI.org",
    category: "Public Data",
    baseURL: "https://newsapi.org/v2",
    authType: "API Key",
    pricingTier: "Freemium",
    shortDescription: "Identify and track trending news articles and breaking headlines worldwide.",
    useCases: ["news aggregators", "sentiment tracking", "topic alerts"],
    docsURL: "https://newsapi.org/docs"
  },
  {
    name: "World Bank API",
    provider: "World Bank",
    category: "Public Data",
    baseURL: "https://api.worldbank.org/v2",
    authType: "None",
    pricingTier: "Free",
    shortDescription: "Access 16,000+ indicators of global development and economic trends.",
    useCases: ["economic রিসার্চ", "data visualization", "policy analysis"],
    docsURL: "https://datahelpdesk.worldbank.org/knowledgebase/topics/125535-developer-information"
  },
  {
    name: "United Nations Data API",
    provider: "United Nations",
    category: "Public Data",
    baseURL: "https://data.un.org/ws/rest",
    authType: "None",
    pricingTier: "Free",
    shortDescription: "Direct access to international statistics on trade, health, and population.",
    useCases: ["global metrics", "sustainability reports", "academic studies"],
    docsURL: "https://data.un.org/Host.aspx?Content=API"
  },

  // Health
  {
    name: "OpenFDA API",
    provider: "FDA",
    category: "Health",
    baseURL: "https://api.fda.gov",
    authType: "None",
    pricingTier: "Free",
    shortDescription: "Public data about drugs, medical devices, and food safety incidents.",
    useCases: ["drug safety apps", "recall trackers", "health compliance"],
    docsURL: "https://open.fda.gov/apis/"
  },
  {
    name: "Nutritionix API",
    provider: "Nutritionix",
    category: "Health",
    baseURL: "https://trackapi.nutritionix.com/v2",
    authType: "API Key",
    pricingTier: "Freemium",
    shortDescription: "The world's largest verified nutrition database for food tracking apps.",
    useCases: ["fitness trackesr", "meal planning", "dietary apps"],
    docsURL: "https://developer.nutritionix.com/docs/v2"
  },
  {
    name: "Disease.sh API",
    provider: "Disease.sh",
    category: "Health",
    baseURL: "https://disease.sh/v3/covid-19",
    authType: "None",
    pricingTier: "Free",
    shortDescription: "Open-source data server for tracking disease statistics and pandemic data.",
    useCases: ["epidemiology trackers", "health dashboards", "public safety"],
    docsURL: "https://disease.sh/docs/"
  },
  {
    name: "Fitbit Web API",
    provider: "Fitbit",
    category: "Health",
    baseURL: "https://api.fitbit.com/1",
    authType: "OAuth2",
    pricingTier: "Free",
    shortDescription: "Access user wearable data including activity, sleep, and heart rate.",
    useCases: ["health tracking", "wellness programs", "biometric study"],
    docsURL: "https://dev.fitbit.com/build/reference/web-api/"
  },
  {
    name: "HealthTap API",
    provider: "HealthTap",
    category: "Health",
    baseURL: "https://api.healthtap.com/v1",
    authType: "API Key",
    pricingTier: "Paid",
    shortDescription: "Connect with medical knowledge and virtual healthcare infrastructure.",
    useCases: ["telemedicine", "medical consultation", "health knowledge"],
    docsURL: "https://developers.healthtap.com/"
  },

  // Entertainment
  {
    name: "TMDb API",
    provider: "The Movie DB",
    category: "Entertainment",
    baseURL: "https://api.themoviedb.org/3",
    authType: "API Key",
    pricingTier: "Free",
    shortDescription: "Premier database for movie, TV show, and actor information.",
    useCases: ["movie recommendations", "streaming guides", "film cataloging"],
    docsURL: "https://developer.themoviedb.org/docs"
  },
  {
    name: "RAWG Video Games Database",
    provider: "RAWG",
    category: "Entertainment",
    baseURL: "https://api.rawg.io/api",
    authType: "API Key",
    pricingTier: "Freemium",
    shortDescription: "The largest open video games database with 500,000+ titles.",
    useCases: ["game discovery", "wishlist apps", "gaming social media"],
    docsURL: "https://rawg.io/apidocs"
  },
  {
    name: "PokeAPI",
    provider: "PokeAPI",
    category: "Entertainment",
    baseURL: "https://pokeapi.co/api/v2",
    authType: "None",
    pricingTier: "Free",
    shortDescription: "A comprehensive RESTful API for all Pokémon data.",
    useCases: ["pokedex apps", "browser games", "educational REST demos"],
    docsURL: "https://pokeapi.co/docs/v2"
  },
  {
    name: "Open Trivia DB",
    provider: "Open Trivia",
    category: "Entertainment",
    baseURL: "https://opentdb.com/api.php",
    authType: "None",
    pricingTier: "Free",
    shortDescription: "Free JSON API for trivia questions with multiple categories and difficulties.",
    useCases: ["quiz apps", "trivia games", "educational bots"],
    docsURL: "https://opentdb.com/api_config.php"
  },
  {
    name: "GIPHY API",
    provider: "GIPHY",
    category: "Entertainment",
    baseURL: "https://api.giphy.com/v1",
    authType: "API Key",
    pricingTier: "Freemium",
    shortDescription: "The world's largest library of animated GIFs and stickers.",
    useCases: ["messaging apps", "social media", "marketing content"],
    docsURL: "https://developers.giphy.com/docs/api/"
  },

  // Commerce
  {
    name: "Shopify Admin API",
    provider: "Shopify",
    category: "Commerce",
    baseURL: "https://SHOP_NAME.myshopify.com/admin/api/2024-01",
    authType: "API Key",
    pricingTier: "Paid",
    shortDescription: "Programmatically manage Shopify products, orders, and customer data.",
    useCases: ["e-commerce backends", "inventory management", "sync tools"],
    docsURL: "https://shopify.dev/docs/api/admin-rest"
  },
  {
    name: "Shippo API",
    provider: "Shippo",
    category: "Commerce",
    baseURL: "https://api.goshippo.com",
    authType: "API Key",
    pricingTier: "Freemium",
    shortDescription: "Multi-carrier shipping API for rates, labels, and tracking.",
    useCases: ["order shipping", "label printing", "delivery tracking"],
    docsURL: "https://goshippo.com/docs/"
  },
  {
    name: "WooCommerce REST API",
    provider: "Automattic",
    category: "Commerce",
    baseURL: "https://YOUR_SITE.com/wp-json/wc/v3",
    authType: "API Key",
    pricingTier: "Free",
    shortDescription: "Complete commerce functionality for WordPress-based online stores.",
    useCases: ["mobile store apps", "headless commerce", "order automation"],
    docsURL: "https://woocommerce.github.io/woocommerce-rest-api-docs/"
  },
  {
    name: "Best Buy API",
    provider: "Best Buy",
    category: "Commerce",
    baseURL: "https://api.bestbuy.com/v1",
    authType: "API Key",
    pricingTier: "Free",
    shortDescription: "Access Best Buy product catalogs, stores, and category information.",
    useCases: ["price comparison", "product research", "localized stock info"],
    docsURL: "https://bestbuycategoryapi.api-docs.io/"
  },
  {
    name: "Printful API",
    provider: "Printful",
    category: "Commerce",
    baseURL: "https://api.printful.com",
    authType: "API Key",
    pricingTier: "Paid",
    shortDescription: "Automate print-on-demand orders, shipping, and fulfillment.",
    useCases: ["custom merch", "dropshipping apps", "e-commerce automation"],
    docsURL: "https://developers.printful.com/docs/"
  }
];
