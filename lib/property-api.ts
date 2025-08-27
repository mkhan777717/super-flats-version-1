// Mock API service - replace with actual API integration
export interface PropertyData {
    id: string
    name: string
    location: string
    bhk: string
    rent: number
    deposit: number
    availability: "Available" | "Rented" | "Maintenance"
    images: string[]
    createdAt: string
    description?: string
    amenities?: string[]
    area?: number
    furnished?: "Fully Furnished" | "Semi Furnished" | "Unfurnished"
    parking?: boolean
    contact?: string
  }
  
  // Simulated API data - replace with actual API calls
  const mockApiData: PropertyData[] = [
    {
      id: "1",
      name: "3 BHK Flat In Sri Tirumala Splendour for Rent In Btm Layout",
      location: "BTM Layout, Bangalore",
      bhk: "3BHK",
      rent: 45000,
      deposit: 90000,
      availability: "Available",
      images: ["/modern-apartment-living.png", "/luxury-apartment-interior.png"],
      createdAt: "2024-01-15",
      description: "Beautiful 3BHK apartment with modern amenities in prime BTM Layout location",
      amenities: ["Parking", "Security", "Gym", "Swimming Pool", "Power Backup"],
      area: 1500,
      furnished: "Semi Furnished",
      parking: true,
      contact: "+91 9876543210",
    },
    {
      id: "2",
      name: "2 BHK Flat In Emerald Residency for Rent In Btm Layout",
      location: "BTM Layout, Bangalore",
      bhk: "2BHK",
      rent: 28000,
      deposit: 56000,
      availability: "Available",
      images: ["/luxury-apartment-interior.png", "/modern-apartment-living.png"],
      createdAt: "2024-01-10",
      description: "Spacious 2BHK flat in Emerald Residency with excellent connectivity",
      amenities: ["Parking", "Security", "Gym", "Club House", "Garden"],
      area: 1200,
      furnished: "Semi Furnished",
      parking: true,
      contact: "+91 9876543211",
    },
    {
      id: "3",
      name: "2 BHK House for Rent In Btm Layout",
      location: "BTM Layout, Bangalore",
      bhk: "2BHK",
      rent: 26000,
      deposit: 52000,
      availability: "Available",
      images: ["/modern-apartment-living.png"],
      createdAt: "2024-01-20",
      description: "Independent 2BHK house with private parking in BTM Layout",
      amenities: ["Parking", "Security", "Power Backup", "Garden"],
      area: 1100,
      furnished: "Unfurnished",
      parking: true,
      contact: "+91 9876543212",
    },
    {
      id: "4",
      name: "1 BHK Apartment in Koramangala",
      location: "Koramangala, Bangalore",
      bhk: "1BHK",
      rent: 22000,
      deposit: 44000,
      availability: "Available",
      images: ["/modern-apartment-living.png"],
      createdAt: "2024-01-25",
      description: "Cozy 1BHK apartment in prime Koramangala location",
      amenities: ["Parking", "Security", "Power Backup"],
      area: 800,
      furnished: "Fully Furnished",
      parking: true,
      contact: "+91 9876543213",
    },
    {
      id: "5",
      name: "4 BHK Villa in Whitefield",
      location: "Whitefield, Bangalore",
      bhk: "4BHK",
      rent: 65000,
      deposit: 130000,
      availability: "Available",
      images: ["/luxury-apartment-interior.png", "/modern-apartment-living.png"],
      createdAt: "2024-01-30",
      description: "Luxurious 4BHK villa with garden and premium amenities",
      amenities: ["Parking", "Security", "Gym", "Swimming Pool", "Garden", "Club House"],
      area: 2500,
      furnished: "Semi Furnished",
      parking: true,
      contact: "+91 9876543214",
    },
  ]
  
  export async function fetchProperties(): Promise<PropertyData[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
  
    // TODO: Replace with actual API call
    // const response = await fetch('https://api.apiscrapy.com/real-estate/properties?location=bangalore')
    // const data = await response.json()
    // return data.properties
  
    return mockApiData
  }
  
  export async function fetchPropertyById(id: string): Promise<PropertyData | null> {
    const properties = await fetchProperties()
    return properties.find((p) => p.id === id) || null
  }
  