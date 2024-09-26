import { Request, Response } from "express";
import ProductSectionServices from "./productSection.services";
import {
  validateCreateSection,
  validateUpdateSection,
  validateSectionId,
} from "./productSection.validator";

class ProductSectionController {
  public static async getAllSections(req: Request, res: Response) {
    try {
      const sections = await ProductSectionServices.getAllSections();
      return res.status(200).json(sections);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  public static async getSectionById(req: Request, res: Response) {
    try {
      const { error } = validateSectionId(req.params);
      if (error) return res.status(400).json({ message: error.message });

      const { id } = req.params;
      const section = await ProductSectionServices.getSectionById(id);
      if (!section) {
        return res.status(404).json({ message: "Section not found" });
      }
      return res.status(200).json(section);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  public static async createSection(req: Request, res: Response) {
    try {
      const { error } = validateCreateSection(req.body);
      if (error) return res.status(400).json({ message: error.message });

      const sectionPayload = req.body;
      const newSection = await ProductSectionServices.createSection(
        sectionPayload
      );

      return res.status(201).json(newSection);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  public static async updateSection(req: Request, res: Response) {
    try {
      const { error: idError } = validateSectionId(req.params);
      if (idError) return res.status(400).json({ message: idError.message });

      const { error: updateError } = validateUpdateSection(req.body);
      if (updateError)
        return res.status(400).json({ message: updateError.message });

      const { id } = req.params;
      const sectionPayload = req.body;
      const updatedSection = await ProductSectionServices.updateSection(
        id,
        sectionPayload
      );
      return res.status(200).json(updatedSection);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  public static async deleteSection(req: Request, res: Response) {
    try {
      const { error } = validateSectionId(req.params);
      if (error) return res.status(400).json({ message: error.message });

      const { id } = req.params;
      await ProductSectionServices.deleteSection(id);
      return res.status(204).json();
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export default ProductSectionController;
