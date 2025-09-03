// backend/api/properties.ts
import { PropertyDB } from "./mysql";

export class PropertyAPI {
  static async getAll() {
    return await PropertyDB.getAllProperties();
  }

  static async getById(id: string | number) {
    return await PropertyDB.getPropertyById(Number(id));
  }

  static async search(search: string) {
    return await PropertyDB.searchProperties(search);
  }

  static async getFiltered(filters: {
    search?: string;
    rentMin?: number;
    rentMax?: number;
    availability_status?: string;
    location?: string;
    bhkTypes?: string[];
  }) {
    return await PropertyDB.getFilteredProperties(filters);
  }
}
