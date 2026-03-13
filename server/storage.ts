import { type User, type InsertUser, type Location, type InsertLocation, type Report, type InsertReport, type Resource, type InsertResource, type ChatMessage, type InsertChatMessage } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods (legacy)
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Location methods
  getLocation(id: string): Promise<Location | undefined>;
  getLocationByName(standardizedName: string): Promise<Location | undefined>;
  getAllLocations(): Promise<Location[]>;
  searchLocations(query: string): Promise<Location[]>;
  createLocation(location: InsertLocation): Promise<Location>;
  updateLocation(id: string, location: Partial<InsertLocation>): Promise<Location | undefined>;
  
  // Report methods
  getReport(id: string): Promise<Report | undefined>;
  getAllReports(): Promise<Report[]>;
  createReport(report: InsertReport): Promise<Report>;
  updateReport(id: string, extractedLocations: string[]): Promise<Report | undefined>;
  
  // Resource methods
  getResource(id: string): Promise<Resource | undefined>;
  getResourcesByLocation(locationId: string): Promise<Resource[]>;
  getAllResources(): Promise<Resource[]>;
  createResource(resource: InsertResource): Promise<Resource>;
  updateResource(id: string, resource: Partial<InsertResource>): Promise<Resource | undefined>;
  
  // Chat methods
  getChatMessages(sessionId: string): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private locations: Map<string, Location>;
  private reports: Map<string, Report>;
  private resources: Map<string, Resource>;
  private chatMessages: Map<string, ChatMessage>;

  constructor() {
    this.users = new Map();
    this.locations = new Map();
    this.reports = new Map();
    this.resources = new Map();
    this.chatMessages = new Map();
    
    // Initialize with some sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample locations
    const locations = [
      { id: randomUUID(), originalText: "New Delhi", standardizedName: "New Delhi", state: "Delhi", country: "India", latitude: "28.6139", longitude: "77.2090", confidence: "0.9500", createdAt: new Date() },
      { id: randomUUID(), originalText: "Chennai", standardizedName: "Chennai", state: "Tamil Nadu", country: "India", latitude: "13.0827", longitude: "80.2707", confidence: "0.9500", createdAt: new Date() },
      { id: randomUUID(), originalText: "Mumbai", standardizedName: "Mumbai", state: "Maharashtra", country: "India", latitude: "19.0760", longitude: "72.8777", confidence: "0.9500", createdAt: new Date() },
      { id: randomUUID(), originalText: "Kolkata", standardizedName: "Kolkata", state: "West Bengal", country: "India", latitude: "22.5726", longitude: "88.3639", confidence: "0.9500", createdAt: new Date() },
      { id: randomUUID(), originalText: "Bangalore", standardizedName: "Bangalore", state: "Karnataka", country: "India", latitude: "12.9716", longitude: "77.5946", confidence: "0.9500", createdAt: new Date() }
    ];

    locations.forEach(loc => this.locations.set(loc.id, loc));

    // Sample resources
    const locationIds = Array.from(this.locations.keys());
    const resourceTypes = ["food", "shelter", "medical", "water"];
    
    locationIds.forEach(locationId => {
      resourceTypes.forEach(type => {
        const capacity = 1000;
        const available = Math.floor(Math.random() * capacity);
        const resource: Resource = {
          id: randomUUID(),
          locationId,
          resourceType: type,
          totalCapacity: capacity,
          currentAvailable: available,
          criticalThreshold: Math.floor(capacity * 0.3),
          lastUpdated: new Date()
        };
        this.resources.set(resource.id, resource);
      });
    });
  }

  // User methods (legacy)
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Location methods
  async getLocation(id: string): Promise<Location | undefined> {
    return this.locations.get(id);
  }

  async getLocationByName(standardizedName: string): Promise<Location | undefined> {
    return Array.from(this.locations.values()).find(loc => 
      loc.standardizedName.toLowerCase() === standardizedName.toLowerCase()
    );
  }

  async getAllLocations(): Promise<Location[]> {
    return Array.from(this.locations.values());
  }

  async searchLocations(query: string): Promise<Location[]> {
    const queryLower = query.toLowerCase();
    return Array.from(this.locations.values()).filter(loc =>
      loc.standardizedName.toLowerCase().includes(queryLower) ||
      loc.originalText.toLowerCase().includes(queryLower) ||
      loc.state?.toLowerCase().includes(queryLower)
    );
  }

  async createLocation(insertLocation: InsertLocation): Promise<Location> {
    const id = randomUUID();
    const location: Location = { 
      ...insertLocation, 
      id, 
      createdAt: new Date(),
      state: insertLocation.state ?? null,
      country: insertLocation.country ?? "",
      latitude: insertLocation.latitude ?? null,
      longitude: insertLocation.longitude ?? null
    };
    this.locations.set(id, location);
    return location;
  }

  async updateLocation(id: string, locationUpdate: Partial<InsertLocation>): Promise<Location | undefined> {
    const existing = this.locations.get(id);
    if (!existing) return undefined;
    
    const updated: Location = { ...existing, ...locationUpdate };
    this.locations.set(id, updated);
    return updated;
  }

  // Report methods
  async getReport(id: string): Promise<Report | undefined> {
    return this.reports.get(id);
  }

  async getAllReports(): Promise<Report[]> {
    return Array.from(this.reports.values());
  }

  async createReport(insertReport: InsertReport): Promise<Report> {
    const id = randomUUID();
    const report: Report = { 
      ...insertReport, 
      id, 
      extractedLocations: [], 
      createdAt: new Date(),
      reportType: insertReport.reportType || "disaster",
      severity: insertReport.severity || "medium"
    };
    this.reports.set(id, report);
    return report;
  }

  async updateReport(id: string, extractedLocations: string[]): Promise<Report | undefined> {
    const existing = this.reports.get(id);
    if (!existing) return undefined;
    
    const updated: Report = { ...existing, extractedLocations };
    this.reports.set(id, updated);
    return updated;
  }

  // Resource methods
  async getResource(id: string): Promise<Resource | undefined> {
    return this.resources.get(id);
  }

  async getResourcesByLocation(locationId: string): Promise<Resource[]> {
    return Array.from(this.resources.values()).filter(resource => resource.locationId === locationId);
  }

  async getAllResources(): Promise<Resource[]> {
    return Array.from(this.resources.values());
  }

  async createResource(insertResource: InsertResource): Promise<Resource> {
    const id = randomUUID();
    const resource: Resource = { ...insertResource, id, lastUpdated: new Date() };
    this.resources.set(id, resource);
    return resource;
  }

  async updateResource(id: string, resourceUpdate: Partial<InsertResource>): Promise<Resource | undefined> {
    const existing = this.resources.get(id);
    if (!existing) return undefined;
    
    const updated: Resource = { ...existing, ...resourceUpdate, lastUpdated: new Date() };
    this.resources.set(id, updated);
    return updated;
  }

  // Chat methods
  async getChatMessages(sessionId: string): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(msg => msg.sessionId === sessionId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const message: ChatMessage = { ...insertMessage, id, createdAt: new Date() };
    this.chatMessages.set(id, message);
    return message;
  }
}

export const storage = new MemStorage();
