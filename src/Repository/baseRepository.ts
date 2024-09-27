import {
  Model,
  Document,
  FilterQuery,
  PipelineStage,
  UpdateWriteOpResult,
  UpdateQuery,
} from "mongoose";

/**
 * A generic base repository class for MongoDB models that provides common database operations.
 * @template T - The Mongoose model type.
 */
export default class BaseRepository<T extends Document> {
  constructor(public model: Model<T>) {
    this.model = model;
  }

  async createOne(payload: Partial<T>): Promise<T> {
    return await this.model.create(payload);
  }

  async createMany(payload: Partial<T>[]): Promise<any> {
    return await this.model.insertMany(payload);
  }

  async findOne(query: FilterQuery<T>): Promise<any> {
    return await this.model.findOne(query).lean();
  }

  async findMany(
    query: FilterQuery<T>,
    options: {
      sort?: string;
      skip?: number;
      limit?: number;
      populate?: string[];
    } = {}
  ): Promise<any> {
    let mongoQuery = this.model.find(query);

    // Apply sorting if provided
    if (options.sort) {
      mongoQuery = mongoQuery.sort(options.sort);
    }

    // Apply pagination if skip and limit are provided
    if (typeof options.skip === "number") {
      mongoQuery = mongoQuery.skip(options.skip);
    }

    if (typeof options.limit === "number") {
      mongoQuery = mongoQuery.limit(options.limit);
    }

    // Apply population if provided
    if (Array.isArray(options.populate)) {
      options.populate.forEach((field) => {
        mongoQuery = mongoQuery.populate(field);
      });
    }

    return mongoQuery; // Return the query object for further manipulation or execution
  }

  async updateOne(
    filter: FilterQuery<T>,
    setPayload?: object,
    unsetPayload?: object
  ): Promise<T | null> {
    // Prepare update operations
    const updateOperations: any = {
      $set: setPayload,
    };

    // Include $unset only if unsetPayload is provided
    if (unsetPayload) {
      updateOperations.$unset = unsetPayload;
    }

    // Perform the update
    const updatedDocument = await this.model.findOneAndUpdate(
      filter,
      updateOperations,
      { new: true, runValidators: true }
    );

    return updatedDocument;
  }

  async updateMany(
    filter: FilterQuery<T>,
    setPayload: Partial<T>,
    unsetPayload?: Partial<T>
  ): Promise<UpdateWriteOpResult> {
    const updateQuery: UpdateQuery<T> = {
      $set: setPayload,
      $unset: unsetPayload,
    };
    return await this.model.updateMany(filter, updateQuery);
  }

  async deleteOne(query: FilterQuery<T>): Promise<{ deletedCount?: number }> {
    return await this.model.deleteOne(query);
  }

  async deleteMany(query: FilterQuery<T>): Promise<{ deletedCount?: number }> {
    return await this.model.deleteMany(query);
  }

  async aggregate(pipeline: PipelineStage[]): Promise<any[]> {
    return await this.model.aggregate(pipeline).exec();
  }

  async populate(
    documentsToBePopulated: any[],
    paths: string[],
    models: string[]
  ): Promise<any[]> {
    const populateOptions = paths.map((path, index) => ({
      path,
      model: models[index],
    }));
    return (await this.model.populate(
      documentsToBePopulated,
      populateOptions
    )) as T[];
  }
}
