import ProductSectionRepository from "./productSection.repository";

class ProductSectionServices {
    
  public static async getAllSections() {
    return await ProductSectionRepository.findMany({});
  }

  public static async getSectionById(sectionId: string) {
    return await ProductSectionRepository.findOne({ _id: sectionId });
  }

  public static async createSection(sectionPayload: any) {
    return await ProductSectionRepository.createOne(sectionPayload);
  }

  public static async updateSection(sectionId: string, sectionPayload: any) {
    return await ProductSectionRepository.updateOne(
      { _id: sectionId },
      sectionPayload
    );
  }

  public static async deleteSection(sectionId: string) {
    return await ProductSectionRepository.deleteOne({ _id: sectionId });
  }
}

export default ProductSectionServices;
