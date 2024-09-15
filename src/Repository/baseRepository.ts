import {
  Model,
  Document,
  FilterQuery,
  PipelineStage,
  UpdateWriteOpResult,
  UpdateQuery,
  FlattenMaps,
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

  async findMany(query: FilterQuery<T>, limit = 10): Promise<FlattenMaps<T>[]> {
    return await this.model.find(query).limit(limit).lean();
  }

  async updateOne(
    filter: FilterQuery<T>,
    setPayload: object,
    unsetPayload?: object
  ): Promise<UpdateWriteOpResult> {
    return await this.model.updateOne(filter, { $set: { ...setPayload }, $unset: { ...unsetPayload } });
  }

  async updateOneAndReturnNew(
    filter: FilterQuery<T>,
    setPayload: object,
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
    documentsToBePopulated: T[],
    paths: string[],
    models: string[]
  ): Promise<T[]> {
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
